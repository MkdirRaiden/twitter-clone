import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

export const getSearchUsers = async (req, res) => {
  try {
    const search = req.query.search || "";
    if (search == "") return res.status(201).json([]);
    const users = await User.find({
      username: { $regex: search, $options: "i" },
    }).select("-password");
    if (!users) return res.status(201).json([]);
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUserProfile controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToFollow = await User.findById(id);
    const currentUser = req.user;
    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "You cannot follow yourself!" });
    }
    if (!userToFollow || !currentUser) {
      return res.status(400).json({ error: "User not found!" });
    }
    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "Unfollowed successfully!" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      const newNotification = new Notification({
        type: "follow",
        from: currentUser._id,
        to: userToFollow._id,
      });
      await newNotification.save();

      res.status(200).json({ message: "Followed successfully!" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => {
      user.password = null;
    });
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in getSuggestedUsers controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const allSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const pageNo = parseInt(req.query.pageNo) || 1;
    const perPage = 8;

    const usersFollowedByMe = await User.findById(userId).select("following");

    const usersCount = await User.countDocuments({
      $and: [
        { _id: { $ne: userId } },
        { _id: { $nin: usersFollowedByMe.following } },
      ],
    });

    const totalPages = Math.ceil(usersCount / perPage);

    const users = await User.aggregate([
      {
        $match: {
          $and: [
            { _id: { $ne: userId } },
            { _id: { $nin: usersFollowedByMe.following } },
          ],
        },
      },
    ])
      .skip((pageNo - 1) * perPage)
      .limit(perPage);

    users.forEach((user) => {
      user.password = null;
    });

    res.status(200).json({ users: users, pageNo, totalPages });
  } catch (error) {
    console.log("Error in getSuggestedUsersAll controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getFollowingUsers = async (req, res) => {
  try {
    const username = req.user.username;
    const pageNo = parseInt(req.query.pageNo) || 1;
    const perPage = 8;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found!" });
    const followingUsersArr = user.following;
    const usersCount = followingUsersArr.length;

    const totalPages = Math.ceil(usersCount / perPage);
    const followingUsers = await User.aggregate([
      {
        $match: {
          _id: { $in: followingUsersArr },
        },
      },
    ])
      .skip((pageNo - 1) * perPage)
      .limit(perPage);
    followingUsers.forEach((user) => {
      user.password = null;
    });
    res.status(201).json({ users: followingUsers, pageNo, totalPages });
  } catch (error) {
    console.log("Error in getFollowingUsers controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const PeopleYouMayKnow = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          $and: [
            { _id: { $ne: userId } },
            { _id: { $nin: usersFollowedByMe.following } },
            { "followers.0": { $exists: true } },
          ],
        },
      },
    ]).limit(8);

    users.forEach((user) => {
      user.password = null;
    });
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in PeopleYouMayKnow controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const {
    fullName,
    email,
    username,
    oldPassword,
    newPassword,
    confirmPassword,
    bio,
    link,
  } = req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    const existUsername = await User.findOne({ username });
    if (existUsername)
      return res.status(404).json({ error: "Username already taken!" });
    const existEmail = await User.findOne({ email });
    if (existEmail)
      return res.status(404).json({ error: "Email already taken!" });

    if (oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Wrong password!" });
      }
      if (newPassword && confirmPassword) {
        if (newPassword != confirmPassword) {
          return res.status(400).json({ error: "Password does not match!" });
        }
        if (newPassword.length < 6) {
          return res.status(400).json({
            error: "Password must be atleast 6 characters!",
          });
        }
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    await user.save();
    user.password = null;
    return res
      .status(200)
      .json({ user: user, message: "Profile updated successfully!" });
  } catch (error) {
    console.log("Error in updateUser controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const repost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    const repost = Number(post.repost);
    await Post.updateOne({ _id: postId }, { $set: { repost: repost + 1 } });
    res.status(201).json({ message: "Reposted successfully!" });
  } catch (error) {
    console.log("Error in repost controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
