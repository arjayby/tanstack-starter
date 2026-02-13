import type { LinkProps, RegisteredRouter } from "@tanstack/react-router";

type AppRoutes = LinkProps<RegisteredRouter>["to"];

export const DEFAULT_AUTH_REDIRECT: AppRoutes = "/dashboard";
