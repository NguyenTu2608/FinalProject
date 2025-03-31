package com.example.chinesechess.service;

import com.example.chinesechess.model.Game;
import com.example.chinesechess.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }


    public Game createGame(Game game) {
        return gameRepository.save(game);
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

    // Delete a game
    public void deleteGame(String gameId) {
        gameRepository.deleteById(gameId);
    }


}
