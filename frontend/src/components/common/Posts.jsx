import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useEffect, useState } from "react";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingSpinner from "./LoadingSpinner";

const Posts = ({ feedType, user }) => {
  const [savedPosts, setSavedPosts] = useState(
    localStorage.getItem("saved")
      ? JSON.parse(localStorage.getItem("saved"))
      : []
  );
  // console.log(savedPosts);
  const getPostEndPoint = (offset) => {
    switch (feedType) {
      case "forYou":
        return `/api/posts/all?offset=${offset}`;
      case "following":
        return `/api/posts/following?offset=${offset}`;
      case "posts":
        return `/api/posts/user/${user.username}?offset=${offset}`;
      case "likes":
        return `/api/posts/liked/${user._id}?offset=${offset}`;
      default:
        return `/api/posts/all?offset=${offset}`;
    }
  };

  const getPosts = async ({ pageParam = 0 }) => {
    try {
      const res = await axios.get(getPostEndPoint(pageParam));
      const data = res.data;
      if (data.error) throw new Error(data.error);
      return { ...data, previousOffset: pageParam };
    } catch (error) {
      return [];
    }
  };

  const { data, fetchNextPage, hasNextPage, isLoading, refetch, isRefetching } =
    useInfiniteQuery({
      queryKey: ["posts", user.username],
      queryFn: getPosts,
      getNextPageParam: (lastPage) => {
        if (lastPage.previousOffset + 8 > lastPage.postsCount) {
          return;
        }
        return lastPage.previousOffset + 8;
      },
    });

  // console.log(data);
  const posts = data?.pages.reduce((acc, page) => {
    return [...acc, ...page.posts];
  }, []);

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);

  return (
    <>
      {isLoading ||
        (isRefetching && (
          <div className="flex flex-col justify-center">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ))}
      {!isLoading && !isRefetching && posts.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts?.length != 0 && (
        <InfiniteScroll
          dataLength={posts ? posts.length : 0}
          next={() => {
            fetchNextPage();
          }}
          hasMore={hasNextPage}
          loader={
            <div className="text-center py-4 text-2xl">
              <LoadingSpinner />
            </div>
          }
        >
          {posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              username={user.username}
              savedPosts={savedPosts}
              setSavedPosts={setSavedPosts}
            />
          ))}
        </InfiniteScroll>
      )}
    </>
  );
};
export default Posts;
