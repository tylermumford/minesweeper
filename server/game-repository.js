import Game from "./entities/game-class.js";

class GameRepository {
    #games = []

    startNewGame() {
        const g = new Game;
        this.#games.push(g);
        return g.gameID;
    }

    getAll() {
        return this.#games;
    }
};

export default GameRepository;
