// # Models: Interact with entity classes and network requests

class SocketWrapper {
    _socket = io()

    /** Wraps socket.emit, and redraws Mithril */
    emit = (eventName, ...emitArgs) => {
        if (typeof emitArgs[emitArgs.length - 1] === "function") {
            const originalCallback = emitArgs[emitArgs.length - 1];
            const newCallback = (...cbArgs) => {
                originalCallback(...cbArgs);
                m.redraw();
            }
            emitArgs.pop();
            return this._socket.emit(eventName, ...emitArgs, newCallback);
        }
        return this._socket.emit(eventName, ...emitArgs);
    }

    /** Wraps socket.on, and redraws Mithril */
    on = (eventName, callback) => {
        const newCallback = (...args) => {
            callback(...args);
            m.redraw();
        }
        return this._socket.on(eventName, newCallback);
    }
}
const Socket = new SocketWrapper;


class StartingModelConstructor {
    games = []

    async loadGameList() {
        this.games = await m.request("/games")
    }

    async startNewGame() {
        m.request({
            method: "POST",
            url: "/games"
        }).then((res) => {
            const gameID = res;
            m.route.set("/playing", { gameID: gameID });
        });
    }
}
const StartingModel = new StartingModelConstructor;

class PlayingModelConstructor {
    game = null;
    gameStatus = "Pending"

    _gameID;

    async setGameID(id) {
        this._gameID = id;
    }

    async loadGame() {
        Socket.emit('gameRequest', this._gameID)
    }
}
const PlayingModel = new PlayingModelConstructor;

Socket.on('gameUpdate', response => {
    console.log('acknowledged, game:', response)
    PlayingModel.game = response.content
    PlayingModel.gameStatus = response.status
})

// # Components: Display information and interfaces; receive user input

class StartScreen {
    view() {
        return m('div', [
            m(NewGameButton),
            m(GameLinks)
        ])
    }
}

class NewGameButton {
    startGame() {
        StartingModel.startNewGame();
    }

    view() {
        return m('button', { onclick: this.startGame }, 'Start a new game');
    }
}

class GameLinks {
    oninit = StartingModel.loadGameList

    view() {
        return m(".game-links", [
            m('h2', 'Open Games'),
            (StartingModel.games.length > 0) ?
                m("ul", [
                    StartingModel.games.map(game => m("li", m(GameLink, { gameID: game.gameID })))
                ])
                : "(none)"
        ])
    }
}

class GameLink {
    view(vnode) {
        return m("a", {href: `#!/playing?gameID=${vnode.attrs.gameID}`}, 
            `Game #${vnode.attrs.gameID}`
        )
    }
}

//---

class PlayingScreen {
    
    async oninit() {
        const gameID = m.route.param('gameID');
        await PlayingModel.setGameID(gameID);
        await PlayingModel.loadGame();
    }

    view() {
        return m('div', [
            m('p', `Playing game ${PlayingModel.game?.gameID ?? ''} (${PlayingModel.gameStatus})`),
            m(Field),
            m('pre', JSON.stringify(PlayingModel.game, null, '  '))
        ]);
    }
}

class Field {
    view() {
        return m('div', `(pretend field of ${PlayingModel.game?.rowCount} by ${PlayingModel.game?.columnCount})`)
    }
}

// # Starting procedure

function startMithrilApp(inElement) {
    m.route(inElement, "/start", {
        "/start": StartScreen,
        "/playing": PlayingScreen
    });
}

const gameContainer = document.getElementById('game-container');
if (gameContainer) {
    startMithrilApp(gameContainer);
} else {
    throw new Error('No game container element.');
}
