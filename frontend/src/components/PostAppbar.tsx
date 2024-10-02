import { Medium } from "./icons/AppbarIcons";
import { More } from "./icons/BlogsIcons";
import { Notification } from "./icons/AppbarIcons";

import Avatar from "./Avatar";
import React from "react";
import { Link } from "react-router-dom";

interface PostAppbarProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostAppbar = ({ setVisible }: PostAppbarProps) => {
  return (
    <div className="flex flex-row p-1 space-x-[39.3rem]">
      <div className="flex flex-row space-x-3 items-center justify-center">
        <Link to={"/blogs"}>
          <div>
            <Medium height="60" width="120" />
          </div>
        </Link>
        <div className="text-sm whitespace-nowrap">Draft in Author</div>
      </div>
      <div className="flex flex-row space-x-4 items-center justify-center ml-[30rem]">
        <div>
          <button
            className="text-sm text-white bg-green-700 px-2 py-1 rounded-full"
            onClick={() => setVisible(true)}
          >
            Publish
          </button>
        </div>
        <div>
          <More height="24" width="24" />
        </div>
        <div>
          <Notification height="22" width="22" />
        </div>
        <div>
          <Avatar size="medium" name="Rutuja Kamble" />
        </div>
      </div>
    </div>
  );
};
export default PostAppbar;
