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

    get(gameID) {
        return this.#games.find(g => g.gameID == gameID)
    }
};


const singleton = new GameRepository();
export default singleton;
export { GameRepository as GameRepositoryClass }
