import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import ProfilePage from "./pages/profile/ProfilePage";
import NotificationPage from "./pages/notification/NotificationPage";
import FollowingPage from "./pages/following/FollowingPage";
import { Toaster } from "react-hot-toast";
import { useGetData } from "./hooks/customHooks";
import PageNotFound from "./pages/PageNotFound";
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout";
import SavedPage from "./pages/saved/SavedPage";
import AllSuggestedUsers from "./pages/suggested/AllSuggestedUsers";

function App() {
  const { data: authUser, isLoading } = useGetData({
    qKey: ["authUser"],
    url: "/api/auth/getAuthUser",
  });

  if (isLoading) {
    return (
      <>
        <div className="flex max-w-full-screen-2xl h-screen justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <AuthenticatedLayout user={authUser} />
            ) : (
              <Navigate to={"/login"} />
            )
          }
        >
          <Route index element={<HomePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/following" element={<FollowingPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/all-suggested-users" element={<AllSuggestedUsers />} />
        </Route>
        <Route
          path="/login"
          element={authUser ? <Navigate to={"/"} /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to={"/"} /> : <SignUpPage />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}
export default App;
