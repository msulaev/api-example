import test, { expect } from "@playwright/test";
import { StatusCode } from "./StatusCode";

type ResponseProps<Type> = {
    statusCode: number,
    body: Type,
    headers: Record<string, string>
}

export class Response<Type extends Record<string, unknown> | string> {
    public statusCode: StatusCode;
    public body: Record<string, unknown> | string;
    public headers: Record<string, string>;

    constructor({ statusCode, headers, body }: ResponseProps<Type>) {
        this.statusCode = new StatusCode(statusCode);
        this.headers = headers;
        this.body = body;
    }

    public async shouldBe(expectedBody: Type) {
        await test.step('Response body should be as expected', async () => {
            if (typeof this.body === 'string') {
                throw new Error('Response body is a string, cannot compare to object');
            }
            expect(this.body as Record<string, unknown>).toEqual(expect.objectContaining(expectedBody));
        });
    }

    public async shouldContain(expectedSubstring: string) {
        await test.step('Response body should contain expected values', async () => {
            expect(this.body).toContain(expectedSubstring);
        });
    }

    public async shouldHave<Key extends keyof Type>({ property, witValue }: { property: Key, witValue: string }) {
        await test.step('Response body should contain property with value', async () => {
            expect(this.body[String(property)]).toEqual(witValue);
        });
    }
}