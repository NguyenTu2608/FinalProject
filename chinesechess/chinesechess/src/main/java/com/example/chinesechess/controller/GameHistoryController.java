package com.example.chinesechess.controller;

import com.example.chinesechess.model.MatchHistory;
import com.example.chinesechess.repository.GameRepository;
import com.example.chinesechess.repository.MatchHistoryRepository;
import com.example.chinesechess.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/match_history")
public class GameHistoryController {
    @Autowired
    private GameService gameService;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private MatchHistoryRepository matchHistoryRepository; // Inject repository


    @GetMapping
    public List<MatchHistory> getAllMatchHistory()
    {
        return gameService.getAllMatchHistory();
    }
    @GetMapping("/by-username")
    public List<MatchHistory> getMatchHistoryByUsername(@RequestParam("username") String username) {
        return matchHistoryRepository.findByPlayerBlackOrPlayerRed(username, username);
    }

    @DeleteMapping("/{matchId}")
    public void deleteMatchHistory(@PathVariable String matchId) {
        gameService.deleteMatchHistory(matchId);
    }

}
