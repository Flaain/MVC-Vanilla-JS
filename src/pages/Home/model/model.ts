import { Observer } from "@/shared/utils/observer";
import { HomeState, UPDATE_TYPES } from "./types";
import { existingViews } from "../config/constants";
import { homeApi } from "../api";
import { LOCAL_STORAGE_KEYS } from "@/shared/model/types";
import { Product } from "@/entities/Product";

export class HomeModel extends Observer {
    private readonly _proxy: HomeState;
    private getProductsAbortController: AbortController;

    constructor() {
        super();

        this.getProductsAbortController = new AbortController();

        this._proxy = new Proxy(
            { view: "products", favorites: this.getFavorites(), products: null, isLoading: false },
            { set: this.setState.bind(this) }
        );
    }

    get state() {
        return this._proxy;
    }

    getFavorites() {
        try {
            return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES) ?? "[]");
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    isFavorite(_id: number) {
        return this.state.favorites.some(({ id }) => id === _id)
    }

    handleFavoriteClick(product: Product) {
        this.state.favorites = this.isFavorite(product.id) ? this.state.favorites.filter(({ id }) => id !== product.id) : [product, ...this.state.favorites];
        
        localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify(this.state.favorites));
    }

    abortProducts(reason?: string) {
        this.getProductsAbortController.abort(reason);
        this.getProductsAbortController = new AbortController();
    }

    resetState() {
        this.state.isLoading = false;
        this.state.products = null;
    }

    private setState(target: HomeState, property: keyof HomeState, value: any) {
        if (property === "view" && !existingViews.includes(value)) throw new Error("Invalid view");

        this.notify(UPDATE_TYPES.CHANGE_STATE, { property, value });

        return Reflect.set(target, property, value);
    }

    async getProducts(updateType: "init" | "minor") {
        try {
            updateType === "init" && (this.state.isLoading = true);

            const { data } = await homeApi.getProducts({
                page: (this.state.products?.meta.current_page ?? 0) + 1,
                signal: this.getProductsAbortController.signal,
            });

            this.state.products = { meta: data.meta, items: [...(this.state.products?.items ?? []), ...data.items] };

            this.notify(UPDATE_TYPES.GET_PRODUCTS, { type: updateType, data: data.items });
        } catch (error) {
            console.error(error);
        } finally {
            this.state.isLoading = false;
        }
    }
}
