import { HomeView } from "@/pages/Home";

export class App {
    private readonly home: HomeView;

    constructor(root: HTMLElement | null) {
        if (!root) throw new Error("Root container not found");

        this.home = new HomeView(root);
    }
}