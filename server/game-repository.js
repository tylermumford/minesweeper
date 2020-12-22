import {createGame} from "entities";

class GameRepository {
    #games = []

    startNewGame() {
        const g = createGame();
        this.#games.push(g);
        return g.gameID;
    }

    getAll() {
        return this.#games;
    }
};

export default GameRepository;
