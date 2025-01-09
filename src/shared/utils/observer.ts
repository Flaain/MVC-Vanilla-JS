import { ObserverSubscriber } from "../model/types";

export abstract class Observer {
    private subscribers: Set<ObserverSubscriber>;

    constructor() {
        this.subscribers = new Set();
    }

    notify<T>(updateType: string, data: T) {
        this.subscribers.forEach((subscriber) => subscriber(updateType, data));
    }

    subscribe(subscriber: ObserverSubscriber) {
        this.subscribers.add(subscriber);
    }

    unsubscribe(subscriber: ObserverSubscriber) {
        this.subscribers.delete(subscriber);
    }
}