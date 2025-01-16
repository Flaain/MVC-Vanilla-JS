import { ModalConfig } from "../model/types";
import { View } from "./view";

export class ModalView extends View<HTMLDivElement> {
    private readonly config: ModalConfig & { disabled?: boolean; focusTrapIndex: number };

    constructor(parent: HTMLElement, config: ModalConfig) {
        super("div", parent, "modal");

        this.config = { ...config, focusTrapIndex: -1 };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleOverlayClick = this.handleOverlayClick.bind(this);
        this.close = this.close.bind(this);
    }
    
    public open() {
        this.render();
        this.setContent();
        this.setEventListeners();
    }

    public close() {
        this.removeEventListeners();
        this.remove();

        this.config.closeHandler?.();

        document.body.classList.remove('body--no-scroll');
        document.body.removeAttribute('style');
    }

    private handleOverlayClick({ target, currentTarget }: Event) {
        !this.config.disabled && target === currentTarget && this.close();
    }

    private handleEscapeDown(event: KeyboardEvent) {
        !this.config.disabled && event.key === 'Escape' && this.close();
    };

    private handleTabDown(event: KeyboardEvent) {
        event.preventDefault();
        
        const modalBody = this.element.querySelector<HTMLDivElement>('.modal__body');

        if (!modalBody) return;

        const focusableElements = Array.from(
            modalBody.querySelectorAll<HTMLElement>(
                "a, button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])"
            )
        );

        const total = focusableElements.length;

        this.config.focusTrapIndex = total ? (this.config.focusTrapIndex + (event.shiftKey ? -1 : 1) + total) % total : -1;
        
        focusableElements[this.config.focusTrapIndex]?.focus?.();
    };

    private handleKeyDown(event: KeyboardEvent) {
        event.stopImmediatePropagation();

        const keyListeners = {
            Tab: this.handleTabDown.bind(this),
            Escape: this.handleEscapeDown.bind(this)
        };

        keyListeners[event.key as keyof typeof keyListeners]?.(event);
    };

    private removeEventListeners() {
        document.removeEventListener('keydown', this.handleKeyDown);
        
        this.element.querySelector('.modal__overlay')?.removeEventListener('click', this.handleOverlayClick);
        this.element.querySelector('.modal__overlay > .modal__body > .modal__header > button')?.removeEventListener('click', this.close)
    }

    private setEventListeners() {
        document.addEventListener('keydown', this.handleKeyDown);
        this.element.querySelector('.modal__overlay')?.addEventListener('click', this.handleOverlayClick);
        this.config.withHeader && this.config.withCloseButton && this.element.querySelector('.modal__overlay > .modal__body > .modal__header > button')?.addEventListener('click', this.close);
    }

    private setContent() {
        document.body.style.setProperty('--scrollbar-size', `${window.innerWidth - document.body.offsetWidth + 'px'}`);
        document.body.classList.add('body--no-scroll');

        this.element.insertAdjacentHTML("afterbegin", `<div class='modal__overlay'></div>`);

        this.config.content.classList.add('modal__body');

        this.element.querySelector('.modal__overlay')?.appendChild(this.config.content);
        
        this.config.withHeader && this.element.querySelector('.modal__overlay > .modal__body')?.insertAdjacentHTML("afterbegin", this.getHeaderTemplate(this.config.title, this.config.withCloseButton));
    }

    private setDisabled(disabled: boolean) {
        this.element.querySelector(".modal__overlay")?.classList.toggle("modal__overlay--disabled", disabled);
        this.config.disabled = disabled;
    }

    private getHeaderTemplate(title?: string, withCloseButton?: boolean) {
        if (!title && !withCloseButton) {
            throw new Error('Please use at least one of title or withCloseButton props or provide falsy withHeader prop');
        }
    
        if (title && !withCloseButton) {
            return `<h1 class='modal__title'>${title}</h1>`;
        }
    
        return title
        ? `
            <div class="modal__header">
                <h1 class="modal__title">${title}</h1>
                <button>X</button>
            </div>
          `
        : `<button>X</button>`;
    }
}