package com.example.chinesechess.repository;

import com.example.chinesechess.model.MatchHistory;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface MatchHistoryRepository extends MongoRepository<MatchHistory, String> {
    Optional<MatchHistory> findById(String Id);
}
