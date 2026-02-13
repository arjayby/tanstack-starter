import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";

/**
 * Middleware to check if the user is authenticated.
 * If the user is not authenticated, redirect them to the sign-in page.
 * If the user is authenticated, continue to the next middleware.
 *
 * Note: This middleware should be used on (protected) routes.
 */
export const authMiddleware = createMiddleware().server(
	async ({ next, pathname }) => {
		const headers = getRequestHeaders();
		const session = await auth.api.getSession({ headers });

		if (!session) {
			throw redirect({ to: "/sign-in", search: { redirect: pathname } });
		}

		return await next();
	},
);
