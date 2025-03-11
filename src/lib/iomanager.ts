import { Server } from "socket.io";

import { Server as HttpServer } from "http";

export default class SocketIoManager {
	static io: Server;

	static initialize(server: HttpServer) {
		this.io = new Server(server, {
			cors: {
				origin: "*",
			},
		});

		this.io.on("connection", (socket) => {
			console.log("socket cxtd");
			socket.on("disconnect", () => console.log("socket discxtd"));

			socket.on("wants-feed", (code) => {
				console.log("ewoooo");
				socket.join(`feed-${code}`);
			});

			socket.on("feed-message", ({ code, message, from }) => {
				console.log(message);
				this.io.to(`feed-${code}`).emit("feed-update", {
					message: `${from}: ${message}`,
					from,
					actions: ["wipe-input", "scroll-feed"],
				});
			});
		});
	}

	static getIo() {
		if (!this.io) {
			throw new Error(
				"Socket.IO has not been initialized. Please call initialize() first."
			);
		}
		return this.io;
	}
}
