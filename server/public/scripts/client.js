// # Models: Interact with entity classes and network requests

class StartingModel {
    static games = []

    static async loadGameList() {
        StartingModel.games = await m.request("/games")
    }

    static async startNewGame() {
        m.request({
            method: "POST",
            url: "/games"
        }).then((res) => {
            const gameID = res;
            m.route.set("/playing", { gameID: gameID });
        });
    }
}

class PlayingModel {
    static game = null;
    static gameStatus = "Pending"

    static _gameID;

    static async setGameID(id) {
        PlayingModel._gameID = id;
    }

    static async loadGame() {
        Con.socket.emit('gameRequest', PlayingModel._gameID, response => {
            console.log('acknowledged, response:', response)
            PlayingModel.game = response.content
            PlayingModel.gameStatus = response.status
            m.redraw();
        })
    }
}

class Con {
    static _socket

    static get socket() {
        if (Con._socket === undefined) {
            Con._socket = io();
        }
        return Con._socket;
    }
}

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
