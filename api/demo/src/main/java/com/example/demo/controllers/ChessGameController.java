package com.example.demo.controllers;

import com.example.demo.models.ChessGame;
import com.example.demo.repositories.ChessGameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/games")
public class ChessGameController {

    @Autowired
    private ChessGameRepository repository;

    // Lấy tất cả ván đấu
    @GetMapping
    public List<ChessGame> getAllGames() {
        return repository.findAll();
    }

    // Thêm một ván đấu mới
    @PostMapping
    public ChessGame createGame(@RequestBody ChessGame game) {
        return repository.save(game);
    }

    // Lấy thông tin một ván đấu theo ID
    @GetMapping("/{id}")
    public ChessGame getGameById(@PathVariable String id) {
        return repository.findById(id).orElse(null);
    }

    // Xóa ván đấu
    @DeleteMapping("/{id}")
    public void deleteGame(@PathVariable String id) {
        repository.deleteById(id);
    }
}
