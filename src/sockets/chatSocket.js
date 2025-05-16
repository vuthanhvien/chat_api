const { Server } = require("socket.io");

const chatSocket = (server) => {
    const io = new Server(server);

    io.on("connection", (socket) => {
        console.log("New user connected:", socket.id);

        socket.on("joinRoom", (room) => {
            socket.join(room);
            console.log(`User ${socket.id} joined room: ${room}`);
        });

        socket.on("sendMessage", (data) => {
            const { room, message } = data;
            io.to(room).emit("receiveMessage", {
                message,
                sender: socket.id,
            });
            console.log(`Message sent to room ${room}:`, message);
        });

        socket.on("createGroupChat", (groupData) => {
            const { groupName, users } = groupData;
            const room = groupName; // Use group name as room identifier
            users.forEach((user) => {
                socket.join(room);
            });
            console.log(`Group chat created: ${room} with users:`, users);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};

module.exports = chatSocket;