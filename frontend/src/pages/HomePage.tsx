import { Medium } from "../components/icons/AppbarIcons";
import MediumImage from "../assets/images/medium-main.jpg";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const userJSON = localStorage.getItem("user") || "{}";
  const user = JSON.parse(userJSON);

  const handleNavigation = () => {
    if (!user.id) {
      navigate("/signin");
    } else {
      navigate("/blogs");
    }
  };
  return (
    <div className="flex flex-col h-screen bg-[#eeece7]">
      <div className=" ml-40 h-auto">
        <div className="flex flex-row w-full space-x-[38rem]">
          {/* space-x-[35.4rem] */}
          <div
            className="flex justify-start py-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Medium height="24" width="120" />
          </div>
          <div className="flex-end flex flex-row  py-4 px-4 space-x-8">
            <div className="py-2 flex flex-row space-x-8 text-sm">
              <div className="cursor-pointer">Our Story</div>
              <div className="cursor-pointer">Membership</div>
              <div onClick={handleNavigation} className="cursor-pointer">
                Write
              </div>
              <div onClick={handleNavigation} className="cursor-pointer">
                Sign in
              </div>
            </div>
            <div
              onClick={handleNavigation}
              className=" rounded-full bg-black text-white text-center px-4 py-2 text-sm cursor-pointer"
            >
              Get Started
            </div>
          </div>
        </div>
      </div>
      <div className="bg-custom-gradient p-3 w-full absolute mt-[4.3rem] justify-center border-black border">
        <h3 className="text-medium font-semibold text-black text-center">
          Last chance! 6 days left!
          <span className="underline ml-2">Get 20% off membership now</span>
        </h3>
      </div>
      <div className="">
        <div className="ml-40 flex flex-row space-x-28 ">
          <div className="flex flex-col justify-start mt-28 space-y-14">
            <div>
              <h3 className="text-[120px] leading-[100px] font-Georgia">
                Human
              </h3>
              <h2 className="text-[120px] leading-[100px] font-Georgia">
                stories & ideas
              </h2>
            </div>
            <div className="text-xl">
              A place to read, write, and deepen your understanding
            </div>
            <div className="bg-black py-2 w-48 rounded-full text-center text-white text-[1.2rem] loading-[1rem]">
              Start reading
            </div>
          </div>
          <div className="">
            <img src={MediumImage} alt="" className="h-[34rem] w-[29.5rem]" />
          </div>
        </div>
        <div className="border-b-1 border-black"></div>
        <div className="flex flex-row space-x-4 justify-center py-6 px-6 text-xs cursor-pointer list-none">
          <li>Help</li>
          <li>Status</li>
          <li>About</li>
          <li>Careers</li>
          <li>Press</li>
          <li>Blog</li>
          <li>Privacy</li>
          <li>Terms</li>
          <li>Text to speech</li>
          <li>Teams</li>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
