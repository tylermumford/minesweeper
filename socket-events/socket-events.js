import GameRepository from "../game-repository.js"
import { addPlayerAndCreateField, createNewPlayer } from 'entities';

export default function attachSocketEvents(io) {
    io.on('connection', socket => {
        console.log('hey, socket connected:', socket.id)

        socket.emit('assignedPlayerID', socket.handshake.address);

        socket.on('disconnect', () => {
            console.log('oh, socket disconnected:', socket.id)
        })

        socket.on('gameRequest', gameID => {
            console.log('gameRequest:', gameID)
            const matchingGame = GameRepository.get(gameID);
            const response = matchingGame ? ok(matchingGame) : notFound()
            socket.emit('gameUpdate', response);
        })

        socket.on('playerJoin', options => {
            console.log('playerJoin:', options);
            let {gameID, playerName} = options;
            playerName = playerName || 'Anonymous';

            const matchingGame = GameRepository.get(gameID);
            if (!matchingGame) {
                console.log('player tried to join a game that doesn\'t exist');
                return;
            }

            // TODO: set a cookie and use that for the player ID instead of IP address?
            const player = createNewPlayer(playerName).set('playerID', socket.handshake.address);
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
