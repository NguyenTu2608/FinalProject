package com.example.demo.repository;

import com.example.demo.model.ChessGame;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChessGameRepository extends MongoRepository<ChessGame, String> {
}
