import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { Bookmark } from "../types";

export const useBookmark = ({ postId }: { postId: string }) => {
  const [bookmark, setBookmark] = useState<Bookmark>();
  const [hasBookmarked, setHasBookmarked] = useState<boolean>(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    const checkUserBookmarkedBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/bookmark/${postId}/hasBookmarked`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHasBookmarked(response.data.hasBookmarkStatus);
        setBookmarkCount(response.data.bookmarkCount);
      } catch (ex) {
        console.log("Error while checking if user bookmarked a blog", ex);
      }
    };
    checkUserBookmarkedBlog();
  }, [postId]);

  async function PostBookmark() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/bookmark`,
        { postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.newBookmark) {
        setBookmark(response.data.newBookmark);
        setHasBookmarked(true);
        setBookmarkCount((prevCount) => prevCount + 1);
      } else if (response.data.deleteBookmark) {
        setBookmark(response.data.deleteBookmark);
        setHasBookmarked(false);
        setBookmarkCount((prevCount) => prevCount - 1);
      }
      return response.data.message;
    } catch (ex) {
      console.log("error while posting bookmark", ex);
    }
  }

  async function deleteBookmark(id: string) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${BACKEND_URL}/api/v1/bookmark/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookmark(response.data.bookmark);
      return response.data.message;
    } catch (ex) {
      console.log("Error while deleting bookmark", ex);
    }
  }

  return {
    bookmarkCount,
    bookmark,
    PostBookmark,
    hasBookmarked,
    deleteBookmark,
  };
};

export const useBookmarks = () => {
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const GetBookmarks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const userJson = localStorage.getItem("user") || "{}";
      const user = JSON.parse(userJson);
      const userId = user.id;

      const response = await axios.get(
        `${BACKEND_URL}/api/v1/bookmark/me/lists`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            userId: userId,
          },
        }
      );
      setBookmarks(response.data.bookmarks);
      setLoading(false);
      return response.data.message;
    } catch (ex) {
      console.log("error while fetching bookmarks", ex);
    }
  }, []);

  useEffect(() => {
    GetBookmarks();
  }, [GetBookmarks]);
  return {
    loading,
    bookmarks,
    GetBookmarks,
  };
};
