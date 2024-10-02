import { useState } from "react";

import { Check } from "../components/icons/BlogsIcons";
import { Medium, HomeIcon } from "../components/icons/AppbarIcons";
import { Plus } from "../components/icons/TopicSliderIcons";

import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

const topics = [
  { id: 1, title: "Software Development" },
  { id: 2, title: "Cryptocurrency" },
  { id: 3, title: "Machine Learning" },
  { id: 4, title: "Technology" },
  { id: 5, title: "Relationship" },
  { id: 6, title: "Web Development" },
  { id: 7, title: "Self Improvement" },
  { id: 8, title: "Data Science" },
  { id: 10, title: "Productivity" },
  { id: 11, title: "Business" },
  { id: 12, title: "LifeStyle" },
  { id: 13, title: "Design" },
  { id: 14, title: "Social Media" },
  { id: 15, title: "Marketing" },
  { id: 16, title: "Android" },
  { id: 17, title: "Mindfulness" },
  { id: 18, title: "DevOps" },
  { id: 19, title: "Extension" },
  { id: 20, title: "Mental Health" },
];

const Topic = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleTopicClick = (topicTitle: string) => {
    if (selectedTopics.includes(topicTitle)) {
      setSelectedTopics(selectedTopics.filter((topic) => topic !== topicTitle));
    } else if (selectedTopics.length < 20) {
      setSelectedTopics([...selectedTopics, topicTitle]);
    }
  };

  const isButtonEnabled = selectedTopics.length >= 3;

  const handlePublishTopic = async () => {
    // if (isButtonEnabled) {
    //   try {
    //     const token = localStorage.getItem("token");
    //     const response = await axios.post(
    //       `${BACKEND_URL}/api/v1/tag/select-topics`,
    //       { topicName: selectedTopics },
    //       {
    //         headers: { Authorization: `Bearer ${token}` },
    //       }
    //     );
    //     console.log("Topic saved: ", response.data.userTopics);
    //     navigate(`/blogs`);
    //   } catch (ex) {
    //     console.log("error saving content to backend:", ex);
    //   }
    // } else {
    //   alert("Please select at least 3 topic");
    // }

    if (isButtonEnabled) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("No authentication token found. Please log in.");
          return;
        }

        const response = await axios.post(
          `${BACKEND_URL}/api/v1/tag/select-topics`,
          { topicName: selectedTopics },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Topics saved: ", response.data.userTopics);
        alert("Topics successfully saved!");
        navigate(`/blogs`);
      } catch (ex) {
        console.error("Error saving content to backend:", ex);
        alert("Failed to save selected topics. Please try again.");
      }
    } else {
      alert("Please select at least 3 topics.");
    }
  };

  return (
    <>
      <section className="w-full flex justify-center h-auto py-4">
        <div className="flex flex-row items-center">
          <HomeIcon width="35" height="35" />
          <span className="ml-[-0.25rem]">
            <Medium height="22" width="120" />
          </span>
        </div>
      </section>
      <section className="h-screen mt-24">
        <div className="w-full flex flex-col items-center justify-center space-y-12">
          <div className="space-y-4">
            <h1 className="text-3xl font-Lora">What are you interested in?</h1>
            <p className="text-base font-Lora text-center">
              Choose three or more
            </p>
          </div>
          <div className="space-x-4 space-y-2 py-3 px-3 lg:w-[45rem] md:w-[40rem] sm:w-[30rem] xs:w-[28rem]">
            {topics.map((topic) => (
              <ButtonTopics
                key={topic.id}
                button_name={topic.title}
                isSelected={selectedTopics.includes(topic.title)}
                onClick={() => handleTopicClick(topic.title)}
              />
            ))}
          </div>
          <div className="">
            <button className=" text-green-700 text-sm font-semibold px-3 py-2">
              Show more
            </button>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 w-full flex justify-center bg-white py-4 shadow-lg">
          <button
            disabled={!isButtonEnabled}
            className={`${
              isButtonEnabled
                ? "bg-black bg-opacity-100"
                : "bg-black bg-opacity-20"
            } text-white text-sm px-24 py-2 rounded-full`}
            onClick={handlePublishTopic}
          >
            Continue
          </button>
        </div>
      </section>
    </>
  );
};

export default Topic;

interface ButtonTopicProps {
  button_name?: string;
  isSelected: boolean;
  onClick: () => void;
}
export const ButtonTopics = ({
  button_name,
  isSelected,
  onClick,
}: ButtonTopicProps) => {
  return (
    <button
      className={`${
        isSelected
          ? "border-[1.5px] border-green-700 bg-[rgb(242,242,242)] text-green-700 text-base font-medium"
          : "border-1 border-rgb(0,0,0)/[.52] bg-[rgb(242,242,242)] text-black text-base font-medium"
      } rounded-full p-0.5 w-fit text-sm text-center`}
      onClick={onClick}
    >
      <span className="flex items-center space-x-2 py-1 px-2">
        <span>{button_name}</span>
        {isSelected ? (
          <Check width="18" height="18" />
        ) : (
          <Plus width="15" height="15" />
        )}
      </span>
    </button>
  );
};
