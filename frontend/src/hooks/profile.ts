/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useEffect, useState } from "react";
import { User, Author } from "../types";
// import { useNavigate } from "react-router-dom";

export const useProfile = ({ penName }: { penName: string }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User>();
  const [isAuthorizedUser, setIsAuthorizedUser] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!penName) {
        setLoading(false);
        setError("User's penName is required");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/profile/user/${penName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCurrentUser(response.data.user);
        setIsAuthorizedUser(response.data.isAuthorizedUser);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 401) {
            setError("User is not authenticated");
          } else if (error.response.status === 403) {
            setError("User is not authorized");
          } else if (error.response.status === 404) {
            setError("User not found");
          } else {
            setError("An error occurred while fetching the profile");
          }
        } else {
          setError("An unexpected error occurred");
        }
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [penName, setError]);

  return {
    loading,
    error,
    currentUser,
    isAuthorizedUser,
  };
};

export const useAuthProfile = ({ penName }: { penName: string }) => {
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState<Author | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      if (!penName) {
        setLoading(false);
        setError("Author's penName is required");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/profile/author/${penName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAuthor(response.data.author);
      } catch (ex) {
        if (axios.isAxiosError(ex) && ex.response) {
          if (ex.response.status === 401) {
            setError("User is not authenticated");
          } else if (ex.response.status === 403) {
            setError("User is not authorized");
          } else if (ex.response.status === 404) {
            setError("User not found");
          } else {
            setError("An error occurred while fetching the profile");
          }
        } else {
          setError("An unexpected error occurred");
        }
        console.error("Error fetching profile:", ex);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthorProfile();
  }, [penName]);

  return {
    loading,
    author,
    error,
  };
};

interface AuthorResponse {
  authors: Author[];
  page: number;
  limit: number;
}
export const useAuthors = (
  initialPage: number = 1,
  initialLimit: number = 3
) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<AuthorResponse>(
          `${BACKEND_URL}/api/v1/profile/authors`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, limit },
          }
        );
        const { authors } = response.data;
        setAuthors(authors);
      } catch (ex) {
        console.log("Error while fetching authors details", ex);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, [page, limit]);

  return {
    loading,
    authors,
    setPage,
    setLimit,
  };
};
