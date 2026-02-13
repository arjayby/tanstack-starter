import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { getAuthToastMessage } from "@/lib/utils";

export const Route = createFileRoute("/(protected)/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();

	const handleSignOut = async () => {
		const { data } = await authClient.signOut();

		if (data?.success) {
			toast.success(getAuthToastMessage("signOut").title);
			navigate({ to: "/sign-in" });
		}
	};

	return (
		<div>
			Hello "/(protected)/dashboard"!
			<Button onClick={handleSignOut}>Sign Out</Button>
		</div>
	);
}
