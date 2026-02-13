import { useForm } from "@tanstack/react-form-start";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
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
import { authClient } from "@/lib/auth-client";
import { DEFAULT_AUTH_REDIRECT } from "@/lib/const";
import { cn, getAuthToastMessage } from "@/lib/utils";

const formSchema = z.object({
	email: z.email().min(1, "Email is required"),
	password: z.string().min(1, "Password is required"),
});

export function SignInForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const navigate = useNavigate();
	const search = useSearch({ from: "/(auth)/sign-in" });
	const [isSigningInToGoogle, setIsSigningInToGoogle] = useState(false);

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
				},
				{
					onSuccess: () => {
						const { title } = getAuthToastMessage("signIn");
						toast.success(title);
						navigate({ to: search.redirect || DEFAULT_AUTH_REDIRECT });
					},
					onError: ({ error }) => {
						toast.error(`${error.message}.`);
					},
				},
			);
		},
	});

	async function handleGoogleSignIn() {
		setIsSigningInToGoogle(true);
		await authClient.signIn.social({
			provider: "google",
			callbackURL: search.redirect || DEFAULT_AUTH_REDIRECT,
		});
		setIsSigningInToGoogle(false);
	}

	return (
		// biome-ignore lint/correctness/useUniqueElementIds: <explanation>
		<form
			id="sign-in-form"
			className={cn("flex flex-col gap-6", className)}
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			{...props}
		>
			<div className="flex flex-col items-center gap-1 text-center">
				<h1 className="text-2xl font-bold">Login to your account</h1>
				<p className="text-muted-foreground text-sm text-balance">
					Enter your email below to login to your account
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
				<form.Field name="password">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Password</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									type="password"
									placeholder="Enter your password"
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
								Login
							</Button>
						);
					}}
				</form.Subscribe>
				<FieldSeparator>Or continue with</FieldSeparator>
				<Field>
					<Button
						variant="outline"
						type="button"
						onClick={handleGoogleSignIn}
						loading={isSigningInToGoogle}
					>
						{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="icon icon-tabler icons-tabler-filled icon-tabler-brand-google"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" />
						</svg>
						Login with Google
					</Button>
					<FieldDescription className="text-center">
						Don&apos;t have an account?{" "}
						<Link
							to="/sign-up"
							search={(prev) => prev}
							className="underline underline-offset-4"
						>
							Sign up
						</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
