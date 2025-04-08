import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../Services/apiConfig';

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
      <div className="flex items-center flex-1 justify-center text-black text-2xl font-semibold">
        <div className="flex-1 text-right pr-8 truncate">{player1}</div>
        <div
          className={`mx-10 px-4 py-1 rounded-full text-xl font-bold ${isWin ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
        >
          {result}
        </div>
        <div className="flex-1 text-left pl-8 truncate">{player2}</div>
      </div>

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
  const [username, setUsername] = useState('');
  const itemsPerPage = 5;

  useEffect(() => {
    const usernameFromToken = getUsernameFromToken();
    if (usernameFromToken) {
      setUsername(usernameFromToken);
    }
  }, []);

  useEffect(() => {
    if (username) {
      getMatchHistoryUsername(username);
    }
  }, [username]);

  const getUsernameFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const decoded = jwtDecode(token);
      return decoded.username || decoded.sub;
    } catch (error) {
      console.error('❌ Lỗi khi giải mã token:', error);
      return null;
    }
  };

  const getMatchHistoryUsername = async (username) => {
    try {
      const response = await apiClient.get('/match_history/by-username', {
        params: { username: username },
      });

      // Đảo ngược thứ tự trận đấu để trận mới nhất ở trên cùng
      const matchData = response.data.map(match => {
        const playerBlack = match.playerBlack === username ? match.playerBlack : match.playerRed;
        const playerRed = match.playerBlack === username ? match.playerRed : match.playerBlack;
        const result = match.winner === 'black'
          ? (match.playerBlack === username ? 'Thắng' : 'Thua')
          : (match.playerRed === username ? 'Thắng' : 'Thua');
        return {
          player1: playerBlack,
          player2: playerRed,
          result: result,
        };
      }).reverse(); // Đảo ngược thứ tự trận đấu

      setMatches(matchData);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  const totalPages = Math.ceil(matches.length / itemsPerPage);

  const indexOfLastMatch = currentPage * itemsPerPage;
  const indexOfFirstMatch = indexOfLastMatch - itemsPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleHistoryClick = () => {
    setShowHistory(!showHistory);
  };

  const handleViewMatch = (matchId) => {
    console.log(`Xem lại trận đấu: ${matchId}`);
  };

  const renderPagination = () => {
    const pageNumbers = [];

    // Hiển thị trang trước và sau trang hiện tại
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        pageNumbers.push(i);
      } else if (pageNumbers[pageNumbers.length - 1] !== '...') {
        pageNumbers.push('...');
      }
    }

    return (
      <ul className="flex gap-4">
        {pageNumbers.map((number, index) =>
          number === '...' ? (
            <li key={index} className="px-4 py-2 text-white">...</li>
          ) : (
            <li key={index}>
              <button
                onClick={() => paginate(number)}
                className={`px-4 py-2 rounded-full ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'} hover:bg-blue-700 transition duration-300`}
              >
                {number}
              </button>
            </li>
          )
        )}
      </ul>
    );
  };

  return (
    <div className="absolute top-10 right-10 flex gap-16 z-20">
      <MenuButton image="/Assets/lichsu.png" label="Lịch sử" onClick={handleHistoryClick} />
      <MenuButton image="/Assets/xephang.png" label="Xếp hạng" link="/xep-hang" />
      <MenuButton image="/Assets/banbe.png" label="Bạn bè" link="/ban-be" />

      {showHistory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-[#f7e3c4] px-10 pt-14 pb-6 rounded-2xl max-h-[80vh] overflow-y-auto shadow-2xl relative w-[1080px]">
            <h2 className="text-black text-4xl font-bold mb-10 text-center">Lịch sử trận đấu của bạn </h2>
            <button
              onClick={handleHistoryClick}
              className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-500 transition"
            >
              ✕
            </button>

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

            <div className="flex justify-center mt-6">
              {renderPagination()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
