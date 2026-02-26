import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { ChangePasswordForm } from "@/components/auth/change-password-form";

export const Route = createFileRoute("/_auth/change-password")({
	component: RouteComponent,
	validateSearch: z.object({
		token: z.string().min(1, "Token is required").catch("INVALID_TOKEN"),
	}),
});

function RouteComponent() {
	return <ChangePasswordForm />;
}
