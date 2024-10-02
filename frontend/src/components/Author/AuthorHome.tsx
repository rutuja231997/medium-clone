import { useAuthProfile } from "../../hooks/profile";
import BlogSkeleton from "../BlogSkeleton";
import { BlogCard } from "../BlogCard";
import moment from "moment";
import { useParams } from "react-router-dom";

const AuthorHome = () => {
  const { penName } = useParams();
  const { loading, author } = useAuthProfile({ penName: penName || "" });

  if (loading) {
    return <BlogSkeleton />;
  }
  if (!author) {
    return <div>No user data found</div>;
  }

  return (
    <div className="flex flex-col">
      {author.posts.map((post) => (
        <BlogCard
          key={post.id}
          id={post.id}
          authorName={post.author.user.name}
          title={post.title}
          content={post.content}
          publishedDate={moment(post.publishedDate).format(
            "DD-MMM-YYYY HH:mm:ss"
          )}
          penName={post.author.penName}
        />
      ))}
    </div>
  );
};

export default AuthorHome;
