import { createServerFn, useServerFn } from "@tanstack/react-start";
import { useRef } from "react";
import z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const AvatarSchema = z.object({
	file: z.instanceof(File),
});

const uploadAvatar = createServerFn({ method: "POST" })
	.inputValidator(AvatarSchema)
	.handler(async ({ data }) => {
		// TODO: upload to cloudflare r2 and return the image url and save it to the user
	});

export function UpdateAvatarCard() {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const uploadAvatarFn = useServerFn(uploadAvatar);

	function handleAvatarClick() {
		fileInputRef.current?.click();
	}

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];

		if (!file) return;

		// const response = await uploadAvatarFn({data: { file}});
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
					<AvatarImage src="https://api.dicebear.com/9.x/adventurer/svg?seed=Ryan" />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
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
