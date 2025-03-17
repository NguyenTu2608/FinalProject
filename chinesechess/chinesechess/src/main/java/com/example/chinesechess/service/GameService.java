package com.example.chinesechess.service;

import com.example.chinesechess.model.Game;
import com.example.chinesechess.DTO.MoveDTO;
import com.example.chinesechess.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

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


    // Get all games for a specific player
    public List<Game> getGamesByPlayer(String player) {
        List<Game> redGames = gameRepository.findByPlayerRed(player);
        List<Game> blackGames = gameRepository.findByPlayerBlack(player);
        redGames.addAll(blackGames);
        return redGames;
    }

    public Game joinGame(String gameId, String username) {
        Game game = gameRepository.findById(gameId)
                .orElseGet(() -> {
                    Game newGame = new Game();
                    newGame.setId(gameId);
                    return newGame;
                });

        if (game.getPlayerBlack() == null) {
            game.setPlayerBlack(username);
        } else if (game.getPlayerRed() == null) {
            game.setPlayerRed(username);
        } else {
            throw new RuntimeException("Game is already full!");
        }

        return gameRepository.save(game);
    }


    // 📌 Xử lý nước đi của người chơi
    public Game processMove(String gameId, MoveDTO move) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // 📌 Kiểm tra người chơi có hợp lệ không
        if (!move.getPlayer().equals(game.getPlayerBlack()) && !move.getPlayer().equals(game.getPlayerRed())) {
            throw new RuntimeException("Invalid player");
        }

        // 📌 Kiểm tra lượt chơi
        if (!move.getPlayer().equals(game.getCurrentTurn())) {
            throw new RuntimeException("Not your turn");
        }
        // 📌 Lưu nước đi vào lịch sử
        game.getMoves().add(move);

        // 📌 Chuyển lượt sau khi đi
        game.setCurrentTurn(game.getCurrentTurn().equals("black") ? "red" : "black");

        return gameRepository.save(game);
    }

    // Update a game's moves and status
    public Game updateGame(Game game) {
        if (gameRepository.existsById(game.getId())) {
            return gameRepository.save(game);
        } else {
            throw new RuntimeException("Game not found");
        }
    }


    // Delete a game
    public void deleteGame(String gameId) {
        gameRepository.deleteById(gameId);
    }
}
