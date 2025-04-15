
class Logs {
    logs: string[];
    subscribers: ((log: string[]) => void)[];
    constructor() {
        this.logs = [];
        this.subscribers = [];
    }

    log(log: string) {
        console.log(log);
        this.logs.push(log);
        this.subscribers.forEach((s) => s(this.logs));
    }

    subscribe(callback: (log: string[]) => void) {
        this.subscribers.push(callback);
        callback(this.logs);
    }

    unsubscribe(callback: (log: string[]) => void) {
        this.subscribers = this.subscribers.filter((s) => s!= callback);
    }
}


export const logs = new Logs();