import { useFollow, useGetData, usePost } from "../../hooks/customHooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Notification from "../../components/common/Notification";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { mutate: deleteAll, isPending: isDeletingAll } = usePost();
  const { mutate: deleteOne, isPending: isDeletingOne } = usePost();
  const [followUnfollow, isPending] = useFollow();

  const { data: notifications, isLoading } = useGetData({
    qKey: ["notifications", authUser.username],
    url: "/api/notifications/",
  });

  const deleteNotifications = (e) => {
    e.preventDefault();
    deleteAll({
      method: "delete",
      url: "/api/notifications/",
      qKey: ["notifications", authUser.username],
      callbackFn: () => {},
    });
  };

  let oldNotifications, newNotifications;
  if (!isLoading) {
    oldNotifications = notifications.filter((n) => n.read == true);
    newNotifications = notifications.filter((n) => n.read == false);
  }

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["newNotifications", authUser.username],
    });
  }, [notifications]);

  return (
    <>
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <p className="font-bold">Notifications</p>
        {isDeletingAll && (
          <p>
            Deleting all...
            <LoadingSpinner size="xs" />
          </p>
        )}
        {!isDeletingAll && !notifications?.length == 0 && (
          <a
            className="text-primary hover:underline hover:cursor-pointer"
            onClick={deleteNotifications}
          >
            Delete all notifications
          </a>
        )}
      </div>
      {notifications?.length === 0 && (
        <div className="text-center p-4 font-bold">No notifications 🤔</div>
      )}{" "}
      {!isLoading && notifications?.length !== 0 && (
        <p className="px-4 py-2 font-bold">New Notifications</p>
      )}
      {!isLoading &&
        newNotifications?.map((notification) => (
          <Notification
            key={notification._id}
            notification={notification}
            authUser={authUser}
            isPending={isPending}
            followUnfollow={followUnfollow}
            isDeletingOne={isDeletingOne}
            deleteOne={deleteOne}
          />
        ))}
      {!isLoading &&
        notifications?.length != 0 &&
        newNotifications?.length == 0 && (
          <p className="text-center border-b border-gray-700 pb-8">
            No new notifications
          </p>
        )}
      {!isLoading && !isLoading && notifications?.length !== 0 && (
        <p className="px-4 py-2 font-bold">Earlier Notifications</p>
      )}
      {!isLoading &&
        oldNotifications?.map((notification) => (
          <Notification
            key={notification._id}
            notification={notification}
            authUser={authUser}
            isPending={isPending}
            followUnfollow={followUnfollow}
            isDeletingOne={isDeletingOne}
            deleteOne={deleteOne}
          />
        ))}
      {!isLoading &&
        notifications?.length != 0 &&
        oldNotifications?.length == 0 && (
          <p className="text-center pb-8">No earlier notifications</p>
        )}
    </>
  );
};
export default NotificationPage;
