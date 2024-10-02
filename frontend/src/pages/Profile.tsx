import { useProfile } from "../hooks/profile";
import Spinner from "../components/icons/Spinner";
import ProfileCard from "../components/User/ProfileCard";
import { useParams } from "react-router-dom";
import Appbar from "../components/Appbar";

export default function Profile() {
  const { penName } = useParams();
  const { loading, currentUser } = useProfile({ penName: penName || "" });

  if (loading || !currentUser) {
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
        name={currentUser.name}
        id={currentUser.id}
        postCount={currentUser.postCount}
      />
    </div>
  );
}
