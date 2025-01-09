import { API } from "./api";

export const api = new API({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    headers: { "content-type": "application/json" },
});