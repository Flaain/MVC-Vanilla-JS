import { View } from "./view";

export class ImageView extends View<HTMLImageElement> {
    private readonly src?: string;
    private readonly skeleton?: string;
    private readonly container: HTMLElement;
    private readonly loading: HTMLImageElement['loading'];
    private readonly alt?: string;
    private readonly onImageLoad?: () => void;

    constructor({
        src,
        skeleton,
        parent,
        classes,
        alt,
        loading = 'lazy',
        onImageLoad
    }: {
        src?: string;
        loading?: HTMLImageElement['loading'];
        skeleton?: string;
        alt?: string;
        parent: HTMLElement;
        classes?: string | Array<string>;
        onImageLoad?: () => void;
    }) {
        super("img", parent, classes);

        this.src = src;
        this.alt = alt;
        this.container = parent;
        this.loading = loading;
        this.skeleton = skeleton;

        this.onImageLoad = onImageLoad;

        this.init();
    }

    setListeners() {
        this.element.addEventListener("load", this.onLoad.bind(this), { once: true });
        this.element.addEventListener("error", this.onError.bind(this), { once: true });
    }

    onLoad() {
        this.onImageLoad?.();
        this.container.querySelector('.imageview__skeleton')?.remove();
        
        this.element.removeAttribute("style");
        this.element.removeEventListener("error", this.onError.bind(this));
    }

    onError() {
        this.element.remove();
    }

    init() {
        this.skeleton && this.container.insertAdjacentHTML('afterbegin', `<div class="imageview__skeleton">${this.skeleton}</div>`);
        
        if (!this.src) return;

        this.element.src = this.src;
        this.element.loading = this.loading;
        this.element.alt = this.alt || '';
        this.element.style.cssText = `
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            white-space: nowrap;
            border-width: 0;
            opacity: 0;
            position: absolute;
        `;
        
        this.setListeners();
        this.render();
    }
}