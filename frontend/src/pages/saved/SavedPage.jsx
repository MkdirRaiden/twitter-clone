import { useFollow, useGetData } from "../../hooks/customHooks";
import { Link } from "react-router-dom";
import UserCardSkeleton from "../../components/skeletons/UserCardSkeleton";
import { useQuery } from "@tanstack/react-query";
import FollowButton from "../../components/common/FollowButton";

const SavedPage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [followUnfollow, isPending] = useFollow();
  const { data: followingUsers, isLoading } = useGetData({
    qKey: ["followingUsers"],
    url: "/api/users/following",
  });

  return (
    <>
      {isLoading && (
        <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
          {authUser.following.map((items, index) => {
            return <UserCardSkeleton key={index} />;
          })}
        </div>
      )}
      {!isLoading && followingUsers?.length == 0 && (
        <p className="text-center py-2 text-xl">
          No following users available.
        </p>
      )}
      {!isLoading && followingUsers && (
        <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
          {followingUsers.map((user) => {
            return (
              <Link key={user._id} to={`/profile/${user.username}`}>
                <div className="card  pt-6 flex justify-center items-center shadow-md rounded-sm">
                  <figure className="w-20 h-20 overflow-hidden rounded-full">
                    <img
                      src={user.profileImg || "/avatar-placeholder.png"}
                      alt={`${user.name} image`}
                    />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title">
                      {user.fullName.substr(0, 10)}...
                    </h3>
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
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};

export default SavedPage;
