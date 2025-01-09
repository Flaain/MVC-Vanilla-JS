import { ObserverSubscriber } from "@/shared/model/types";
import { HomeModel } from "./model";

export class HomeController {
    private readonly model: HomeModel;

    constructor() {
        this.model = new HomeModel();
    }

    get state() {
        return this.model.state;
    }

    abortProducts(reason?: string) {
        this.model.abortProducts(reason);
    }

    getProducts(updateType: "init" | "minor") {
        this.model.getProducts(updateType);
    }

    resetState() {
        this.model.resetState();
    }

    subscribe(subscriber: ObserverSubscriber) {
        this.model.subscribe(subscriber);
    }

    unsubscribe(subscriber: ObserverSubscriber) {
        this.model.unsubscribe(subscriber);
    }
}
