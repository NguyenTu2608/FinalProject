package com.example.chinesechess.service;

import com.example.chinesechess.DTO.MoveDTO;
import com.example.chinesechess.model.Game;
import com.example.chinesechess.model.MatchHistory;
import com.example.chinesechess.repository.GameRepository;
import com.example.chinesechess.repository.MatchHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private MatchHistoryRepository matchHistoryRepository; // Inject repository

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public Game createGame(Game game) {
        return gameRepository.save(game);
    }

    public Optional<Game> findByRoomName(String name) {
        return gameRepository.findByName(name);
    }

    // Get a game by ID
    public Optional<Game> getGameById(String gameId) {
        System.out.println("🔍 Tìm game với ID: " + gameId);

        Optional<Game> game = gameRepository.findById(gameId);

        if (game.isEmpty()) {
            System.out.println("❌ Không tìm thấy game với ID: " + gameId);
        } else {
            System.out.println("✅ Tìm thấy game: " + game.get());
        }

        return game;
    }

    public Optional<Game> findRandomAvailableRoom() {
        List<Game> availableRooms = gameRepository.findByPlayerBlackIsNullOrPlayerRedIsNull();

        if (availableRooms.isEmpty()) {
            return Optional.empty(); // Không có phòng trống
        }

        // Chọn phòng ngẫu nhiên từ danh sách phòng trống
        Game randomRoom = availableRooms.get(new Random().nextInt(availableRooms.size()));
        return Optional.of(randomRoom);
    }


    // Get all games for a specific player
    public List<Game> getGamesByPlayer(String player) {
        List<Game> redGames = gameRepository.findByPlayerRed(player);
        List<Game> blackGames = gameRepository.findByPlayerBlack(player);
        redGames.addAll(blackGames);
        return redGames;
    }

    public void setWinner(String gameId, String winner) {
        Optional<Game> gameOpt = gameRepository.findById(gameId);
        if (gameOpt.isPresent()) {
            Game game = gameOpt.get();
            game.setWinner(winner);
            game.setGameStatus("finished"); // Cập nhật trạng thái game
            gameRepository.save(game);
            System.out.println("✅ Đã lưu người thắng vào DB: " + winner);
        } else {
            System.err.println("❌ Không tìm thấy game với ID: " + gameId);
        }
    }

    // Update a game's moves and status
    public void updateGame(Game game) {
        if (gameRepository.existsById(game.getId())) {
            gameRepository.save(game);
        } else {
            throw new RuntimeException("Game not found");
        }
    }

    // Phương thức lưu trận đấu vào cơ sở dữ liệu
    public void saveMatchHistory(String gameId, String playerRed, String playerBlack, String winner, List<MoveDTO> moves, String gameMode) {
        // Tạo đối tượng MatchHistory
        MatchHistory matchHistory = new MatchHistory();
        matchHistory.setGameId(gameId);
        matchHistory.setPlayerRed(playerRed);
        matchHistory.setPlayerBlack(playerBlack);
        matchHistory.setWinner(winner);
        matchHistory.setMoves(moves);
        matchHistory.setGameMode(gameMode);

        // Lưu đối tượng MatchHistory vào MongoDB
        matchHistoryRepository.save(matchHistory);
        System.out.println("✅ Trận đấu đã được lưu vào lịch sử!");
    }

    // Delete a game
    public void deleteGame(String gameId) {
        gameRepository.deleteById(gameId);
    }


}
