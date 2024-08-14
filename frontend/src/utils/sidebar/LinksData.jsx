import { IoNotificationsOutline, IoHomeOutline } from "react-icons/io5";
import { SlUserFollowing } from "react-icons/sl";

const SidebarLinkData = [
  {
    name: "Home",
    path: "/",
    icon: <IoHomeOutline className="w-7 h-7" />,
  },
  {
    name: "Followings",
    path: "/following",
    icon: <SlUserFollowing className="w-7 h-7" />,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: <IoNotificationsOutline className="w-7 h-7" />,
  },
];

export default SidebarLinkData;
