export type ProductSource = 'products' | 'favorites';

export interface Product {
    id: number;
    title: string;
    image: string;
    price: number;
    description: string;
    brand: string;
    model: string;
    color: string;
    category: string;
    discount: number;
}

export interface ProductViewProps {
    parent: HTMLElement;
    product: Product;
    source: ProductSource;
    isFavorited?: boolean;
    classes?: string | Array<string>;
    isLast?: boolean;
}