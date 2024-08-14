import { useFollow, getUsersPage } from "../../hooks/customHooks";
import { Link } from "react-router-dom";
import UserCardSkeleton from "../../components/skeletons/UserCardSkeleton";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import UserCard from "../../components/common/UserCard";
import { useState } from "react";
import Pagination from "../../components/common/Pagination";
import MobileSwiper from "../../components/swiper/MobileSwiper";

const AllSuggestedUsers = () => {
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
    queryKey: ["suggestedPage", pageNo],
    queryFn: () =>
      getUsersPage({ url: `/api/users/all-suggested-users?pageNo=${pageNo}` }),

    placeholderData: keepPreviousData,
  });

  return (
    <>
      {isFetching && (
        <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 md:gap-4 gap-2">
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
          No suggested users available.
        </p>
      )}
      <p className="p-4 font-bold md:hidden text-slate-500 text-lg">
        People You may Know
      </p>
      <div className="md:hidden max-w-screen-sm">
        <MobileSwiper />
      </div>
      <p className="p-4 font-bold md:hidden text-slate-500 text-lg">
        Suggested users
      </p>

      {!isFetching && page?.users && (
        <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 md:gap-4 md:min-h-[80%] gap-2">
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

export default AllSuggestedUsers;
