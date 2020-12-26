import {createGame} from "entities";
import {List} from 'immutable';

class GameRepository {
    #games = new List;

    startNewGame() {
        const g = createGame();
        this.#games = this.#games.push(g);
        return g.gameID;
    }

    getAll() {
        return this.#games.toArray();
    }

    get(gameID) {
        return this.#games.find(g => g.gameID == gameID)
    }
};


const singleton = new GameRepository();
export default singleton;
export { GameRepository as GameRepositoryClass }
