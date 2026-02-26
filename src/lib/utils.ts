import type { Session } from "better-auth";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UAParser } from "ua-parser-js";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type ToastType = "signIn" | "signUp" | "signOut";

interface ToastMessage {
	title: string;
	description?: string;
}

const TOAST_MESSAGES: Record<ToastType, ToastMessage> = {
	signIn: { title: "You are now signed in." },
	signUp: {
		title: "Account created.",
		description: "Verify your email to sign in.",
	},
	signOut: { title: "You have been signed out." },
};

export function getAuthToastMessage(type: ToastType): ToastMessage {
	return TOAST_MESSAGES[type];
}
function formatSession(session: Session, currentSessionId: string) {
	const parser = new UAParser(session.userAgent || "");
	const result = parser.getResult();

	return {
		id: session.id,
		device: result.device.model || result.os.name || "Unknown Device",
		os: result.os.name,
		browser: `${result.browser.name} ${result.browser.major}`,
		ipAddress: session.ipAddress,
		createdAt: session.createdAt,
		expiresAt: session.expiresAt,
		isCurrent: session.id === currentSessionId,
	};
}

export function formatSessions(sessions: Session[], currentSessionId: string) {
	return sessions
		.sort(
			(a, b) =>
				new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
		)
		.map((session) => formatSession(session, currentSessionId));
}
