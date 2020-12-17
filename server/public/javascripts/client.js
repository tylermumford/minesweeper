class GameModel {
    static games = []

    static async loadGameList() {
        GameModel.games = await m.request("/games")
    }
}

//---

let startNewGame = async () => {
    m.request({
        method: "POST",
        url: "/games"
    }).then((res) => {
        const gameID = res;
        m.route.set("/playing", {gameID: gameID});
    });
}

//---

class GameSelection {
    view() {
        return m('div', [
            m(NewGameButton),
            m(GameLinks)
        ])
    }
}

//---

class GameLinks {
    oninit = GameModel.loadGameList

    view() {
        return m(".game-links", [
            m('h2', 'Open Games'),
            (GameModel.games.length > 0) ?
                m("ul", [
                    GameModel.games.map(game => m("li", m(GameLink, { gameID: game.gameID })))
                ])
                : "(none)"
        ])
    }
}

//--

class GameLink {
    view(vnode) {
        return m("a", {href: `#!/playing?gameID=${vnode.attrs.gameID}`}, 
            `Game #${vnode.attrs.gameID}`
        )
    }
}

//---

class Playing {
    view() {
        return m('div', 'Playing game ' + m.route.param('gameID'));
    }
}

//---

class NewGameButton {
    startGame() {
        startNewGame();
    }

    view() {
        return m('button', {onclick: this.startGame}, 'Start a new game');
    }
}

//---

function startMithrilApp(inElement) {
    m.route(inElement, "/start", {
        "/start": GameSelection,
        "/playing": Playing
    });
}

let gameContainer = document.getElementById('game-container');
if (gameContainer) {
    startMithrilApp(gameContainer);
} else {
    throw new Error('No game container element.');
}
