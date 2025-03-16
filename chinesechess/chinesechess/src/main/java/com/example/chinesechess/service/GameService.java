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

    // Create a new game
//    public Game createGame(String playerRed, String playerBlack) {
//        Game newGame = new Game(playerRed, playerBlack, List.of(), "ongoing", "white");
//        return gameRepository.save(newGame);
//    }

    public Game createGame(Game game) {
        return gameRepository.save(game);
    }

    // Get a game by ID
    public Optional<Game> getGameById(String gameId) {
        return gameRepository.findById(gameId);
    }

    // Get all games for a specific player
    public List<Game> getGamesByPlayer(String player) {
        List<Game> redGames = gameRepository.findByPlayerRed(player);
        List<Game> blackGames = gameRepository.findByPlayerBlack(player);
        redGames.addAll(blackGames);
        return redGames;
    }

    public Game processMove(String gameId, MoveDTO move) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        game.getMoves().add(move); // Lưu nước đi vào lịch sử

        return gameRepository.save(game);
    }

    // Update a game's moves and status
    public Game updateGame(String gameId, List<MoveDTO> moves, String currentTurn, String gameStatus, String createdAt, String gameMode) {
        Optional<Game> gameOptional = gameRepository.findById(gameId);
        if (gameOptional.isPresent()) {
            Game game = gameOptional.get();
            game.setMoves(moves);
            game.setCurrentTurn(currentTurn);
            game.setGameStatus(gameStatus);
            game.setCreatedAt(createdAt);
            game.setGameMode(gameMode);
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
