import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import GameManager from "./GameManager";

const pieceImages = {
    r: "/Assets/red-rook.png",
    n: "/Assets/red-knight.png",
    b: "/Assets/red-bishop.png",
    a: "/Assets/red-advisor.png",
    k: "/Assets/red-king.png",
    c: "/Assets/red-cannon.png",
    p: "/Assets/red-pawn.png",
    R: "/Assets/black-rook.png",
    N: "/Assets/black-knight.png",
    B: "/Assets/black-bishop.png",
    A: "/Assets/black-advisor.png",
    K: "/Assets/black-king.png",
    C: "/Assets/black-cannon.png",
    P: "/Assets/black-pawn.png",
};

const initialBoard = [
    ["r", "n", "b", "a", "k", "a", "b", "n", "r"],
    ["", "", "", "", "", "", "", "", ""],
    ["", "c", "", "", "", "", "", "c", ""],
    ["p", "", "p", "", "p", "", "p", "", "p"],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["P", "", "P", "", "P", "", "P", "", "P"],
    ["", "C", "", "", "", "", "", "C", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["R", "N", "B", "A", "K", "A", "B", "N", "R"],
];

const ChessboardAI = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    const mode = queryParams.get("mode") || "easy";
    const playerColor = queryParams.get("color") || "black";
    const aiColor = playerColor === "black" ? "red" : "black";

    const [board, setBoard] = useState(initialBoard);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentTurn, setCurrentTurn] = useState("black"); // Đen đi trước

    const gameManager = new GameManager(board);


    const aiHasMoved = useRef(false);

    useEffect(() => {
        // Khi trang tải, thay đổi lịch sử trình duyệt để ngăn người dùng quay lại trang trước
        window.history.pushState(null, document.title, window.location.href);

        // Lắng nghe sự kiện khi người dùng nhấn nút "quay lại" (back)
        window.onpopstate = function (event) {
            // Chuyển hướng lại trang hiện tại nếu người dùng nhấn nút back
            window.history.go(1);  // Điều hướng người dùng tới trang hiện tại
        };

        // Dọn dẹp khi component bị unmount
        return () => {
            window.onpopstate = null;
        };
    }, []);

    useEffect(() => {
        if (gameOver) return;

        if (currentTurn === aiColor && !aiHasMoved.current) {
            aiHasMoved.current = true; // chặn AI đi nhiều lần
            setTimeout(() => {
                handleAIMove();
            }, 300); // delay nhẹ cho mượt mà (nếu cần)
        } else {
            aiHasMoved.current = false; // reset lại khi đến lượt người chơi
        }
    }, [currentTurn, gameOver]);

    let aiDifficulty = mode;

    const handleAIMove = () => {
        switch (aiDifficulty) {
            case "easy":
                handleAIMoveEasy();
                break;
            case "medium":
                handleAIMoveMedium();
                break;
            case "hard":
                handleAIMoveHard();
                break;
            default:
                handleAIMoveEasy();
        }
    };


    // Xử lý nước đi của AI mode Easy (chọn ngẫu nhiên từ danh sách nước hợp lệ)
    const handleAIMoveEasy = () => {
        if (gameOver || currentTurn !== aiColor) return;

        let possibleMoves = [];
        let captureMoves = []; // Lưu các nước có thể ăn quân
        let centerMoves = [];  // Lưu các nước giúp AI kiểm soát bàn cờ
        let escapeMoves = []; // Nước đi giúp AI thoát khỏi chiếu
        let checkmateMoves = []; // Lưu các nước đi có thể chiếu bí
        // Kiểm tra nếu người chơi chỉ còn Tướng
        const isPlayerOnlyKing = (playerColor === "red" && board.flat().filter(piece => piece === "k").length === 1) ||
            (playerColor === "black" && board.flat().filter(piece => piece === "K").length === 1);
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = board[row][col];
                if (piece && ((aiColor === "black" && piece === piece.toUpperCase()) ||
                    (aiColor === "red" && piece === piece.toLowerCase()))) {
                    const moves = gameManager.getValidMoves(piece, row, col);
                    moves.forEach(([toRow, toCol]) => {
                        const targetPiece = board[toRow][toCol];

                        // Kiểm tra xem nước đi có gây ra chiếu tướng cho AI không
                        if (!gameManager.isMoveCausingCheck(row, col, toRow, toCol, aiColor === "red")) {
                            // Kiểm tra nếu nước đi này có thể tạo ra chiếu bí
                            const isCheckmate = gameManager.isCheckmate(aiColor === "red");
                            // Kiểm tra chiếu bí: Nếu nước đi này có thể chiếu bí đối phương
                            if (isCheckmate) {
                                // Nếu có thể chiếu bí, lưu nước đi này
                                checkmateMoves.push({ fromRow: row, fromCol: col, toRow, toCol });
                            } else {
                                // Nếu nước đi không gây chiếu tướng cho AI, chia các nước đi theo mục đích
                                if ((toRow >= 3 && toRow <= 6) && (toCol >= 3 && toCol <= 5)) {
                                    centerMoves.push({ fromRow: row, fromCol: col, toRow, toCol });
                                }
                                else if (targetPiece && targetPiece !== "") {
                                    captureMoves.push({ fromRow: row, fromCol: col, toRow, toCol });
                                } else {
                                    possibleMoves.push({ fromRow: row, fromCol: col, toRow, toCol });
                                }
                            }
                        }
                    });
                }
            }
        }
        // 🔥 Nếu AI đang bị chiếu, chỉ chọn nước giúp thoát chiếu
        if (gameManager.isKingInCheck(aiColor === "red")) {
            setErrorMessage("⚠ AI đang bị chiếu!");
            setTimeout(() => setErrorMessage(""), 2000);

            escapeMoves = possibleMoves.filter(move =>
                !gameManager.isMoveCausingCheck(move.fromRow, move.fromCol, move.toRow, move.toCol, aiColor === "red")
            );

            if (escapeMoves.length > 0) {
                possibleMoves = escapeMoves;
            }
        }
        let chosenMove = null;
        // Nếu người chơi chỉ còn Tướng, kiểm tra nếu AI có thể chiếu bí ngay
        if (isPlayerOnlyKing) {
            // Kiểm tra xem Tướng của người chơi có bị chiếu tướng không
            const opponentKingPosition = gameManager.isKingInCheck(playerColor === "red");
            // Nếu Tướng của người chơi không thể di chuyển vào ô an toàn, là chiếu bí
            const playerKingMoves = gameManager.getValidMoves("k", opponentKingPosition.row, opponentKingPosition.col); // Tìm các nước đi của Tướng người chơi
            const isPlayerCheckmated = playerKingMoves.every(([r, c]) =>
                gameManager.isMoveCausingCheck(opponentKingPosition.row, opponentKingPosition.col, r, c, playerColor === "red")
            );

            if (isPlayerCheckmated) {
                console.log("🤖 AI xác nhận chiếu bí!");
                checkmateMoves = possibleMoves; // Đặt tất cả các nước đi vào checkmateMoves để chọn
            }
        }
        // Ưu tiên chọn chiếu bí trước nếu có
        if (checkmateMoves.length > 0) {
            chosenMove = checkmateMoves[Math.floor(Math.random() * checkmateMoves.length)];
            console.log("🤖 AI chọn nước đi CHIẾU BÍ:", chosenMove);
        } else if (captureMoves.length > 0) {
            chosenMove = captureMoves[Math.floor(Math.random() * captureMoves.length)];
            console.log("🤖 AI chọn nước đi ĂN QUÂN:", chosenMove);
        } else if (centerMoves.length > 0) {
            chosenMove = centerMoves[Math.floor(Math.random() * centerMoves.length)];
            console.log("🤖 AI chọn nước đi KIỂM SOÁT BÀN CỜ:", chosenMove);
        } else if (possibleMoves.length > 0) {
            chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            console.log("🤖 AI chọn nước đi THÔNG THƯỜNG:", chosenMove);
        }

        if (chosenMove) {
            const newBoard = gameManager.movePiece(chosenMove.fromRow, chosenMove.fromCol, chosenMove.toRow, chosenMove.toCol);
            if (!newBoard) {
                console.error("❌ Lỗi: movePiece trả về undefined!");
                return;
            }
            setBoard(newBoard);
            setCurrentTurn(playerColor); // Chuyển lượt về người chơi

            // 🔥 Kiểm tra ngay sau nước đi của AI
            setTimeout(() => {
                if (gameManager.isKingInCheck(playerColor === "red")) {
                    setErrorMessage("⚠ Cảnh báo: Bạn đang bị chiếu!");
                }
                if (gameManager.isCheckmate(playerColor === "red")) {
                    setErrorMessage("❌ Bạn đã bị chiếu bí! Trò chơi kết thúc.");
                    setWinner(aiColor); // AI thắng
                    setGameOver(true); // Kết thúc game
                }
            }, 2000); // Đợi 0.2s để UI cập nhật trước
            // Xóa thông báo sau vài giây
            setTimeout(() => setErrorMessage(""), 5000);
        }
    };

    //xu ly AI che do kho
    const handleAIMoveMedium = () => {
        if (gameOver || currentTurn !== aiColor) return;

        console.log("🤖 AI (Medium) đang tính toán nước đi...");

        let possibleMoves = [];
        let captureMoves = [];
        let centerMoves = [];

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = board[row][col];
                if (piece && ((aiColor === "black" && piece === piece.toUpperCase()) ||
                    (aiColor === "red" && piece === piece.toLowerCase()))) {
                    const moves = gameManager.getValidMoves(piece, row, col);
                    moves.forEach(([toRow, toCol]) => {
                        const targetPiece = board[toRow][toCol];

                        // Nếu có thể ăn quân, ưu tiên nước này
                        if (targetPiece && targetPiece !== "") {
                            captureMoves.push({ fromRow: row, fromCol: col, toRow, toCol });
                        }
                        // Nếu di chuyển về giữa bàn cờ (chiến thuật cơ bản)
                        else if ((toRow >= 3 && toRow <= 6) && (toCol >= 3 && toCol <= 5)) {
                            centerMoves.push({ fromRow: row, fromCol: col, toRow, toCol });
                        }
                        // Nếu không thì đưa vào danh sách nước đi thông thường
                        else {
                            possibleMoves.push({ fromRow: row, fromCol: col, toRow, toCol });
                        }
                    });
                }
            }
        }

        // Ưu tiên các nước đi ăn quân đối thủ, sau đó là kiểm soát trung tâm
        let chosenMove = null;
        if (captureMoves.length > 0) {
            chosenMove = captureMoves[Math.floor(Math.random() * captureMoves.length)];
        } else if (centerMoves.length > 0) {
            chosenMove = centerMoves[Math.floor(Math.random() * centerMoves.length)];
        } else if (possibleMoves.length > 0) {
            chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }

        if (chosenMove) {
            const newBoard = gameManager.movePiece(chosenMove.fromRow, chosenMove.fromCol, chosenMove.toRow, chosenMove.toCol);
            setBoard(newBoard);
            setCurrentTurn(playerColor); // Đến lượt người chơi
        }
    };

    const getAllValidMoves = () => {
        let moves = [];
        if (!Array.isArray(board) || board.length !== 10 || board[0].length !== 9) {
            console.error("❌ LỖI: Board không phải là mảng 10x9 hợp lệ!", board);
            return [];
        }
        // Duyệt qua từng quân cờ trên bàn cờ
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = board[row][col];
                if (!piece) continue; // Ô trống thì bỏ qua
                // Kiểm tra xem quân cờ này có phải của AI hay không
                if ((aiColor === "black" && piece === piece.toUpperCase()) ||
                    (aiColor === "red" && piece === piece.toLowerCase())) {

                    // Lấy các nước đi hợp lệ của quân cờ
                    const validMoves = gameManager.getValidMoves(piece, row, col);
                    if (!validMoves || !Array.isArray(validMoves) || validMoves.length === 0) {
                        continue;
                    }
                    // Kiểm tra từng nước đi, nếu nước đi gây check thì loại bỏ
                    validMoves.forEach(([toRow, toCol]) => {
                        const isCausingCheck = gameManager.isMoveCausingCheck(row, col, toRow, toCol, aiColor === "red");
                        if (!isCausingCheck) {
                            // Tạo bản sao của bàn cờ và thực hiện nước đi
                            let newBoard = JSON.parse(JSON.stringify(board));
                            gameManager.movePiece(newBoard, row, col, toRow, toCol);

                            // Cách đánh giá để ưu tiên quân tốt, xe, pháo theo cách mà AI nên di chuyển
                            let priority = piecePriority(piece, newBoard, aiColor);
                            if (priority > 0) {
                                moves.push({ fromRow: row, fromCol: col, toRow, toCol, priority });
                            }
                        }
                    });
                }
            }
        }

        // Sắp xếp các nước đi dựa trên điểm số (chọn nước đi có điểm cao nhất)
        moves.sort((a, b) => b.score - a.score);

        // Trả về các nước đi hợp lệ, đã được sắp xếp theo điểm số
        return moves.map(move => ({ fromRow: move.fromRow, fromCol: move.fromCol, toRow: move.toRow, toCol: move.toCol }));
    };


    // Hàm tiêu chí ưu tiên cho từng quân cờ
    const piecePriority = (piece, board, aiColor) => {
        // Đánh giá điểm dựa trên quân cờ 
        switch (piece.toLowerCase()) {
            case 'p': // Tốt
                return 1;   // Ưu tiên thấp
            case 'c': // Pháo
                return 5;   // Ưu tiên cao hơn
            case 'n': // Mã
                return 4;   // Ưu tiên
            case 'b': // Tượng
                return 4;   // Ưu tiên
            case 'a': // Sĩ
                return 3;   // Ưu tiên
            case 'r': // Xe
                return 6;   // Ưu tiên cao hơn
            case 'k': // Tướng
                return 10;  // Ưu tiên rất cao
            default:
                return 0; // Quân không xác định thì không có ưu tiên
        }
    };

    // Đánh giá vị trí của quân cờ
    const positionBonus = (piece, row, col, aiColor) => {
        let bonus = 0;
        // Thưởng cho quân cờ ở trung tâm (tăng điểm cho quân ở gần vị trí trung tâm)
        if (piece === 'p' || piece === 'P') {
            bonus += (aiColor === 'red' && row <= 4) ? 5 : 0;
            bonus += (aiColor === 'black' && row >= 5) ? 5 : 0;
        }
        if (piece === 'c' || piece === 'C') {
            bonus += (Math.abs(col - 4) <= 2) ? 5 : 0; // Pháo ở gần trung tâm
        }
        if (piece === 'r' || piece === 'R') {
            bonus += (Math.abs(row - 4) <= 2 && Math.abs(col - 4) <= 2) ? 10 : 0; // Xe gần trung tâm
        }
        if (piece === 'k' || piece === 'K') {
            bonus += (Math.abs(row - 4) <= 2 && Math.abs(col - 4) <= 2) ? 10 : 0; // Giảm điểm thưởng cho Tướng ở trung tâm
        }
        // Bonus cho việc bảo vệ Tướng (dựa trên vị trí Xe gần Tướng)
        if (piece === 'r' || piece === 'R') {
            bonus += (Math.abs(row - 9) <= 2 && aiColor === 'red') || (Math.abs(row - 0) <= 2 && aiColor === 'black') ? 15 : 0;
        }
        // Thưởng cho quân cờ bảo vệ Tướng
        if ((piece === 'k' || piece === 'K') && aiColor === 'red') {
            // Tướng đỏ bảo vệ quanh các quân như Mã, Sĩ
            bonus += (row === 0 || row === 1) ? 10 : 0;
        }
        if ((piece === 'k' || piece === 'K') && aiColor === 'black') {
            // Tướng đen bảo vệ quanh các quân như Mã, Sĩ
            bonus += (row === 9 || row === 8) ? 10 : 0;
        }

        return bonus;
    };



    // Cập nhật lại hàm `evaluateBoard` với vị trí quân cờ
    const evaluateBoard = (board, aiColor) => {
        let score = 0;
        const pieceValues = {
            "p": 10, "P": 10, // Tốt
            "c": 30, "C": 30, // Pháo
            "n": 30, "N": 30, // Mã
            "b": 20, "B": 20, // Tượng
            "a": 20, "A": 20, // Sĩ
            "r": 100, "R": 100, // Xe
            "k": 500, "K": 500 // Tướng (giảm điểm)
        };

        // Duyệt tất cả các quân cờ trên bàn
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = board[row][col];
                if (piece) {
                    let value = pieceValues[piece.toLowerCase()] || 0;

                    // Thêm điểm cho vị trí của quân cờ
                    value += positionBonus(piece, row, col, aiColor);

                    // Nếu quân cờ thuộc về AI, cộng điểm; ngược lại, trừ điểm
                    if ((aiColor === "black" && piece === piece.toUpperCase()) ||
                        (aiColor === "red" && piece === piece.toLowerCase())) {
                        score += value;
                    } else {
                        score -= value;
                    }
                }
            }
        }

        return score;
    };



    const minimax = (boardState, depth, isMaximizing, aiColor, alpha, beta) => {
        // Nếu đạt độ sâu tìm kiếm tối đa hoặc trò chơi kết thúc (checkmate hoặc stalemate)
        if (depth === 0 || gameManager.isCheckmate(aiColor) || gameManager.isStalemate(aiColor)) {
            return evaluateBoard(boardState, aiColor); // Trả về giá trị đánh giá của bàn cờ
        }
        // Lấy tất cả các nước đi hợp lệ của người chơi (hoặc AI, hoặc đối thủ)
        const moves = getAllValidMoves(boardState, isMaximizing ? aiColor : (aiColor === "red" ? "black" : "red"));
        console.log(moves);
        // Nếu không có nước đi hợp lệ, trò chơi kết thúc (ví dụ, đối thủ hết nước đi hoặc thua)
        if (moves.length === 0) {
            console.warn("⚠ Không có nước đi hợp lệ!");
            return isMaximizing ? -9999 : 9999;
        }
        let bestScore;
        // Nếu là lượt của AI (tối đa hóa điểm số)
        if (isMaximizing) {
            bestScore = -Infinity;
            for (const move of moves) {
                let newBoard = JSON.parse(JSON.stringify(boardState)); // Sao chép trạng thái bàn cờ
                gameManager.movePiece(newBoard, move.fromRow, move.fromCol, move.toRow, move.toCol); // Thực hiện nước đi
                let score = minimax(newBoard, depth - 1, false, aiColor, alpha, beta); // Đệ quy tìm nước đi tiếp theo
                bestScore = Math.max(bestScore, score); // Chọn nước đi tốt nhất
                alpha = Math.max(alpha, score); // Cập nhật alpha
                // Cắt tỉa nhánh không cần thiết nếu không cần tính tiếp
                if (beta <= alpha) break;
            }
        } else {
            // Nếu là lượt của đối thủ (tối thiểu hóa điểm số)
            bestScore = Infinity;
            for (const move of moves) {
                let newBoard = JSON.parse(JSON.stringify(boardState)); // Sao chép trạng thái bàn cờ
                gameManager.movePiece(newBoard, move.fromRow, move.fromCol, move.toRow, move.toCol); // Thực hiện nước đi
                let score = minimax(newBoard, depth - 1, true, aiColor, alpha, beta); // Đệ quy tìm nước đi tiếp theo
                bestScore = Math.min(bestScore, score); // Chọn nước đi tốt nhất cho đối thủ
                beta = Math.min(beta, score); // Cập nhật beta

                // Cắt tỉa nhánh không cần thiết nếu không cần tính tiếp
                if (beta <= alpha) break;
            }
        }
        return bestScore;
    };
    // xu li AI che do sieu kho
    const handleAIMoveHard = () => {
        // Nếu trò chơi đã kết thúc hoặc không phải lượt của AI, thoát ra
        if (gameOver || currentTurn !== aiColor) return;
        let bestMove = null;
        let bestScore = -Infinity;
        // Lấy tất cả các nước đi hợp lệ của AI
        const moves = getAllValidMoves(board, aiColor);
        // Nếu không có nước đi hợp lệ, thoát ra
        if (moves.length === 0) {
            console.warn(`⚠ AI (${aiColor}) không có nước đi nào!`);
            return;
        }
        // Duyệt qua tất cả các nước đi để tìm nước đi tốt nhất
        for (const move of moves) {
            let newBoard = JSON.parse(JSON.stringify(board)); // Sao chép bàn cờ
            gameManager.movePiece(newBoard, move.fromRow, move.fromCol, move.toRow, move.toCol); // Thực hiện nước đi
            // Đánh giá nước đi này bằng thuật toán minimax
            let score = minimax(newBoard, 6, false, aiColor, -Infinity, Infinity);
            // Lựa chọn nước đi có điểm cao nhất
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        if (bestMove) {
            console.log("🤖 AI chọn nước đi:", bestMove);

            // Di chuyển quân cờ theo nước đi tốt nhất

            const newBoard = gameManager.movePiece(bestMove.fromRow, bestMove.fromCol, bestMove.toRow, bestMove.toCol);
            setBoard(newBoard); // Cập nhật trạng thái bàn cờ sau khi AI di chuyển

            // Kiểm tra nếu đối thủ bị chiếu bí
            if (gameManager.isCheckmate(aiColor === "red")) {
                setErrorMessage("❌ Bạn đã bị chiếu bí! Trò chơi kết thúc.");
                setWinner(aiColor);
                setGameOver(true);
                return;
            }
            // Kiểm tra nếu AI tạo ra tình huống "check" cho đối thủ
            if (gameManager.isKingInCheck(aiColor === "red")) {
                console.log("⚠ AI đã tạo ra tình huống Check!");
            }

            // Chuyển lượt cho người chơi
            setCurrentTurn(playerColor);
        }
    };




    // Xử lý khi người chơi chọn quân cờ hoặc di chuyển
    const handleClick = (row, col) => {
        if (gameOver) return;

        if (currentTurn !== playerColor) return;
        const isPlayerInCheck = gameManager.isKingInCheck(playerColor === "red");
        const piece = board[row][col];

        // 2️⃣ Nếu chọn quân cờ hợp lệ (cùng màu với người chơi)
        if (piece && ((playerColor === "black" && piece === piece.toUpperCase()) ||
            (playerColor === "red" && piece === piece.toLowerCase()))) {
            console.log("✅ Quân cờ hợp lệ:", piece);
            setSelectedPiece({ row, col });
            const validMoves = gameManager.getValidMoves(piece, row, col);
            setValidMoves(validMoves);
            console.log("📌 Nước đi hợp lệ:", validMoves);
            return;
        }

        // 3️⃣ Nếu đã chọn quân cờ và bấm vào vị trí hợp lệ
        if (selectedPiece) {
            const { row: fromRow, col: fromCol } = selectedPiece;

            // Kiểm tra nước đi có hợp lệ không
            const isValidMove = validMoves.some(([r, c]) => r === row && c === col);
            if (validMoves) {
                if (gameManager.isMoveCausingCheck(selectedPiece.row, selectedPiece.col, row, col, currentTurn === "red")) {
                    setErrorMessage("Không thể đi nước đi này hãy kiểm tra lại tướng của bạn !");
                    return; // Không thực hiện nước đi
                }
            }
            // Nếu đang bị chiếu, lọc ra các nước đi hợp lệ giúp thoát chiếu
            if (isPlayerInCheck) {
                if (validMoves.length === 0) {
                    alert("❌ Bạn đang bị chiếu bí! Trò chơi kết thúc.");
                    return;
                }
            }
            console.log("📌 Move valid?", isValidMove);

            if (isValidMove) {
                // Thực hiện di chuyển
                const newBoard = gameManager.movePiece(fromRow, fromCol, row, col);
                if (!newBoard) {
                    console.error("❌ Lỗi: movePiece trả về undefined!");
                    return;
                }
                setBoard(newBoard);
                setSelectedPiece(null);
                setValidMoves([]);

                // 🔥 Kiểm tra nếu AI bị chiếu tướng
                if (gameManager.isKingInCheck(aiColor === "red")) {
                    setErrorMessage("⚠ AI đang bị chiếu!");
                    setTimeout(() => setErrorMessage(""), 2000);
                }

                // 🔥 Kiểm tra nếu AI bị chiếu bí (tức là AI không có nước đi nào hợp lệ)
                if (gameManager.isCheckmate(aiColor === "red")) {
                    setErrorMessage("🎉 Chúc mừng bạn chiến thắng ! AI bị chiếu bí !");
                    setWinner(playerColor); // player thắng
                    setGameOver(true); // Kết thúc game
                    return;
                }

                setCurrentTurn(aiColor); // Đến lượt AI
                setErrorMessage("");

                setTimeout(() => handleAIMove(), 5000); // AI đi sau 0.5s
            } else {
                setErrorMessage("Nước đi không hợp lệ!");
                setTimeout(() => setErrorMessage(""), 1500);
            }
        }
    };

    const resetGame = () => {
        setBoard(initialBoard);  // Reset lại bàn cờ
        setCurrentTurn("black");   // Mặc định quân đỏ đi trước
        setSelectedPiece(null);
        setValidMoves([]);
        setErrorMessage("");
        setWinner(null);
        setGameOver(false);      // Đặt lại trạng thái game
    };



    const boardSize = 500;
    const cellSize = boardSize / 9;

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-center text-[#003366] mb-2">
                Chế độ: {mode.toUpperCase()}
            </h1>
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
                Bạn chơi: {playerColor === "black" ? "♟️ Đen (Đi trước)" : "♟️ Đỏ"}
            </h2>

            <div className="relative w-[500px] h-[550px]">
                <img src="/Assets/chessboard.png" alt="Chessboard" className="w-full h-full" />
                {board.map((row, rowIndex) =>
                    row.map((piece, colIndex) =>
                        piece ? (
                            <img
                                key={`${rowIndex}-${colIndex}`}
                                src={pieceImages[piece]}
                                alt={piece}
                                className="absolute w-[45px] h-[45px] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                style={{
                                    left: `${colIndex * cellSize + cellSize / 2}px`,
                                    top: `${rowIndex * cellSize + cellSize / 2}px`,
                                }}
                                onClick={() => handleClick(rowIndex, colIndex)}
                            />
                        ) : null
                    )
                )}

                {validMoves.map(([row, col]) => (
                    <div
                        key={`${row}-${col}`}
                        className="absolute w-[45px] h-[45px] bg-green-500 opacity-50 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{
                            left: `${col * cellSize + cellSize / 2}px`,
                            top: `${row * cellSize + cellSize / 2}px`,
                        }}
                        onClick={() => handleClick(row, col)}
                    />
                ))}
                {/* Hiển thị thông báo lỗi */}
                {errorMessage && (
                    <div
                        className="absolute left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded"
                        style={{
                            top: "100%", // Đưa thông báo xuống dưới bàn cờ
                            marginTop: "10px", // Tạo khoảng cách giữa bàn cờ và thông báo
                        }}
                    >
                        {errorMessage}
                    </div>
                )}
                {gameOver && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                        <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-80">
                            <h2 className={`text-2xl font-bold ${winner === playerColor ? "text-green-600" : "text-red-600"}`}>
                                {winner === playerColor ? "🎉 Bạn thắng!" : "😔 Bạn thua!"}
                            </h2>
                            <p className="text-gray-700 mt-2">Trận đấu đã kết thúc.</p>
                            <button
                                onClick={resetGame}
                                className="mt-4 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-200"
                            >
                                🔄 Chơi lại
                            </button>

                        </div>
                    </div>
                )}
            </div>
            <button
                onClick={() => navigate("/Training/ChooseAI")} // Quay lại trang trước
                className="absolute bottom-5 left-5 px-6 py-3 bg-red-500 rounded-full text-lg font-semibold hover:bg-red-700 transition"
            >
                ⬅ Quay lại
            </button>
        </div>

    );
};

export default ChessboardAI;


