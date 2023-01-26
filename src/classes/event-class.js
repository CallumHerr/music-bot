module.exports = class Event {
    constructor(client, name) {
        this.client = client;
        this.name = name;
    }

    run(...params) {
        console.log(this.name)
    }
}