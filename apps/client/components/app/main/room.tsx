import ChatList from "./chat-list";
import PlayerList from "./player-list";
import PokerTable from "./poker-table";

const Room = () => (
	<>
		<PlayerList />

		<PokerTable />

		<ChatList />
	</>
);

export default Room;
