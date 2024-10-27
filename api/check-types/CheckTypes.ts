import test from "@playwright/test";
import { ApiRoute } from "../ApiRoute";
import { HttpMethod } from "../client/ApiClient";

export class CheckTypes extends ApiRoute {
    public async check({ method }: { method: HttpMethod }) {
        return test.step(`GET check method ${method}`, async () => {
            return this.apiClient.sendRequest(method, this.url);
        });
    }
}