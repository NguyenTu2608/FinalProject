import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Room = () => {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message.trim() !== "") {
      setChatMessages([...chatMessages, message]);
      setMessage("");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-900 text-white">
      {/* Nút quay lại */}
      <button 
        onClick={() => navigate(-1)} 
        className="absolute bottom-4 left-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-700"
      >
        Quay lại
      </button>
      
      {/* Bàn cờ và người chơi */}
      <div className="flex items-center gap-10">
        {/* Người chơi 1 */}
        <div className="flex flex-col items-center absolute left-10 top-1/2 transform -translate-y-1/2">
          <img src="/Assets/player1.png" alt="Player 1" className="w-20 h-20 rounded-full" />
          <p className="text-xl font-bold mt-2">Người chơi 1</p>
          <div className="grid grid-cols-4 gap-2 bg-gray-800 p-3 rounded-lg mt-2 w-32">
            {/* Hiển thị quân cờ đã ăn của người chơi 1 */}
          </div>
        </div>
        
        {/* Bàn cờ */}
        <div className="flex justify-center items-center">
          <img src="/Assets/chessboard.png" alt="Bàn cờ" className="w-[500px] h-[500px]" />
        </div>

        {/* Người chơi 2 */}
        <div className="flex flex-col items-center absolute right-10 top-1/2 transform -translate-y-1/2">
          <img src="/Assets/player2.png" alt="Player 2" className="w-20 h-20 rounded-full" />
          <p className="text-xl font-bold mt-2">Người chơi 2</p>
          <div className="grid grid-cols-4 gap-2 bg-gray-800 p-3 rounded-lg mt-2 w-32">
            {/* Hiển thị quân cờ đã ăn của người chơi 2 */}
          </div>
        </div>
      </div>
      
      {/* Khung chat */}
      <div className="absolute bottom-4 right-4 w-80 h-64 bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="h-48 overflow-y-auto border-b border-gray-600 pb-2">
          {chatMessages.map((msg, index) => (
            <p key={index} className="text-white bg-gray-700 p-2 my-1 rounded-md">
              {msg}
            </p>
          ))}
        </div>
        <div className="flex mt-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 rounded-l-md bg-gray-700 text-white outline-none"
            placeholder="Nhập tin nhắn..."
          />
          <button
            onClick={sendMessage}
            className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-700"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
