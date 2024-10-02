import { RightArrow } from "./icons/TopicSliderIcons";
import { LeftArrow } from "./icons/TopicSliderIcons";
import { Plus } from "./icons/TopicSliderIcons";

import React, { useEffect, useRef, useState } from "react";
import { useTags } from "../hooks/tag";
import { useNavigate } from "react-router-dom";
import TopicSkeleton from "./TopicSkeleton";

interface topicProps {
  selectedTopic: string;
  setSelectedTopic: React.Dispatch<React.SetStateAction<string>>;
}

const TopicSlider = ({ selectedTopic, setSelectedTopic }: topicProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { loading, UserTopics } = useTags();
  const navigate = useNavigate();

  const [atStart, setAtStart] = useState(true);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 100, behavior: "smooth" });
      setAtStart(false);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
      if (scrollContainerRef.current.scrollLeft <= 10) {
        setAtStart(true);
      }
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setAtStart(scrollContainerRef.current.scrollLeft === 10);
    }
  };

  const handleTopicClick = (topicName: string) => {
    setSelectedTopic(topicName);

    if (topicName === "For you") {
      navigate("/blogs");
    } else {
      navigate(`/blogs?topicName=${topicName}`);
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollContainerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        scrollContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div>
      {loading ? (
        <TopicSkeleton />
      ) : (
        <div>
          <div className="relative flex justify-center items-center mx-auto px-1 h-[2.5rem] w-[46.5rem]">
            {atStart ? (
              <div className="z-10 p-1 cursor-pointer">
                <Plus height="13" width="13" fill="#000" />
              </div>
            ) : (
              <button
                onClick={scrollLeft}
                className="z-10 p-2 mb-7 transform translate-y-1/2 bg-white/50 backdrop:blur-sm rounded-full"
              >
                <LeftArrow height="13" width="13" fill="#000" />
              </button>
            )}

            <div
              className="flex overflow-x-auto scrollbar-hide space-x-4 p-2"
              ref={scrollContainerRef}
            >
              <div
                onClick={() => handleTopicClick("For you")}
                className={`flex-shrink-0 cursor-pointer px-3 py-2 text-sm transition-colors duration-200 text-black/[30] hover:text-black/[80] hover:font-semibold font-Lora ${
                  selectedTopic === "For you"
                    ? "text-black font-semibold underline underline-offset-[14px] decoration-black decoration-[1px]"
                    : "text-black/[30] hover:text-black/[80] hover:font-semibold font-Lora"
                }`}
              >
                For you
              </div>

              {UserTopics.map((ut) => (
                <div
                  key={ut.topic.id}
                  onClick={() => handleTopicClick(ut.topic.topicName)}
                  className={`flex-shrink-0 cursor-pointer px-3 py-2 text-sm transition-colors duration-200${
                    selectedTopic === ut.topic.topicName
                      ? "text-black font-medium underline underline-offset-[14px] decoration-black decoration-[1px]"
                      : "text-black/[30] hover:text-black/[80] hover:font-medium font-Lora"
                  }`}
                >
                  {ut.topic.topicName}
                </div>
              ))}
            </div>
            <button
              onClick={scrollRight}
              className="z-10 p-2 mb-7 transform translate-y-1/2 bg-white/50 backdrop:blur-sm rounded-full"
            >
              <RightArrow height="13" width="13" fill="#000" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicSlider;
