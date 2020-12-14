let generateGameID = () => {
    let r = Math.random();
    const min = 10;
    const max = 1000;

    let inRange = r * (max - min) + min;
    let asInteger = Math.floor(inRange);
    let asString = new String(asInteger);
    return asString;
}

class GameMaster {
    games = []

    startNewGame() {
        let id = generateGameID();
        this.games.push({gameID: id});
        return id;
    }
};

module.exports = GameMaster;
