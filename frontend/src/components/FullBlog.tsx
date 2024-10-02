import { Post } from "../types";
import ActionBox from "./ActionBox";
import Appbar from "./Appbar";
import Avatar from "./Avatar";
import moment from "moment";
import ReactQuill from "react-quill";

export default function FullBlog({ blog }: { blog: Post }) {
  return (
    <div>
      <Appbar />
      <div className="flex flex-col justify-center items-center p-4 md:px-10">
        <div className="p-4 max-w-[720px]">
          <div className="text-custom-size md:text-custom-size leading-custom-line-height py-4 line-clamp-4 font-Lora font-black">
            {blog.title}
          </div>
          {/* authorbox */}
          <div>
            <div className="flex items-center gap-4 py-4">
              {/* avatar */}
              <Avatar
                size="medium"
                name={blog.author.user.name || " Anonymous"}
              />
              <div>
                <div className="font-bold">{blog.author.user.name}</div>
                <div>
                  <span className="mr-2">Author Details</span>
                  <span className="text-sm text-slate-500">
                    {"Post on "}{" "}
                    {moment(blog.publishedDate).format("DD-MMM-YYYY HH:mm:ss")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* end of authorbox */}

          {/* action_box */}
          <ActionBox blog={blog} />

          {/* content */}
          <div className="pt-4">
            <ReactQuill
              value={blog.content}
              readOnly={true}
              theme={"bubble"}
              className="tracking-wide bg-transparent custom-quill"
            />
          </div>
        </div>
        {/* tags */}
      </div>
    </div>
  );
}
