import * as Turbo from '/static/turbo.es2017-esm.js?beta5'

const application = Stimulus.Application.start();
const Controller = Stimulus.Controller;


function registerControllers() {
    application.register("button", ButtonController);
    application.register("game-stream", GameStreamController);
}

class ButtonController extends Controller {
    static get targets() { return ['flagSubmit']; }

    setFlag(event) {
        event.preventDefault();
        this.flagSubmitTarget?.click();
    }
}

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
    }

    disconnect() {
        Turbo.disconnectStreamSource(this.connection);
        this.connection.close();
        clearTimeout(this.staleGameTimeout);
    }
}

registerControllers();
