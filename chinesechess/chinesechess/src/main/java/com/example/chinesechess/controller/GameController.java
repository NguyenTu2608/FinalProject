package com.example.chinesechess.controller;

import com.example.chinesechess.model.Game;
import com.example.chinesechess.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/games")
public class GameController {

    @Autowired
    private GameService gameService;

    // Create a new game
    @PostMapping("/create")
    public Game createGame(@RequestParam String playerWhite, @RequestParam String playerBlack) {
        return gameService.createGame(playerWhite, playerBlack);
    }

    // Get a game by ID
    @GetMapping("/{gameId}")
    public Optional<Game> getGameById(@PathVariable String gameId) {
        return gameService.getGameById(gameId);
    }

    // Get all games for a specific player
    @GetMapping("/player/{player}")
    public List<Game> getGamesByPlayer(@PathVariable String player) {
        return gameService.getGamesByPlayer(player);
    }

    // Update a game's moves and status
    @PutMapping("/{gameId}/update")
    public Game updateGame(
            @PathVariable String gameId,
            @RequestBody List<String> moves,
            @RequestParam String currentTurn,
            @RequestParam String gameStatus) {
        return gameService.updateGame(gameId, moves, currentTurn, gameStatus);
    }

    // Delete a game
    @DeleteMapping("/{gameId}")
    public void deleteGame(@PathVariable String gameId) {
        gameService.deleteGame(gameId);
    }
}
