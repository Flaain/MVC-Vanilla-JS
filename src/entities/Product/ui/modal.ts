import { View } from "@/shared/utils/view";
import { Product } from "../model/types";
import { ImageView } from "@/shared/utils/image";

export class ProductModalView extends View<HTMLDivElement> {
    constructor(private readonly product: Product, private isFavorited?: boolean) {
        super("div", undefined, "product-modal");

        this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
    }

    private handleFavoriteClick(e: Event) {
        this.callbacks.onFavorite?.(e);
        this.isFavorited = !this.isFavorited;
        this.element.querySelector(".product__icon--add-to-favorite")?.classList.toggle("product__icon--add-to-favorite--true", this.isFavorited);
    }

    private getTemplate() {
        return `
        <div class="product__header product__header--modal">
            <div class="product-modal__header-text">
                <h1 class="product__title product__title--modal" title="${this.product.title}">${this.product.title}</h1>
                <strong class="product__price product__price--modal">
                ${new Intl.NumberFormat(navigator.language, {
                    style: "currency",
                    minimumFractionDigits: 0,
                    currency: "usd",
                }).format(this.product.price)}
                </strong>
            </div>
            <button class="btn product-modal__close">
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
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                </svg>
            </button>
        </div>
        <div class="product-modal__body">
            <div class="product-modal__gallery">
                <button class="btn product__btn--add-to-favorite product__btn--add-to-favorite-modal">
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
            <div class="product-modal__column">
                <span product-modal__column-heading>Описание товара</span>
                <p class="product__description product__description--modal">${this.product.description}</p>
            </div>
        </div>
        `;
    }

    init() {
        this.element.insertAdjacentHTML("afterbegin", this.getTemplate());
        this.element.querySelector(".product-modal__close")?.addEventListener("click", this.callbacks.onClose, { once: true });
        this.element.querySelector(".product__btn--add-to-favorite-modal")?.addEventListener("click", this.handleFavoriteClick);

        new ImageView({
            alt: this.product.title,
            src: this.product.image,
            insertPosition: 'afterbegin',
            parent: this.element.querySelector(".product-modal__gallery")!,
            classes: ["product__image", "product__image--modal"],
            skeleton: `<div class="skeleton product__image--skeleton product__image--skeleton-modal"></div>`,
        })
    }
}