import { IView } from "../model/types";

export abstract class View<T extends HTMLElement = HTMLElement> implements IView {
    public element: T;
    readonly callbacks: Record<string, (...args: any) => any>;

    constructor(
        private readonly tag: keyof HTMLElementTagNameMap,
        public parent?: HTMLElement,
        private readonly classes?: string | Array<string>
    ) {
        this.element = this.create(tag, classes);
        this.parent = parent;
        this.callbacks = {};
    }

    setParent(parent: HTMLElement) {
        this.parent = parent;
    }
    
    private recreate() {
        this.element = this.create(this.tag, this.classes);
    }

    private create(tag: keyof HTMLElementTagNameMap, classes?: string | Array<string>) {
        if (this.element) return this.element;

        const element = document.createElement(tag);

        classes && element.classList.add(...(Array.isArray(classes) ? classes : [classes]));

        return element as T;
    }

    protected render(insertPosition: 'beforeend' | 'afterbegin' = 'beforeend') {
        if (!this.parent) throw new Error("Parent element not found");
        
        !this.element && this.recreate();
        this.parent[insertPosition === 'afterbegin' ? 'prepend' : 'append'](this.element);
    }

    remove() {
        this.element.remove();
        this.element = null!;
    }
}