import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import apiClient from '../../Services/apiConfig';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs'; // Import dayjs

const GameManagement = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]); // State để lưu trữ danh sách game
    const [loading, setLoading] = useState(true); // State để kiểm tra xem dữ liệu đang được tải hay chưa
    const [activeTab, setActiveTab] = useState('game');
    const [activeRankingTab, setActiveRankingTab] = useState('chess');
    const [chessPlayers, setChessPlayers] = useState([]); // State để lưu trữ danh sách người chơi Cờ Tướng
    const [matchHistory, setMatchHistory] = useState([]);
    useEffect(() => {
        fetchGames(); // Gọi API khi component được render lần đầu
        fetchChessPlayers(); // Lấy danh sách người chơi Cờ Tướng
        fetchMatchHistory();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await apiClient.get('/games'); // Đường dẫn lấy game từ API
            setGames(response.data); // Lưu dữ liệu vào state
        } catch (error) {
            toast.error('Lỗi khi lấy game:', error);
        } finally {
            setLoading(false); // Sau khi dữ liệu được lấy về, set loading = false
        }
    };

    const fetchChessPlayers = async () => {
        try {
            const response = await apiClient.get('/users'); // Lấy danh sách người chơi
            setChessPlayers(response.data); // Lưu dữ liệu vào state
        } catch (error) {
            console.error('Error fetching chess players:', error);
        }
    };

    const fetchMatchHistory = async () => {
        try {
            const response = await apiClient.get('/match_history'); // Lấy danh sách người chơi
            setMatchHistory(response.data); // Lưu dữ liệu vào state
        } catch (error) {
            console.error('Error fetching chess players:', error);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleDelete = async (gameId) => {
        try {
            await apiClient.delete(`/games/${gameId}`); // Gọi API xóa game
            setGames(games.filter((game) => game.id !== gameId)); // Cập nhật lại danh sách game sau khi xóa
            toast.success('Game đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa game:', error);
            toast.error('Có lỗi xảy ra khi xóa game!');
        }
    };
    const handleViewReplay = (matchId) => {
        // Ví dụ: mở modal hoặc điều hướng đến trang replay
        toast.error("Tính năng đang được update")
        console.log('Xem lại trận:', matchId);
        // navigate(`/replay/${matchId}`);
    };

    const handleDeleteMatch = async (matchId) => {
        try {
            await apiClient.delete(`/match_history/${matchId}`); // Gọi API xóa game
            setMatchHistory(matchHistory.filter((matchHistory) => matchHistory.id !== matchId)); // Cập nhật lại danh sách game sau khi xóa
            toast.success('Game đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa game:', error);
            toast.error('Có lỗi xảy ra khi xóa game!');
        }
    };
    const formatDate = (dateString) => {
        return dayjs(dateString).format('DD/MM/YYYY HH:mm'); // Định dạng thời gian ngắn gọn
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-[#f7e3c4] px-10 pt-14 pb-6 rounded-2xl max-h-[80vh] overflow-auto shadow-2xl relative w-[1080px]">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Quản lý Game</h2>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-6">
                    <button
                        className={`px-6 py-2 mx-2 text-lg font-semibold rounded-md ${activeTab === 'game' ? 'bg-yellow-500 text-white' : 'bg-gray-300'}`}
                        onClick={() => handleTabChange('game')}
                    >
                        Game
                    </button>
                    <button
                        className={`px-6 py-2 mx-2 text-lg font-semibold rounded-md ${activeTab === 'matchHistory' ? 'bg-yellow-500 text-white' : 'bg-gray-300'}`}
                        onClick={() => handleTabChange('matchHistory')}
                    >
                        Match History
                    </button>
                    <button
                        className={`px-6 py-2 mx-2 text-lg font-semibold rounded-md ${activeTab === 'ranking' ? 'bg-yellow-500 text-white' : 'bg-gray-300'}`}
                        onClick={() => handleTabChange('ranking')}
                    >
                        Ranking
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'game' && (
                        <div className="game-tab-content">
                            <h3 className="text-xl font-bold mb-4">Danh sách Game</h3>
                            {loading ? (
                                <div>Đang tải...</div>
                            ) : (
                                <div>
                                    <div className="flex bg-gray-200 p-2 mb-2 font-semibold">
                                        <div className="w-1/6 text-center">Tên Phòng</div>
                                        <div className="w-1/6 text-center">Player Red</div>
                                        <div className="w-1/6 text-center">Player Black</div>
                                        <div className="w-1/6 text-center">Trạng thái</div>
                                        <div className="w-1/6 text-center">Game Mode</div>
                                        <div className="w-1/6 text-center">Thời gian tạo</div>
                                        <div className="w-1/6 flex justify-center">Hành động</div>
                                    </div>
                                    {games.map((game) => (
                                        <div key={game.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-lg mb-4">
                                            <div className="w-1/6 text-center">{game.name}</div>
                                            <div className="w-1/6 text-center">{game.playerRed}</div>
                                            <div className="w-1/6 text-center">{game.playerBlack}</div>
                                            <div className="w-1/6 text-center">{game.gameStatus}</div>
                                            <div className="w-1/6 text-center">{game.gameMode}</div>
                                            <div className="w-1/6 text-center">{formatDate(game.createdAt)}</div>
                                            <div className="w-1/6 flex justify-center">
                                                <button
                                                    onClick={() => handleDelete(game.id)}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'matchHistory' && (
                        <div className="match-history-tab-content w-full max-w-6xl mx-auto">
                            <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">Lịch sử Trận Đấu</h3>

                            {matchHistory.length === 0 ? (
                                <p className="text-center text-gray-600">Không có dữ liệu trận đấu.</p>
                            ) : (
                                <>
                                    {/* Header */}
                                    <div className="grid grid-cols-5 gap-4 text-center font-semibold text-gray-900 pb-2 border-b border-gray-300 mb-4">
                                        <div>Người chơi Đen</div>
                                        <div>Kết quả</div>
                                        <div>Người chơi Đỏ</div>
                                        <div>Thời gian</div>
                                        <div className="flex justify-center">Hành động</div> {/* Căn giữa cho cột hành động */}
                                    </div>

                                    {/* Match rows */}
                                    {matchHistory.map((match) => {
                                        const red = match.playerRed;
                                        const black = match.playerBlack;

                                        let winnerUsername = match.winner === 'red' ? red
                                            : match.winner === 'black' ? black
                                                : match.winner;

                                        const isRedWinner = winnerUsername === red;
                                        const isDraw = red === black || (!winnerUsername || winnerUsername === '');

                                        const result = isDraw ? 'Hòa' : (isRedWinner ? 'Thắng' : 'Thua');

                                        return (
                                            <div
                                                key={match.id}
                                                className="grid grid-cols-5 gap-4 items-center text-center bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl shadow-sm mb-3 hover:shadow-lg transition duration-300"
                                            >
                                                <div className="truncate text-gray-900">{black}</div>

                                                <div>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${isDraw
                                                        ? 'bg-gray-400 text-gray-900'  // Màu chữ khi hòa
                                                        : isRedWinner
                                                            ? 'bg-green-600 text-white'  // Màu chữ khi người chơi đỏ thắng
                                                            : 'bg-red-600 text-white'  // Màu chữ khi người chơi đen thắng
                                                        }`}>
                                                        {isDraw ? 'Hòa' : result}
                                                    </span>
                                                </div>

                                                <div className="truncate text-gray-900">{red}</div>
                                                <div className="text-sm text-gray-500">{formatDate(match.createdAt)}</div>

                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => handleViewReplay(match.id)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-3 rounded-xl shadow transition duration-300"
                                                    >
                                                        Xem lại
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteMatch(match.id)} // Function to handle deletion
                                                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-3 rounded-xl shadow transition duration-300"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'ranking' && (
                        <div>
                            <div className="flex justify-center mb-6">
                                <button
                                    className={`px-6 py-2 mx-2 text-lg font-semibold rounded-md ${activeRankingTab === 'chess' ? 'bg-yellow-500 text-white' : 'bg-gray-300'}`}
                                    onClick={() => setActiveRankingTab('chess')}
                                >
                                    Cờ Tướng
                                </button>
                                <button
                                    className={`px-6 py-2 mx-2 text-lg font-semibold rounded-md ${activeRankingTab === 'chessUp' ? 'bg-yellow-500 text-white' : 'bg-gray-300'}`}
                                    onClick={() => setActiveRankingTab('chessUp')}
                                >
                                    Cờ Úp
                                </button>
                            </div>

                            {/* Nội dung Ranking Cờ Tướng */}
                            {activeRankingTab === 'chess' && (
                                <div className="chess-ranking">
                                    <h4 className="text-lg font-semibold">Ranking Cờ Tướng</h4>
                                    <div>
                                        <div className="flex bg-gray-200 p-2 mb-2 font-semibold">
                                            <div className="w-[10%] text-center">Thứ Hạng</div>
                                            <div className="w-[40%] text-center">Tên Người Chơi</div>
                                            <div className="w-[25%] text-center">Elo</div>
                                            <div className="w-[25%] text-center">Cấp Bậc</div>
                                        </div>
                                        {/* Sắp xếp danh sách người chơi theo Elo (điểm số) */}
                                        {chessPlayers
                                            .sort((a, b) => b.chessElo - a.chessElo) // Sắp xếp từ cao xuống
                                            .map((player, index) => (
                                                <div key={player.id} className="flex justify-between items-center bg-white p-2 mb-2 rounded-lg">
                                                    <div className="w-[10%] text-center">{index + 1}</div>
                                                    <div className="w-[40%] text-center">{player.username}</div>
                                                    <div className="w-[25%] text-center">{player.chessElo}</div>
                                                    <div className="w-[25%] text-center">{player.rankChess}</div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {activeRankingTab === 'chessUp' && (
                                <div className="chess-up-ranking">
                                    <h4 className="text-lg font-semibold">Ranking Cờ Úp</h4>
                                    <div>
                                        <div className="flex bg-gray-200 p-2 mb-2 font-semibold">
                                            <div className="w-[10%] text-center">Thứ Hạng</div>
                                            <div className="w-[40%] text-center">Tên Người Chơi</div>
                                            <div className="w-[25%] text-center">Elo</div>
                                            <div className="w-[25%] text-center">Cấp Bậc</div>
                                        </div>
                                        {/* Sắp xếp danh sách người chơi theo Elo của Cờ Úp (điểm số) */}
                                        {chessPlayers
                                            .filter(player => player.chessDownElo !== undefined) // Lọc những người chơi có Elo Cờ Úp
                                            .sort((a, b) => b.chessDownElo - a.chessDownElo) // Sắp xếp từ cao xuống
                                            .map((player, index) => (
                                                <div key={player.id} className="flex justify-between items-center bg-white p-2 mb-2 rounded-lg">
                                                    <div className="w-[10%] text-center">{index + 1}</div>
                                                    <div className="w-[40%] text-center">{player.username}</div>
                                                    <div className="w-[25%] text-center">{player.chessDownElo}</div>
                                                    <div className="w-[25%] text-center">{player.rankChessDown}</div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>

                <ToastContainer position="top-center" hideProgressBar={true} closeOnClick pauseOnHover draggable autoClose={1000} />
            </div>

            {/* Button quay lại */}
            <button
                onClick={() => navigate("/")}
                className="absolute bottom-5 left-5 px-6 py-3 bg-red-500 rounded-full text-lg font-semibold hover:bg-red-700 transition"
            >
                ⬅ Quay lại
            </button>
        </div>
    );
};

export default GameManagement;
