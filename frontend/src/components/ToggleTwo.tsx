import { Edit, Trash } from "./icons/BlogsIcons";

import { useNavigate } from "react-router-dom";

const ToggleTwo = () => {
  const navigate = useNavigate();
  return (
    <div className="w-60 absolute bottom-full left-1/2 transform -translate-x-1/2 border bg-white box-shadow rounded z-20 py-2">
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-8px] border-t-8 border-t-white border-x-8 border-x-transparent"></div>
      <ul className="">
        <li className="py-2 px-5">
          <button>Bookmark</button>
        </li>
        <li className="py-2 px-5">
          <button onClick={() => navigate(`/AuthorProfile`)}>
            Author Profile
          </button>
        </li>
        <li className="py-2 block">
          <div className="toggle-div-border"></div>
        </li>
        <li className="py-2 px-5">
          <div className="flex flex-row cursor-pointer">
            <Edit height="24px" width="24px" />
            <button>Edit</button>
          </div>
        </li>
        <li className="py-2 px-5 ">
          <div className="flex flex-row cursor-pointer">
            <Trash height="24px" width="24px" />
            <button>Delete</button>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ToggleTwo;
