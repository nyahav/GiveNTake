import { connectDB } from "./db/utils/connection.js"
import createApp from "./app.js"
import ViteExpress from "vite-express";
import { Server } from 'socket.io';

try {
	process.on('uncaughtException', err => {
		console.log(err.name, err.message);
		console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');

		process.exit(1);

	});

	const app = createApp();

	// Connect to the database
	const isConnected = await connectDB();
	if (!isConnected) throw new Error("Database connection failed.")

	const { PORT = 3000 } = process.env;
	const server = ViteExpress.listen(app, PORT, () => {
		if (process.env.NODE_ENV === 'development') {
			console.log(`  > Local: \x1b[36mhttp://localhost:\x1b[1m${PORT}/\x1b[0m`);
		}
		console.log("🫡 Server is listening...");
	});

	// socket for messaging
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:5000",
			credentials: true,
		},
	});

	global.onlineUsers = new Map();
	io.on("connection", (socket) => {
		global.chatSocket = socket;

		socket.on("add-user", (userId) => {
			onlineUsers.set(userId, socket.id);
		});

		socket.on("send-msg", (data) => {
			for (const userId of data.to) {
				const sendUserSocket = onlineUsers.get(userId);
				if (sendUserSocket) {
					const packet = {
						conversationId: data.conversationId,
						message: data.message,
						from: data.from,
						isNew: data.isNew
					}
					socket.to(sendUserSocket).emit("msg-recieve", packet);
				}
			}
		});
	});
} catch (error) {
	console.error('Error starting server:', error);
	process.exit(1); // Exit the process if unable to start the server
}
