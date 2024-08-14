import { useFollow, getUsersPage } from "../../hooks/customHooks";
import { Link } from "react-router-dom";
import UserCardSkeleton from "../../components/skeletons/UserCardSkeleton";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import UserCard from "../../components/common/UserCard";
import { useState } from "react";
import Pagination from "../../components/common/Pagination";

const FollowingPage = () => {
  const [pageNo, setPageNo] = useState(1);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const [followUnfollow, isPending] = useFollow();

  const {
    data: page,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["followingPage", pageNo],
    queryFn: () =>
      getUsersPage({ url: `/api/users/following?pageNo=${pageNo}` }),

    placeholderData: keepPreviousData,
  });

  return (
    <>
      {isFetching && (
        <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
          <UserCardSkeleton />
          <UserCardSkeleton />
          <UserCardSkeleton />
          <UserCardSkeleton />
          <UserCardSkeleton />
          <UserCardSkeleton />
          <UserCardSkeleton />
          <UserCardSkeleton />
        </div>
      )}
      {!isFetching && page?.users.length == 0 && (
        <p className="text-center py-2 text-xl">
          No following users available.
        </p>
      )}
      {!isFetching && page?.users && (
        <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 min-h-[80%]">
          {page.users.map((user) => {
            return (
              <Link
                className="h-fit"
                key={user._id}
                to={`/profile/${user.username}`}
              >
                <UserCard
                  user={user}
                  authUser={authUser}
                  isPending={isPending}
                  followUnfollow={followUnfollow}
                />
              </Link>
            );
          })}
        </div>
      )}
      {!isFetching && (
        <div className="w-full flex justify-center">
          <Pagination
            setPageNo={setPageNo}
            pageNo={pageNo}
            page={page}
            isPlaceholderData={isPlaceholderData}
          />
        </div>
      )}
    </>
  );
};

export default FollowingPage;
