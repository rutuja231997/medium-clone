import { useProfile } from "../../hooks/profile";
import BlogSkeleton from "../BlogSkeleton";
import { BlogCard } from "../BlogCard";
import moment from "moment";
import { useParams } from "react-router-dom";

const UserHome = () => {
  const { penName } = useParams();
  const { loading, currentUser } = useProfile({ penName: penName || "" });

  if (loading) {
    return <BlogSkeleton />;
  }
  if (!currentUser) {
    return <div>No user data found</div>;
  }

  return (
    <div className="flex flex-col">
      {currentUser.posts.map((post) => (
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
          topicName={post.topicName}
        />
      ))}
    </div>
  );
};

export default UserHome;
