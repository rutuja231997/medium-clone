import { Link, useNavigate } from "react-router-dom";

import Avatar from "./Avatar";

import {
  ProfileIcon,
  StoryIcon,
  LibraryIcon,
  Write,
  Notification,
  SearchBar,
  HomeIcon,
  Medium,
} from "./icons/AppbarIcons";

import { useEffect, useState, useRef } from "react";

export default function Appbar() {
  //Logout section code
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const containRef = useRef<HTMLDivElement>(null);

  const userJSON = localStorage.getItem("user") || "{}";
  const user = JSON.parse(userJSON);

  const Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  useEffect(() => {
    setLoading(false);
  }, [user]);

  const handleClickOutside = (ex: MouseEvent) => {
    if (containRef.current && !containRef.current.contains(ex.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="border-b flex justify-between py-3 h-16 px-3">
      <div className="flex justify-start space-x-8">
        <Link
          to={"/blogs"}
          className="flex flex-row justify-center cursor-pointer"
        >
          <HomeIcon height="40" width="40" />
          <span className="font-bold text-gray-800 text-4xl ml-1 py-1 font-Lora">
            <Medium width="120" height="26" />
          </span>
        </Link>

        <div className="py-3 px-4 bg-[rgb(242,242,242)] rounded-full w-60 flex justify-start space-x-2 h-10">
          <SearchBar height="18" width="18" />
          <input
            type="text"
            className="focus:outline-none bg-[rgb(242,242,242)] font-Lora text-sm"
            placeholder="Search"
          />
        </div>
      </div>

      <div>
        {loading ? (
          <p>Loading...</p> // Display a loading indicator while fetching user profile
        ) : user ? (
          <>
            <div className="flex space-x-8 flex-end">
              <div className=" flex flex-row pt-2 space-x-8">
                <Link to={"/publish"} className="space-x-2 flex flex-row">
                  <Write height="24" width="24" />{" "}
                  <span className="text-[rgb(117,117,117)]"> Write</span>
                </Link>

                <Link to={"/publish"}>
                  <Notification height="26" width="26" />
                </Link>
              </div>

              <div className="relative inline-block py-1" ref={containRef}>
                <Avatar name={user.name} onClick={toggleMenu} />
                {showMenu && (
                  <div
                    className="absolute mt-2 min-w-72 py-4 px-4 bg-white border rounded shadow-lg max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                    style={{ right: "-2.5rem" }}
                  >
                    <Link
                      to={`/profile/${user.penName}`}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      <div className="flex flex-start space-x-4">
                        <ProfileIcon height="24" width="24" />
                        <span>Profile</span>
                      </div>
                    </Link>
                    <Link
                      to="/bookmark"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      <div className="flex flex-start space-x-4">
                        <LibraryIcon height="24" width="24" />
                        <span>Library</span>
                      </div>
                    </Link>
                    <Link
                      to="/library"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      <div className="flex flex-start space-x-4">
                        <StoryIcon height="24" width="24" />
                        <span>Stories</span>
                      </div>
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={Logout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate("/signin")}
            className="mr-4 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}
