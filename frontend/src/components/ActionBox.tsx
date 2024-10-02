import { Tooltip } from "@nextui-org/react";

import {
  Clap,
  DarkClap,
  Bookmark,
  DarkBookmark,
  Audio,
  Share,
  More,
  Message,
} from "./icons/BlogsIcons";

import Toggle from "./Toggle";
import ToggleOne from "./ToggleOne";

import { useBookmark } from "../hooks/bookmark";
import { useLikeBlog } from "../hooks/clap";
import { Post } from "../types";

const ActionBox = ({ blog }: { blog: Post }) => {
  // const { id } = useParams();

  const { clapCount, hasLiked, LikeBlog } = useLikeBlog({
    postId: blog.id || "",
  });

  const { PostBookmark, hasBookmarked } = useBookmark({
    postId: blog.id || "",
  });

  const handleLikeBlog = async () => {
    await LikeBlog();
  };

  //handleBookmark code
  const handleBookmark = async () => {
    await PostBookmark();
  };

  return (
    <div className="text-slate-500 py-2 flex flex-row border-y border-slate-200">
      <div className="margin-blog flex flex-row justify-between items-center space-x-6">
        <div className="text-sm flex flex-row flex-start space-x-2">
          <Tooltip
            content={hasLiked ? "Remove Clap" : "Clap"}
            showArrow={true}
            placement="top"
            color="foreground"
          >
            <button onClick={handleLikeBlog} className="cursor-pointer">
              {hasLiked ? (
                <DarkClap width="24px" height="24px" />
              ) : (
                <Clap width="24px" height="24px" />
              )}
            </button>
          </Tooltip>

          <Tooltip
            content="view claps"
            showArrow={true}
            placement="top"
            color="foreground"
          >
            <p className="font-Lora cursor-pointer">{clapCount}</p>
          </Tooltip>
        </div>

        <div>
          <Tooltip
            content="Respond"
            showArrow={true}
            placement="top"
            color="foreground"
          >
            <div className="cursor-pointer">
              <Message width="24px" height="24px" />
            </div>
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-row space-x-4">
        <div className="flex flex-row justify-between items-center space-x-6">
          <Tooltip
            content={hasBookmarked ? "Remove Bookmark" : "Bookmark"}
            showArrow={true}
            placement="top"
            color="foreground"
          >
            <div className="flex flex-row space-x-2">
              <button onClick={handleBookmark} className="cursor-pointer">
                {hasBookmarked ? (
                  <DarkBookmark height="24px" width="24px" />
                ) : (
                  <Bookmark height="24px" width="24px" />
                )}
              </button>
              {/* <p>{bookmarkCount}</p> */}
            </div>
          </Tooltip>

          <Tooltip
            content="Audio"
            showArrow={true}
            placement="top"
            color="foreground"
          >
            <button className="cursor-pointer">
              <Audio height="24px" width="24px" />
            </button>
          </Tooltip>

          <Tooltip
            content="Share"
            showArrow={true}
            placement="top"
            color="foreground"
          >
            <button className="cursor-pointer">
              <Share height="24px" width="24px" />
            </button>
          </Tooltip>
        </div>

        <Tooltip
          content="More"
          showArrow={true}
          placement="top"
          color="foreground"
        >
          <button className="cursor-pointer">
            <Toggle
              buttonText={<More width="24px" height="24px" />}
              children={<ToggleOne blogId={blog.id} />}
            />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ActionBox;
