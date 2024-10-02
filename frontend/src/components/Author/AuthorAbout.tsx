import Avatar from "../Avatar";
import TextField from "../TextField";
import { useParams } from "react-router-dom";
import { useAuthProfile } from "../../hooks/profile";
import Spinner from "../icons/Spinner";

const AuthorAbout = () => {
  const { penName } = useParams();
  const { author, loading } = useAuthProfile({ penName: penName || "" });

  if (loading || !author) {
    return (
      <div className="justify-center items-center flex mt-40">
        <Spinner />
      </div>
    );
  }
  return (
    <form>
      <div>
        <label>Photo</label>
        <div className="flex py-4">
          <div className="flex justify-start items-start gap-4">
            <Avatar name={author.user.name} size="large" />
          </div>
          <div className="mx-4 sm:w-fit w-[66%]">
            <div>
              <button
                className="text-green-700 py-2 border-none"
                onClick={() => console.log("update")}
              >
                Update
              </button>
              <button className="text-red-700 px-4 py-2 border-none disabled:opacity-50">
                Remove
              </button>
              <input
                type="file"
                className="invisible"
                onChange={() => console.log("edit picture")}
              />
            </div>
            <label className="text-xs">
              Recommended: Square JPG, PNG or GIF at least 1,000 pixels per side
            </label>
          </div>
        </div>
      </div>
      {/* textfield for name */}
      <TextField
        label="Name"
        placeholder="Name"
        value={author.user.name}
        onChange={() => console.log("name")}
        suffix="Appears on your Profile page, as your byline, and in your responses"
      />
      <TextField
        label="Bio"
        placeholder="Bio"
        value={author.user.details}
        onChange={() => console.log("bio")}
        suffix="Appears on your Profile and Next to your stories"
      />
      <button className="ml-4 cursor-pointer focus:outline-none text-white bg-green-700 hover:bg-green-800 hover:text-white focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 mt-4">
        save
      </button>
      <button className="ml-4 cursor-pointer focus:outline text-green-700 border border-green-700 hover:bg-green-800 hover:text-white focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 mt-4">
        cancel
      </button>
    </form>
  );
};

export default AuthorAbout;
