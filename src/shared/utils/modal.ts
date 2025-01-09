import { ModalConfig } from "../model/types";
import { View } from "./view";

export class ModalView extends View<HTMLDivElement> {
    private readonly config: ModalConfig & { disabled?: boolean };

    constructor(parent: HTMLElement, config: ModalConfig) {
        super("div", parent, "modal");

        this.config = config;

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleOverlayClick = this.handleOverlayClick.bind(this);
        this.close = this.close.bind(this);
    }
    
    open() {
        this.render();
        this.setContent();
        this.setEventListeners();
    }

    close() {
        this.removeEventListeners();
        this.remove();

        this.config.closeHandler?.();

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
        
        const ctx = { body: this.element.querySelector<HTMLDivElement>('.modal__body')!, activeIndex: -1 };

        if (!ctx.body) return;

        return () => {
            const focusableElements = Array.from(
                ctx.body.querySelectorAll<HTMLElement>(
                    'a, button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
                )
            );
    
            const total = focusableElements.length;
            const currentIndex = ctx.activeIndex;
            
            ctx.activeIndex = total ? (currentIndex + (event.shiftKey ? -1 : 1) + total) % total : -1;
    
            focusableElements[ctx.activeIndex]?.focus?.();
        }
    };

    private handleKeyDown(event: KeyboardEvent) {
        event.stopImmediatePropagation();

        const keyListeners = {
            Tab: this.handleTabDown.call(this, event)?.bind(this),
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
        document.body.style.paddingRight = window.innerWidth - document.body.offsetWidth + 'px';
        document.body.style.overflow = 'hidden';

        this.element.insertAdjacentHTML("afterbegin", this.getContentTemplate(this.config.content));
        this.config.withHeader && this.element.querySelector('.modal__overlay > .modal__body')?.insertAdjacentHTML("afterbegin", this.getHeaderTemplate(this.config.title, this.config.withCloseButton));
    }

    private setDisabled(disabled: boolean) {
        this.element.querySelector(".modal__overlay")?.classList.toggle("modal__overlay--disabled", disabled);
        this.config.disabled = disabled;
    }

    private getContentTemplate(content: string) {
        return `
                <div class='modal__overlay'>
                    <div class="modal__body">
                        ${content}
                    </div>
                </div>
        `;
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
