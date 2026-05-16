import { PokerRoomLayout } from "@/components/layout/poker-room-layout";

export default function PokerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PokerRoomLayout>{children}</PokerRoomLayout>;
}
