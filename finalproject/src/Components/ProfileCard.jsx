import React from "react";
import { Camera } from "lucide-react";

const ProfileCard = ({ user }) => {
  return (
    <div className="absolute top-5 left-5 w-[350px] h-[150px] border-4 border-yellow-600 rounded-lg shadow-lg p-4 flex z-10">
      {/* Avatar + Thông tin */}
      <div className="flex items-center">
        <div className="relative w-20 h-20">
          <img
            onClick={123}
            src={user?.avatar || ""}  // Hiển thị avatar hoặc hình mặc định
            alt="Avatar"
            className="w-full h-full object-cover rounded-full border-4 border-yellow-500"
          />
        </div>

        {/* Thông tin user */}
        <div className="ml-3 flex flex-col">
          {/* Hiển thị tên user */}
          <div 
            className="text-lg font-bold italic"
            style={{
              backgroundColor: "gray",  // Màu nền xám
              width: "200px",  // Chiều rộng nền
              border: "solid",  // Thêm border đen dày 2px
              borderRadius: "10px",  // Bo góc cho border (tuỳ chọn)
              padding: "5px",  // Thêm khoảng cách trong nội dung
            }}
          >
            {user?.username || "Loading..."}
          </div>
          
          <div className="flex items-center mt-1">
            {/* Hiển thị chessElo */}
            <div 
              className="text-sm font-bold text-gray-600"
              style={{
                backgroundColor: "gray",  // Màu nền xám
                width: "85px",  // Chiều rộng nền
                border: "solid",  // Thêm border đen dày 2px
                borderRadius: "10px",  // Bo góc cho border (tuỳ chọn)
                padding: "5px",  // Thêm khoảng cách trong nội dung
              }}
            >
              {user?.chessElo || "Loading..."} {/* Hiển thị elo nếu có, nếu chưa có thì hiển thị "Loading..." */}
            </div>

            {/* Tạo khoảng cách 15px */}
            <div className="ml-6">

              {/* Hiển thị chessDownElo */}
              <div 
                className="text-sm font-bold text-gray-600"
                style={{
                  backgroundColor: "gray",  // Màu nền xám
                  width: "85px",  // Chiều rộng nền
                  border: "solid",  // Thêm border đen dày 2px
                  borderRadius: "10px",  // Bo góc cho border (tuỳ chọn)
                  padding: "5px",  // Thêm khoảng cách trong nội dung
                }}
              >
                {user?.chessDownElo || "Loading..."} {/* Hiển thị chessDownElo nếu có */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProfileCard;
