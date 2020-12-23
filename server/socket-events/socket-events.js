import GameRepository from "../game-repository.js"

export default function attachSocketEvents(io) {
    io.on('connection', socket => {
        console.log('hey, socket connected:', socket.id)

        socket.on('disconnect', () => {
            console.log('oh, socket disconnected:', socket.id)
        })

        socket.on('gameRequest', (gameID, callback) => {
            console.log('gameRequest:', gameID)
            let matchingGame = GameRepository.getAll().find(g => g.gameID == gameID)
            callback(matchingGame ? ok(matchingGame) : notFound())
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
