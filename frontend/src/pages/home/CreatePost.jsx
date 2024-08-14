import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { usePost } from "../../hooks/customHooks";
import { IoIosSend } from "react-icons/io";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);
  const [showBorder, setShowBorder] = useState(false);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate: createPost, isPending } = usePost();

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({
      method: "post",
      url: "/api/posts/create",
      data: { text, img },
      qKey: ["posts", authUser.username],
      callbackFn: () => {
        setText("");
        setImg(null);
      },
    });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          onFocus={() => {
            setShowBorder(true);
          }}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div
          className={`flex justify-between py-2 ${
            showBorder ? "border-t border-secondary" : ""
          }`}
        >
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input
            accept="image/*"
            type="file"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button
            id="post-submit-btn"
            disabled={isPending || (!text && !img)}
            className={`btn btn-primary rounded-full btn-sm text-white px-4`}
          >
            {isPending ? (
              <>
                Posting
                <LoadingSpinner size="xs" />{" "}
              </>
            ) : (
              <>
                {" "}
                Post <IoIosSend />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreatePost;
