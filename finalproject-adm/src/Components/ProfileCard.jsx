import React, { useState } from "react";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from "../Services/apiConfig";

const ProfileCard = ({ admin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // state để điều khiển modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // state điều khiển modal đổi mật khẩu

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleAvatarClick = () => {
    setIsModalOpen(true); // Mở modal khi click avatar
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Đóng modal
  };

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true); // Mở modal đổi mật khẩu
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false); // Đóng modal đổi mật khẩu
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và mật khẩu xác nhận không khớp!", {
        className:
          "bg-red-500 text-white text-center text-lg font-semibold shadow-md px-6 py-4 border-2 border-red-600 rounded-full my-2"
      });
      return;
    }

    try {
      const response = await apiClient.post(
        "/admins/change-password",
        {
          oldPassword,
          newPassword,
          confirmPassword,
        }
      );

      toast.success(response.data || "Đổi mật khẩu thành công!", {
        className: "bg-green-500 text-white text-center text-lg font-semibold shadow-md px-6 py-4 border-2 border-green-600 rounded-full my-2"
      }
      );
      setIsPasswordModalOpen(false); // Đóng modal sau khi thành công
      // Reset form nếu cần
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data || "Đổi mật khẩu thất bại!", {
          className:
            "bg-red-500 text-white text-center text-lg font-semibold shadow-md px-6 py-4 border-2 border-red-600 rounded-full my-2"
        });
      } else {
        alert.error("Lỗi kết nối đến máy chủ!");
      }
    }
  };

  return (
    <>
      {/* ProfileCard */}
      <div className="absolute top-2 left-5 w-[400px] h-[180px] p-4 flex z-50 bg-transparent">
        <div className="flex items-center">
          {/* Avatar */}
          <div className="relative flex flex-col items-center">
            <img
              src={admin?.avatar || "/Assets/avatarloading"}
              alt="Avatar"
              className="w-24 h-24 object-cover rounded-full border-4 border-yellow-500 cursor-pointer"
              onClick={handleAvatarClick} // Mở modal khi click
            />
          </div>


          {/* Thông tin user */}
          <div className="ml-5 flex flex-col justify-center">
            <div
              className="italic font-bold text-green-400 text-xl text-center"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "#56C596",
                borderRadius: "10px",
                padding: "4px 12px",
                width: "200px",
                textAlign: "center",
              }}
            >
              {admin?.username || "Loading..."}
            </div>

            {/* <div className="flex mt-4 space-x-6">
                <div className="flex items-center bg-gray-800 text-yellow-200 px-3 py-2 rounded-full space-x-2">
                  <img src="/Assets/red-dumpling.png" alt="Icon1" className="w-6 h-6" />
                  <span className="text-base font-semibold">{admin?.chessElo || "Loading..."}</span>
                </div>
  
                <div className="flex items-center bg-gray-800 text-yellow-200 px-3 py-2 rounded-full space-x-2">
                  <img src="/Assets/gold-potato.png" alt="Icon2" className="w-6 h-6" />
                  <span className="text-base font-semibold">{admin?.chessDownElo || "Loading..."}</span>
                </div>
              </div> */}
          </div>
        </div>
      </div>

      {/* Modal thông tin người dùng */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#f7e3c4] w-[600px] rounded-xl p-6 relative shadow-xl border-4 border-yellow-800">
            {/* Nút đóng */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-black font-bold text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold text-center mb-4">Thông tin người dùng </h2>

            {/* Avatar + tên */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <img
                  src={admin.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-4 border-yellow-500"
                />
                <div className="absolute top-0 right-0 bg-black bg-opacity-70 p-1 rounded-full">
                  📸
                </div>
              </div>
              <div>
                <div className="bg-[#d1bb93] px-4 py-1 rounded-lg italic text-lg font-bold">
                  {admin.username}
                </div>
                {/* <div className="mt-1 bg-yellow-200 text-orange-700 px-3 py-1 rounded-full inline-block text-sm font-semibold">
                    {admin.rankChess} ⭐
                  </div> */}
              </div>
            </div>

            {/* Elo Info */}
            {/* <div className="space-y-4 text-lg font-semibold ">
                <div className="flex items-center gap-4">
                  <img src="/Assets/red-dumpling.png" className="w-12 h-12" />
                  <div>
                    Elo Cờ Tướng : {admin.chessElo} <br />
                    Win: <span className="text-red-600">{admin.win1}</span> &nbsp;
                    Lose: <span className="text-red-600">{admin.lose1}</span> &nbsp;
                    Rank: {admin.rankChess} ⭐
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <img src="/Assets/gold-potato.png" className="w-12 h-12" />
                  <div>
                    Elo Cờ Úp: {admin.chessDownElo} <br />
                    Win: <span className="text-red-600">{admin.win2}</span> &nbsp;
                    Lose: <span className="text-red-600">{admin.lose2}</span> &nbsp;
                    Rank: {admin.rankChessDown} ⭐
                  </div>
                </div>
              </div> */}
            {/* Nút Đổi Mật Khẩu */}
            <div className="mt-6 text-center">
              <button
                onClick={handleOpenPasswordModal} // Mở modal đổi mật khẩu
                className="px-4 py-2 bg-blue-500 text-white rounded-full font-semibold"
              >
                Đổi Mật Khẩu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal đổi mật khẩu */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#f7e3c4] w-[400px] rounded-xl p-6 relative shadow-xl border-4 border-yellow-800">
            {/* Nút đóng */}
            <button
              onClick={handleClosePasswordModal}
              className="absolute top-2 right-2 text-black font-bold text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold text-center mb-4">Đổi Mật Khẩu</h2>

            {/* Mật khẩu cũ */}
            <div className="mb-4">
              <label htmlFor="oldPassword" className="block text-lg font-semibold">
                Mật khẩu cũ
              </label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-yellow-800 rounded-xl mt-2"
                placeholder="Nhập mật khẩu cũ"
              />

            </div>

            {/* Mật khẩu mới */}
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-lg font-semibold">
                Mật khẩu mới
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-yellow-800 rounded-xl mt-2"
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-lg font-semibold">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-yellow-800 rounded-xl mt-2"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            {/* Nút đổi mật khẩu */}
            <div className="text-center mt-4">
              <button
                onClick={handleChangePassword}
                className="px-6 py-2 bg-blue-500 text-white rounded-full font-semibold"
              >
                Đổi Mật Khẩu
              </button>
            </div>
            {/* ...router or other app components */}
          </div>

        </div>
      )}
      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        draggable
        autoClose={3000}
      />
    </>
  );
};

export default ProfileCard;

