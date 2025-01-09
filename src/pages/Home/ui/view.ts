import { View } from "@/shared/utils/view";
import { HomeController } from "../model/controller";
import { ProductsListView } from "@/widgets/ProductsList/ui/view";

export class HomeView extends View {
    private readonly controller: HomeController;
    private productsListView: ProductsListView;

    constructor(root: HTMLElement) {
        super("section", root, "home");
        
        this.controller = new HomeController();
        this.productsListView = null!

        this.init();
    }

    favoritesViewHandler(ct: HTMLButtonElement) {
        this.productsListView.init();
        
        this.controller.state.view = "products";
        this.controller.getProducts("init");

        this.element.querySelector(".home__toolbar-btn--back")?.remove();

        ct.textContent = "Показать избранное";
    }

    productsViewHandler(ct: HTMLButtonElement) {
        this.controller.state.view = "favorites";
        this.controller.resetState();
        this.controller.abortProducts('Aborted due to view change');

        this.element.querySelector(".home__toolbar")?.insertAdjacentHTML(
            "afterbegin",
            `
            <button class="btn home__toolbar-btn home__toolbar-btn--back">
                Назад
            </button>
        `
        );

        this.element.querySelector(".home__toolbar-btn--back")?.addEventListener("click", () => this.favoritesViewHandler(ct), { once: true });

        ct.textContent = "Скрыть избранное";
    }

    handleUpdateView({ currentTarget }: Event | { currentTarget: HTMLButtonElement }) {
        this[this.controller.state.view === "favorites" ? "favoritesViewHandler" : "productsViewHandler"](currentTarget as HTMLButtonElement);
    }

    getToolbarTemplate() {
        return ` 
        <div class="home__toolbar">
            <button class="btn btn--variant--toolbar home__toolbar-btn home__toolbar-btn--favorites">
                Показать избранное
            </button>
        </div>
        `
    }

    setToolbar() {
        this.element.insertAdjacentHTML("afterbegin", this.getToolbarTemplate());
        this.element.querySelector(".home__toolbar > .home__toolbar-btn--favorites")?.addEventListener("click", this.handleUpdateView.bind(this));
    }

    setContent() {
        this.element.querySelector(".home__toolbar")?.insertAdjacentHTML(
            "afterend",
            `
            <div class="home__content">
                <div class="sidebar"></div>
            </div>
        `
        );
    }

    init() {
        this.setToolbar();
        this.setContent();
        
        this.productsListView = new ProductsListView(this.element.querySelector<HTMLDivElement>(".home__content")!);

        this.productsListView.callbacks.subscribeHomeEvents = this.controller.subscribe.bind(this.controller);
        this.productsListView.callbacks.unsubscribeHomeEvents = this.controller.unsubscribe.bind(this.controller);
        this.productsListView.callbacks.getNextProducts = this.controller.getProducts.bind(this.controller);
        this.productsListView.callbacks.getProductsMeta = () => this.controller.state.products?.meta;

        this.productsListView.init();
        
        this.render();

        this.controller.getProducts("init");
    }
}