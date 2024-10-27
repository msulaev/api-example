import test, { expect } from "@playwright/test";
import { StatusCode } from "./StatusCode";

type ResponseProps = {
    statusCode: number,
    body: Record<string, unknown> | string
    headers: Record<string, string>
}

export class Response {
    public statusCode: StatusCode;
    public body: Record<string, unknown> | string;
    public headers: Record<string, string>;

    constructor({ statusCode, headers, body }: ResponseProps) {
        this.statusCode = new StatusCode(statusCode);
        this.headers = headers;
        this.body = body;
    }

    public async shouldBe(expectedBody: Record<string, unknown>) {
        await test.step('Response body should be as expected', async () => {
            if (typeof this.body === 'string') {
                throw new Error('Response body is a string, cannot compare to object');
            }
            expect(this.body).toEqual(expect.objectContaining(expectedBody));
        });
    }

    public async shouldContain(expectedSubstring: string) {
        await test.step('Response body should contain expected values', async () => {
            expect(this.body).toContain(expectedSubstring);
        });
    }

    public async shouldHave({ property, witValue }: { property: string, witValue: string }) {
        await test.step('Response body should contain property with value', async () => {
            expect(this.body[property]).toEqual(witValue);
        });
    }
}