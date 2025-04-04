package com.example.chinesechess.repository;

import com.example.chinesechess.model.Game;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface GameRepository extends MongoRepository<Game, String> {
    Optional<Game> findById(String Id);
    List<Game> findByPlayerRed(String playerRed);
    List<Game> findByPlayerBlack(String playerBlack);
    List<Game> findByPlayerBlackIsNullOrPlayerRedIsNull();
    Optional<Game> findByName(String name);
}
