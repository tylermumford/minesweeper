import * as Turbo from '/static/turbo.es2017-esm.js?beta5'

const application = Stimulus.Application.start();
const Controller = Stimulus.Controller;


function registerControllers() {
    application.register("button", ButtonController);
    application.register("refresher", RefresherController);
}

class ButtonController extends Controller {
    static get targets() { return ['flagSubmit']; }

    setFlag(event) {
        event.preventDefault();
        this.flagSubmitTarget?.click();
    }
}

class RefresherController extends Controller {
    polling

    connect() {
        this.element.addEventListener('click', () => this.reload())

        this.startPolling()
    }

    disconnect() {
        clearInterval(this.polling)
    }

    reload() {
        Turbo.visit(document.location.href, { action: 'replace' })
    }

    startPolling() {
        this.polling = setInterval(() => {
            this.reload()
        }, 3000);
    }
}

registerControllers();
