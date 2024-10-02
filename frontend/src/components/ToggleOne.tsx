import { useNavigate } from "react-router-dom";

import { Edit, Trash } from "./icons/BlogsIcons";

import { useDeleteBlog } from "../hooks/post";

const ToggleOne = ({ blogId }: { blogId: string }) => {
  const navigate = useNavigate();

  //Edit and Delete actions code
  const { DeleteBlog } = useDeleteBlog();

  const EditBlog = () => {
    navigate(`/edit/${blogId}`);
  };

  const handleDeleteBlog = async () => {
    const message = await DeleteBlog(blogId);
    console.log(message);
    navigate("/blogs");
  };

  return (
    <div className="w-60 absolute bottom-full left-1/2 transform -translate-x-1/2 border bg-white box-shadow rounded z-20 py-2">
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-8px] border-t-8 border-t-white border-x-8 border-x-transparent"></div>
      <ul className="">
        <li className="py-2 px-5">
          <div className="flex flex-row cursor-pointer">
            <Edit height="24px" width="24px" />
            <button onClick={EditBlog}>Edit</button>
          </div>
        </li>
        <li className="py-2 block">
          <div className="toggle-div-border"></div>
        </li>
        <li className="py-2 px-5 ">
          <div className="flex flex-row cursor-pointer">
            <Trash height="24px" width="24px" />
            <button onClick={handleDeleteBlog}>Delete</button>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ToggleOne;
