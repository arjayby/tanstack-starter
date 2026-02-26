import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import EmailVerification from "emails/email-verification";
import ResetPassword from "emails/reset-password";
import { Resend } from "resend";
import { db } from "@/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			await resend.emails.send({
				from: "onboarding@resend.dev",
				to: user.email,
				subject: "Reset Password",
				react: ResetPassword({ url }),
			});
		},
	},
	socialProviders: {
		google: {
			enabled: true,
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			await resend.emails.send({
				from: "onboarding@resend.dev",
				to: user.email,
				subject: "Verify Email Address",
				react: EmailVerification({ url }),
			});
		},
		sendOnSignUp: true,
	},
	plugins: [tanstackStartCookies()], // make sure tanstackStartCookies is the last plugin in the array
});
