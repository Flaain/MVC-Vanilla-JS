import { ObserverSubscriber } from "@/shared/model/types";
import { HomeModel } from "./model";
import { Product } from "@/entities/Product";

export class HomeController {
    private readonly model: HomeModel;

    constructor() {
        this.model = new HomeModel();
    }

    get state() {
        return this.model.state;
    }

    isFavorite(_id: number) {
        return this.model.isFavorite(_id);
    }

    handleFavoriteClick(product: Product) {
        this.model.handleFavoriteClick(product);
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

    getFavorites() {
        return this.model.getFavorites();
    }
}
