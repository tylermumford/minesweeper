let startNewGame = async () => {
    m.request({
        method: "POST",
        url: "/games"
    }).then((res) => {
        console.log("response:", res)
    });
}

//---

let gameUI = () => {
    return {
        view: () => m('div', [
            m(newGameButton)
        ])
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

let gameContainer = document.getElementById('game-container');
if (gameContainer) {
    m.mount(gameContainer, gameUI);
} else {
    throw new Error('No game container element.');
}
