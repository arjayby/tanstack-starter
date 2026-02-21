import { useForm } from "@tanstack/react-form-start";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth.client";

const PasswordSchema = z.object({
	currentPassword: z.string().min(8),
	newPassword: z.string().min(8),
});

export function UpdatePasswordCard() {
	const form = useForm({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
		},
		validators: {
			onSubmit: PasswordSchema,
		},
		onSubmit: async ({ value }) => {
			await authClient.changePassword({
				currentPassword: value.currentPassword,
				newPassword: value.newPassword,
			});
		},
	});

	return (
		// biome-ignore lint/correctness/useUniqueElementIds: <>
		<form
			id="update-password-form"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<Card className="max-w-xl bg-background">
				<CardHeader>
					<CardTitle>Change Password</CardTitle>
					<CardDescription>
						Enter your current password and a new password.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<FieldGroup>
						<form.Field name="currentPassword">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>
											Current Password
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											type="password"
											autoComplete="current-password"
											placeholder="Enter your current password"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
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
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
					</FieldGroup>
				</CardContent>
				<CardFooter className=" flex justify-between border-t border-border">
					<p className="text-muted-foreground text-sm">
						Please use 8 characters at minimum.
					</p>
					<form.Subscribe>
						{({ isSubmitting }) => {
							return (
								<Button
									type="submit"
									variant="secondary"
									loading={isSubmitting}
								>
									Save
								</Button>
							);
						}}
					</form.Subscribe>
				</CardFooter>
			</Card>
		</form>
	);
}
