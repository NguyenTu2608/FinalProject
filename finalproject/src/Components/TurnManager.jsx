class TurnManager {
    // Kiểm tra xem người chơi hiện tại có được phép đánh không
    isPlayerTurn(piece, currentTurn) {
      const isRedPiece = piece === piece.toLowerCase(); // Quân đỏ là chữ thường
      return (isRedPiece && currentTurn === "red") || (!isRedPiece && currentTurn === "black");
    }
  
    // Chuyển lượt chơi
    switchTurn(currentTurn) {
      return currentTurn === "red" ? "black" : "red";
    }
  }
  
  export default TurnManager;