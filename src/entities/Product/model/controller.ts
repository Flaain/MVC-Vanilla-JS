import { ProductModel } from "./model";

export class ProductController {
    private readonly model: ProductModel;

    constructor() {
        this.model = new ProductModel();
    }
}