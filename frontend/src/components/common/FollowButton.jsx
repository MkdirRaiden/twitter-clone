const FollowButton = ({
  authUser,
  userId,
  isPending,
  followUnfollow,
  cls = "",
}) => {
  return (
    <button
      className={cls}
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        followUnfollow(userId);
      }}
    >
      {authUser.following.includes(userId) ? "UnFollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
