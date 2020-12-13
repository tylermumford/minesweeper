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
            m(newGameButton)
        ])
    }
}

//---

let Playing = () => {
    return {
        view: () => m('div', 'Playing game ' + m.route.param('gameID'))
    }
}

//---

let newGameButton = () => {
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
