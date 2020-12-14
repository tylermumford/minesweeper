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

let GameSelection = () => {
    return {
        view: () => m('div', [
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

let Playing = () => {
    return {
        view: () => m('div', 'Playing game ' + m.route.param('gameID'))
    }
}

//---

let NewGameButton = () => {
    let startGame = () => {
        startNewGame();
    };

    return {
        view: () => m('button', {onclick: startGame}, 'Start a new game')
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
