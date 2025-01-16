import { View } from "@/shared/utils/view";
import { ProductView, productSkeletonTemplate, Product } from "@/entities/Product";
import { PRODUCT_SKELETONS_COUNT } from "@/shared/config/constants";
import { HomeState, UPDATE_TYPES } from "@/pages/Home";
import { HomeController } from "@/pages/Home/model/controller";

export class ProductsListView extends View<HTMLUListElement> {
    constructor(parent: HTMLElement, private readonly homeController: HomeController) {
        super("ul", parent, "home__list");

        this.subscriber = this.subscriber.bind(this);

        this.init();
    }

    init() {
        this.homeController.subscribe(this.subscriber);
        this.render();
    }

    private subscriber(type: UPDATE_TYPES, data: any) {
        const actions: Record<UPDATE_TYPES, () => void> = {
            [UPDATE_TYPES.GET_PRODUCTS]: () => this.renderProducts(data),
            [UPDATE_TYPES.CHANGE_STATE]: () => {
                const { property, value } = data;

                const handlers: Record<Exclude<keyof HomeState, 'products'>, () => void> = {
                    isLoading: () => value && this.setSkeleton(),
                    favorites: () => {},
                    view: () => this.handleViewChange(value),
                }

                handlers[property as keyof typeof handlers]?.();
            }
        };

        actions[type]?.();
    }

    private handleViewChange(view: HomeState['view']) {
        this.parent?.querySelector('.home__empty')?.remove();

        !this.element && this.render();

        view === 'favorites' ? this.renderFavorites() : this.homeController.getProducts('init');
    }

    private unmount() {
        this.homeController.unsubscribe(this.subscriber);
        this.remove();
    }

    private handleNextProducts() {
        const meta = this.homeController.state.products?.meta;

        if (meta && meta.current_page + 1 > meta.total_pages) return;

        this.element.insertAdjacentHTML("beforeend", this.getSkeletonTemplate());
        this.homeController.getProducts('minor');
    }

    private setSkeleton() {
        this.element.replaceChildren();
        this.element.insertAdjacentHTML("afterbegin", this.getSkeletonTemplate());
    }

    private getSkeletonTemplate() {
        return productSkeletonTemplate.repeat(PRODUCT_SKELETONS_COUNT);
    }

    private getEmptyFavoritesTemplate() {
        return `
            <div class="home__empty">
                <h1 class="home__empty-title">Нет избранных товаров</h1>
                <svg
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                >
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
                    <line x1="9" x2="9.01" y1="9" y2="9"/>
                    <line x1="15" x2="15.01" y1="9" y2="9"/>
                </svg>
            </div>
        `
    }

    private handleFavoriteClick(product: Product) {
        this.homeController.handleFavoriteClick(product);

        if (!this.homeController.state.favorites.length) {
            this.remove();
            this.parent?.insertAdjacentHTML("afterbegin", this.getEmptyFavoritesTemplate());
        }
    }

    private renderFavorites() {
        if (!this.homeController.state.favorites.length) {
            this.remove();
            this.parent?.insertAdjacentHTML("afterbegin", this.getEmptyFavoritesTemplate());
            return;
        }
        
        this.element.replaceChildren();

        this.homeController.state.favorites.forEach((product: Product) => {
            const productView = new ProductView({
                product,
                source: 'favorites',
                classes: 'home__list-item',
                isFavorited: true,
                parent: this.element,
            })

            productView.callbacks.onFavorite = this.handleFavoriteClick.bind(this);
        })
    }
    
    private renderProducts({ type, data }: { type: string; data: Array<Product> }) {    
        if (type === 'init') {
            this.element.replaceChildren();
        } else {
            for (let i = 0; i < PRODUCT_SKELETONS_COUNT; i += 1) {
                this.element.removeChild(this.element.lastElementChild!);
            }
        }

        data.forEach((product, index, array) => {
            const productView = new ProductView({
                product,
                source: 'products',
                classes: "home__list-item",
                isFavorited: this.homeController.isFavorite(product.id),
                parent: this.element,
                isLast: index === array.length - 1,
            });

            productView.callbacks.getNextProducts = this.handleNextProducts.bind(this);
            productView.callbacks.onFavorite = this.homeController.handleFavoriteClick.bind(this.homeController);
        });
    }
}