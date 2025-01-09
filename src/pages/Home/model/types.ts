import { Product } from "@/entities/Product/model/types";
import { WithMeta } from "@/shared/model/types";

export type IHomeview = "products" | "favorites";

export interface HomeState {
    view: IHomeview;
    isLoading: boolean;
    products: WithMeta<Product> | null;
}

export enum UPDATE_TYPES {
    GET_PRODUCTS = "getProducts",
    CHANGE_STATE = "changeState",
}