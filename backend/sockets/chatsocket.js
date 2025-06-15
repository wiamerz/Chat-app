const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const Room = require("../Models/Room");
const Message = require("../Models/Message");

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.user.username} connected`);

    // Join room
    socket.on("join-room", async (roomId) => {
      try {
        const room = await Room.findById(roomId).populate(
          "members",
          "username"
        );

        if (
          !room ||
          !room.members.some(
            (member) => member._id.toString() === socket.userId.toString()
          )
        ) {
          socket.emit("error", "Not authorized to join this room");
          return;
        }

        socket.join(roomId);
        socket.currentRoom = roomId;

        // Send room members
        socket.emit("room-members", room.members);

        // Send previous messages
        const messages = await Message.find({ room: roomId })
          .populate("sender", "username")
          .sort({ createdAt: 1 })
          .limit(50);

        socket.emit(
          "previous-messages",
          messages.map((msg) => ({
            content: msg.content,
            sender: msg.sender,
            timestamp: msg.createdAt,
          }))
        );

        // Notify others user joined
        socket.to(roomId).emit("user-joined", {
          user: socket.user.username,
          members: room.members,
        });
      } catch (error) {
        console.error("Join room error:", error);
        socket.emit("error", "Failed to join room");
      }
    });

    // Send message
    socket.on("send-message", async (data) => {
      try {
        const { roomId, content } = data;

        // Verify user is in room
        const room = await Room.findById(roomId);
        if (!room || !room.members.includes(socket.userId)) {
          socket.emit("error", "Not authorized");
          return;
        }

        // Save message
        const message = new Message({
          content,
          sender: socket.userId,
          room: roomId,
        });
        await message.save();
        await message.populate("sender", "username");

        // Update room's last message time
        room.lastMessage = new Date();
        await room.save();

        // Broadcast to room
        const messageData = {
          content: message.content,
          sender: message.sender,
          timestamp: message.createdAt,
        };

        io.to(roomId).emit("new-message", messageData);
      } catch (error) {
        console.error("Send message error:", error);
        socket.emit("error", "Failed to send message");
      }
    });

    // Leave room
    socket.on("leave-room", async (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user-left", {
        user: socket.user.username,
      });
      socket.currentRoom = null;
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`User ${socket.user.username} disconnected`);
      if (socket.currentRoom) {
        socket.to(socket.currentRoom).emit("user-left", {
          user: socket.user.username,
        });
      }
    });
  });

  return io;
};

module.exports = { initializeSocket };
