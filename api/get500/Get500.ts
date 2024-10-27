import test from "@playwright/test";
import { ApiRoute } from "../ApiRoute";

export class Get500 extends ApiRoute {
    public async get() {
        return test.step('Sendignt GET', async () => {
            return this.apiClient.sendRequest('GET', this.url);
        });
    }
}