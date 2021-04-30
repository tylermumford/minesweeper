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
    connect() {
        console.log("Connected", this.element);

        const connection = new EventSource(document.location.href + "/stream");
        Turbo.connectStreamSource(connection)
    }
}

registerControllers();
