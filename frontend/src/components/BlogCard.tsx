import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { Tooltip } from "@nextui-org/react";

import {
  Clap,
  DarkClap,
  Message,
  DarkBookmark,
  Bookmark,
  More,
  ShowLessLikeThis,
} from "./icons/BlogsIcons";

import Toggle from "./Toggle";
import ToggleTwo from "./ToggleTwo";

import { useBookmark } from "../hooks/bookmark";

import { useLikeBlog } from "../hooks/clap";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: string;
  penName: string;
  bookmarkCount?: number;
  topicName: string;
}

export const BlogCard = ({
  penName,
  authorName,
  title,
  content,
  publishedDate,
  id,
}: BlogCardProps) => {
  //extract content only text
  const getTextPreview = (html: string) => {
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(html, "text/html");
    return parsedDoc.body.textContent || ""; // Extract text content only
  };

  const contentPreview = getTextPreview(content).slice(0, 100) + "...";

  // extract only image from content
  const extractImage = (html: string) => {
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(html, "text/html");
    const imgElements = parsedDoc.querySelectorAll("img");
    return Array.from(imgElements).map((img) => img.src);
  };

  const imageUrls = extractImage(content);
  const firstImage = imageUrls.length > 0 ? imageUrls[0] : null;

  const { hasBookmarked, PostBookmark } = useBookmark({
    postId: id || "",
  });

  const { hasLiked, clapCount } = useLikeBlog({ postId: id || "" });

  const handleBookmark = async () => {
    const bookmark = await PostBookmark();
    console.log(bookmark);
  };

  return (
    <div className="p-4 border-b border-[rgb(242,242,242)] pb-4 w-screen max-w-screen-md cursor-pointer">
      <div className="flex flex-col">
        <div className="flex px-2 py-2">
          <Avatar name={authorName} size="small" />

          <Link to={`/authorProfile/${penName}`}>
            <div className="font-extralight pl-2  text-sm flex-justify-center flex-col">
              {authorName}
            </div>
          </Link>
          <div className="flex justify-center pl-2 pt-0.5 flex-justify-center flex-col">
            <Circle />
          </div>
          <div className="pl-2 font-thin text-slate-500 text-sm flex justify-center flex-col">
            {"Post on "}
            {publishedDate}
          </div>
        </div>
        <Link to={`/blog/${id}`}>
          <div className="flex flex-row p-2 space-x-12">
            <div className="flex flex-col static space-between min-w-[32rem] p-1">
              <div className="blogCard-title">{title}</div>
              <div className="flex flex-col content-preview mt-2">
                {contentPreview.slice(0, 100) + "..."}
              </div>
            </div>
            <div className="">
              {firstImage ? (
                <img src={firstImage} className="h-wll w-full object-cover" />
              ) : (
                <img
                  src="https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  className="object-cover h-28 w-40"
                />
              )}
            </div>
          </div>
        </Link>
        <div className="flex flex-row min-w-[32rem] space-x-[14.8rem] px-2">
          <div className="flex flex-row space-x-4">
            <div className="text-slate-500 text-xs font-thin ">
              {`${Math.ceil(contentPreview.length / 100)} minutes(s) read`}
            </div>

            <div className="space-x-4 flex flex-row">
              <div>
                <Tooltip
                  content={hasLiked ? `${clapCount} clap` : `${clapCount} clap`}
                  color="foreground"
                  showArrow={true}
                  placement="top"
                >
                  <div className="flex flex-row">
                    <button>
                      {hasLiked ? (
                        <DarkClap width="22px" height="22px" />
                      ) : (
                        <Clap width="22px" height="22px" />
                      )}
                    </button>
                    <p className="font-Lora likeCount">{clapCount}</p>
                  </div>
                </Tooltip>
              </div>
              <div>
                <Tooltip
                  content="Message"
                  color="foreground"
                  showArrow={true}
                  placement="top"
                >
                  <button>
                    <Message width="22px" height="22px" />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="flex flex-row space-x-4">
            <div>
              <Tooltip
                content="Show Less Like This"
                color="foreground"
                showArrow={true}
                placement="top"
              >
                <button>
                  <ShowLessLikeThis height="24px" width="24px" />
                </button>
              </Tooltip>
            </div>

            <div>
              <Tooltip
                content={hasBookmarked ? "Remove Bookmark" : "Bookmark"}
                color="foreground"
                showArrow={true}
                placement="top"
              >
                <button onClick={handleBookmark}>
                  {hasBookmarked ? (
                    <DarkBookmark width="24px" height="24px" />
                  ) : (
                    <Bookmark height="24px" width="24px" />
                  )}
                </button>
              </Tooltip>
            </div>
            <div>
              <Toggle
                children={<ToggleTwo />}
                buttonText={<More width="24px" height="24px" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Circle() {
  return <div className="h-1 w-1 rounded-full bg-slate-600"></div>;
}
