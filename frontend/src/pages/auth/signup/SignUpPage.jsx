import { Link } from "react-router-dom";
import { useState } from "react";
import XSvg from "../../../components/svgs/X";
import {
  MdOutlineMail,
  MdPassword,
  MdDriveFileRenameOutline,
  MdOutlineArrowForward,
} from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { usePost } from "../../../hooks/customHooks";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const { mutate: signup, isPending } = usePost();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup({
      method: "post",
      url: "/api/auth/signup",
      data: formData,
      callbackFn: () => {},
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="max-w-screen-xl mx-auto flex h-screen px-10">
        <div className="flex-1 flex justify-center items-center gap-10">
          <div className="hidden max-w-1/2 lg:flex items-center justify-center">
            <div className="hidden max-w-1/2 lg:flex items-center justify-center">
              <XSvg className="w-60 h-60 fill-white" />
            </div>
          </div>
          <div className="md:w-1/4">
            <form
              className="flex gap-4 flex-col md:2/5"
              onSubmit={handleSubmit}
            >
              <XSvg className="w-24 lg:hidden fill-white" />
              <h1 className="text-4xl font-extrabold text-white">
                Join today.
              </h1>
              <label className="input input-bordered rounded flex items-center gap-2">
                <MdOutlineMail />
                <input
                  type="email"
                  className="grow"
                  placeholder="Email"
                  name="email"
                  onChange={handleInputChange}
                  value={formData.email}
                  required
                />
              </label>
              <div className="flex gap-4 flex-wrap">
                <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                  <FaUser />
                  <input
                    type="text"
                    className="grow "
                    placeholder="Username"
                    name="username"
                    onChange={handleInputChange}
                    value={formData.username}
                    required
                  />
                </label>
                <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                  <MdDriveFileRenameOutline />
                  <input
                    type="text"
                    className="grow"
                    placeholder="Full Name"
                    name="fullName"
                    onChange={handleInputChange}
                    value={formData.fullName}
                    required
                  />
                </label>
              </div>
              <label className="input input-bordered rounded flex items-center gap-2">
                <MdPassword />
                <input
                  type="password"
                  className="grow"
                  placeholder="Password"
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                  required
                />
              </label>
              <button
                disabled={isPending}
                className="btn rounded-full btn-primary text-white"
              >
                {isPending ? (
                  <>
                    <span>Submitting</span>
                    <span className="loading loading-spinner loading-xs"></span>
                  </>
                ) : (
                  <>
                    Sign Up <IoIosSend />
                  </>
                )}
              </button>
            </form>
            <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
              <p className="text-white text-lg">Already have an account?</p>
              <Link to="/login">
                <button className="btn rounded-full btn-primary text-white btn-outline w-full">
                  Sign in <MdOutlineArrowForward />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SignUpPage;
