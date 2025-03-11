import React from "react";
import { Camera } from "lucide-react";

const ProfileCard = ({ user }) => {
  return (
    <div className="absolute top-5 left-5 w-[350px] h-[150px] border-4 border-yellow-600 rounded-lg shadow-lg p-4 flex z-10">
      {/* Avatar + Thông tin */}
      <div className="flex items-center">
        <div className="relative w-20 h-20">
          <img
            src={user?.avatar || "../Assets/avatar.png"}
            alt="Avatar"
            className="w-full h-full object-cover rounded-full border-4 border-yellow-500"
          />
          <div className="absolute top-0 left-0 bg-black/50 rounded-full p-1">
            <Camera size={18} color="white" />
          </div>
        </div>

        {/* Thông tin user */}
        <div className="ml-3 flex flex-col">
          <div className="text-lg font-bold italic text-yellow-600">
            {user?.username || "Loading..."}
          </div>
          <div className="flex items-center mt-1">
            <span className="text-sm font-bold text-red-700 bg-yellow-200 px-2 py-1 rounded-lg">
              {user?.role || "Tập sự"}
            </span>
            <span className="ml-1">⭐</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
