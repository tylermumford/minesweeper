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
    timeStartedPolling
    lastSeenState

    async connect() {
        this.element.addEventListener('click', () => this.reload())

        await this.getFirstState();
        this.startPolling();
    }

    async getFirstState() {
        const response = await fetch(document.location.href, { method: 'HEAD' });

        const stateHeader = response.headers.get('X-Minesweeper-Game-State');
        if (response.ok && stateHeader) {
            this.lastSeenState = stateHeader;
        }
    }

    startPolling() {
        this.timeStartedPolling = new Date();

        this.polling = setInterval(async () => {
            await this.maybeReload()

            const maxPollingTime = 5 * 60 * 1000;
            if (new Date() - this.timeStartedPolling > maxPollingTime) {
                clearInterval(this.polling);
            }
        }, 3000);
    }

    async maybeReload() {
        const response = await fetch(document.location.href, {method: 'HEAD'});

        const stateHeader = response.headers.get('X-Minesweeper-Game-State');
        if (!response.ok || !stateHeader) {
            return;
        }

        if (stateHeader !== this.lastSeenState) {
            this.reload();
        }
    }

    reload() {
        Turbo.visit(document.location.href, { action: 'replace' });
    }

    disconnect() {
        clearInterval(this.polling)
    }
}

registerControllers();
