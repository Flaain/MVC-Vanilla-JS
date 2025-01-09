import { Product } from "@/entities/Product/model/types";
import { api } from "@/shared/api";
import { WithMeta } from "@/shared/model/types";

export const homeApi = {
    getProducts: ({ limit = 10, page = 1, signal }: { limit?: number; page: number; signal?: AbortSignal }) => api.get<WithMeta<Product>>(`${import.meta.env.VITE_SERVER_URL}/products`, { params: { limit, page }, signal }),
};
