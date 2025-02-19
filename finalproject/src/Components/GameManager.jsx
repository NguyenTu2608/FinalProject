class GameManager {
  constructor(board) {
    this.board = board; // Nhận bàn cờ từ `Chessboard`
  }

  // Lấy danh sách các nước đi hợp lệ
  getValidMoves(piece, row, col) {
    const moves = [];
    const isRed = piece === piece.toLowerCase();

    console.log('pice-move', piece)
    switch (piece.toLowerCase().trim()) {
      case "p": // Tốt (Pawn)
        if (isRed) {
          // Quân đỏ (p) đi lên
          if (row > 0) moves.push([row + 1, col]); // Đi lên
          if (row >= 5) { // Đã qua sông có thể đi ngang
            if (col > 0) moves.push([row, col - 1]); // Sang trái
            if (col < 8) moves.push([row, col + 1]); // Sang phải
          }
        } else {
          // Quân đen (P) đi xuống
          if (row < 9) moves.push([row - 1, col]); // Đi xuống
          if (row <= 4) { // Đã qua sông có thể đi ngang
            if (col > 0) moves.push([row, col - 1]); // Sang trái
            if (col < 8) moves.push([row, col + 1]); // Sang phải
          }
        }
        break;

      case "r": // Xe (Rook)
        this.addLinearMoves(moves, row, col, 1, 0); // Đi xuống
        this.addLinearMoves(moves, row, col, -1, 0); // Đi lên
        this.addLinearMoves(moves, row, col, 0, 1); // Đi phải
        this.addLinearMoves(moves, row, col, 0, -1); // Đi trái
        break;

      // Thêm các quân cờ khác tại đây
      case "c": // Pháo (Cannon)
        this.addCannonMoves(moves, row, col);
        break;

      case "n": // Mã (Knight)
        this.addKnightMoves(moves, row, col, isRed);
        break;

      case "b": // Tượng (Bishop)
        this.addBishopMoves(moves, row, col, isRed);
        break;

      case "a": // Sĩ (Advisor)
      console.log('Quan Si -row:', row)
      console.log('Quan Si -col:', col)

        this.addAdvisorMoves(moves, row, col, isRed);
        break;

      case "k": // Tướng (King)
        this.addKingMoves(moves, row, col, isRed);
        break;
      default:
        break;
    }
    return moves;
  }
  canMove(row, col, isRed) {
    if (row < 0 || row >= 10 || col < 0 || col >= 9) return false; // Kiểm tra giới hạn bàn cờ
    const targetPiece = this.board[row][col];
    if (targetPiece === "") return true; // Ô trống, có thể đi
    const isTargetRed = targetPiece.toUpperCase() !== targetPiece; // Quân đỏ là chữ thường
    return isRed !== isTargetRed; // Chỉ có thể đi nếu là quân địch
  }

  addLinearMoves(moves, row, col, rowStep, colStep) {
    let r = row + rowStep;
    let c = col + colStep;
    const currentPiece = this.board[row][col];
    const isRed = currentPiece === currentPiece.toUpperCase(); // Quân đỏ là chữ in hoa

    while (r >= 0 && r < 10 && c >= 0 && c < 9) {
      const targetPiece = this.board[r][c];

      if (targetPiece === "") {
        moves.push([r, c]); // Ô trống -> có thể đi tiếp
      } else {
        const isEnemy = (targetPiece === targetPiece.toUpperCase()) !== isRed; // Kiểm tra quân địch
        if (isEnemy) moves.push([r, c]); // Nếu là quân địch -> có thể ăn
        break; // Gặp quân cản thì dừng lại
      }

      r += rowStep;
      c += colStep;
    }
  }
  addCannonMoves(moves, row, col) {
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    directions.forEach(([rowStep, colStep]) => {
      let r = row + rowStep;
      let c = col + colStep;
      let jumped = false;

      while (r >= 0 && r < 10 && c >= 0 && c < 9) {
        const targetPiece = this.board[r][c];

        if (targetPiece === "") {
          if (!jumped) moves.push([r, c]);
        } else {
          if (!jumped) {
            jumped = true;
          } else {
            const isEnemy = (targetPiece === targetPiece.toUpperCase()) !== (this.board[row][col] === this.board[row][col].toUpperCase());
            if (isEnemy) moves.push([r, c]);
            break;
          }
        }

        r += rowStep;
        c += colStep;
      }
    });
  }

  // Di chuyển Mã (Knight)
  addKnightMoves(moves, row, col, isRed) {
    const knightMoves = [[-2, -1], [-2, 1], [2, -1], [2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2]];
    knightMoves.forEach(([dr, dc]) => {
      const r = row + dr;
      const c = col + dc;
      if (this.canMove(r, c, isRed)) { // Truyền tham số isRed
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
    this.checkFaceToFaceKing(moves, row, col, isRed);
  }
  
  // Hàm kiểm tra đối mặt trực tiếp với Tướng đối phương
  checkFaceToFaceKing(moves, row, col, isRed) {
    console.log('chekc')
    const kingRow = isRed ? 7 : 2; // Hàng của Tướng đối phương
    let hasObstacle = false;
  
    // Duyệt từ hàng hiện tại đến hàng của Tướng đối phương
    for (let r = row + 1; r <= kingRow; r++) {
      if (this.board[r][col] !== "") {
        if (this.board[r][col].toLowerCase() === "k") {
          // Nếu gặp Tướng đối phương mà không có quân chặn
          if (!hasObstacle) {
            // Loại bỏ nước đi thẳng lên hoặc xuống (tùy thuộc vào luật chơi)
            moves = moves.filter(([moveRow, moveCol]) => moveCol !== col);
          }
          break;
        } else {
          hasObstacle = true; // Có quân chặn
        }
      }
    }
  }

  // Cập nhật bàn cờ khi quân cờ di chuyển
  movePiece(fromRow, fromCol, toRow, toCol) {
    const newBoard = this.board.map(row => [...row]);
    const movingPiece = newBoard[fromRow][fromCol];
    const targetPiece = newBoard[toRow][toCol];

    if (targetPiece !== "" && this.canMove(toRow, toCol, movingPiece === movingPiece.toUpperCase())) {
      console.log(`${movingPiece} đã ăn ${targetPiece}!`);
    }

    newBoard[toRow][toCol] = movingPiece;
    newBoard[fromRow][fromCol] = "";
    this.board = newBoard;
    return newBoard;
  }
}

export default GameManager;
