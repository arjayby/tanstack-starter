import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function DeleteAccountCard() {
	return (
		<Card className="max-w-xl bg-background border-[0.5px] border-destructive pb-0">
			<CardHeader>
				<CardTitle>Delete Account</CardTitle>
				<CardDescription>
					Permanently remove your account and all of its content. This action is
					not reversible, so please continue with caution.
				</CardDescription>
			</CardHeader>
			<CardFooter className="border-t-[0.5px] border-destructive bg-destructive/5 py-6">
				<Button variant="destructive" className="ml-auto">
					Delete Account
				</Button>
			</CardFooter>
		</Card>
	);
}
