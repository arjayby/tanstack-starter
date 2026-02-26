import { useForm } from "@tanstack/react-form-start";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth.client";
import { cn, getAuthToastMessage } from "@/lib/utils";

const formSchema = z.object({
	newPassword: z.string().min(8, "Password must be at least 8 characters"),
	token: z.string().min(1, "Token is required"),
});

export function ChangePasswordForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const navigate = useNavigate({ from: "/sign-in" });
	const search = useSearch({ from: "/_auth/change-password" });

	const form = useForm({
		defaultValues: {
			newPassword: "",
			token: search.token,
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			await authClient.resetPassword(
				{
					newPassword: value.newPassword,
					token: value.token,
				},
				{
					onSuccess: () => {
						const { title, description } =
							getAuthToastMessage("changePassword");

						toast.success(title, { description });
						navigate({ to: "/sign-in" });
					},
					onError: ({ error }) => {
						toast.error(`${error.message}.`);
					},
				},
			);
		},
	});

	return (
		// biome-ignore lint/correctness/useUniqueElementIds: <>
		<form
			id="change-password-form"
			className={cn("flex flex-col gap-6", className)}
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			{...props}
		>
			<div className="flex flex-col items-center gap-1 text-center">
				<h1 className="text-2xl font-bold">Change your password</h1>
				<p className="text-muted-foreground text-sm text-balance">
					Enter your new password below
				</p>
			</div>
			<FieldGroup>
				<form.Field name="newPassword">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>New Password</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									type="password"
									autoComplete="new-password"
									placeholder="Enter your new password"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<form.Subscribe>
					{({ isSubmitting }) => {
						return (
							<Button type="submit" loading={isSubmitting}>
								Change Password
							</Button>
						);
					}}
				</form.Subscribe>
				<FieldSeparator />
				<Field>
					<FieldDescription className="text-center">
						Already changed your password?{" "}
						<Link
							to="/sign-in"
							search={(prev) => prev}
							className="underline underline-offset-4"
						>
							Sign in
						</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
