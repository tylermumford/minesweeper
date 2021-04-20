const application = Stimulus.Application.start();
const Controller = Stimulus.Controller;

function registerControllers() {
    application.register("button", ButtonController);
}

class ButtonController extends Controller {
    connect() {
        console.log("Connected!");
    }
}

registerControllers();
