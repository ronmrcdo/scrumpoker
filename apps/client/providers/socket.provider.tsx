"use client";

import { useSocketBindings } from "@/hooks/useSocketBindings";

export function SocketProvider({ children }: { children: React.ReactNode }) {
	useSocketBindings();
	return children;
}
