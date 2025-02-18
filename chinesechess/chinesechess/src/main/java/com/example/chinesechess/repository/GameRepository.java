package com.example.chinesechess.repository;

import com.example.chinesechess.model.Game;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GameRepository extends MongoRepository<Game, String> {
    List<Game> findByPlayerWhite(String playerWhite);
    List<Game> findByPlayerBlack(String playerBlack);
}
