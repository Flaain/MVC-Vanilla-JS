import { View } from "@/shared/utils/view";
import { Product, ProductSource, ProductViewProps } from "../model/types";
import { ImageView } from "@/shared/utils/image";
import { ModalView } from "@/shared/utils/modal";
import { ProductController } from "../model/controller";
import { ProductModalView } from "./modal";

export class ProductView extends View<HTMLLIElement> {
    private isFavorited?: boolean;

    private readonly controller: ProductController;
    private readonly product: Product;
    private readonly source: ProductSource;
    private readonly observer: IntersectionObserver | null;

    constructor({ parent, isFavorited, source, classes, product, isLast }: ProductViewProps) {
        super("li", parent, ["product", ...(classes ? (Array.isArray(classes) ? classes : [classes]) : [])]);

        this.controller = new ProductController();

        this.isFavorited = isFavorited;
        this.source = source;
        this.product = product;

        this.observer = isLast ? new IntersectionObserver((entries) => {
            entries[0].isIntersecting && (this.callbacks.getNextProducts?.(), this.observer?.disconnect());
        }) : null;

        this.observer?.observe(this.element);

        new ImageView({
            src: this.product.image,
            parent: this.element,
            classes: 'product__image',
            alt: this.product.title,
            skeleton: `<div class="skeleton product__image--skeleton"></div>`,
        });

        this.renderModal = this.renderModal.bind(this);
        this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
        
        this.init();
    }

    private handleFavoriteClick(event: any) {
        event.stopPropagation();

        try {
            this.callbacks.onFavorite?.(this.product);
            this.isFavorited = !this.isFavorited;
            this.source === 'products' ? this.element.querySelector(".product__icon--add-to-favorite")?.classList.toggle("product__icon--add-to-favorite--true", this.isFavorited) : this.remove();
        } catch (error) {
            console.error(error);
        }
    }

    private getProductTemplate() {
        return `
           <div class="product__content">
               <div class="product__header">
                    <h2 class="product__title">${this.product.title}</h2>
                    <button class="btn product__btn--add-to-favorite">
                        <svg
                            class="product__icon--add-to-favorite ${this.isFavorited ? 'product__icon--add-to-favorite--true' : ''}"
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
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                    </button>
               </div>
               <strong class="product__price">
                    ${new Intl.NumberFormat(navigator.language, {
                        style: "currency",
                        minimumFractionDigits: 0,
                        currency: "usd",
                    }).format(this.product.price)}
               </strong>
               <p class="product__description">${this.product.description}</p>
           </div>
        `;
    }

    private renderModal() {
        const productModalView = new ProductModalView(this.product, this.isFavorited);
        const modalView = new ModalView(document.querySelector('#portal')!, { content: productModalView.element })

        productModalView.callbacks.onClose = modalView.close;
        productModalView.callbacks.onFavorite = (e) => {
            this.handleFavoriteClick(e);
            this.source === 'favorites' && modalView.close();
        }
        productModalView.init();
        
        modalView.open();
    }

    private setProduct() {
        this.element.insertAdjacentHTML('beforeend', this.getProductTemplate());
        this.element.addEventListener('click', this.renderModal);
        this.element.querySelector('.product__btn--add-to-favorite')?.addEventListener('click', this.handleFavoriteClick);
    }

    private init() {
        this.setProduct();
        this.render();
    }
}