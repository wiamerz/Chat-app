import { verify } from "jsonwebtoken";
import { findById } from "../Models/User";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Token non fourni" });
    }

    const decoded = verify(token, process.env.JWT_SECRET);
    const user = await findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};

export default authMiddleware;
