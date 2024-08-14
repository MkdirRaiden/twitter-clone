import XSvg from "../svgs/X";
import { AiOutlineLogout } from "react-icons/ai";
import { Link } from "react-router-dom";
import { usePost, useGetData } from "../../hooks/customHooks";
import { useLocation } from "react-router-dom";
import SidebarLinkData from "../../utils/sidebar/LinksData";
import Search from "./Search";

const Sidebar = ({ user }) => {
  const { pathname, search, hash } = useLocation();
  const { data: newNotifications, isLoading } = useGetData({
    qKey: ["newNotifications", user.username],
    url: "/api/notifications/new",
  });

  const { mutate: logout } = usePost();

  return (
    <>
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r-2 border-gray-700 w-20 md:w-full">
        <Link
          to="/"
          className="flex justify-center md:justify-start md:items-center w-fit px-4 pt-3"
        >
          <XSvg className="fill-white w-10" />
          <span className="font-bold font-mono text-xl md:inline hidden">
            TWITTER
          </span>
        </Link>
        <ul className="flex flex-col gap-1 mt-4">
          <li className="flex justify-center md:justify-start">
            <Search modalId={"large-screen"} cls={"sidebar-link"} />
          </li>
          {SidebarLinkData.map((link, index) => {
            return (
              <li key={index} className="flex justify-center md:justify-start ">
                <Link
                  to={link.path}
                  className={`relative ${
                    pathname == link.path
                      ? "sidebar-active-link"
                      : "sidebar-link"
                  }`}
                >
                  {link.icon}
                  {!isLoading &&
                    link.name == "Notifications" &&
                    newNotifications?.length != 0 && (
                      <div className="badge bg-red-500 rounded-full badge-xs absolute top-[0.6rem] left-8"></div>
                    )}
                  <span className="text-lg hidden md:block">{link.name}</span>
                </Link>
              </li>
            );
          })}
          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${user.username}`}
              className={`relative ${
                pathname == `/profile/${user.username}`
                  ? "sidebar-active-link"
                  : "sidebar-link"
              }`}
            >
              <img
                className={`w-7 h-7 rounded-full ${
                  pathname == `/profile/${user.username}` ? "border-2" : ""
                }`}
                src={user.profileImg || "/avatar-placeholder.png"}
                alt={user.name + "image"}
              />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {user && (
          <button
            className="mt-auto mb-5 sidebar-link"
            onClick={(e) => {
              e.preventDefault();
              logout({
                method: "post",
                url: "/api/auth/logout",
                callbackFn: () => {},
              });
            }}
          >
            <AiOutlineLogout className="w-7 h-7 cursor-pointer" />
            <div className="text-lg hidden md:block">Logout</div>
          </button>
        )}
      </div>
    </>
  );
};
export default Sidebar;
