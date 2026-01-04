import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import IdentityListener from "@/components/identity-listener";
import { ThemeListener } from "@/components/poker/theme-listener";
import "./globals.css";

const notoSans = Noto_Sans({ variable: "--font-sans" });

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Stacks",
	description: "A peer to peer Scrum planning platform.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={notoSans.variable}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-indigo-500/30 flex flex-col overflow-hidden">
					{children}
					<ThemeListener />
					<IdentityListener />
				</div>
			</body>
		</html>
	);
}
