import React from "react";
import FollowButton from "./FollowButton";
import LoadingSpinner from "./LoadingSpinner";
import { Link } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { FaHeart, FaMessage } from "react-icons/fa6";

const Notification = ({
  notification,
  authUser,
  isPending,
  followUnfollow,
  deleteOne,
  isDeletingOne,
}) => {
  return (
    <div className="flex justify-between pr-2">
      <div className="flex gap-2 p-4">
        {notification.type === "follow" && (
          <FaUser className="w-5 h-5 text-white" />
        )}
        {notification.type === "like" && (
          <FaHeart className="w-5 h-5 text-red-500" />
        )}
        {notification.type === "comment" && (
          <FaMessage className="w-5 h-5 text-primary" />
        )}
        <Link
          className="flex gap-2 md:basis-3/4"
          to={`/profile/${notification.from.username}`}
        >
          <div className="avatar">
            <div className="w-8 h-8 rounded-full">
              <img
                src={notification.from.profileImg || "/avatar-placeholder.png"}
              />
            </div>
          </div>
          <div className="">
            <span className="font-bold inline">
              @{notification.from.username}
            </span>{" "}
            {notification.type === "follow"
              ? "started following you"
              : notification.type === "like"
              ? "has liked your post"
              : "has commented on your post"}
          </div>
        </Link>
      </div>
      <div className="pt-4">
        <div className="dropdown dropdown-left">
          <div tabIndex={0} role="button" className=" hover: bg-base-100">
            <CiMenuKebab />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-secondary rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              <button
                onClick={() => {
                  deleteOne({
                    method: "delete",
                    url: `/api/notifications/${notification._id}`,
                    qKey: ["notifications", authUser.username],
                    callbackFn: () => {},
                  });
                }}
              >
                {isDeletingOne ? (
                  <>
                    Deleting <LoadingSpinner size="xs" />
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </li>
            {notification.type === "follow" && (
              <li>
                <FollowButton
                  userId={notification.from._id}
                  authUser={authUser}
                  isPending={isPending}
                  followUnfollow={followUnfollow}
                />
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Notification;
