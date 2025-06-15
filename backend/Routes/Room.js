import { Router } from "express";
const router = Router();
import {
  createRoom,
  joinRoom,
  getUserRooms,
  getRoomByCode,
} from "../controllers/RoomControllers";
import authMiddleware from "../middleware/authMiddleware";

// All room routes require authentication
router.use(authMiddleware);

// Room routes
router.post("/create", createRoom);
router.post("/join", joinRoom);
router.get("/my-rooms", getUserRooms);
router.get("/preview/:code", getRoomByCode);

export default router;
