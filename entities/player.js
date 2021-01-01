import { Record } from "immutable";

const Player = Record({
    playerID: null,
    name: 'Unknown',

    hasHitAMine: false
}, 'Player')

export default Player;

export function createNewPlayer(name = 'Unknown') {
    let p = Player();
    p = p.set('name', name).set('playerID', generateID());
    return p;
}

function generateID() {
    // Credit: StackOverflow, Simon Rigét
    // https://stackoverflow.com/a/44078785
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    return uniqueId;
}
