import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import { DEFAULT_AUTH_REDIRECT } from "@/lib/const";

/**
 * Middleware to check if the user is authenticated.
 * If the user is authenticated, redirect to dashboard or the redirect query param.
 * Usable for sign-in and sign-up pages
 *
 * Note: This middleware should be used on (auth) routes.
 */
export const authedMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const headers = getRequestHeaders();
		const session = await auth.api.getSession({ headers });

		const search = new URL(request.url);

		if (session) {
			throw redirect({
				to: search.searchParams.get("redirect") || DEFAULT_AUTH_REDIRECT,
			});
		}

		return await next();
	},
);
