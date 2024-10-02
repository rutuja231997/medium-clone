import { Clap } from "./../types/index";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

//like blog code
export const useLikeBlog = ({ postId }: { postId: string }) => {
  const [clap, setClap] = useState<Clap>();
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [clapCount, setClapCount] = useState(0);

  //fetching hasLiked status code
  useEffect(() => {
    const fetchHasLikedStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${BACKEND_URL}/api/v1/clap/${postId}/hasLiked`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHasLiked(response.data.hasLikedStatus);
        setClapCount(response.data.clapCount);
      } catch (ex) {
        console.log("Error while fetching hasLiked Status", ex);
      }
    };
    fetchHasLikedStatus();
  }, [postId]);

  //Like blog function code
  async function LikeBlog() {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/clap`,
        { postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.newClap) {
        // Update local state with the new clap data
        setClap(response.data.newClap);
        setClapCount((prevCount) => prevCount + 1);
        setHasLiked(true);
      } else {
        setHasLiked(false);
      }
    } catch (ex) {
      console.log("Error while liking a blog", ex);
    }
  }
  return { LikeBlog, clap, hasLiked, clapCount };
};
