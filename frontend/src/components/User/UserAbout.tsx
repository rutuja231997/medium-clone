import { useParams } from "react-router-dom";
import { useProfile } from "../../hooks/profile";
import React, {
  ChangeEvent,
  FormEvent,
  useState,
  useEffect,
  useRef,
} from "react";
import { BACKEND_URL } from "../../config";
import Avatar from "../Avatar";
import Spinner from "../icons/Spinner";
import TextField from "../TextField";
import axios from "axios";

const UserAbout = () => {
  const { penName } = useParams();
  const { currentUser, loading } = useProfile({ penName: penName || "" });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    profilePic: null as File | null,
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        details: currentUser.details,
        profilePic: null,
      });
    }
  }, [currentUser]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "profilePic") {
      setFormData({ ...formData, [name]: files?.[0] || null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("details", formData.details);

    if (formData.profilePic) form.append("profilePic", formData.profilePic);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/profile/updateDetails/${penName}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("user successfully updated...!!!");
      console.log(response);
    } catch (ex) {
      console.log(ex);
      alert("Error while updating user data...!!!");
    }
  };

  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormData({ ...formData, profilePic: null });
  };

  const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        details: currentUser.details,
        profilePic: null,
      });
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="justify-center items-center flex mt-40">
        <Spinner />
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Photo</label>
        <div className="flex py-4">
          <div className="flex justify-start items-start gap-4">
            <Avatar
              name={currentUser.name || ""}
              size="large"
              imageSrc={
                formData.profilePic
                  ? URL.createObjectURL(formData.profilePic)
                  : currentUser.profilePic
              }
            />
          </div>
          <div className="mx-4 sm:w-fit w-[66%]">
            <div>
              <button
                className="text-green-700 py-2 border-none"
                onClick={handleClick}
              >
                Update
              </button>
              <button
                onClick={handleRemoveClick}
                className="text-red-700 px-4 py-2 border-none disabled:opacity-50"
              >
                Remove
              </button>
              <input
                type="file"
                name="profilePic"
                onChange={handleChange}
                ref={fileInputRef}
                className="hidden"
                id="profilePicInput"
              />
            </div>
            <label className="text-xs">
              Recommended: Square JPG, PNG or GIF at least 1,000 pixels per side
            </label>
          </div>
        </div>
      </div>

      <TextField
        name="name"
        value={formData.name || ""}
        type="text"
        onChange={handleChange}
        placeholder="Name"
        label="Name"
        suffix="Appears on your Profile page, as your byline, and in your responses"
      />
      <TextField
        type="text"
        name="details"
        value={formData.details || ""}
        onChange={handleChange}
        placeholder="Bio"
        label="Bio"
        suffix="Appears on your Profile and Next to your stories"
      />

      <button className="ml-4 cursor-pointer focus:outline-none text-white bg-green-700 hover:bg-green-800 hover:text-white focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 mt-4">
        save
      </button>
      <button
        onClick={handleCancelClick}
        className="ml-4 cursor-pointer focus:outline text-green-700 border border-green-700 hover:bg-green-800 hover:text-white focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 mt-4"
      >
        cancel
      </button>
    </form>
  );
};

export default UserAbout;
