import { useState, useEffect } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { Post } from "../types";

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Post>();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlog(response.data.blog);
      } catch (error) {
        console.log("Error while fetching blogs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  return {
    loading,
    blog,
  };
};

interface BlogResponse {
  blogs: Post[];
  page: number;
  limit: number;
  totalBlogs: number;
  totalPages: number;
  message: string;
}

interface BlogResponse {
  blogs: Post[];
  totalBlogs: number;
  totalPages: number;
  message: string;
}

export const useBlogs = (
  initialPage: number = 1,
  initialLimit: number = 30,
  initialTopicName: string = "For you"
) => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState<Post[]>([]);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [topicName, setTopicName] = useState(initialTopicName);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true); // Set loading to true while fetching
      setBlogs([]); // Clear previous blogs to prevent stale data
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<BlogResponse>(
          `${BACKEND_URL}/api/v1/blog/blogs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page,
              limit,
              topicName: topicName === "For you" ? undefined : topicName,
            },
          }
        );

        const { blogs, totalBlogs, totalPages, message } = response.data;
        setBlogs(blogs);
        setTotalBlogs(totalBlogs);
        setTotalPages(totalPages);
        setMessage(message);
      } catch (error) {
        console.error("Error while fetching blogs:", error); // Error handling
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchBlogs();
  }, [page, limit, topicName]);

  const nextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1); // Using functional update for consistency
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1); // Using functional update for consistency
    }
  };

  const updateTopic = (newTopicName: string) => {
    setTopicName(newTopicName);
    setPage(1); // Reset page number to 1 when changing topic
  };

  return {
    loading,
    blogs,
    page,
    limit,
    totalPages,
    totalBlogs,
    message,
    nextPage,
    prevPage,
    setLimit,
    setTopicName: updateTopic,
  };
};

interface RecommendedBlogResponse {
  recommendedBlogs: Post[];
  message: string;
}

export const useRecommendedBlogs = () => {
  const [recommendedBlogs, setRecommendedBlogs] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchRecommendedBlogs() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const userJson = localStorage.getItem("user") || "{}";
        const user = JSON.parse(userJson);
        const userId = user.id;
        const userPenName = user.penName;

        if (!userId) {
          throw new Error("userId is missing");
        }

        const response = await axios.get<RecommendedBlogResponse>(
          `${BACKEND_URL}/api/v1/blog/recommended-blogs`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
              userId: userId,
              userPenName: userPenName,
            },
          }
        );

        const { recommendedBlogs, message } = response.data;
        setRecommendedBlogs(recommendedBlogs);
        setMessage(message);
      } catch (ex) {
        setLoading(false);
        console.log("Failed fetched recommended blogs...!!!", ex);
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendedBlogs();
  }, []);
  return {
    recommendedBlogs,
    loading,
    message,
  };
};

//delete blog code
export const useDeleteBlog = () => {
  const [blog, setBlog] = useState<Post | null>(null);

  async function DeleteBlog(id: string) {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${BACKEND_URL}/api/v1/blog/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlog(response.data.blog);
      return response.data.message;
    } catch (error) {
      console.log("Error while deleting blog:", error);
    }
  }

  return { blog, DeleteBlog };
};
