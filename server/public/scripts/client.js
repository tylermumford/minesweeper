// # Models: Interact with entity classes

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

    static _gameID;

    static async setGameID(id) {
        PlayingModel._gameID = id;
        await PlayingModel.loadGame();
    }

    static async loadGame() {
        const socket = io();
        socket.emit('getGame', PlayingModel._gameID)
        m.request("/games/")
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
    }

    view() {
        return m('div', 'Playing game ' + '?');
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
