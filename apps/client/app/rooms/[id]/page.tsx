import Room from "@/components/app/main/room";
import AppLayout from "@/components/layout/app";

type RoomPageProps = {
	params: Promise<{ id: string }>;
};

export default async function Page({ params }: RoomPageProps) {
	const { id } = await params;
	return (
		<AppLayout>
			<Room />
		</AppLayout>
	);
}
