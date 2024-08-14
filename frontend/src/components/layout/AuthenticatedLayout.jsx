import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import RightPanel from "../common/RightPanel";
import TopPanel from "../common/TopPanel";
import RightPanelSwiper from "../swiper/RightPanelSwiper";

const AuthenticatedLayout = ({ user }) => {
  const { pathname } = useLocation();
  return (
    <div className="flex max-w-full-screen-2xl mx-auto">
      <div className="md:flex sm:flex flex-none md:w-52 sm:w-18 hidden">
        <Sidebar user={user} />
      </div>
      <div className="fixed top-0 md:hidden sm:hidden block w-screen z-10 bg-[#000]">
        <TopPanel user={user} />
      </div>
      <div className="flex-1 mr-auto min-h-[100-10] sm:min-h-screen relative sm:py-2 md:py-1 py-4 sm:mt-0 mt-10">
        <Outlet />
      </div>
      <div className="hidden lg:block border-l border-gray-800 px-2 w-72 min-h-screen relative">
        {pathname == "/all-suggested-users" ? (
          <RightPanelSwiper />
        ) : (
          <RightPanel />
        )}
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
