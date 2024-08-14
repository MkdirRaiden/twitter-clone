import { register } from "swiper/element/bundle";
register();

import { useFollow, useGetData } from "../../hooks/customHooks";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import FollowButton from "../common/FollowButton";
import { useEffect, useRef } from "react";
import RightPanelUserCardSkeleton from "../skeletons/RightPanelUserCardSkeleton";
import UserCard from "../common/UserCard";

const RightPanelSwiper = () => {
  const swiperRef = useRef(null);
  useEffect(() => {
    const swiperContainer = swiperRef.current;
    const params = {
      pagination: {
        clickable: true,
      },
      slidesPerView: 3,
      speed: 750,
      autoplay: {
        delay: 1000,
      },

      injectStyles: [
        `      
          .swiper-pagination-bullet{
            width: 12px;
            height: 12px;
            background-color: rgb(29, 155, 240);
          }
          .swiper-pagination-bullet-active{
       
           border-radius: 4px; 
           height: 16px;        
          }
      `,
      ],
    };

    if (swiperContainer) {
      Object.assign(swiperContainer, params);
      swiperContainer.initialize();
    }
  });
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [followUnfollow, isPending] = useFollow();
  const { data: usersFollowingMe, isLoading } = useGetData({
    qKey: ["peopleYouMayKnow"],
    url: "/api/users/people-you-may-know",
  });

  return (
    <div className="h-screen">
      <p className="py-2 font-bold text-slate-500 text-lg">
        People You may Know
      </p>
      {isLoading && (
        <div>
          <RightPanelUserCardSkeleton />
          <RightPanelUserCardSkeleton />
          <RightPanelUserCardSkeleton />
        </div>
      )}
      {!isLoading && usersFollowingMe?.length != 0 && (
        <swiper-container
          ref={swiperRef}
          class="h-[92%] w-56"
          direction="vertical"
          init="false"
        >
          {!isLoading &&
            usersFollowingMe?.map((user, index) => {
              return (
                <swiper-slide key={index} class="w-fit">
                  {" "}
                  <Link key={user._id} to={`/profile/${user.username}`}>
                    <div className="card py-6 w-48 flex justify-center gap-4 items-center shadow-md rounded-sm">
                      <figure className="w-16 h-16 overflow-hidden rounded-full border-1">
                        <img
                          src={user.profileImg || "/avatar-placeholder.png"}
                          alt={`${user.name} image`}
                        />
                      </figure>
                      <div className="card-body py-0">
                        <h3 className="card-title">
                          {user.fullName.substr(0, 8)}...
                        </h3>
                        <div className="card-actions justify-center">
                          <FollowButton
                            cls="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                            authUser={authUser}
                            userId={user._id}
                            isPending={isPending}
                            followUnfollow={followUnfollow}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>{" "}
                </swiper-slide>
              );
            })}
        </swiper-container>
      )}
    </div>
  );
};

export default RightPanelSwiper;
