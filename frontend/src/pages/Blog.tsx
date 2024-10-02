// import Appbar from "../components/Appbar";
import FullBlog from "../components/FullBlog";
import Spinner from "../components/icons/Spinner";
import { useBlog } from "../hooks/post";
import { useParams } from "react-router-dom";

// atomFamilies/selectorFamilies
export const Blog = () => {
  const { id } = useParams();
  const { loading, blog } = useBlog({
    id: id || "",
  });

  if (loading || !blog) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div>
      <FullBlog blog={blog} />
    </div>
  );
};
