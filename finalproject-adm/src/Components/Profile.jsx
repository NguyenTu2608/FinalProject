import { useEffect, useState } from "react";
import { getCurrentAdmin } from "../Services/adminServices";
import ProfileCard from "./ProfileCard";
import Menu from "./Menu";

function Profile() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const adminData = await getCurrentAdmin();
        setAdmin(adminData);
      } catch (error) {
        console.log("Không thể lấy thông tin admin");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex justify-center items-center ">
      <ProfileCard admin={admin} />
      <Menu />
    </div>
  );
}

export default Profile;
