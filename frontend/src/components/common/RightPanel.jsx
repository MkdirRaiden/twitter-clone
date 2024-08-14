import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useFollow, useGetData } from "../../hooks/customHooks";
import FollowButton from "./FollowButton";
import { useQuery } from "@tanstack/react-query";

const RightPanel = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [followUnfollow, isPending] = useFollow();
  const { data: suggestedUsers, isLoading } = useGetData({
    qKey: ["suggestedUsers"],
    url: "/api/users/suggested",
  });

  return (
    <>
      <div className="bg-[#16181C] p-4 rounded-md my-4 sticky top-2">
        <p className="font-bold mb-4 flex justify-between">
          <span className="text-slate-500">Who to follow</span>
          <Link
            to={"/all-suggested-users"}
            className="text-primary hover:underline"
          >
            See more
          </Link>
        </p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading && suggestedUsers?.length == 0 && (
            <p>No suggested users available.</p>
          )}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <FollowButton
                    cls="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    authUser={authUser}
                    userId={user._id}
                    isPending={isPending}
                    followUnfollow={followUnfollow}
                  />
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};
export default RightPanel;
