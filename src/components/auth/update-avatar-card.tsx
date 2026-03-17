import { useRouteContext, useRouter } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { AwsClient } from "aws4fetch";
import { useRef } from "react";
import { toast } from "sonner";
import z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth.client";
import { requireAuth } from "@/middlewares/require-auth";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const fileClientSchema = z
	.instanceof(File)
	.refine((file) => file.size <= MAX_FILE_SIZE, {
		message: "Max file size is 2MB",
	})
	.refine((file) => ACCEPTED_TYPES.includes(file.type), {
		message: "Only JPEG/PNG/WebP allowed",
	});

const uploadRequestSchema = z.object({
	fileType: z.enum(["image/jpeg", "image/png", "image/webp"]),
	fileSize: z.number().max(MAX_FILE_SIZE),
});

const getPreSignedUrl = createServerFn()
	.middleware([requireAuth])
	.inputValidator(uploadRequestSchema)
	.handler(async ({ context: { user }, data: { fileType } }) => {
		const avatarId = crypto.randomUUID();
		const bucket = process.env.R2_BUCKET_NAME as string;
		const endpoint = process.env.R2_ENDPOINT as string;
		const publicUrl = process.env.R2_PUBLIC_URL as string;

		const key = `avatars/${user.id}/${avatarId}`;

		const r2 = new AwsClient({
			region: "auto",
			service: "s3",
			accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
			secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
		});

		const preSignedRequest = await r2.sign(
			new Request(`${endpoint}/${bucket}/${key}`, {
				method: "PUT",
				headers: { "Content-Type": fileType },
			}),
			{ aws: { signQuery: true } },
		);

		return {
			preSignedUrl: preSignedRequest.url,
			publicUrl: `${publicUrl}/${key}`,
		};
	});

export function UpdateAvatarCard() {
	const { user } = useRouteContext({ from: "/_protected/account" });
	const router = useRouter();

	const fileInputRef = useRef<HTMLInputElement>(null);
	const getPreSignedUrlFn = useServerFn(getPreSignedUrl);

	function handleAvatarClick() {
		fileInputRef.current?.click();
	}

	async function uploadAvatar(file: File) {
		try {
			const { preSignedUrl, publicUrl } = await getPreSignedUrlFn({
				data: {
					fileType: file.type as "image/jpeg" | "image/png" | "image/webp",
					fileSize: file.size,
				},
			});

			const response = await fetch(preSignedUrl, {
				method: "PUT",
				body: file,
				headers: {
					"Content-Type": file.type,
				},
			});

			if (!response.ok) {
				console.error("Upload failed:", response.status, await response.text());
				toast.error(`Upload failed: ${response.status}`);
				return;
			}

			await authClient.updateUser({ image: publicUrl });
			await router.invalidate();
		} catch (err) {
			console.error("Upload error:", err);
		}
	}

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];

		if (!file) return;

		const parsed = fileClientSchema.safeParse(file);

		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}

		toast.promise(uploadAvatar(file), {
			loading: "Uploading avatar...",
			success: "Avatar uploaded successfully.",
			error: "An error occurred during upload.",
		});
	}

	return (
		<Card className="max-w-xl bg-background">
			<CardHeader className="flex gap-8 justify-between">
				<div className="flex flex-col gap-1">
					<CardTitle>Avatar</CardTitle>
					<CardDescription>
						Click on the avatar to upload a custom one from your files.
					</CardDescription>
				</div>
				<Avatar
					size="xl"
					className="cursor-pointer hover:opacity-60 transition"
					onClick={handleAvatarClick}
				>
					<AvatarImage src={user.image || ""} />
					<AvatarFallback>
						{user.name?.substring(0, 2).toUpperCase() || "?"}
					</AvatarFallback>
				</Avatar>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/jpeg, image/png, image/webp"
					className="hidden"
					onChange={handleFileChange}
				/>
			</CardHeader>
			<CardFooter className="border-t border-border">
				<p className="text-muted-foreground text-sm">An avatar is optional.</p>
			</CardFooter>
		</Card>
	);
}
