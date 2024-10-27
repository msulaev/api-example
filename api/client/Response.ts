import test, { expect } from "@playwright/test";
import { StatusCode } from "./StatusCode";
import Ajv, { JSONSchemaType } from "ajv";

type ResponseProps<Type> = {
    statusCode: number,
    body: Type,
    headers: Record<string, string>
}

export class Response<Type extends Record<string, unknown> | string> {

    public statusCode: StatusCode;
    public body: Type;
    public headers: Record<string, string>;
    private schema: JSONSchemaType<Type> | undefined;
    private ajv = new Ajv();

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

    public async shouldHaveValidSchema() {
        return test.step('Response body should have valid schema', async () => {

        });
    }

    public setSchema(schema: JSONSchemaType<Type>) {
        this.schema = schema;
        if (!this.schema) {
            throw new Error('No schema provided');
        }
        const validate = this.ajv.compile(this.schema);
        validate(this.body);
        expect(validate.errors).toBe(null);
    }
}