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
	email: z.email().min(1, "Email is required"),
});

export function ResetPasswordForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const navigate = useNavigate({ from: "/sign-in" });
	const search = useSearch({ from: "/_auth" });

	const form = useForm({
		defaultValues: {
			email: search.email || "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			await authClient.requestPasswordReset(
				{
					email: value.email,
					redirectTo: "/change-password",
				},
				{
					onSuccess: () => {
						const { title, description } = getAuthToastMessage("resetPassword");
						toast.success(title, { description });
						navigate({ to: "/sign-in", search: { email: value.email } });
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
			id="reset-password-form"
			className={cn("flex flex-col gap-6", className)}
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			{...props}
		>
			<div className="flex flex-col items-center gap-1 text-center">
				<h1 className="text-2xl font-bold">Reset your password</h1>
				<p className="text-muted-foreground text-sm text-balance">
					Enter your email below to reset your password
				</p>
			</div>
			<FieldGroup>
				<form.Field name="email">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Email</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder="Enter your email"
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
								Reset Password
							</Button>
						);
					}}
				</form.Subscribe>
				<FieldSeparator />
				<Field>
					<FieldDescription className="text-center">
						Already know your password?{" "}
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
