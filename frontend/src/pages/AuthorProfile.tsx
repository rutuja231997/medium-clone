import Appbar from "../components/Appbar";
import { useAuthProfile } from "../hooks/profile";
import Spinner from "../components/icons/Spinner";
import { useParams } from "react-router-dom";
import ProfileCard from "../components/Author/ProfileCard";

const AuthorProfile = () => {
  const { penName } = useParams();
  const { loading, author } = useAuthProfile({ penName: penName || "" });

  if (loading || !author) {
    return (
      <div className="w-screen h-screen justify-center items-center flex">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center">
      <Appbar />
      <ProfileCard
        name={author.user.name}
        postCount={author.postCount}
        id={author.id}
      />
    </div>
  );
};

export default AuthorProfile;
