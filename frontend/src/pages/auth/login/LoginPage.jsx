import { useState } from "react";
import { Link } from "react-router-dom";
import XSvg from "../../../components/svgs/X";
import {
  MdOutlineMail,
  MdPassword,
  MdOutlineArrowForward,
} from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { usePost } from "../../../hooks/customHooks";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { mutate: login, isPending } = usePost();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      method: "post",
      url: "/api/auth/login",
      data: formData,
      callbackFn: () => {},
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen md:px-10">
      <div className="flex-1 flex justify-center items-center gap-10">
        <div className=" hidden max-w-1/2 lg:flex items-center justify-center">
          <XSvg className="w-52 h-52 fill-white" />
        </div>
        <div>
          <form
            className="flex gap-4 flex-col md-w-2/5"
            onSubmit={handleSubmit}
          >
            <XSvg className="w-24 lg:hidden fill-white" />
            <h1 className="text-4xl font-extrabold text-white">
              {"Let's"} go.
            </h1>
            <label className="input input-bordered rounded flex items-center gap-2">
              <MdOutlineMail />
              <input
                type="text"
                className="grow"
                placeholder="username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
                required
              />
            </label>

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
                  {" "}
                  Login <IoIosSend />
                </>
              )}
            </button>
          </form>
          <div className="flex flex-col md:items-center gap-2 mt-4">
            <p className="text-white text-lg">{"Don't"} have an account?</p>
            <Link className="md:w-2/3" to="/signup">
              <button className="btn rounded-full btn-primary text-white btn-outline w-full">
                Sign up <MdOutlineArrowForward />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
