import { useRef, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import { MdOutlineArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";

const Search = ({ modalId, cls }) => {
  const inputField = document.getElementById(`search${modalId}`);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef("");
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState([]);

  const handleChange = async () => {
    setIsPending(true);
    try {
      const res = await axios.get(
        `/api/users/search?search=${searchRef.current}`
      );
      if (res.data.error) throw new Error(res.data.error);
      setData(res.data);
      setIsPending(false);
    } catch (error) {
      setData([]);
      setIsPending(false);
    }
  };
  return (
    <div className="sm:w-full w-fit">
      {isSearchOpen ? (
        <div className="sidebar-link h-11"></div>
      ) : (
        <button
          className={cls}
          onClick={() => {
            document.getElementById(modalId).showModal();
            setIsSearchOpen(!isSearchOpen);
          }}
        >
          <HiOutlineMagnifyingGlass className="w-7 h-7" />
          <span className="text-lg hidden md:block">Search</span>
        </button>
      )}

      <dialog id={`${modalId}`} className="modal modal-top">
        <div className="modal-box md:w-1/2 relative left-[50%] translate-x-[-50%] border border-gray-900 top-4 max-h-[75%]">
          <label className="input input-bordered flex items-center gap-2">
            <form className="relative w-full">
              <HiOutlineMagnifyingGlass className="absolute -top-[.12rem] -left-2 w-7 h-7" />
              <input
                id={`search${modalId}`}
                name="search"
                type="text"
                className="grow w-full bg-transparent pr-4 ps-8"
                placeholder="Search people..."
                autoComplete="off"
                onChange={(e) => {
                  searchRef.current = e.target.value;
                  handleChange();
                }}
              />
              {searchRef ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    inputField.value = "";
                    searchRef.current = "";
                    setData([]);
                  }}
                  className="cursor-pointer absolute -right-1 top-[0.2rem]"
                >
                  <RxCross1 />
                </button>
              ) : (
                ""
              )}
            </form>
          </label>
          <div className="py-6">
            {data?.length == 0 && searchRef.current == "" && !isPending && (
              <p className="text-center">Search results...</p>
            )}
            {!isPending && searchRef.current != "" && data?.length == 0 && (
              <p className="text-center">{`No search result for "${searchRef.current}"`}</p>
            )}
            {isPending && (
              <p className="flex items-center justify-center text-xl">
                Loading
                <LoadingSpinner size="xs" />
              </p>
            )}
            <ul>
              {!isPending &&
                data?.map((user, i) => {
                  return (
                    <Link
                      to={`/profile/${user.username}`}
                      className="flex items-center justify-between gap-4 mt-2"
                      key={i}
                    >
                      <div className="flex gap-2 items-center">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={user.profileImg || "/avatar-placeholder.png"}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold tracking-tight truncate w-28">
                            {user.fullName}
                          </span>
                          <span className="text-sm text-slate-500">
                            @{user.username}
                          </span>
                        </div>
                      </div>
                      <MdOutlineArrowOutward />
                    </Link>
                  );
                })}
            </ul>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button
            className="cursor-default"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              searchRef.current = "";
              inputField.value = "";
              setData([]);
            }}
          >
            close
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default Search;
