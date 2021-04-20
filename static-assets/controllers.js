const application = Stimulus.Application.start();
const Controller = Stimulus.Controller;

function registerControllers() {
    application.register("button", ButtonController);
}

class ButtonController extends Controller {
    static get targets() { return ['flagSubmit']; }

    setFlag(event) {
        event.preventDefault();
        this.flagSubmitTarget?.click();
    }
}

registerControllers();
