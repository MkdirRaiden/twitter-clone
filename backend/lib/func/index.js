export const getUser = (user) => {
  return {
    _id: user._id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    profileImg: user.profileImg,
    coverImg: user.coverImg,
    following: user.following,
    followers: user.followers,
  };
};
