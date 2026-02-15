import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFound() {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="relative flex flex-col gap-4 border-2 border-zinc-800 p-6 md:p-10">
				<div className="pointer-events-none absolute inset-0">
					<div className="absolute -left-px -top-px h-16 w-16 border-l-2 border-t-2 border-zinc-400" />
					<div className="absolute -right-px -top-px h-16 w-16 border-r-2 border-t-2 border-zinc-400" />
					<div className="absolute -bottom-px -left-px h-16 w-16 border-b-2 border-l-2 border-zinc-400" />
					<div className="absolute -bottom-px -right-px h-16 w-16 border-b-2 border-r-2 border-zinc-400" />
				</div>

				<div className="flex justify-center gap-2 md:justify-start">
					<Link to="/" className="flex items-center gap-2 font-medium">
						<img src="/src/logo.svg" alt="ShortIntel" className="size-8" />
						<span className="text-xl font-bold tracking-tighter font-mono">
							Tanstack Starter
						</span>
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="flex flex-col  items-center justify-center px-4 py-8 text-center">
						<h2 className="mb-6 text-5xl font-semibold">Whoops!</h2>
						<h3 className="mb-1.5 text-3xl font-semibold">
							Something went wrong
						</h3>
						<p className="text-muted-foreground mb-6 max-w-sm">
							The page you&apos;re looking for isn&apos;t found, we suggest you
							back to home.
						</p>
						<Link to="/" className="rounded-lg text-base">
							<Button size="lg" className="rounded-lg text-base">
								Back to home page
							</Button>
						</Link>
					</div>
				</div>
			</div>
			<div className="relative max-h-screen w-full p-2 max-lg:hidden">
				<div className="h-full w-full rounded-2xl bg-black"></div>
				<img
					src="/404.png"
					alt="404 illustration"
					className="absolute top-1/2 left-1/2 h-[clamp(260px,25vw,406px)] -translate-x-1/2 -translate-y-1/2"
				/>
			</div>
		</div>
	);
}
