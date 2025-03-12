package com.example.chinesechess.repository;

import com.example.chinesechess.model.Game;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GameRepository extends MongoRepository<Game, String> {
    List<Game> findByPlayerRed(String playerRed);
    List<Game> findByPlayerBlack(String playerBlack);
}
