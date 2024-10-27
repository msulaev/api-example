import { test } from '@playwright/test';
import { Api } from '../api/Api';
import { HttpMethod } from '../api/client/ApiClient';


test.describe('API tests', () => {
    test('GET /hello', async ({ request }) => {
        const name = 'someone';
        const response = await new Api(request).hello.get({ name: name });
        await response.statusCode.shouldBe(200);
        await response.shouldBe({ answer: 'Hello, someone' });
    });

    test('GET /get500', async ({ request }) => {
        const response = await new Api(request).get500.get();
        await response.statusCode.shouldBe(500);
    });

    const EXPECTED_METHODS = ['get', 'post', 'delete', 'patch'] as const;
    EXPECTED_METHODS.forEach((methodName) => {
        test.only(`GET check method ${methodName}`, async ({ request }) => {
            const response = await new Api(request).checkType.check({ method: methodName.toUpperCase() as unknown as HttpMethod });
            await response.statusCode.shouldBe(200);
            await response.shouldContain(methodName.toUpperCase());
        });
    });
});