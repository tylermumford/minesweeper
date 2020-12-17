// TODO: Remove this one
function generateGameID() {
    let r = Math.random();
    const min = 10;
    const max = 1000;

    let inRange = r * (max - min) + min;
    let asInteger = Math.floor(inRange);
    let asString = new String(asInteger);
    return asString;
}

class GameRepository {
    #games = []

    startNewGame() {
        let id = generateGameID();
        this.#games.push({gameID: id});
        return id;
    }

    getAll() {
        return this.#games;
    }
};

export default GameRepository;
