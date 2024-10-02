/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate, useParams, Link } from "react-router-dom";

import PostAppbar from "../components/PostAppbar";
import { useBlog } from "../hooks/post";
import { Close } from "../components/icons/BlogsIcons";
import Spinner from "../components/icons/Spinner";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { videoHandler, modules } from "../util/videoHandler";

const Edit = () => {
  const { id } = useParams();
  const { loading, blog } = useBlog({ id: id || "" });

  const [isVisible, setIsVisible] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topicName, setTopicName] = useState("");

  useEffect(() => {
    if (!loading && blog) {
      setTitle(blog.title);
      setContent(blog.content);
    }
  }, [loading, blog]);

  const navigate = useNavigate();
  const writingPadRef = useRef<ReactQuill>(null);

  Quill.register("modules/customToolbar", function (quill: any) {
    quill.getModule("toolbar").addHandler("video", videoHandler.bind(quill));
  });

  const getTextPreview = (html: string) => {
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(html, "text/html");
    return parsedDoc.body.textContent || ""; // Extract text content only
  };

  const contentPreview = getTextPreview(content).slice(0, 140) + "...";

  // extract only image from content
  const extractImage = (html: string) => {
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(html, "text/html");
    const imgElements = parsedDoc.querySelectorAll("img");
    return Array.from(imgElements).map((img) => img.src);
  };

  const imageUrls = extractImage(content);
  const firstImage = imageUrls.length > 0 ? imageUrls[0] : null;

  async function handleEdit() {
    try {
      // const parsedContent = JSON.parse(content);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/blog/edit/${id}`,
        { id: id, title, content, topicName, published: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/blog/${response.data.id}`);
    } catch (error) {
      console.log("error saving content to backend", error);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const handleChangeOfTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.title);
  };

  const handleChangeOfEditor = (value: string) => {
    setContent(value);
  };
  return (
    <div className="flex h-screen flex-col justify-start items-start ml-60 mr-60">
      <PostAppbar setVisible={setIsVisible} />
      <div className="flex justify-center w-full pt-8">
        <div className="max-w-screen-lg w-full ml-44 mr-44">
          <textarea
            value={title}
            onChange={handleChangeOfTitle}
            className="resize-none overflow-hidden text-wrap w-full bg-white border-none block p-2.5 font-Lora text-custom-size leading-custom-line-height focus:outline-none"
            placeholder="Title"
            rows={2}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto"; // Reset the height to auto first
              target.style.height = `${target.scrollHeight}px`; // Set height based on content
            }}
          />

          <div className="mt-1">
            <div className="w-full mb-4 ">
              <div className="flex items-center justify-between">
                <div className=" bg-white w-full p-4">
                  <ReactQuill
                    value={content}
                    onChange={handleChangeOfEditor}
                    theme={"bubble"}
                    ref={writingPadRef}
                    placeholder="Tell your story...."
                    className="tracking-wide bg-transparent custom-quill"
                    modules={modules}
                  />
                </div>
              </div>
            </div>
          </div>

          {isVisible && (
            <div className="fixed inset-0 bg-white bg-opacity-100 items-center justify-center">
              <section className="h-10 flex justify-end items-end px-8">
                <button
                  onClick={() => setIsVisible(false)}
                  className="py-2 px-2 mr-[13rem]"
                >
                  <Close height="13px" width="13px" fill="rgb(103, 102, 102)" />
                </button>
              </section>
              <section>
                <div className=" w-screen h-screen flex">
                  <div className="px-8 w-full flex flex-row space-x-20 justify-center items-center lg:flex-row lg:space-x-20 lg:space-y-0 md:flex-col md:space-y-8 md:space-x-0  sm:flex-col sm:space-y-8 sm:space-x-0 xs:flex-col xs:space-y-6 xs:space-x-0">
                    <div className="lg:w-[30rem] md:w-[45rem] sm:w-[35rem] xs:w-[25rem] space-y-4 px-2 py-2">
                      {/* story preview */}
                      <h1 className="font-bold text-base">Story Preview</h1>
                      <div className="bg-gray-100 flex items-center justify-center">
                        {firstImage ? (
                          <img
                            src={firstImage}
                            className="h-48 w-full object-cover"
                          />
                        ) : (
                          <div className="h-48 w-full object-cover flex justify-center items-center">
                            <p className="text-center px-24 font-normal text-sm text-black/[.54]">
                              Included a high-quality image in your story to
                              make it more inviting to readers
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col space-y-4">
                        <textarea
                          className="lucida focus:outline-none border-b-[1.5px] border-black/[.20] resize-none"
                          value={title}
                          readOnly
                        />

                        <textarea
                          className="text-black/[.54] text-sm font-normal focus:outline-none border-b-1 border-black/[.20] resize-none"
                          value={contentPreview}
                          readOnly
                        />
                      </div>
                      <p className="text-sm text-black/[.50] text-wrap">
                        <span className="font-bold">Note:</span> Changes here
                        will affect how your appears in public places like
                        Medium's homepage and in subscribers inboxes - not the
                        contents of the story itself.
                      </p>
                    </div>
                    <div className="px-2 py-2 lg:w-[30rem] md:w-[45rem] sm:w-[35rem] xs:w-[25rem] h-[25.4rem]">
                      <h1 className="font-medium text-base">
                        Publishing to :{" "}
                        <span className="font-bold">krutuja@31</span>
                      </h1>
                      <p className="text-sm">
                        Add or change topics (up to 5) so readers know what your
                        story is about
                      </p>
                      <input
                        name="Topic"
                        type="text"
                        placeholder="Add a Topic..."
                        className="py-4 px-2 w-full text-start bg-gray-100 text-rgb(0,0,0)/[.54] font-normal text-sm"
                        onChange={(e) => setTopicName(e.target.value)}
                      />
                      <p className=" text-[#6d7378] text-sm font-normal">
                        <Link
                          to={"/blogs"}
                          className="mr-1 underline decoration-[1.5px] decoration-gray-600"
                        >
                          Learn more
                        </Link>
                        about what happens to your post when you publish
                      </p>

                      <div className="py-8 space-x-8">
                        <button
                          onClick={handleEdit}
                          className="text-sm font-normal bg-[#228B22] py-2 px-5 rounded-full text-white hover:bg-green-700"
                        >
                          Publish now
                        </button>
                        <button className="text-sm font-normal text-gray-500 hover:text-black">
                          Schedule for later
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Edit;
