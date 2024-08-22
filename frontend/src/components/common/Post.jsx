import {
  FaRegComment,
  FaComment,
  FaRegHeart,
  FaTrash,
  FaHeart,
} from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePost } from "../../hooks/customHooks";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import moment from "moment";
import toast from "react-hot-toast";

const Post = ({ post, username, savedPosts, setSavedPosts }) => {
  // console.log(savedPosts);
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [comment, setComment] = useState("");
  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);
  const isMyPost = postOwner._id == authUser._id;

  const formattedDate = moment(post.createdAt).startOf("minute").fromNow();

  const { mutate: deletePost, isPending: isDeleting } = usePost();

  const { mutate: commentOnPost, isPending: isCommenting } = usePost();

  const { mutate: likePost, isPending: isLiking } = usePost();

  const { mutate: repost, isPending: isReposting } = usePost();

  const handleDeletePost = () => {
    deletePost({
      method: "delete",
      url: `/api/posts/${post._id}`,
      qKey: ["posts", username],
      callbackFn: () => {
        return;
      },
    });
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    commentOnPost({
      method: "post",
      url: `/api/posts/comment/${post._id}`,
      qKey: ["posts", username],
      data: { text: comment },
      callbackFn: () => {
        setComment("");
      },
    });
  };

  const handleLikePost = () => {
    likePost({
      method: "post",
      url: `/api/posts/like/${post._id}`,
      qKey: ["posts", username],
      callbackFn: () => {},
    });
  };
  const handleRepost = () => {
    repost({
      method: "put",
      url: `/api/users/repost/${post._id}`,
      qKey: ["posts", username],
      callbackFn: () => {},
    });
  };
  const handleSave = () => {
    if (savedPosts.includes(post._id)) {
      savedPosts.splice(savedPosts.indexOf(post._id));
      toast.success("Post unsaved successfully!");
    } else {
      savedPosts.push(post._id);
      toast.success("Post saved successfully!");
    }
    setSavedPosts(savedPosts);
    localStorage.setItem("saved", JSON.stringify(savedPosts));
    queryClient.invalidateQueries({ queryKey: ["posts", username] });
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 h-8 rounded-full overflow-hidden"
          >
            <img src={postOwner.profileImg || "/avatar-placeholder.png"} />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            <span className="flex justify-end flex-1">
              {isMyPost && !isDeleting && (
                <FaTrash
                  className="cursor-pointer hover:text-red-500"
                  onClick={handleDeletePost}
                />
              )}
              {isMyPost && isDeleting && <LoadingSpinner size="sm" />}
            </span>
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img}
                className="h-80 object-contain rounded-lg border border-gray-700"
                alt=""
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={() =>
                  document
                    .getElementById("comments_modal" + post._id)
                    .showModal()
                }
              >
                {post.comments.length != 0 ? (
                  <FaComment className="text-sky-400" />
                ) : (
                  <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
                )}

                <span
                  className={`text-sm ${
                    post.comments.length != 0
                      ? "text-sky-400"
                      : "text-slate-500"
                  } group-hover:text-sky-400`}
                >
                  {post.comments.length}
                </span>
              </div>
              {/* We're using Modal Component from DaisyUI */}
              <dialog
                id={`comments_modal${post._id}`}
                className="modal border-none outline-none"
              >
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {post.comments.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="flex gap-2 items-start">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={
                                comment.user.profileImg ||
                                "/avatar-placeholder.png"
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">
                              {comment.user.fullName}
                            </span>
                            <span className="text-gray-700 text-sm">
                              @{comment.user.username}
                            </span>
                          </div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                      {isCommenting ? (
                        <>
                          {" "}
                          Posting...
                          <span className="loading loading-spinner loading-md"></span>
                        </>
                      ) : (
                        "Post"
                      )}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>
              <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={handleRepost}
              >
                { !isReposting && <BiRepost
                  className={`w-6 h-6 ${
                    post.repost >= 1
                      ? "text-green-500"
                      : "text-slate-500 group-hover:text-green-500"
                  }`}
                /> }
                
                {!isReposting && <span className="text-sm text-slate-500 group-hover:text-green-500">
                  {post.repost}
                </span>
              }
               {isReposting && <LoadingSpinner size="sm" />}
              </div>
              <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={handleLikePost}
              >
                {!isLiking && !isLiked && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
                )}
                {!isLiking && isLiked && (
                  <FaHeart className="w-4 h-4 cursor-pointer text-pink-500 " />
                )}
                 {isLiking && <LoadingSpinner size="sm" />}

                {!isLiking && <span
                  className={`text-sm text-slate-500 group-hover:text-pink-500 ${
                    isLiked ? "text-pink-500" : ""
                  }`}
                >
                  {post.likes.length}
                </span> }
              </div>
            </div>
            <div
              onClick={handleSave}
              className="flex w-1/3 justify-end gap-2 items-center"
            >
              {savedPosts.includes(post._id) ? (
                <FaBookmark className="w-4 h-4 text-slate-300 cursor-pointer" />
              ) : (
                <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;
