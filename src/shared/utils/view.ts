import { IView } from "../model/types";

export abstract class View<T extends HTMLElement = HTMLElement> implements IView {
    protected element: T;
    readonly callbacks: Record<string, Function>;

    constructor(
        private readonly tag: keyof HTMLElementTagNameMap,
        private parent?: HTMLElement,
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

    protected render() {
        if (!this.parent) throw new Error("Parent element not found");
        
        !this.element && this.recreate();
        this.parent.append(this.element);
    }

    remove() {
        this.element.remove();
        this.element = null!;
    }
}