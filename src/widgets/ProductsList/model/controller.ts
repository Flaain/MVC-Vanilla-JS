import { ProductsListModel } from "./model";

export class ProductsListController {
    private readonly model: ProductsListModel;

    constructor() {
        this.model = new ProductsListModel();
    }
}