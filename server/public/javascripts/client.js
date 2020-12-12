let gameUI = () => {
    return {
        view: () => m('div', 'Mithril is here.')
    }
}

let gameContainer = document.getElementById('game-container');
if (gameContainer) {
    m.mount(gameContainer, gameUI);
} else {
    throw new Error('No game container element.');
}
