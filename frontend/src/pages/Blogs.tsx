import Appbar from "../components/Appbar";
import TopicSlider from "../components/TopicSlider";

import BlogList from "../components/BlogList";
import Right from "../components/Right";
import BlogSkeleton from "../components/BlogSkeleton";

import { useBlogs } from "../hooks/post";

import { useState, useEffect } from "react";

export const Blogs = () => {
  const [selectedTopic, setSelectedTopic] = useState("For you");
  const { setTopicName, message, blogs, loading } = useBlogs(
    1,
    30,
    selectedTopic
  );

  // Update the topic in the useBlogs hook whenever the selectedTopic changes
  useEffect(() => {
    setTopicName(selectedTopic);
  }, [selectedTopic, setTopicName]);

  return (
    <div className="flex h-screen justify-start items-start bg-white">
      <div className="flex flex-col w-full">
        <div className="">
          <div className="px-3">
            <Appbar />
          </div>
          <div className="bg-custom-gradient p-3 text-black text-center">
            This is a div with a custom linear gradient background!
          </div>
        </div>
        <div className="w-full">
          <div className="flex flex-row">
            <div className="flex flex-col ml-32 mr-16 w-[60rem]">
              <div className="mt-4">
                {/* <TopicSlider
                  selectedTopic={selectedTopic}
                  setSelectedTopic={setSelectedTopic}
                /> */}
                {!loading && (
                  <TopicSlider
                    selectedTopic={selectedTopic}
                    setSelectedTopic={setSelectedTopic}
                  />
                )}
              </div>
              <div className="border-t-2 border-[rgb(242,242,242)]"></div>
              <div className="px-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center min-h-screen">
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                  </div>
                ) : message ? (
                  <div className="text-center h-[70vh] flex justify-center items-center font-Lora font-semibold text-base">
                    {message}
                  </div>
                ) : (
                  <div>
                    <BlogList blogs={blogs} />
                  </div>
                )}
              </div>
            </div>

            <div className="border-r-2 border-[rgb(242,242,242)"></div>
            <div className="justify-center w-[35.5rem]">
              <Right />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
