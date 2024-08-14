import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getUserProfile,
  getSuggestedUsers,
  getFollowingUsers,
  followUnfollowUser,
  getSearchUsers,
  allSuggestedUsers,
  PeopleYouMayKnow,
  repost,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/search", protectRoute, getSearchUsers);
router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.get("/all-suggested-users", protectRoute, allSuggestedUsers);
router.get("/people-you-may-know", protectRoute, PeopleYouMayKnow);
router.get("/following", protectRoute, getFollowingUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/repost/:id", protectRoute, repost);
router.put("/update", protectRoute, updateUser);

export default router;
