class Player {
    get name() {return this.#name}
    
    constructor(name) {
        if (name) this.#name = name;
    }

    #name = 'Anonymous'

    toJSON() {
        return {name: this.#name}
    }
}

export default Player;
