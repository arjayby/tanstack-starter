import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatSessions } from "@/lib/utils";

dayjs.extend(relativeTime);

export function ManageSessionsCard() {
	const { session } = useRouteContext({ from: "/_protected" });
	const { sessions } = useLoaderData({ from: "/_protected/account" });

	return (
		<Card className="max-w-xl bg-background">
			<CardHeader>
				<CardTitle>Sessions</CardTitle>
				<CardDescription>
					Manage your active sessions and revoke access.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				{formatSessions(sessions, session.id).map((session) => (
					<div
						key={session.id}
						className="flex justify-between gap-8 p-4 border border-border rounded-xl"
					>
						<div className="flex items-center gap-2">
							<Laptop size={18} />
							{session.isCurrent ? (
								<span className="text-success">Current Session </span>
							) : (
								<span>{`${session.device} • ${session.browser}`}</span>
							)}
						</div>
						<Button variant="outline">Sign Out</Button>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
