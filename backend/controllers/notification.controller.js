import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notification = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg fullName",
    });
    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
    console.log("Error in getNotifications controller: ", error);
  }
};
export const getNewNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notification = await Notification.find({ to: userId, read: false });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
    console.log("Error in getNotifications controller: ", error);
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });
    res
      .status(200)
      .json({ message: "All notifications deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
    console.log("Error in deleteNotification controller: ", error);
  }
};

export const deleteOneNotifications = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found!" });
    }
    if (notification.to.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this notification!",
      });
    }

    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
    console.log("Error in deleteOneNotification controller: ", error);
  }
};
