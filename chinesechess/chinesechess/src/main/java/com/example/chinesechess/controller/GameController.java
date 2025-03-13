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
        Game game = new Game();
        game.setPlayerRed(request.getPlayerRed());
        game.setPlayerBlack(request.getPlayerBlack());
        game.setMoves(new ArrayList<>());
        game.setGameStatus("ongoing");
        game.setCurrentTurn("red");
        game.setCreatedAt(Instant.now().toString());

        Game savedGame = gameService.createGame(game);
        return ResponseEntity.ok(savedGame);
    }

    @PostMapping("/{gameId}/move")
    public ResponseEntity<Game> makeMove(@PathVariable String gameId, @RequestBody MoveDTO moveDTO) {
        Optional<Game> optionalGame = gameRepository.findById(gameId);
        if (optionalGame.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Game game = optionalGame.get();

        // Thêm nước đi vào danh sách moves
        if (game.getMoves() == null) {
            game.setMoves(new ArrayList<>()); // Nếu chưa có danh sách thì khởi tạo
        }
        game.getMoves().add(moveDTO);

        // Chuyển lượt chơi
        game.setCurrentTurn(game.getCurrentTurn().equals("red") ? "black" : "red");

        gameRepository.save(game); // Lưu vào MongoDB

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
            @RequestParam String createdAt) {
        return gameService.updateGame(gameId, moves, currentTurn, gameStatus, createdAt);
    }

    // Delete a game
    @DeleteMapping("/{gameId}")
    public void deleteGame(@PathVariable String gameId) {
        gameService.deleteGame(gameId);
    }
}
