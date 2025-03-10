import { useNavigate } from "react-router-dom";

const MenuButton = ({ image, label, link }) => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(link)} className="relative group flex flex-col items-center">
      <img
        src={image}
        alt={label}
        className="w-14 h-14 transform transition duration-300 group-hover:scale-110"
      />
      <span className="text-lg font-bold text-yellow-500 drop-shadow-md mt-1">
        {label}
      </span>
    </button>
  );
};

const Menu = () => {
  return (
    <div className="absolute top-10 right-10 flex gap-14">
      <MenuButton image="/Assets/lichsu.png" label="Lịch sử" link="/lich-su" />
      <MenuButton image="/Assets/xephang.png" label="Xếp hạng" link="/xep-hang" />
      <MenuButton image="/Assets/banbe.png" label="Bạn bè" link="/ban-be" />
    </div>
  );
};

export default Menu;
