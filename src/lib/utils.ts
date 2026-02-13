import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type ToastType = "signIn" | "signUp" | "signOut";

interface ToastMessage {
	title: string;
}

const TOAST_MESSAGES: Record<ToastType, ToastMessage> = {
	signIn: { title: "You are now signed in." },
	signUp: { title: "Your account has been created." },
	signOut: { title: "You have been signed out." },
};

export function getAuthToastMessage(type: ToastType): ToastMessage {
	return TOAST_MESSAGES[type];
}
