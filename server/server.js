const express = require("express");
const cors = require("cors");
const PikafishEngine = require("./pikafish");
const app = express();

app.use(express.json());
app.use(cors());

const engine = new PikafishEngine();

app.post("/api/pikafish/move", (req, res) => {
  const { fen } = req.body;
  if (!fen) return res.status(400).json({ error: "FEN is required" });
  engine.setPosition(fen);
  engine.getBestMove((bestMove) => {
    res.json({ move: bestMove });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));

process.on("exit", () => engine.quit());