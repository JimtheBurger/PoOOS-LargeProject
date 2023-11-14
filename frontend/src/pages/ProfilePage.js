import TopNav from "../components/TopNav/TopNav";
import { connectAPI } from "../components/Forms/connectAPI";
import Profile from "../components/Profile";

const ProfilePage = () => {
  return (
    <div>
      <TopNav />
      <Profile />
    </div>
  );
};

export default ProfilePage;
