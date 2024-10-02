import Avatar from "./Avatar";
import { Link } from "react-router-dom";

interface StaffCardProps {
  authorName: string;
  title: string;
  topicName: string;
  penName: string;
  id: string;
}

const Staff = ({
  authorName,
  title,
  topicName,
  penName,
  id,
}: StaffCardProps) => {
  return (
    <div className="py-2 pb-2 w-80 cursor-pointer">
      <div className="flex px-1 py-0">
        <Avatar name={authorName} size="small" />

        <div className="flex flex-row space-x-1 mb-2 mt-1">
          <Link to={`/authorProfile/${penName}`}>
            <div className="font-semibold pl-2 text-xs text-black">
              {authorName}
            </div>
          </Link>
          <div className="font-semibold text-xs text-black">in</div>
          <Link to={"/topics"}>
            <div className="font-semibold text-xs text-black">{topicName}</div>
          </Link>
        </div>
      </div>
      <Link to={`/blog/${id}`}>
        <div className="flex flex-row p-2">
          <div className="flex flex-col static space-between max-w-lg">
            <div className="recommended-title">{title}</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Staff;
