const UserCardSkeleton = () => {
  return (
    <div className="card pt-6 flex justify-center items-center shadow-md rounded-sm">
      <div className="skeleton w-24 h-24 overflow-hidden rounded-lg"></div>
      <div className="card-body">
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-6 w-full rounded-full"></div>
      </div>
    </div>
  );
};

export default UserCardSkeleton;
