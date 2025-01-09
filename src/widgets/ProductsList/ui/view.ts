import { productSkeletonTemplate } from "@/entities/Product/config/constants";
import { View } from "@/shared/utils/view";
import { ProductsListController } from "../model/controller";
import { Product as IProduct } from "@/entities/Product/model/types";
import { HomeState, UPDATE_TYPES } from "@/pages/Home/model/types";
import { ProductView } from "@/entities/Product";
import { PRODUCT_SKELETONS_COUNT } from "@/shared/config/constants";

export class ProductsListView extends View<HTMLUListElement> {
    private readonly controller: ProductsListController;

    constructor(parent: HTMLElement) {
        super("ul", parent, "home__list");

        this.controller = new ProductsListController();

        this.homeSubscriber = this.homeSubscriber.bind(this);
    }

    init() {
        this.callbacks.subscribeHomeEvents(this.homeSubscriber);
        this.render();
    }

    private homeSubscriber(type: UPDATE_TYPES, data: any) {
        const actions: Record<UPDATE_TYPES, () => void> = {
            [UPDATE_TYPES.GET_PRODUCTS]: () => this.renderProducts(data),
            [UPDATE_TYPES.CHANGE_STATE]: () => {
                const { property, value } = data;

                const handlers: Record<Exclude<keyof HomeState, 'products'>, () => void> = {
                    isLoading: () => value && this.setSkeleton(),
                    view: () => value !== 'products' && this.unmount()
                }

                handlers[property as keyof typeof handlers]?.();
            }
        };

        actions[type]?.();
    }

    private handleNextProducts() {
        const meta = this.callbacks.getProductsMeta();

        if (meta.current_page + 1 > meta.total_pages) return;

        this.element.insertAdjacentHTML("beforeend", this.getSkeletonTemplate());
        this.callbacks.getNextProducts('minor');
    }

    private unmount() {
        this.callbacks.unsubscribeHomeEvents(this.homeSubscriber);
        this.remove();
    }

    private setSkeleton() {
        this.element.replaceChildren();
        this.element.insertAdjacentHTML("afterbegin", this.getSkeletonTemplate());
    }

    private getSkeletonTemplate() {
        return productSkeletonTemplate.repeat(PRODUCT_SKELETONS_COUNT);
    }
    
    private renderProducts({ type, data }: { type: string; data: Array<IProduct> }) {
        if (type === 'init') {
            this.element.replaceChildren();
        } else {
            for (let i = 0; i < PRODUCT_SKELETONS_COUNT; i += 1) {
                this.element.removeChild(this.element.lastElementChild!);
            }
        }

        data.forEach((product, index, array) => new ProductView({
            product,
            parent: this.element,
            isLast: index === array.length - 1,
            getNextProducts: index === array.length - 1 ? this.handleNextProducts.bind(this) : undefined
        }));
    }
}