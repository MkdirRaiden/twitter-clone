import express from "express";
import {
  signup,
  login,
  logout,
  getUser,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getAuthUser", protectRoute, getUser);

export default router;
