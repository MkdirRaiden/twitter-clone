import React from "react";
import FollowButton from "./FollowButton";

const UserCard = ({ user, authUser, isPending, followUnfollow }) => {
  return (
    <>
      {" "}
      <div className="card pt-6 flex justify-center items-center shadow-md rounded-sm">
        <figure className="w-24 h-24 overflow-hidden rounded-lg">
          <img
            src={user.profileImg || "/avatar-placeholder.png"}
            alt={`${user.name} image`}
          />
        </figure>
        <div className="card-body">
          <h3 className="card-title">{user.fullName.substr(0, 8)}...</h3>
          <div className="card-actions justify-center">
            <FollowButton
              cls="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
              authUser={authUser}
              userId={user._id}
              isPending={isPending}
              followUnfollow={followUnfollow}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;
