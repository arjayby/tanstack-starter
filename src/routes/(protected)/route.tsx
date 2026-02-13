import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authMiddleware } from "@/middlewares/auth";

export const Route = createFileRoute("/(protected)")({
	component: RouteComponent,
	server: {
		middleware: [authMiddleware],
	},
});

function RouteComponent() {
	return <Outlet />;
}
