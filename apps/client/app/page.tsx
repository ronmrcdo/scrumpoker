"use client";

import Poker from "@/components/poker";
import RoomForm from "@/components/room-form";
import useBoundStore from "@/stores";

export default function Page() {
	const room = useBoundStore((state) => state.room);

	return room ? <Poker /> : <RoomForm />;
}
