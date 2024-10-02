import { Link, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import Toggle from "./Toggle";

import { Bookmark, DarkBookmark, Trash, More } from "./icons/BlogsIcons";
import { useBookmark } from "../hooks/bookmark";

import { Tooltip } from "@nextui-org/react";
import generative from "../assets/images/generative.jpg";
import { useCallback } from "react";

interface BookmarkCardProps {
  id: string;
  userId?: string;
  postId: string;
  title: string;
  content: string;
  authorName: string;
  publishDate: string;
  published?: string;
  bookmarks?: string;
  onBookmarkDeleted: () => void;
}

const BookmarkCard = ({
  id,
  postId,
  title,
  content,
  authorName,
  publishDate,
  onBookmarkDeleted,
}: BookmarkCardProps) => {
  const navigate = useNavigate();
  const { hasBookmarked, deleteBookmark } = useBookmark({
    postId: postId || "",
  });

  const handleBookmark = useCallback(async () => {
    const bookmark = await deleteBookmark(id);
    console.log(bookmark);
    onBookmarkDeleted();
  }, [deleteBookmark, id, onBookmarkDeleted]);

  const contentPreview = content.slice(0, 100) + "...";
  return (
    <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer">
      <div className="flex px-2 py-2">
        <Avatar name={authorName} size="small" />

        <div className="font-extralight pl-2  text-sm flex-justify-center flex-col">
          {authorName}
        </div>
        <div className="flex justify-center pl-2 pt-0.5 flex-justify-center flex-col">
          <Circle />
        </div>
        <div className="pl-2 font-thin text-slate-500 text-sm flex justify-center flex-col">
          {"Post on "}
          {publishDate}
        </div>
      </div>
      <Link to={`/blog/${postId}`}>
        <div className="flex flex-row p-2">
          <div className="flex flex-col static mr-12 max-w-lg">
            <div className="text-2xl font-bold font-Lora">{title}</div>
            <div className="font-medium text-[#6d7378] font-Lora ">
              {contentPreview.slice(0, 100) + "..."}
            </div>
          </div>
          <div className=" h-28 w-40">
            <img src={generative} className="h-full w-full object-cover" />
          </div>
        </div>
      </Link>
      <div className="flex flex-row space-x-80 px-2 py-2">
        <div className=" text-slate-500 text-sm font-thin py">{`${Math.ceil(
          contentPreview.length / 100
        )} minutes(s) read`}</div>

        <div className="flex flex-row space-x-4">
          <Tooltip
            content={hasBookmarked ? "Bookmarked" : "Bookmarked"}
            showArrow={true}
            placement="top"
            color="foreground"
          >
            <button>
              {hasBookmarked ? (
                <DarkBookmark height="24px" width="24px" />
              ) : (
                <Bookmark height="24px" width="24px" />
              )}
            </button>
          </Tooltip>

          <Toggle
            children={
              <div className="w-60 absolute bottom-full left-1/2 transform -translate-x-1/2 border bg-white box-shadow rounded z-20 py-2">
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-8px] border-t-8 border-t-white border-x-8 border-x-transparent"></div>
                <ul className="">
                  <li className="py-2 px-5">
                    <button>Bookmark</button>
                  </li>
                  <li className="py-2 px-5">
                    <button onClick={() => navigate(`/AuthorProfile`)}>
                      Author Profile
                    </button>
                  </li>
                  <li className="py-2 block">
                    <div className="toggle-div-border"></div>
                  </li>
                  <li className="py-2 px-5 ">
                    <div className="flex flex-row cursor-pointer">
                      <Trash height="24px" width="24px" />
                      <button onClick={handleBookmark}>Delete</button>
                    </div>
                  </li>
                </ul>
              </div>
            }
            buttonText={<More width="24px" height="24px" />}
          />
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;

export function Circle() {
  return <div className="h-1 w-1 rounded-full bg-slate-600"></div>;
}

// export function ToggleBookmark() {
//   const navigate = useNavigate();
//   return (
//     <div className="w-60 absolute bottom-full left-1/2 transform -translate-x-1/2 border bg-white box-shadow rounded z-20 py-2">
//       <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-8px] border-t-8 border-t-white border-x-8 border-x-transparent"></div>
//       <ul className="">
//         <li className="py-2 px-5">
//           <button>Bookmark</button>
//         </li>
//         <li className="py-2 px-5">
//           <button onClick={() => navigate(`/AuthorProfile`)}>
//             Author Profile
//           </button>
//         </li>
//         <li className="py-2 block">
//           <div className="toggle-div-border"></div>
//         </li>
//         <li className="py-2 px-5 ">
//           <div className="flex flex-row cursor-pointer">
//             <Trash height="24px" width="24px" />
//             <button>Delete</button>
//           </div>
//         </li>
//       </ul>
//     </div>
//   );
// }
