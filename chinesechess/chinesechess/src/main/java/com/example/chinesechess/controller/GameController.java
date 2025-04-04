package com.example.chinesechess.controller;

import com.example.chinesechess.DTO.GameRequest;
import com.example.chinesechess.DTO.MoveDTO;
import com.example.chinesechess.model.Game;
import com.example.chinesechess.repository.GameRepository;
import com.example.chinesechess.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

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
            String name = request.getName();
            if (name != null && !name.isEmpty()) {
                game.setName(name);
            } else {
                return ResponseEntity.badRequest().body(null);  // Trả về lỗi nếu không có tên phòng
            }
            game.setPlayerRed(null);
            game.setGameStatus("waiting");

        } else {
            return ResponseEntity.badRequest().body(null);
        }

        game.setMoves(new ArrayList<>());
        game.setCreatedAt(Instant.now().toString());
        game.setGameMode(request.getGameMode());
        game.setCurrentTurn("black");

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

    @GetMapping("/find-by-room-name")
    public ResponseEntity<Game> findGameByRoomName(@RequestParam String name) {
        Optional<Game> gameOpt = gameService.findByRoomName(name);
        return gameOpt.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }



    @GetMapping("/find-random-room")
    public ResponseEntity<Game> findRandomRoom() {
        Optional<Game> availableRoom = gameService.findRandomAvailableRoom();
        if (availableRoom.isPresent()) {
            return ResponseEntity.ok(availableRoom.get());
        }
        // Nếu không có phòng trống, tạo phòng mới
        Game newGame = new Game();
        newGame.setPlayerBlack(null); // Phòng mới chưa có người chơi
        newGame.setPlayerRed(null);
        newGame.setMoves(new ArrayList<>());
        newGame.setCreatedAt(Instant.now().toString());
        newGame.setGameMode("online");
        newGame.setCurrentTurn("black");

        Game savedGame = gameService.createGame(newGame);
        return ResponseEntity.ok(savedGame); // ✅ Trả về phòng mới được tạo
    }

    // Get all games for a specific player
    @GetMapping("/player/{player}")
    public List<Game> getGamesByPlayer(@PathVariable String player) {
        return gameService.getGamesByPlayer(player);
    }

    // Update a game's moves and status
    @PutMapping("/{gameId}/update")
    public Game updateGame(Game game) {
        if (gameRepository.existsById(game.getId())) {
            return gameRepository.save(game);
        } else {
            throw new RuntimeException("Game not found");
        }
    }

    // Delete a game
    @DeleteMapping("/{gameId}")
    public void deleteGame(@PathVariable String gameId) {
        gameService.deleteGame(gameId);
    }

}
