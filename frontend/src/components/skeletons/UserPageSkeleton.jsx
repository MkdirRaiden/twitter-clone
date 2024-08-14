import React from "react";
import UserCardSkeleton from "./UserCardSkeleton";

const UserPageSkeleton = () => {
  return (
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
  );
};

export default UserPageSkeleton;
