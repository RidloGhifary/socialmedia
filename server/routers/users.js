import express from "express";
import { getUser, getUserFriends, removeFriend } from "../controllers/users.js";
import { verifyToken } from "../middlewares/user.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.patch("/:id/:friendId", verifyToken, removeFriend);

export default router;
