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
    const [moveHistory, setMoveHistory] = useState([]);
    const transpositionTable = new Map();


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
        if (captureMoves.length > 0) {
            chosenMove = captureMoves[Math.floor(Math.random() * captureMoves.length)];
            console.log("🤖 AI chọn nước đi ĂN QUÂN:", chosenMove);
        } else if (checkmateMoves.length > 0) {
            chosenMove = checkmateMoves[Math.floor(Math.random() * checkmateMoves.length)];
            console.log("🤖 AI chọn nước đi CHIẾU BÍ:", chosenMove);
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
            setErrorMessage("Đến lượt bạn");

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



    function isSquareThreatened(row, col, color, boardSnapshot) {
        // Lặp toàn bộ quân địch để xem có nước nào ăn được ô (row, col) không
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 9; c++) {
                const piece = boardSnapshot[r][c];
                if (piece && ((color === "black" && piece === piece.toLowerCase()) ||
                    (color === "red" && piece === piece.toUpperCase()))) {
                    const enemyMoves = gameManager.getValidMoves(piece, r, c, boardSnapshot);
                    if (enemyMoves.some(([tr, tc]) => tr === row && tc === col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //xu ly AI che do kho
    const handleAIMoveMedium = () => {
        if (gameOver || currentTurn !== aiColor) return;

        const opponentColor = aiColor === "red" ? "black" : "red";
        const opponentKingPos = gameManager.findKingPosition(opponentColor);
        const allMoves = [];
        const lastMove = moveHistory[moveHistory.length - 1];

        // Ghi nhận quân đã di chuyển gần đây
        const usedPieces = moveHistory
            .filter(move => move.player === aiColor)
            .map(move => `${move.from.row},${move.from.col}`);

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = board[row][col];
                if (
                    piece &&
                    ((aiColor === "black" && piece === piece.toUpperCase()) ||
                        (aiColor === "red" && piece === piece.toLowerCase()))
                ) {
                    const moves = gameManager.getValidMoves(piece, row, col);
                    moves.forEach(([toRow, toCol]) => {
                        if (gameManager.isMoveCausingCheck(row, col, toRow, toCol, aiColor === "red")) return;

                        if (
                            lastMove &&
                            lastMove.from.row === row &&
                            lastMove.from.col === col &&
                            lastMove.to.row === toRow &&
                            lastMove.to.col === toCol
                        ) return;

                        const target = board[toRow][toCol];
                        const simulatedBoard = gameManager.simulateMoveBot(board, row, col, toRow, toCol);
                        const value = target ? pieceValue[target] || 0 : 0;

                        let score = 0;
                        score += value * 10;

                        // Ưu tiên vùng trung tâm
                        score += (toRow >= 3 && toRow <= 6 && toCol >= 3 && toCol <= 5) ? 3 : 0;

                        // Gần Tướng đối phương
                        const nearKing = opponentKingPos &&
                            Math.abs(toRow - opponentKingPos.row) <= 2 &&
                            Math.abs(toCol - opponentKingPos.col) <= 2;
                        score += nearKing ? 6 : 0;

                        // Chiếu tướng
                        if (gameManager.isKingInCheck(opponentColor === "red", simulatedBoard)) {
                            score += 12;
                        }

                        // Bao vây Tướng địch
                        let surroundBonus = 0;
                        if (opponentKingPos) {
                            const directions = [
                                [1, 0], [-1, 0], [0, 1], [0, -1],
                                [1, 1], [1, -1], [-1, 1], [-1, -1],
                            ];
                            directions.forEach(([dx, dy]) => {
                                const nx = opponentKingPos.row + dx;
                                const ny = opponentKingPos.col + dy;
                                if (
                                    nx >= 0 && nx < 10 && ny >= 0 && ny < 9 &&
                                    simulatedBoard[nx][ny] &&
                                    ((aiColor === "red" && simulatedBoard[nx][ny] === simulatedBoard[nx][ny].toLowerCase()) ||
                                        (aiColor === "black" && simulatedBoard[nx][ny] === simulatedBoard[nx][ny].toUpperCase()))
                                ) {
                                    surroundBonus += 2;
                                }
                            });
                            score += surroundBonus;
                        }

                        // Ưu tiên vị trí an toàn
                        if (!isSquareThreatened(toRow, toCol, aiColor, simulatedBoard)) {
                            score += 5;
                        }

                        // Khuyến khích đẩy tốt
                        if (piece.toLowerCase() === "p") {
                            score += aiColor === "red" ? toRow : (9 - toRow);
                        }

                        // Khuyến khích dùng quân chưa được sử dụng
                        const isUsed = usedPieces.includes(`${row},${col}`);
                        score += isUsed ? 0 : 4;

                        allMoves.push({ fromRow: row, fromCol: col, toRow, toCol, score });
                    });
                }
            }
        }

        if (allMoves.length === 0) return;

        allMoves.sort((a, b) => b.score - a.score);
        const chosenMove = allMoves[0];

        if (chosenMove) {
            const newBoard = gameManager.movePiece(
                chosenMove.fromRow,
                chosenMove.fromCol,
                chosenMove.toRow,
                chosenMove.toCol
            );
            setTimeout(() => {
                if (gameManager.isKingInCheck(playerColor === "red")) {
                    setErrorMessage("⚠ Cảnh báo: Bạn đang bị chiếu!");
                }
                if (gameManager.isCheckmate(playerColor === "red")) {
                    setErrorMessage("❌ Bạn đã bị chiếu bí! Trò chơi kết thúc.");
                    setWinner(aiColor);
                    setGameOver(true);
                }
            }, 200);
            setTimeout(() => setErrorMessage(""), 5000);
            setBoard(newBoard);

            setMoveHistory(prev => [
                ...prev,
                {
                    from: { row: chosenMove.fromRow, col: chosenMove.fromCol },
                    to: { row: chosenMove.toRow, col: chosenMove.toCol },
                    piece: board[chosenMove.fromRow][chosenMove.fromCol],
                    player: aiColor,
                },
            ]);
            setCurrentTurn(playerColor);


        }
    };

    const pieceValue = {
        K: 1000, k: 1000, // Tướng
        A: 20, a: 20,     // Sĩ
        B: 20, b: 20,     // Tượng
        N: 40, n: 40,     // Mã
        R: 90, r: 90,     // Xe
        C: 45, c: 45,     // Pháo
        P: 10, p: 10      // Tốt
    };
    function evaluateBoard(board, aiColor, gameManager) {
        let score = 0;
        const opponentColor = aiColor === "red" ? "black" : "red";

        const aiMoves = gameManager.getAllPossibleMoves(board, aiColor);
        const opponentMoves = gameManager.getAllPossibleMoves(board, opponentColor);
        const opponentKingPos = gameManager.findKingPosition(opponentColor, board);

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = board[row][col];
                if (!piece) continue;

                const isAI = (aiColor === "red" && piece === piece.toLowerCase()) ||
                    (aiColor === "black" && piece === piece.toUpperCase());
                const multiplier = isAI ? 1 : -1;
                let val = pieceValue[piece] || 0;

                // Tốt đã sang sông mạnh hơn
                if (piece.toLowerCase() === 'p') {
                    const pos = aiColor === "red" ? row : (9 - row);
                    if (pos >= 5) val += 6;
                    if (pos >= 7) val += 10;
                }

                // Ưu tiên kiểm soát trung tâm bàn cờ
                if ((row >= 3 && row <= 6) && (col >= 3 && col <= 5)) {
                    val += 1;
                }

                // Cộng điểm nếu quân được bảo vệ
                const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
                for (let [dx, dy] of dirs) {
                    const r = row + dx;
                    const c = col + dy;
                    if (r >= 0 && r < 10 && c >= 0 && c < 9) {
                        const nearby = board[r][c];
                        if (nearby && ((aiColor === "red" && nearby === nearby.toLowerCase()) || (aiColor === "black" && nearby === nearby.toUpperCase()))) {
                            val += 0.5; // được bảo vệ
                        }
                    }
                }

                score += val * multiplier;
            }
        }

        // Trừ điểm nếu AI đang bị chiếu
        if (gameManager.isInCheck(board, aiColor)) {
            score -= 30;
        }

        // Cộng điểm nếu đang chiếu đối thủ
        if (gameManager.isInCheck(board, opponentColor)) {
            score += 25;
        }

        // Tính áp lực xung quanh tướng địch
        if (opponentKingPos) {
            score += getSurroundingPressure(board, opponentKingPos, aiColor);
            score += countAttackersNearKing(board, opponentKingPos, aiColor, gameManager) * 4;

            const kingMoves = gameManager.getValidMoves("k", opponentKingPos.row, opponentKingPos.col, board);
            const safeKingMoves = kingMoves.filter(([r, c]) => {
                const sim = gameManager.simulateMoveBot(board, opponentKingPos.row, opponentKingPos.col, r, c);
                return !gameManager.isInCheck(sim, opponentColor);
            });

            if (safeKingMoves.length === 0) score += 20; // bị khóa tướng
        }

        // Ưu tiên kiểm soát bàn cờ (nhiều nước đi hơn)
        score += (aiMoves.length - opponentMoves.length) * 0.3;

        return score;
    }
    function scoreMove(move, board, aiColor, gameManager) {
        let score = 0;
        const target = board[move.toRow][move.toCol];
        const opponentColor = aiColor === "red" ? "black" : "red";

        // ⚔️ 1. Ăn quân địch giá trị cao
        if (target) {
            score += (pieceValue[target] || 0);
        }

        // 👑 2. Chiếu tướng
        const simulated = gameManager.simulateMoveBot(board, move.fromRow, move.fromCol, move.toRow, move.toCol);
        if (gameManager.isInCheck(simulated, opponentColor)) {
            score += 10;
        }

        // 🎯 3. Gần tướng địch = tạo áp lực
        const oppKing = gameManager.findKingPosition(opponentColor, board);
        if (oppKing) {
            const dist = Math.abs(move.toRow - oppKing.row) + Math.abs(move.toCol - oppKing.col);
            if (dist <= 2) {
                score += 4; // Gần tướng → áp lực
            }
        }

        // 🔁 4. Tiến sâu vào lãnh thổ đối phương
        if ((aiColor === "red" && move.toRow <= 4) || (aiColor === "black" && move.toRow >= 5)) {
            score += 2;
        }

        // 🧱 5. Được quân ta bảo vệ sau khi đi
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];
        for (let [dr, dc] of dirs) {
            const nr = move.toRow + dr;
            const nc = move.toCol + dc;
            if (nr >= 0 && nr < 10 && nc >= 0 && nc < 9) {
                const ally = board[nr][nc];
                if (ally && ((aiColor === "red" && ally === ally.toLowerCase()) || (aiColor === "black" && ally === ally.toUpperCase()))) {
                    score += 1; // Được yểm trợ
                }
            }
        }

        return score;
    }




    function quiescenceSearch(board, alpha, beta, aiColor, gameManager, depth = 1) {
        const standPat = evaluateBoard(board, aiColor, gameManager);
        if (depth <= 0) return standPat;

        if (standPat >= beta) return beta;
        if (standPat > alpha) alpha = standPat;

        let captureMoves = gameManager.getAllPossibleMoves(board, aiColor).filter(move =>
            board[move.toRow][move.toCol] // chỉ nước ăn
        );

        // ✅ Ưu tiên nước ăn quân mạnh trước (giúp Alpha-Beta cắt nhanh)
        captureMoves.sort((a, b) => {
            const valA = pieceValue[board[a.toRow][a.toCol]] || 0;
            const valB = pieceValue[board[b.toRow][b.toCol]] || 0;
            return valB - valA;
        });

        // ✅ Giới hạn số move ăn (tránh lan rộng)
        captureMoves = captureMoves.slice(0, 10);

        for (const move of captureMoves) {
            // 🔁 Tối ưu clone board: chỉ clone 2 dòng
            const simulated = board.slice();
            simulated[move.fromRow] = [...board[move.fromRow]];
            simulated[move.toRow] = [...board[move.toRow]];
            simulated[move.toRow][move.toCol] = board[move.fromRow][move.fromCol];
            simulated[move.fromRow][move.fromCol] = "";

            const score = -quiescenceSearch(
                simulated,
                -beta,
                -alpha,
                aiColor === "red" ? "black" : "red",
                gameManager,
                depth - 1
            );

            if (score >= beta) return beta;
            if (score > alpha) alpha = score;
        }

        return alpha;
    }




    function getSurroundingPressure(board, kingPos, aiColor) {
        let score = 0;
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
        for (let [dx, dy] of dirs) {
            const r = kingPos.row + dx;
            const c = kingPos.col + dy;
            if (r >= 0 && r < 10 && c >= 0 && c < 9) {
                const p = board[r][c];
                if (p && ((aiColor === "red" && p === p.toLowerCase()) || (aiColor === "black" && p === p.toUpperCase()))) {
                    score += 2;
                }
            }
        }
        return score;
    }


    function countAttackersNearKing(board, kingPos, aiColor, gameManager) {
        let count = 0;
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 9; c++) {
                const p = board[r][c];
                if (p && ((aiColor === "red" && p === p.toLowerCase()) || (aiColor === "black" && p === p.toUpperCase()))) {
                    const moves = gameManager.getValidMoves(p, r, c, board);
                    if (moves.some(([tr, tc]) => tr === kingPos.row && tc === kingPos.col)) count++;
                }
            }
        }
        return count;
    }
    const ZOBRIST_TABLE = Array.from({ length: 10 }, () =>
        Array.from({ length: 9 }, () =>
            Array.from({ length: 14 }, () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
        )
    );

    const pieceToIndex = {
        'k': 0, 'a': 1, 'b': 2, 'n': 3, 'r': 4, 'c': 5, 'p': 6,
        'K': 7, 'A': 8, 'B': 9, 'N': 10, 'R': 11, 'C': 12, 'P': 13,
    };

    function zobristHash(board) {
        let h = 0;
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = board[row][col];
                if (!piece) continue;
                const index = pieceToIndex[piece];
                h ^= ZOBRIST_TABLE[row][col][index];
            }
        }
        return h;
    }

    function minimax(board, depth, isMax, alpha, beta, aiColor, gameManager) {
        if (depth === 0 || gameManager.isGameOver(board)) {
            return quiescenceSearch(board, alpha, beta, aiColor, gameManager);
        }

        const currentTurn = isMax ? aiColor : (aiColor === "red" ? "black" : "red");

        // ✅ Null Move Pruning — chỉ áp dụng khi không bị chiếu
        if (
            !isMax &&
            depth >= 3 &&
            !gameManager.isInCheck(board, currentTurn)
        ) {
            const nullEval = -minimax(board, depth - 2, true, -beta, -beta + 1, aiColor, gameManager);
            if (nullEval >= beta) return beta;
        }

        const hashKey = zobristHash(board);
        const stored = transpositionTable.get(hashKey);

        // ✅ Transposition Table: dùng lại nếu depth ≥
        if (stored && stored.depth >= depth) {
            return stored.score;
        }

        let moves = gameManager.getAllPossibleMoves(board, currentTurn);

        // ✅ Không còn nước đi → chiếu bí hoặc hòa
        if (moves.length === 0) {
            return evaluateBoard(board, aiColor, gameManager);
        }

        // ✅ Move Ordering
        moves.sort(
            (a, b) =>
                scoreMove(b, board, currentTurn, gameManager) -
                scoreMove(a, board, currentTurn, gameManager)
        );

        // ✅ Cắt move ở depth lớn
        if (depth >= 3 && moves.length > 20) {
            moves = moves.slice(0, 20);
        }

        let bestEval = isMax ? -Infinity : Infinity;

        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];

            // 🔁 simulate move (đã tối ưu chỉ clone 2 hàng)
            const simulated = gameManager.simulateMoveBot(
                board,
                move.fromRow,
                move.fromCol,
                move.toRow,
                move.toCol
            );

            const evalScore = minimax(
                simulated,
                depth - 1,
                !isMax,
                alpha,
                beta,
                aiColor,
                gameManager
            );

            if (isMax) {
                bestEval = Math.max(bestEval, evalScore);
                alpha = Math.max(alpha, evalScore);
            } else {
                bestEval = Math.min(bestEval, evalScore);
                beta = Math.min(beta, evalScore);
            }

            if (beta <= alpha) {
                break; // ✂️ Alpha-Beta Pruning
            }
        }

        // ✅ Ghi nhớ trạng thái
        transpositionTable.set(hashKey, { score: bestEval, depth });

        return bestEval;
    }





    // Hàm chính gọi ở Chessboard
    const handleAIMoveHard = () => {
        if (gameOver || currentTurn !== aiColor) return;

        transpositionTable.clear(); // 🔁 Reset cache

        const TIME_LIMIT = 5000; // ⏱️ Giới hạn thời gian 4 giây
        const startTime = Date.now();

        let moves = gameManager.getAllPossibleMoves(board, aiColor);
        if (moves.length === 0) return;

        // 🧠 Move Ordering ban đầu
        moves.sort((a, b) =>
            scoreMove(b, board, aiColor, gameManager) - scoreMove(a, board, aiColor, gameManager)
        );

        let bestMove = null;
        let bestEval = -Infinity;
        let nodeCount = 0; // Ghi số node đã duyệt

        const maxDepth = 6;

        for (let depth = 1; depth <= maxDepth; depth++) {
            let currentBestMove = null;
            let currentBestEval = -Infinity;

            moves.sort((a, b) =>
                scoreMove(b, board, aiColor, gameManager) - scoreMove(a, board, aiColor, gameManager)
            );

            if (depth >= 3 && moves.length > 25) {
                moves = moves.slice(0, 25);
            }

            for (let i = 0; i < moves.length; i++) {
                if (depth >= 4 && i >= 15) break; // Giới hạn move sâu để không bị nghẽn

                const move = moves[i];
                const simulated = gameManager.simulateMoveBot(board, move.fromRow, move.fromCol, move.toRow, move.toCol);
                const evalScore = minimax(simulated, depth - 1, false, -Infinity, Infinity, aiColor, gameManager);

                nodeCount++;

                if (evalScore > currentBestEval) {
                    currentBestEval = evalScore;
                    currentBestMove = move;
                }

                if (Date.now() - startTime > TIME_LIMIT) break;

                const moveEnd = Date.now();
            }

            if (Date.now() - startTime <= TIME_LIMIT) {
                bestMove = currentBestMove;
                bestEval = currentBestEval;
                console.log(`🧠 Depth ${depth} => Move:`, currentBestMove, "| Eval:", currentBestEval);
            } else {
                console.log(`⏰ Hết thời gian ở depth ${depth}`);
                break;
            }
        }


        console.log(`✅ Tổng thời gian: ${Date.now() - startTime}ms | Node đã duyệt: ${nodeCount}`);

        if (bestMove) {
            const newBoard = gameManager.movePiece(bestMove.fromRow, bestMove.fromCol, bestMove.toRow, bestMove.toCol);

            setBoard(newBoard);
            setMoveHistory(prev => [
                ...prev,
                {
                    from: { row: bestMove.fromRow, col: bestMove.fromCol },
                    to: { row: bestMove.toRow, col: bestMove.toCol },
                    piece: board[bestMove.fromRow][bestMove.fromCol],
                    player: aiColor,
                },
            ]);
            setCurrentTurn(playerColor);
            setErrorMessage("Đến lượt bạn");

            // 🛡️ Kiểm tra sau nước đi
            setTimeout(() => {
                if (gameManager.isKingInCheck(playerColor === "red")) {
                    setErrorMessage("⚠ Cảnh báo: Bạn đang bị chiếu!");
                }
                if (gameManager.isCheckmate(playerColor === "red")) {
                    setErrorMessage("❌ Bạn đã bị chiếu bí! Trò chơi kết thúc.");
                    setWinner(aiColor);
                    setGameOver(true);
                }
            }, 300);
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
                    row.map((piece, colIndex) => {
                        // Đảo vị trí nếu người chơi là red
                        const displayRow = playerColor === "red" ? 9 - rowIndex : rowIndex;
                        const displayCol = playerColor === "red" ? 8 - colIndex : colIndex;

                        return piece ? (
                            <img
                                key={`${rowIndex}-${colIndex}`}
                                src={pieceImages[piece]}
                                alt={piece}
                                className="absolute w-[45px] h-[45px] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                style={{
                                    left: `${displayCol * cellSize + cellSize / 2}px`,
                                    top: `${displayRow * cellSize + cellSize / 2}px`,
                                }}
                                onClick={() => handleClick(rowIndex, colIndex)}
                            />
                        ) : null;
                    })
                )}

                {validMoves.map(([row, col]) => {
                    const displayRow = playerColor === "red" ? 9 - row : row;
                    const displayCol = playerColor === "red" ? 8 - col : col;

                    return (
                        <div
                            key={`${row}-${col}`}
                            className="absolute w-[45px] h-[45px] bg-green-500 opacity-50 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                            style={{
                                left: `${displayCol * cellSize + cellSize / 2}px`,
                                top: `${displayRow * cellSize + cellSize / 2}px`,
                            }}
                            onClick={() => handleClick(row, col)}
                        />
                    );
                })}
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


