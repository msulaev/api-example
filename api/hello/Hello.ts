import { ApiRoute } from "../ApiRoute";
import { test } from '@playwright/test';

export class Hello extends ApiRoute {

    public async get(param?: { name?: string }) {
        return test.step('Sendignt GET', async () => {
            return this.apiClient.sendRequest<{ answer: string }>('GET', this.url, { param });
        });
    }
}
