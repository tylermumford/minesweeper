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

    currentPlayerID = null
    currentPlayerName = ''

    constructor() {
        this.currentPlayerName = localStorage.playerName || 'Anonymous'
    }

    setPlayerName(name) {
        this.currentPlayerName = name.trim();
        localStorage.playerName = name.trim() || 'Anonymous';
    }

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

Socket.on('assignedPlayerID', id => StartingModel.currentPlayerID = id)


class PlayingModelConstructor {
    game = null;
    gameStatus = "Pending"

    _gameID;

    async setGameID(id) {
        this._gameID = id;
    }

    async loadGame() {
        Socket.emit('gameRequest', this._gameID)
        Socket.emit('playerJoin', { gameID: this._gameID, playerName: StartingModel.currentPlayerName })
    }

    async handleClick(square) {
        Socket.emit('click', square);
    }
}
const PlayingModel = new PlayingModelConstructor;

Socket.on('gameUpdate', response => {
    console.log('received game update', response)
    PlayingModel.game = response.content
    PlayingModel.gameStatus = response.status
})

// # Components: Display information and interfaces; receive user input

class StartScreen {
    view() {
        return m('div', [
            m(PlayerNameInput),
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

class PlayerNameInput {

    get nameInput() {
        return document.getElementById('player-name');
    }

    updateName() {
        const newName = this.nameInput.value;
        StartingModel.setPlayerName(newName);
    }

    view() {
        return m('p', [
            m('label', 'Your player name: ',
                m('input#player-name', {
                    oninput: () => this.updateName(),
                    // onblur: () => this.handleNoName(),
                    placeholder: 'Anonymous',
                    value: StartingModel.currentPlayerName
                })
            )
        ])
    }
}

class GameLinks {
    oninit() {
        StartingModel.loadGameList()
    }

    view() {
        return m(".game-links", [
            m('h2', 'Available Games'),
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
        return m("a", { href: `#!/playing?gameID=${vnode.attrs.gameID}` },
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
            // m('pre', JSON.stringify(PlayingModel.game, null, '  '))
        ]);
    }
}

class Field {
    view() {
        const myField = PlayingModel.game?.fields[StartingModel.currentPlayerID];
        return m('div.field', [
            m('h4', 'Your Field'),
            m('div.field-grid',
                (!myField) ? '' : myField.squares.map(row => row.map(square => m(Square, { squareData: square })))
            )
        ])

    }
}

class Square {
    /** @param {MouseEvent} event */
    handleClick(event, vnode) {
        PlayingModel.handleClick(vnode.attrs.squareData)
        console.log(JSON.stringify(vnode.attrs.squareData))
    }

    view(vnode) {
        const square = vnode.attrs.squareData;
        const emSpace = ' ';
        const coords = square.coordinates.toString();

        return m('button.square', {
            title: coords + (square.isMine ? ' (a mine)' : ''),
            class: square.isOpened ? 'square--opened' : '',
            onclick: e => this.handleClick(e, vnode)
        }, square.isRevealed ? (square.isMine ? '💥' : square.numberOfMinesSurrounding) : emSpace)
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
