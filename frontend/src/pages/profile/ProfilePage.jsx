import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { useFollow, useGetData, usePost } from "../../hooks/customHooks";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import moment from "moment";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");
  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  const { username } = useParams();
  const [followUnfollow, isPending] = useFollow();

  const {
    data: userProfile,
    isLoading,
    refetch,
    isRefetching,
  } = useGetData({
    qKey: ["userProfile", username],
    url: `/api/users/profile/${username}`,
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const isMyProfile = username == authUser.username;

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { mutate: update, isPending: isUpdating } = usePost();

  useEffect(() => {
    refreshProfilePage();
  }, [username, followUnfollow]);

  const refreshProfilePage = () => {
    refetch();
    setProfileImg(null);
    setCoverImg(null);
  };

  const { data: userPostsCount, isLoading: isCounting } = useGetData({
    qKey: ["postCount", username],
    url: `/api/posts/all-user-postsCount/${username}`,
  });

  return (
    <>
      {/* HEADER */}
      {isLoading || (isRefetching && <ProfileHeaderSkeleton />)}
      {!isLoading && !isRefetching && !userProfile && (
        <p className="text-center text-lg mt-4">User not found</p>
      )}
      <div className="flex flex-col">
        {!isLoading && !isRefetching && userProfile && (
          <>
            <div className="flex flex-col px-4">
              <p className="font-bold text-lg">{userProfile?.fullName}</p>
              {!isCounting && (
                <span className="text-sm text-slate-500 py-1">
                  {userPostsCount?.postsCount} post
                </span>
              )}
            </div>

            {/* COVER IMG */}
            <div className="relative group/cover">
              <img
                src={coverImg || userProfile?.coverImg || "/cover.png"}
                className="h-52 w-full object-cover"
                alt="cover image"
              />
              {isMyProfile && (
                <div
                  className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                  onClick={() => coverImgRef.current.click()}
                >
                  <MdEdit className="w-5 h-5 text-white" />
                </div>
              )}

              <input
                type="file"
                hidden
                ref={coverImgRef}
                onChange={(e) => handleImgChange(e, "coverImg")}
              />
              <input
                type="file"
                hidden
                ref={profileImgRef}
                onChange={(e) => handleImgChange(e, "profileImg")}
              />
              {/* USER AVATAR */}
              <div className="avatar absolute -bottom-16 left-4">
                <div className="w-32 rounded-full relative group/avatar">
                  <img
                    src={
                      profileImg ||
                      userProfile?.profileImg ||
                      "/avatar-placeholder.png"
                    }
                  />
                  <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                    {isMyProfile && (
                      <MdEdit
                        className="w-4 h-4 text-white"
                        onClick={() => profileImgRef.current.click()}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end px-4 mt-5">
              {isMyProfile && <EditProfileModal username={username} />}
              {!isMyProfile && (
                <button
                  disabled={isPending}
                  className="btn btn-outline rounded-full btn-sm"
                  onClick={() => {
                    followUnfollow(userProfile._id);
                  }}
                >
                  {authUser.following.includes(userProfile._id)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
              {(coverImg || profileImg) && (
                <button
                  disabled={isUpdating}
                  className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                  onClick={() => {
                    update({
                      method: "put",
                      url: "/api/users/update",
                      data: { coverImg, profileImg },
                      callbackFn: () => {
                        refreshProfilePage();
                      },
                    });
                  }}
                >
                  {isUpdating ? (
                    <>
                      Updating
                      <LoadingSpinner size="xs" />
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4 mt-14 px-4">
              <div className="flex flex-col">
                <span className="font-bold text-lg">
                  {userProfile?.fullName}
                </span>
                <span className="text-sm text-slate-500">
                  @{userProfile?.username}
                </span>
                {userProfile?.bio && (
                  <span className="text-sm my-1">{userProfile?.bio}</span>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {userProfile?.link && (
                  <div className="flex gap-1 items-center ">
                    <>
                      <FaLink className="w-3 h-3 text-slate-500" />
                      <a
                        href={userProfile.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {userProfile.link}
                      </a>
                    </>
                  </div>
                )}
                <div className="flex gap-2 items-center text-sm text-slate-500">
                  joined
                  <span>
                    {moment(userProfile.createdAt).format("MMM Do YY")}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-xs">
                    {userProfile?.following.length}
                  </span>
                  <span className="text-slate-500 text-xs">Following</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-xs">
                    {authUser?.followers.length}
                  </span>
                  <span className="text-slate-500 text-xs">Followers</span>
                </div>
              </div>
            </div>
            <div className="flex w-full border-b border-gray-700 md:justify-around px-4 mt-4 justify-between">
              <div
                className={`cursor-pointer py-2 text-lg hover:border-b-2 hover:border-primary translation-all duration-0-300 ${
                  feedType == "posts" ? "border-b-2 border-primary" : ""
                }`}
                onClick={() => setFeedType("posts")}
              >
                User Posts
              </div>
              <div
                className={`cursor-pointer py-2 text-lg hover:border-b-2 hover:border-primary translation-all duration-0-300 ${
                  feedType == "likes" ? "border-b-2 border-primary" : ""
                }`}
                onClick={() => setFeedType("likes")}
              >
                Liked Posts
              </div>
            </div>
          </>
        )}

        {!isLoading && !isRefetching && userProfile && (
          <Posts feedType={feedType} user={userProfile} />
        )}
      </div>
    </>
  );
};
export default ProfilePage;
