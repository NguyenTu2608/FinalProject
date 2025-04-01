const { spawn } = require("child_process");
const path = require("path");

class PikafishEngine {
  constructor() {
    const pikafishPath = path.join(__dirname, "engines", "pikafish-avx2.exe");
    try {
      this.engine = spawn(pikafishPath, [], { cwd: __dirname });
      this.engine.stdout.on("data", (data) => console.log(`Pikafish: ${data}`));
      this.engine.stderr.on("data", (data) => console.error(`Pikafish Error: ${data}`));
      this.engine.on("error", (err) => console.error(`Spawn Error: ${err.message}`));
      this.initialize();
    } catch (err) {
      console.error(`Failed to spawn Pikafish: ${err.message}`);
    }
  }
  initialize() {
    this.sendCommand("uci");
    this.sendCommand("setoption name UCI_Variant value xiangqi");
    this.sendCommand("isready");
  }
  sendCommand(command) {
    this.engine.stdin.write(`${command}\n`);
  }
  setPosition(fen) {
    this.sendCommand(`position fen ${fen}`);
  }
  getBestMove(callback) {
    this.sendCommand("go movetime 1000");
    this.engine.stdout.on("data", (data) => {
      const match = data.toString().match(/bestmove (\w+)/);
      if (match) callback(match[1]);
    });
  }
  quit() {
    this.sendCommand("quit");
    this.engine.kill();
  }
}

module.exports = PikafishEngine;