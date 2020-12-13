let generateGameID = () => {
    let r = Math.random();
    const min = 10;
    const max = 1000;

    let inRange = r * (max - min) + min;
    let asInteger = Math.floor(inRange);
    let asString = new String(asInteger);
    return asString;
}

class gameMaster {
    games = {}

    startNewGame() {
        let id = generateGameID();
        this.games[id] = {};
        return id;
    }
};

module.exports = gameMaster;
