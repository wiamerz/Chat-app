import Room, { findOne, find } from "../Models/Room";
import User from "../Models/User";

// Create room
const createRoom = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: "Le titre est requis" });
    }

    const room = new Room({
      title,
      creator: userId,
      members: [userId],
    });

    await room.save();
    await room.populate("creator", "username");

    res.status(201).json({
      message: "Salle créée avec succès",
      room: {
        id: room._id,
        title: room.title,
        code: room.code,
        creator: room.creator.username,
        memberCount: room.members.length,
      },
    });
  } catch (error) {
    console.error("Erreur création salle:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Join room
const joinRoom = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    const room = await findOne({ code }).populate("creator", "username");

    if (!room) {
      return res.status(404).json({ message: "Salle non trouvée" });
    }

    if (room.members.length >= room.maxMembers) {
      return res.status(400).json({ message: "Salle pleine" });
    }

    if (room.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "Vous êtes déjà dans cette salle" });
    }

    room.members.push(userId);
    await room.save();

    res.status(200).json({
      message: "Rejoint la salle avec succès",
      room: {
        id: room._id,
        title: room.title,
        code: room.code,
        creator: room.creator.username,
        memberCount: room.members.length,
      },
    });
  } catch (error) {
    console.error("Erreur rejoindre salle:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Get user rooms
const getUserRooms = async (req, res) => {
  try {
    const userId = req.user.id;

    const rooms = await find({
      members: userId,
    })
      .populate("creator", "username")
      .sort({ lastMessage: -1 });

    res.status(200).json({ rooms });
  } catch (error) {
    console.error("Erreur récupération salles:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Get room by code (for preview)
const getRoomByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const room = await findOne({ code }).populate("creator", "username");

    if (!room) {
      return res.status(404).json({ message: "Salle non trouvée" });
    }

    res.status(200).json({
      title: room.title,
      creator: room.creator.username,
      memberCount: room.members.length,
      maxMembers: room.maxMembers,
    });
  } catch (error) {
    console.error("Erreur récupération salle:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export default { createRoom, joinRoom, getUserRooms, getRoomByCode };
