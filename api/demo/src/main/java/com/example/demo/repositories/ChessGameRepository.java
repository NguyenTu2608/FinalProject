package com.example.demo.repositories;

import com.example.demo.models.ChessGame;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChessGameRepository extends MongoRepository<ChessGame, String> {
}
