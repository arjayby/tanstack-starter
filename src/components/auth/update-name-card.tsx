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
import { authClient } from "@/lib/auth.client";

const NameSchema = z.object({
	name: z.string().min(1).max(32),
});

export function UpdateNameCard() {
	const { user } = useRouteContext({ from: "/_protected" });

	const form = useForm({
		defaultValues: {
			name: user.name,
		},
		validators: {
			onSubmit: NameSchema,
		},
		onSubmit: async ({ value }) => {
			await authClient.updateUser({
				name: value.name,
			});
		},
	});

	return (
		// biome-ignore lint/correctness/useUniqueElementIds: <>
		<form
			id="update-name-form"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<Card className="max-w-xl bg-background">
				<CardHeader>
					<CardTitle>Name</CardTitle>
					<CardDescription>
						Please enter your full name or display name.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form.Field name="name">
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
										type="text"
										placeholder="Enter your name"
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
				</CardContent>
				<CardFooter className=" flex justify-between border-t border-border">
					<p className="text-muted-foreground text-sm">
						Please use 32 characters at maximum.
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
