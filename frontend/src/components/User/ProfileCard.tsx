import { useState } from "react";
import Avatar from "../Avatar";
import UserAbout from "./UserAbout";
import UserHome from "./UserHome";
import { Link } from "react-router-dom";

interface ProfileCardProps {
  name: string;
  postCount: number;
  id?: string;
}

export default function ProfileCard({ name, postCount }: ProfileCardProps) {
  const [currentTab, setCurrentTab] = useState("Home");

  const determineTabContent = () => {
    switch (currentTab) {
      case "Home":
        return postCount === 0 ? <NoBlogsMessage /> : <UserHome />;
      case "About":
        return <UserAbout />;
      default:
        return <></>;
    }
  };

  return (
    <div className="flex flex-row justify-center">
      <div className="flex flex-col w-full p-5 md:p-24 md:w-4/6 md:pl-36">
        <div className="text-3xl font-Lora hidden md:block ">{name}</div>

        <div className="md:hidden w-full">
          <div className="flex items-center gap-5">
            <Avatar name={name} size="medium" />
            <div>
              <div className="text-md font-bold">{name}</div>
              <p className="text-gray-400 text-sm">0 Followers</p>
            </div>
          </div>
          <button className="flex gap-5 w-full justify-center items-center cursor-pointer focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 mt-4">
            Follow
          </button>
        </div>

        <nav className="flex flex-row gap-5 mt-3 border-b">
          <div
            className={`cursor-pointer hover:text-black py-3 ${
              currentTab === "Home"
                ? "text-black border-b border-black"
                : "text-gray-500"
            }`}
            onClick={() => setCurrentTab("Home")}
          >
            Home
          </div>{" "}
          <div
            className={`cursor-pointer hover:text-black py-3 ${
              currentTab === "About"
                ? "text-black border-b border-black"
                : "text-gray-500"
            }`}
            onClick={() => setCurrentTab("About")}
          >
            About
          </div>
        </nav>

        <div className="mt-3">{determineTabContent()}</div>
      </div>

      <div className="border-1 border-slate-100 hidden md:block w-2/6 p-8 pr-36">
        <Avatar name={name} size="large" />
        <div className="text-lg mt-3 font-bold ">{name}</div>
        <p className="text-gray-400">0 Followers</p>
      </div>
    </div>
  );
}

const NoBlogsMessage = () => (
  <div className="flex flex-col items-center justify-center p-5 border border-gray-200 rounded-lg mt-5">
    <p className="text-lg text-gray-600 mb-3">
      You haven't written any blogs yet.
    </p>
    <Link to="/publish">
      <button
        className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={() => console.log("Navigate to write blog")}
      >
        Write your first blog
      </button>
    </Link>
  </div>
);
