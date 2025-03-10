import { useEffect, useState } from "react";
import { getCurrentUser } from "../Services/userServices";
import ProfileCard from "./ProfileCard";
import Menu from "./Menu";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.log("Không thể lấy thông tin user");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <ProfileCard user={user} />
      <Menu />
    </div>
  );
}

export default Profile;
