import GameRepository from "../game-repository.js"
import { addPlayerAndCreateField, createNewPlayer, performClick } from 'entities';
import { is, Map } from 'immutable'

export default function attachSocketEvents(io) {
    /** A map of socket IDs to player IDs. */
    let claimedPlayerIDs = Map();

    io.on('connection', socket => {
        console.log('hey, socket connected:', socket.id)

        socket.on('claimPlayerID', requestedID => {
            console.log(`socket ${socket.id} claiming player ID ${requestedID}`)

            const existingClaim = claimedPlayerIDs.keyOf(requestedID);
            if (existingClaim) {
                console.log(`  that ID was already claimed by socket ${existingClaim}`);
                claimedPlayerIDs = claimedPlayerIDs.delete(existingClaim);
            }

            claimedPlayerIDs = claimedPlayerIDs.set(socket.id, requestedID);
        });

        socket.on('disconnect', () => {
            console.log('oh, socket disconnected:', socket.id)
            claimedPlayerIDs = claimedPlayerIDs.delete(socket.id)
        })

        socket.on('gameRequest', gameID => {
            console.log('gameRequest:', gameID)
            const matchingGame = GameRepository.get(gameID);
            const response = matchingGame ? ok(matchingGame) : notFound()
            socket.emit('gameUpdate', response);
        })

        socket.on('playerJoin', options => {
            console.log('playerJoin:', {...options, playerID: claimedPlayerIDs.get(socket.id)});
            let {gameID, playerName} = options;
            playerName = playerName || 'Anonymous';

            const matchingGame = GameRepository.get(gameID);
            if (!matchingGame) {
                console.log('player tried to join a game that doesn\'t exist');
                return;
            }

            const player = createNewPlayer(playerName).set('playerID', claimedPlayerIDs.get(socket.id));
            let result = matchingGame;
            try {
                result = addPlayerAndCreateField(matchingGame, player)
                GameRepository.update(result);
            } catch {
                console.log('player rejoining game');
            }
            socket.join(matchingGame.gameID);
            io.to(matchingGame.gameID).emit('gameUpdate', ok(result));
        })

        socket.on('click', square => {
            console.log('click received:', square.coordinates)
            try {
                // const [row, col] = square.coordinates;
                const gameID = Array.from(socket.rooms)[1];
                const matchingGame = GameRepository.get(gameID)
                const playerID = claimedPlayerIDs.get(socket.id);
                const player = matchingGame.players.find(p => p.playerID == playerID);

                const newGame = performClick(matchingGame, player, square.coordinates);

                if (is(matchingGame, newGame)) {
                    console.log('click changed nothing');
                } else {
                    GameRepository.update(newGame);
                    io.to(gameID).emit('gameUpdate', ok(newGame));
                }
            } catch (err) {
                console.error('error while clicking', err)
            }
        })
    })
}

function ok(obj) {
    return {
        status: "OK",
        content: obj ?? null
    }
}

function notFound(obj) {
    return {
        status: "Not Found",
        content: obj ?? null
    }
}
