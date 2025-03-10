import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const UserInfo = ({ user }) => {
  if (!user) return null; // Nếu không có user, ẩn luôn phần này
  return (
    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center gap-4 bg-gray-800 p-3 rounded-lg shadow-md">
      {/* Ảnh đại diện */}
      <img
        src={user.avatar || "/Assets/avatar.png"}
        alt="Avatar"
        className="w-16 h-16 rounded-full border-2 border-yellow-500"
      />
      {/* Thông tin người dùng */}
      <div>
        <p className="text-green-400 font-bold text-lg">{user.username}</p>
        <div className="flex items-center gap-2">
          <img src="/Assets/coin1.png" alt="Xu 1" className="w-6 h-6" />
          <span className="text-white">{user.coin1}</span>
          <img src="/Assets/coin2.png" alt="Xu 2" className="w-6 h-6" />
          <span className="text-white">{user.coin2}</span>
        </div>
      </div>
    </div>
  );
};

const MenuButton = ({ image, label, link }) => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(link)} className="relative group">
      <img
        src={image}
        alt={label}
        className="w-20 h-20 transform transition duration-300 group-hover:scale-110"
      />
      <span className="absolute bottom-[-65px] left-1/2 transform -translate-x-1/2 text-xl font-bold text-yellow-500 drop-shadow-md">
        {label}
      </span>
    </button>
  );
};

const Menu = ({ user }) => {
  if (!user) return null;

  return (
    <div className="relative w-full flex justify-between items-center mt-0">
      {/* Chỉ hiển thị UserInfo nếu có user */}
      {user && <UserInfo user={user} />}
  
      {/* Menu sát bên phải và xuống dưới thêm */}
      <div className="absolute right-0 bottom-[-100px] flex gap-20 mr-10 mb-0">
        <MenuButton image="/Assets/lichsu.png" label="Lịch sử" link="/lich-su" />
        <MenuButton image="/Assets/xephang.png" label="Xếp hạng" link="/xep-hang" />
        <MenuButton image="/Assets/banbe.png" label="Bạn bè" link="/ban-be" />
      </div>
    </div>
  );
  
  
};

export default Menu;
