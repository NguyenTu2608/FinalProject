package com.example.chinesechess.service;

import com.example.chinesechess.model.Game;
import com.example.chinesechess.model.Move;
import com.example.chinesechess.model.User;
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
    public Game createGame(String playerWhite, String playerBlack) {
        Game newGame = new Game(playerWhite, playerBlack, List.of(), "ongoing", "white");
        return gameRepository.save(newGame);
    }

    // Get a game by ID
    public Optional<Game> getGameById(String gameId) {
        return gameRepository.findById(gameId);
    }

    // Get all games for a specific player
    public List<Game> getGamesByPlayer(String player) {
        List<Game> whiteGames = gameRepository.findByPlayerWhite(player);
        List<Game> blackGames = gameRepository.findByPlayerBlack(player);
        whiteGames.addAll(blackGames);
        return whiteGames;
    }

    // Update a game's moves and status
    public Game updateGame(String gameId, List<Move> moves, String currentTurn, String gameStatus, String createdAt) {
        Optional<Game> gameOptional = gameRepository.findById(gameId);
        if (gameOptional.isPresent()) {
            Game game = gameOptional.get();
            game.setMoves(moves);
            game.setCurrentTurn(currentTurn);
            game.setGameStatus(gameStatus);
            game.setCreatedAt(createdAt);
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
