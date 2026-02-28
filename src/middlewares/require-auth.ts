import { createMiddleware } from "@tanstack/react-start";
import { auth } from "@/lib/auth";

export const requireAuth = createMiddleware().server(
	async ({ next, request }) => {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session?.user) {
			throw new Response("Unauthorized", { status: 401 });
		}

		return next({
			context: {
				user: session.user,
				session,
			},
		});
	},
);
