import * as Turbo from '/static/turbo.es2017-esm.js?beta5'
import '/static/hammer.min.js';

const application = Stimulus.Application.start();
const Controller = Stimulus.Controller;


// Called once (at the bottom of this file) to connect
// controllers to Stimulus.
function registerControllers() {
    application.register("button", ButtonController);
    application.register("game-stream", GameStreamController);
    application.register("gestures", GesturesController);
}

// Wires up an event handler for flagging a square
// on the minefield.
class ButtonController extends Controller {
    static get targets() { return ['flagSubmit']; }

    setFlag(event) {
        event.preventDefault();
        this.flagSubmitTarget?.click();
    }
}

// Wires up the Server-Sent Events connection with Turbo.
// Implements a timeout to end the connection.
class GameStreamController extends Controller {
    static get targets() { return ["timeoutMessage"]; }

    connect() {
        this.connection = new EventSource(document.location.href + "/stream");
        Turbo.connectStreamSource(this.connection);

        const time20Minutes = 20 * 60 * 1000;
        this.staleGameTimeout = setTimeout(() => {
            this.timeoutMessageTarget.classList.remove("dn");
            this.disconnect();
        }, time20Minutes);

        document.addEventListener('turbo:before-visit', this.disconnect)
    }

    disconnect() {
        Turbo.disconnectStreamSource(this.connection);
        this.connection.close();
        clearTimeout(this.staleGameTimeout);
    }
}

// Lets the Hammer library know about an element.
class GesturesController extends Controller {
    connect() {
        this.hammerRef = new Hammer(this.element);
        // The long-press event is wired up in the DOM.
    }
}

registerControllers();
