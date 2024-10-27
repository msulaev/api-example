import { ApiClient, HttpMethod, RequestOptions } from "./ApiClient";
import { APIRequestContext, test } from '@playwright/test';
import { Response } from "./Response";

export class PlaywrightApiClient implements ApiClient {

    constructor(private request: APIRequestContext) {
    }

    public sendRequest(
        method: HttpMethod,
        url: string,
        options?: RequestOptions): Promise<Response> {
        return test.step(
            `Request ${method} ${url}`,
            async () => {
                const response = await this.request[(method.toLowerCase()) as 'get'](url, {
                    data: options?.body,
                    params: options?.param,
                });
                let responseBody: Record<string, any> | string;

                try {
                    responseBody = await response.json();
                } catch (ignored) {
                    responseBody = await response.text();
                }

                return new Response({
                    statusCode: response.status(),
                    body: responseBody,
                    headers: response.headers(),
                });
            });
    }
}

