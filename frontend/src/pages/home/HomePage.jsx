import { useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");
  const { data: authUser, isLoading } = useQuery({ queryKey: ["authUser"] });

  return (
    <>
      {/* Header */}
      <div className="flex w-full border-b border-gray-700 md:justify-around px-4 justify-between">
        <div
          className={`cursor-pointer py-2 text-lg hover:border-b-2 hover:border-primary  translation-all duration-0-300 ${
            feedType == "forYou" ? "border-b-2 border-primary" : ""
          }`}
          onClick={() => setFeedType("forYou")}
        >
          For you
        </div>
        <div
          className={`cursor-pointer py-2 text-lg hover:border-b-2 hover:border-primary  translation-all duration-0-300 ${
            feedType == "following" ? "border-b-2 border-primary" : ""
          }`}
          onClick={() => setFeedType("following")}
        >
          Following
        </div>
      </div>

      {/*  CREATE POST INPUT */}
      <div className="mt-2">
        <CreatePost />
      </div>

      {/* POSTS */}
      {!isLoading && <Posts feedType={feedType} user={authUser} />}
    </>
  );
};
export default HomePage;
