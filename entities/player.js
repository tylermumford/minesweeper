import { Record } from "immutable";

const Player = Record({
    playerID: null,
    name: 'Unknown',

    hasHitAMine: false
}, 'Player')

export default Player;

export function createNewPlayer(name = 'Unknown') {
    let p = Player();
    p = p.set('name', name);
    return p;
}
