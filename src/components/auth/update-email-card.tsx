import { useForm } from "@tanstack/react-form-start";
import { useRouteContext } from "@tanstack/react-router";
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
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const EmailSchema = z.object({
	email: z.email(),
});

export function UpdateEmailCard() {
	const { user } = useRouteContext({ from: "/_protected" });

	const form = useForm({
		defaultValues: {
			email: user.email,
		},
		validators: {
			onSubmit: EmailSchema,
		},
		onSubmit: async () => {
			// TODO: update email with verification
		},
	});

	return (
		// biome-ignore lint/correctness/useUniqueElementIds: <>
		<form
			id="update-email-form"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<Card className="max-w-xl bg-background">
				<CardHeader>
					<CardTitle>Email</CardTitle>
					<CardDescription>
						Enter the email address you want to use to login.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form.Field name="email">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										type="email"
										placeholder="Enter your email"
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
				</CardContent>
				<CardFooter className=" flex justify-between border-t border-border">
					<p className="text-muted-foreground text-sm">
						Please use a valid email address.
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
