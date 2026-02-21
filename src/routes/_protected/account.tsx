import { createFileRoute } from "@tanstack/react-router";
import { DeleteAccountCard } from "@/components/auth/delete-account-card";
import { ManageLinkProvidersCard } from "@/components/auth/manage-link-providers";
import { ManageSessionsCard } from "@/components/auth/manage-sessions";
import { UpdateAvatarCard } from "@/components/auth/update-avatar-card";
import { UpdateEmailCard } from "@/components/auth/update-email-card";
import { UpdateNameCard } from "@/components/auth/update-name-card";
import { UpdatePasswordCard } from "@/components/auth/update-password-card";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	TanstackBreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listUserAccountsAndSessions } from "@/lib/auth.server";

export const Route = createFileRoute("/_protected/account")({
	component: RouteComponent,
	loader: async () => {
		const { accounts, sessions } = await listUserAccountsAndSessions();

		return { accounts, sessions };
	},
});

function RouteComponent() {
	return (
		<>
			<header className="flex h-16 shrink-0 items-center gap-2">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<TanstackBreadcrumbLink to="/account">
									Settings
								</TanstackBreadcrumbLink>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>
			<div className="mx-auto max-w-xl w-full flex flex-1 flex-col gap-4 p-4 pt-0">
				<Tabs defaultValue="account">
					<TabsList variant="line" className="mb-6">
						<TabsTrigger value="account">Account</TabsTrigger>
						<TabsTrigger value="billing">Billing</TabsTrigger>
					</TabsList>
					<TabsContent
						value="account"
						className="mx-auto w-full max-w-xl space-y-4"
					>
						<UpdateAvatarCard />
						<UpdateNameCard />
						<UpdateEmailCard />
						<UpdatePasswordCard />
						<ManageLinkProvidersCard />
						<ManageSessionsCard />
						<DeleteAccountCard />
					</TabsContent>
					<TabsContent value="billing">Billing.</TabsContent>
				</Tabs>
			</div>
		</>
	);
}
