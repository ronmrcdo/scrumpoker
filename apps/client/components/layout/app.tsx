import { SocketProvider } from "@/providers/socket.provider";
import Header from "../app/header/header";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<SocketProvider>
		<Header />

		<main className="relative z-10 flex-1 flex overflow-hidden">
			{children}
		</main>
	</SocketProvider>
);

export default AppLayout;
