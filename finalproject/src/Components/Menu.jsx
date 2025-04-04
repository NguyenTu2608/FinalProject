import React, { useState, useEffect } from 'react';
import {jwtDecode} from "jwt-decode";
import apiClient from "../Services/apiConfig"; 
import { useNavigate } from "react-router-dom";

const MenuButton = ({ image, label, link, onClick }) => {
  return (
    <button onClick={onClick} className="relative group flex flex-col items-center">
      <img
        src={image}
        alt={label}
        className="w-16 h-16 transform transition duration-300 group-hover:scale-110"
      />
      <span className="text-xl font-bold text-yellow-500 drop-shadow-md mt-2">
        {label}
      </span>
    </button>
  );
};

const MatchHistory = ({ player1, player2, result, onViewClick }) => {
  const isWin = result === 'Thắng';

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-md flex items-center justify-between mb-6 w-[1000px] hover:shadow-xl transition duration-300">
      {/* Người chơi + Kết quả */}
      <div className="flex items-center flex-1 justify-center text-white text-2xl font-semibold">
        <div className="flex-1 text-right pr-8 truncate">{player1}</div>
        <div
          className={`mx-10 px-4 py-1 rounded-full text-xl font-bold ${isWin ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
        >
          {result}
        </div>
        <div className="flex-1 text-left pl-8 truncate">{player2}</div>
      </div>

      {/* Nút xem lại */}
      <button
        onClick={onViewClick}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300"
      >
        Xem lại
      </button>
    </div>
  );
};

const Menu = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [matches, setMatches] = useState([]);
  const [username, setUsername] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    const usernameFromToken = getUsernameFromToken();
    if (usernameFromToken) {
      setUsername(usernameFromToken);  // Set username vào state
    }
  }, []);

  useEffect(() => {
    if (username) {
      getMatchHistoryUsername(username);
    }
  }, [username]);

  const getUsernameFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const decoded = jwtDecode(token);
      return decoded.username || decoded.sub;
    } catch (error) {
      console.error("❌ Lỗi khi giải mã token:", error);
      return null;
    }
  };

  
    const getMatchHistoryUsername = async (username) => {
      try {
        const response = await apiClient.get('/match_history/by-username', {
          params: { username: username }
        });
        
        // Chuyển đổi dữ liệu API vào matches state, đảm bảo playerBlack là username
        const matchData = response.data.map(match => {
          const playerBlack = match.playerBlack === username ? match.playerBlack : match.playerRed;
          const playerRed = match.playerBlack === username ? match.playerRed : match.playerBlack;
          const result = match.winner === 'black' 
        ? (match.playerBlack === username ? "Thắng" : "Thua")
        : (match.playerRed === username ? "Thắng" : "Thua");
          return {
            player1: playerBlack,  // Đảm bảo playerBlack là username
            player2: playerRed,      // playerRed là người còn lại
            result: result
          };
        });
        setMatches(matchData);  // Cập nhật state với dữ liệu lấy được từ API
        console.log('Lịch sử trận đấu:', response.data);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };
  
  // Tính toán số trang
  const totalPages = Math.ceil(matches.length / itemsPerPage);

  // Lấy trận đấu hiện tại trên trang
  const indexOfLastMatch = currentPage * itemsPerPage;
  const indexOfFirstMatch = indexOfLastMatch - itemsPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);

  // Chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleHistoryClick = () => {
    setShowHistory(!showHistory);
  };

  const handleViewMatch = (matchId) => {
    console.log(`Xem lại trận đấu: ${matchId}`);
  };

  return (
    <div className="absolute top-10 right-10 flex gap-16 z-20">
      {/* Các MenuButton */}
      <MenuButton image="/Assets/lichsu.png" label="Lịch sử" onClick={handleHistoryClick} />
      <MenuButton image="/Assets/xephang.png" label="Xếp hạng" link="/xep-hang" />
      <MenuButton image="/Assets/banbe.png" label="Bạn bè" link="/ban-be" />

      {/* Giao diện lịch sử đấu */}
      {showHistory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-900 px-10 pt-14 pb-6 rounded-2xl max-h-[80vh] overflow-y-auto shadow-2xl relative w-[1080px]">
            <h2 className="text-white text-4xl font-bold mb-10 text-center">Lịch sử trận đấu</h2>
            {/* Nút X */}
            <button
              onClick={handleHistoryClick}
              className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-500 transition"
            >
              ✕
            </button>

            {/* Danh sách trận */}
            <div className="max-h-[60vh] overflow-y-auto mb-8">
              {currentMatches.map((match, index) => (
                <MatchHistory
                  key={index}
                  player1={match.player1}
                  player2={match.player2}
                  result={match.result}
                  onViewClick={() => handleViewMatch(index + 1)}
                />
              ))}
            </div>
            {/* Phân trang */}
            <div className="flex justify-center mt-6">
              <ul className="flex gap-4">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => paginate(index + 1)}
                      className={`px-4 py-2 rounded-full ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'} hover:bg-blue-700 transition duration-300`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
