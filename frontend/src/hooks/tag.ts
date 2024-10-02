import { UserTopic } from "../types";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";

export const useTags = () => {
  const [UserTopics, setUserTopics] = useState<UserTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/tag/user-topics`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserTopics(response.data.UserTopics);
        setLoading(false);
      } catch (ex) {
        console.log(ex);
        setLoading(true);
      }
    };
    fetchTags();
  }, []);
  return { UserTopics, loading };
};
