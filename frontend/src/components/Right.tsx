/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRecommendedBlogs } from "../hooks/post";

import Avatar from "./Avatar";
import Staff from "./Staff";

const Right = () => {
  const { recommendedBlogs } = useRecommendedBlogs();

  return (
    <div className="mr-[9.5rem] ml-10">
      <div>
        <h3 className="py-2 h-[2.5rem] text-md font-semibold">Staff Picks</h3>
        <div>
          {recommendedBlogs && recommendedBlogs.length > 0 ? ( // Add check for recommendedBlogs
            recommendedBlogs.map((blog) => (
              <Staff
                key={blog.id}
                id={blog.id}
                authorName={blog.author.user.name}
                title={blog.title}
                topicName={blog.topicName}
                penName={blog.author.penName}
              />
            ))
          ) : (
            <div>No recommended blogs available</div>
          )}
        </div>
        <h4 className="py-4 text-green-700 text-sm font-semibold">
          See more topics
        </h4>
      </div>
      <div className="mt-4 h-auto">
        <h3 className="py-2 text-medium font-semibold">Recommended Topics</h3>
        <div className="space-x-1 space-y-3">
          {recommendedBlogs && recommendedBlogs.length > 0 ? (
            recommendedBlogs.map((blog) => (
              <ButtonComponent
                key={blog.id}
                button_title={blog.topicName}
                className="bg-gray-100 px-3 py-2 rounded-full text-black font-Georgia font-normal text-sm"
              />
            ))
          ) : (
            <div>No recommended Topics available</div>
          )}
        </div>

        <h4 className="py-4 text-green-700 text-sm font-semibold">
          See more topics
        </h4>
      </div>

      <div className="mt-4 h-auto">
        <h3 className="py-2 text-medium font-semibold">Who to Follow</h3>
        <div>
          {recommendedBlogs && recommendedBlogs.length > 0 ? (
            recommendedBlogs.map((blog) => (
              <AuthorFollow
                key={blog.id}
                authorName={blog.author.user.name}
                details={blog.author.user.details}
              />
            ))
          ) : (
            <div>No recommended Author's available</div>
          )}
        </div>
      </div>

      <div>
        <h3 className="py-4 text-green-700 text-sm font-semibold">
          See more suggestions
        </h3>
      </div>
    </div>
  );
};

export default Right;

interface ComponentProps {
  button_title?: string;
  authorName?: string;
  details?: string;
  profilePic?: string;
  onClick?: () => void;
  className?: string;
}
export const ButtonComponent = ({
  button_title,
  onClick,
  className,
}: ComponentProps) => {
  return (
    <button onClick={onClick} className={className}>
      {button_title}
    </button>
  );
};

export const AuthorFollow = ({ authorName, details }: ComponentProps) => {
  return (
    <div className="mb-2">
      <div className="flex flex-row mt-2">
        <div>
          <Avatar size="medium" name={authorName || ""} />
        </div>
        <div className="flex justify-center flex-col ml-4">
          <h4 className="font-bold">{authorName}</h4>
          <p className="text-xs text-[#8c9196]">{details}</p>
        </div>
        <button className="bg-white rounded-full font-semibold text-center h-8 px-3 text-xs ml-4 border-black border-solid border-1">
          Follow
        </button>
      </div>
    </div>
  );
};
