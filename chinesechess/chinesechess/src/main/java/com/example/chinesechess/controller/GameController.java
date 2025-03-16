package com.example.chinesechess.controller;

import com.example.chinesechess.DTO.GameRequest;
import com.example.chinesechess.model.Game;
import com.example.chinesechess.DTO.MoveDTO;
import com.example.chinesechess.repository.GameRepository;
import com.example.chinesechess.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/games")
public class GameController {

    @Autowired
    private GameService gameService;

    @Autowired
    private GameRepository gameRepository;

    @GetMapping
    public List<Game> getAllUsers() {
        return gameService.getAllGames();
    }

    // Create a new game
//    @PostMapping("/create")
//    public Game createGame(@RequestBody Game game) {
//        return gameService.createGame(game.getPlayerRed(), game.getPlayerBlack());
//    }

    @PostMapping("/create")
    public ResponseEntity<Game> createGame(@RequestBody GameRequest request) {
        if (request.getGameMode() == null || request.getGameMode().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        Game game = new Game();
        game.setPlayerBlack(request.getPlayerBlack());

        if ("practice".equals(request.getGameMode())) {
            game.setPlayerRed(request.getPlayerRed());
        }

        // 🌍 Nếu là phòng online, chưa có người chơi thứ hai
        else if ("online".equals(request.getGameMode())) {
            game.setPlayerRed(null);
        } else {
            return ResponseEntity.badRequest().body(null);
        }

        game.setMoves(new ArrayList<>());
        game.setCreatedAt(Instant.now().toString());
        game.setGameMode(request.getGameMode());

        Game savedGame = gameService.createGame(game);
        return ResponseEntity.ok(savedGame);
    }

    @PostMapping("/{gameId}/moves")
    public ResponseEntity<Game> saveMove(@PathVariable String gameId, @RequestBody MoveDTO move) {
        Optional<Game> optionalGame = gameRepository.findById(gameId);
        if (!optionalGame.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Game game = optionalGame.get();

        // Kiểm tra lượt chơi hợp lệ

        // Lưu nước đi vào danh sách
        game.getMoves().add(move);

        // Chuyển lượt chơi

        gameRepository.save(game);
        return ResponseEntity.ok(game);
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
            @RequestBody List<MoveDTO> moves,
            @RequestParam String currentTurn,
            @RequestParam String gameStatus,
            @RequestParam String createdAt,
            @RequestParam String gameMode) {
        return gameService.updateGame(gameId, moves, currentTurn, gameStatus, createdAt, gameMode);
    }

    // Delete a game
    @DeleteMapping("/{gameId}")
    public void deleteGame(@PathVariable String gameId) {
        gameService.deleteGame(gameId);
    }

}
