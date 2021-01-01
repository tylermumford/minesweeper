import GameRepository from "../game-repository.js"
import { addPlayerAndCreateField, createNewPlayer, performClick } from 'entities';
import { is } from 'immutable'

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

        socket.on('click', square => {
            console.log('click received:', square.coordinates)
            try {
                // const [row, col] = square.coordinates;
                const gameID = Array.from(socket.rooms)[1];
                const matchingGame = GameRepository.get(gameID)
                const playerID = socket.handshake.address;
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
