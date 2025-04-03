class GameManager {
  constructor(board) {
    this.board = board; // Nhận bàn cờ từ Chessboard
  }

  // Lấy danh sách các nước đi hợp lệ
  getValidMoves(piece, row, col) {
    if (!piece || typeof piece !== "string") {
        console.warn("⚠ Dữ liệu quân cờ không hợp lệ:", piece);
        return [];
    }


    const moves = [];
    const isRed = piece === piece.toLowerCase(); // Xác định quân đỏ hay đen


    switch (piece.toLowerCase()) {
        case "p": // 🛠 Tốt (Pawn)
            if (isRed) {
                if (row < 9 && this.canMove(row + 1, col, isRed)) moves.push([row + 1, col]); // Đi lên
                if (row >= 5) { // Qua sông có thể đi ngang
                    if (col > 0 && this.canMove(row, col - 1, isRed)) moves.push([row, col - 1]); // Trái
                    if (col < 8 && this.canMove(row, col + 1, isRed)) moves.push([row, col + 1]); // Phải
                }
            } else {
                if (row > 0 && this.canMove(row - 1, col, isRed)) moves.push([row - 1, col]); // Đi xuống
                if (row <= 4) { // Qua sông có thể đi ngang
                    if (col > 0 && this.canMove(row, col - 1, isRed)) moves.push([row, col - 1]); // Trái
                    if (col < 8 && this.canMove(row, col + 1, isRed)) moves.push([row, col + 1]); // Phải
                }
            }
            break;
        case "r": // 🏰 Xe (Rook)
            this.addLinearMoves(moves, row, col, [[1, 0], [-1, 0], [0, 1], [0, -1]]);
            break;
        case "c": // 🔥 Pháo (Cannon)
            this.addCannonMoves(moves, row, col);
            break;
        case "n": // 🐴 Mã (Knight)
            this.addKnightMoves(moves, row, col, isRed);
            break;
        case "b": // 🎭 Tượng (Bishop)
            this.addBishopMoves(moves, row, col, isRed);
            break;
        case "a": // 🏯 Sĩ (Advisor)
            this.addAdvisorMoves(moves, row, col, isRed);
            break;
        case "k": // 👑 Tướng (King)
            this.addKingMoves(moves, row, col, isRed);
            break;
        default:
            console.warn("⚠ Không xác định được quân cờ:", piece);
            break;             
    }

    return moves;
}

canMove(row, col, isRed) {
  if (row < 0 || row >= 10 || col < 0 || col >= 9) return false; // ✅ Kiểm tra giới hạn bàn cờ
  const targetPiece = this.board[row][col];

  if (!targetPiece || targetPiece === "") return true; // ✅ Nếu ô trống, có thể đi

  if (typeof targetPiece !== "string") {
      console.warn("⚠ targetPiece không hợp lệ tại", row, col, ":", targetPiece);
      return false;
  }

  const isTargetRed = targetPiece.toUpperCase() !== targetPiece; // ✅ Kiểm tra quân cờ có phải của Đỏ không
  return isRed !== isTargetRed; // ✅ Chỉ có thể đi nếu là quân địch
}

  addLinearMoves(moves, row, col, directions) {
    directions.forEach(([rowStep, colStep]) => {
        let r = row + rowStep;
        let c = col + colStep;

        while (r >= 0 && r < 10 && c >= 0 && c < 9) {
            const targetPiece = this.board[r][c];

            if (!targetPiece) { // ✅ Nếu ô trống, có thể đi tiếp
                moves.push([r, c]);
            } else {
                const currentPiece = this.board[row][col];

                // ✅ Kiểm tra nếu `currentPiece` hoặc `targetPiece` là null trước khi gọi `.toUpperCase()`
                if (currentPiece && targetPiece) {
                    const isEnemy = (targetPiece.toUpperCase() !== targetPiece) !== (currentPiece.toUpperCase() !== currentPiece);
                    if (isEnemy) moves.push([r, c]);
                }
                
                break; // Gặp quân cờ thì dừng lại
            }

            r += rowStep;
            c += colStep;
        }
    });
}
  addCannonMoves(moves, row, col) {
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // Các hướng di chuyển

    directions.forEach(([rowStep, colStep]) => {
        let r = row + rowStep;
        let c = col + colStep;
        let jumped = false; // Theo dõi xem đã nhảy qua quân cờ nào chưa

        while (r >= 0 && r < 10 && c >= 0 && c < 9) {
            const targetPiece = this.board[r][c];

            if (!targetPiece) {
                // Nếu ô trống và chưa nhảy qua quân cản, cho phép đi tiếp
                if (!jumped) moves.push([r, c]);
            } else {
                if (!jumped) {
                    // Nếu gặp quân cờ đầu tiên, đánh dấu đã nhảy
                    jumped = true;
                } else {
                    // Nếu đã nhảy qua 1 quân, kiểm tra xem có thể ăn không
                    const currentPiece = this.board[row][col];
                    const isEnemy = currentPiece && targetPiece &&
                                    (targetPiece.toUpperCase() !== targetPiece) !== (currentPiece.toUpperCase() !== currentPiece);
                    if (isEnemy) moves.push([r, c]);
                    break; // Dừng lại vì không thể đi tiếp sau khi ăn quân
                }
            }

            r += rowStep;
            c += colStep;
        }
    });
}



  addKnightMoves(moves, row, col, isRed) {
    const knightMoves = [
        [-2, -1], [-2, 1], [2, -1], [2, 1],
        [-1, -2], [-1, 2], [1, -2], [1, 2]
    ];

    knightMoves.forEach(([dr, dc]) => {
        const r = row + dr;
        const c = col + dc;

        // Kiểm tra nếu r, c nằm ngoài biên của bàn cờ (10x9)
        if (r < 0 || r >= 10 || c < 0 || c >= 9) return;

        // Kiểm tra quân cản (chỉ có thể đi khi không có quân cản)
        const midRow = row + Math.sign(dr);  // Ô giữa theo hướng dọc
        const midCol = col + Math.sign(dc);  // Ô giữa theo hướng ngang

        if ((Math.abs(dr) === 2 && this.board[midRow]?.[col] !== "") || 
            (Math.abs(dc) === 2 && this.board[row]?.[midCol] !== "")) {
            return; // Nếu có quân cản thì không thể đi
        }

        // Nếu không bị cản, kiểm tra xem có thể đi đến đó không
        if (this.canMove(r, c, isRed)) {
            moves.push([r, c]);
        }
    });
}



  // Di chuyển Tượng (Bishop)
  addBishopMoves(moves, row, col, isRed) {
    const bishopMoves = [
      [-2, -2], // Lên trái
      [-2, 2],  // Lên phải
      [2, -2],  // Xuống trái
      [2, 2]    // Xuống phải
    ];

    for (let i = 0; i < bishopMoves.length; i++) {
      const [dr, dc] = bishopMoves[i];
      const r = row + dr; // Hàng đích
      const c = col + dc; // Cột đích

      // Kiểm tra xem vị trí đích có nằm trong cung của bên mình không
      if (isRed) {
        // Quân đỏ: cung từ hàng 0 đến hàng 4
        if (r < 0 || r > 4 || c < 0 || c > 8) continue; // Bỏ qua nếu ngoài phạm vi
      } else {
        // Quân đen: cung từ hàng 5 đến hàng 9
        if (r < 5 || r > 9 || c < 0 || c > 8) continue; // Bỏ qua nếu ngoài phạm vi
      }

      // Kiểm tra "mắt Tượng": ô giữa đường đi phải trống
      const midRow = row + dr / 2;
      const midCol = col + dc / 2;
      if (this.board[midRow][midCol] !== "") continue; // Có quân chặn, không thể đi

      // Kiểm tra quân địch tại vị trí đích
      if (this.canMove(r, c, isRed)) {
        moves.push([r, c]);
      }
    }
  }

  // // Di chuyển Sĩ (Advisor)
  // addAdvisorMoves(moves, row, col, isRed) {
  //   // Phạm vi cung của mỗi bên
  //   const palaceRows = isRed ? [7, 9] : [0, 2]; // Quân đỏ ở hàng 7-9, quân đen ở hàng 0-2
  //   const palaceCols = [3, 5]; // Cung nằm giữa cột 3-5

  //   // Các hướng di chuyển chéo của Sĩ
  //   const advisorMoves = [
  //     [-1, -1], // Lên trái
  //     [-1, 1],  // Lên phải
  //     [1, -1],  // Xuống trái
  //     [1, 1]    // Xuống phải
  //   ];

  //   // Duyệt qua các hướng di chuyển
  //   advisorMoves.forEach(([dr, dc]) => {
  //     const r = row + dr; // Hàng đích
  //     const c = col + dc; // Cột đích

  //     // Kiểm tra xem vị trí đích có nằm trong cung không
  //     if (
  //       r >= palaceRows[0] && r <= palaceRows[1] && // Kiểm tra hàng
  //       c >= palaceCols[0] && c <= palaceCols[1]    // Kiểm tra cột
  //     ) {
  //       // Kiểm tra xem có thể di chuyển đến ô đích không
  //       if (this.canMove(r, c, isRed)) {
  //         moves.push([r, c]);
  //       }
  //     }
  //   });
  // }
  // Di chuyển Sĩ (Advisor) 
  addAdvisorMoves(moves, row, col, isRed) {
    // Phạm vi cung của mỗi bên
    const palaceRows = !isRed ? [7, 8, 9] : [0, 1, 2]; // Đỏ: hàng 7-9, Đen: hàng 0-2
    const palaceCols = [3, 4, 5]; // Cung nằm giữa cột 3-5

    // Các hướng di chuyển chéo của Sĩ
    const advisorMoves = [
      [-1, -1], // Lên trái
      [-1, 1],  // Lên phải
      [1, -1],  // Xuống trái
      [1, 1]    // Xuống phải
    ];

    // Duyệt qua các hướng di chuyển
    advisorMoves.forEach(([dr, dc]) => {
      const r = row + dr; // Hàng đích
      const c = col + dc; // Cột đích

      // Kiểm tra xem vị trí đích có nằm trong cung không
      if (palaceRows.includes(r) && palaceCols.includes(c)) {
        // Kiểm tra xem có thể di chuyển đến ô đích không
        if (this.board[r][c] === "" || this.isOpponentPiece(r, c, isRed)) {
          moves.push([r, c]);
        }
      }
    });
  }

  // Hàm kiểm tra quân đối phương
  isOpponentPiece(row, col, isRed) {
    const piece = this.board[row][col];
    if (!piece) return false; // Ô trống không phải quân đối phương
    const isPieceRed = piece === piece.toLowerCase(); // Quân đỏ là chữ thường
    return isPieceRed !== isRed; // Nếu khác màu => là quân đối phương
  }


  // Di chuyển Tướng (King)
  addKingMoves(moves, row, col, isRed) {
    // Phạm vi cung của mỗi bên
    const palaceRows = !isRed ? [7, 8, 9] : [0, 1, 2]; // Đỏ: hàng 7-9, Đen: hàng 0-2
    const palaceCols = [3, 4, 5]; // Cung nằm giữa cột 3-5

    // Các hướng di chuyển của Tướng (ngang và dọc)
    const kingMoves = [
      [-1, 0], // Lên
      [1, 0],  // Xuống
      [0, -1], // Sang trái
      [0, 1]   // Sang phải
    ];

    // Duyệt qua các hướng di chuyển
    kingMoves.forEach(([dr, dc]) => {
      const r = row + dr; // Hàng đích
      const c = col + dc; // Cột đích

      // Kiểm tra xem vị trí đích có nằm trong cung không
      if (palaceRows.includes(r) && palaceCols.includes(c)) {
        // Kiểm tra xem có thể di chuyển đến ô đích không
        if (this.board[r][c] === "" || this.isOpponentPiece(r, c, isRed)) {
          moves.push([r, c]);
        }
      }
    });

    // Kiểm tra đối mặt trực tiếp với Tướng đối phương (tùy chọn)
    // this.checkFaceToFaceKing(moves, row, col, isRed);
  }

  movePiece(fromRow, fromCol, toRow, toCol) {
    if (!this.board[fromRow] || !this.board[fromRow][fromCol]) {
        console.error("❌ Không thể di chuyển: vị trí không hợp lệ", fromRow, fromCol);
        return null; // Trả về null nếu không hợp lệ
    }

    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) {
        console.warn(`⚠ Không thể di chuyển: nước đi (${fromRow}, ${fromCol}) → (${toRow}, ${toCol}) không hợp lệ`);
        return null; // Trả về null nếu nước đi không hợp lệ
    }

    // Tạo bản sao bàn cờ mới (Không làm thay đổi this.board)
    const newBoard = this.board.map(row => [...row]);
    const movingPiece = newBoard[fromRow][fromCol];

    console.log(`🚀 Di chuyển quân ${movingPiece} từ (${fromRow}, ${fromCol}) đến (${toRow}, ${toCol})`);

    newBoard[toRow][toCol] = movingPiece;
    newBoard[fromRow][fromCol] = "";

    return newBoard; // Trả về bàn cờ mới thay vì thay đổi this.board
}



  // Kiểm tra xem Tướng của một bên có đang bị chiếu hay không
  isKingInCheck(isRed) {
    const kingSymbol = isRed ? "k" : "K"; // Ký hiệu của Tướng
    let kingPosition = null;

    // Tìm vị trí của Tướng
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.board[row][col] === kingSymbol) {
          kingPosition = { row, col };
          break;
        }
      }
      if (kingPosition) break;
    }

    if (!kingPosition) return false; // Không tìm thấy Tướng (trường hợp không xảy ra)

    // Kiểm tra xem có quân cờ nào của đối phương có thể ăn Tướng không
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 9; col++) {
        const piece = this.board[row][col];
        if (piece && (piece === piece.toLowerCase()) !== isRed) {
          // Nếu là quân của đối phương
          const validMoves = this.getValidMoves(piece, row, col);
          if (validMoves.some(([r, c]) => r === kingPosition.row && c === kingPosition.col)) {
            return true; // Tướng bị chiếu
          }
        }
      }
    }

    return false; // Tướng không bị chiếu
    
  }
  simulateMove(fromRow, fromCol, toRow, toCol) {
    const newBoard = this.board.map(row => [...row]); // Tạo bản sao của bàn cờ
    const movingPiece = newBoard[fromRow][fromCol];
    newBoard[toRow][toCol] = movingPiece; // Di chuyển quân cờ
    newBoard[fromRow][fromCol] = ""; // Xóa quân cờ ở vị trí cũ
    return newBoard;
  }
  
  isMoveCausingCheck(fromRow, fromCol, toRow, toCol, isRed) {
    const simulatedBoard = this.simulateMove(fromRow, fromCol, toRow, toCol);
    const tempGameManager = new GameManager(simulatedBoard);

    return tempGameManager.isKingInCheck(isRed) ||
      tempGameManager.areKingsFacing(simulatedBoard);
  }
  
  isCheckmate(isRed) {
    if (!this.isKingInCheck(isRed)) return false; // Nếu không bị chiếu thì không phải chiếu bí

    // Duyệt qua tất cả các quân cờ của bên isRed
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 9; col++) {
        const piece = this.board[row][col];
        // Kiểm tra nếu quân này thuộc bên isRed (đối với quân đỏ, piece là chữ thường)
        if (piece && ((piece === piece.toLowerCase()) === isRed)) {
          // Lấy danh sách các nước đi hợp lệ của quân đó
          const validMoves = this.getValidMoves(piece, row, col);
          for (const [r, c] of validMoves) {
            // Giả lập nước đi này mà không làm thay đổi bàn cờ gốc
            const simulatedBoard = this.simulateMove(row, col, r, c);
            const tempGameManager = new GameManager(simulatedBoard);
            // Nếu sau khi thực hiện nước đi, Tướng không còn bị chiếu, tức là có thể thoát chiếu
            if (!tempGameManager.isKingInCheck(isRed)) {
              return false;
            }
          }
        }
      }
    }
    // Nếu không có nước đi nào cứu được Tướng, trả về true (chiếu bí)
    return true;
  }
  /**
   * Kiểm tra nước đi có làm hở mặt tướng hay không
   * @param {number} fromRow - Hàng xuất phát
   * @param {number} fromCol - Cột xuất phát
   * @param {number} toRow - Hàng đích
   * @param {number} toCol - Cột đích
   * @param {boolean} isRed - Quân đỏ hay đen
   * @returns {boolean} - true nếu nước đi làm hở mặt tướng
   */
  isMoveExposingKing(fromRow, fromCol, toRow, toCol, isRed) {
    const simulatedBoard = this.simulateMove(fromRow, fromCol, toRow, toCol);
    return this.areKingsFacing(simulatedBoard);
  }
  /**
    * Kiểm tra xem hai tướng có đang đối mặt trực tiếp không
    * @param {Array} board - Bàn cờ để kiểm tra
    * @returns {boolean} - true nếu hai tướng đối mặt trực tiếp
    */
  areKingsFacing(board) {
    let redKingPos = null;
    let blackKingPos = null;

    // Tìm vị trí hai tướng
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 'k') {
          redKingPos = { row, col };
        } else if (board[row][col] === 'K') {
          blackKingPos = { row, col };
        }
      }
    }
    // Nếu không tìm thấy một trong hai tướng
    if (!redKingPos || !blackKingPos) return false;

    // Hai tướng phải cùng cột
    if (redKingPos.col !== blackKingPos.col) return false;

    // Kiểm tra có quân cờ nào ở giữa không
    const minRow = Math.min(redKingPos.row, blackKingPos.row);
    const maxRow = Math.max(redKingPos.row, blackKingPos.row);

    for (let row = minRow + 1; row < maxRow; row++) {
      if (board[row][redKingPos.col] !== '') {
        return false; // Có quân cờ chặn giữa
      }
    }

    return true; // Hai tướng đối mặt trực tiếp
  }
  // Cập nhật phương thức kiểm tra nước đi hợp lệ
  isValidMove(piece, fromRow, fromCol, toRow, toCol, isRed) {
    // ... kiểm tra các điều kiện di chuyển cơ bản ...

    // Giả lập nước đi và kiểm tra
    const simulatedBoard = this.simulateMove(fromRow, fromCol, toRow, toCol);

    // Không được để hai tướng đối mặt
    if (this.areKingsFacing(simulatedBoard)) {
      return false;
    }

    // ... các kiểm tra khác ...
    return true;
  }

  // Cập nhật phương thức isMoveCausingCheck để kiểm tra cả hở mặt tướng


}




export default GameManager;

