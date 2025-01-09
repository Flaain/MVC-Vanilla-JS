import { View } from "@/shared/utils/view";
import { Product as IProduct } from "../model/types";
import { ImageView } from "@/shared/utils/image";
import { ModalView } from "@/shared/utils/modal";

export class ProductView extends View<HTMLLIElement> {
    private readonly product: IProduct;
    private readonly formatedPrice: Intl.NumberFormat;
    private readonly productModalView: ModalView;
    private readonly observer: IntersectionObserver | null;

    constructor({ parent, product, isLast, getNextProducts }: { parent: HTMLElement; product: IProduct; isLast?: boolean; getNextProducts?: () => void; }) {
        super("li", parent, ["product", "home__list-item"]);

        this.product = product;
        this.productModalView = new ModalView(document.querySelector('#portal')!, {
            content: `<div>${this.product.description}</div>`,
            withHeader: true,
            withCloseButton: true,
            title: 'Test modal',
        })

        this.observer = isLast ? new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                getNextProducts?.();
                this.observer?.disconnect();
            }
        }) : null;

        this.observer?.observe(this.element);

        new ImageView({
            src: this.product.image,
            parent: this.element,
            classes: 'product__image',
            alt: this.product.title,
            skeleton: `<div class="skeleton product__image--skeleton"></div>`,
        })

        this.formatedPrice = new Intl.NumberFormat(navigator.language, {
            style: "currency",
            minimumFractionDigits: 0,
            currency: "usd",
        })
        
        this.init();
    }

    getProductTemplate() {
        return `
           <div class="product__content">
               <h2 class="product__title">${this.product.title}</h2>
               <strong class="product__price">
                    ${this.formatedPrice.format(this.product.price)}
               </strong>
               <p class="product__description">${this.product.description}</p>
           </div>
        `;
    }    

    setProduct() {
        this.element.insertAdjacentHTML('beforeend', this.getProductTemplate());
        this.element.addEventListener('click', () => this.productModalView.open());
    }

    init() {
        this.setProduct();
        this.render();
    }
}