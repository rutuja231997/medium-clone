import moment from "moment";
import { Post } from "../types";

import { BlogCard } from "./BlogCard";

interface BlogListProps {
  // selectedTopic: string;
  blogs: Post[];
}

const BlogList = ({ blogs }: BlogListProps) => {
  return (
    <div>
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          id={blog.id}
          authorName={blog.author.user.name || "ram"}
          title={blog.title}
          content={blog.content}
          publishedDate={moment(blog.publishedDate).format(
            "DD-MMM-YYYY HH:mm:ss"
          )}
          penName={blog.author.penName}
          topicName={blog.topicName}
        />
      ))}
    </div>
  );
};

export default BlogList;
