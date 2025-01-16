import { View } from "@/shared/utils/view";
import { HomeController } from "../model/controller";
import { ProductsListView } from "@/widgets/ProductsList/ui/view";

export class HomeView extends View {
    private readonly controller: HomeController;

    constructor(root: HTMLElement) {
        super("section", root, "home");
        
        this.controller = new HomeController();

        this.init();
    }

    private favoritesViewHandler(ct: HTMLButtonElement) {
        this.controller.state.view = "products";

        this.element.querySelector(".home__content")?.insertAdjacentHTML('afterbegin', '<div class="sidebar"></div>');

        ct.textContent = "Показать избранное";
    }

    private productsViewHandler(ct: HTMLButtonElement) {
        this.element.querySelector(".home__content > .sidebar")?.remove();

        this.controller.state.view = "favorites";
        this.controller.resetState();
        this.controller.abortProducts('Aborted due to view change');

        ct.textContent = "Скрыть избранное";
    }

    private handleUpdateView({ currentTarget }: Event | { currentTarget: HTMLButtonElement }) {
        this[this.controller.state.view === "favorites" ? "favoritesViewHandler" : "productsViewHandler"](currentTarget as HTMLButtonElement);
    }

    private getToolbarTemplate() {
        return ` 
        <div class="home__toolbar">
            <button class="btn btn--variant--toolbar home__toolbar-btn home__toolbar-btn--favorites">
                Показать избранное
            </button>
        </div>
        `
    }

    private setToolbar() {
        this.element.insertAdjacentHTML("afterbegin", this.getToolbarTemplate());
        this.element.querySelector(".home__toolbar > .home__toolbar-btn--favorites")?.addEventListener("click", this.handleUpdateView.bind(this));
    }

    private setContent() {
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
        
        new ProductsListView(this.element.querySelector<HTMLDivElement>(".home__content")!, this.controller);
        
        this.render();

        this.controller.getProducts("init");
    }
}