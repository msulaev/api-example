import { expect, test } from '@playwright/test';

const StatusCodes = {
    'OK': 200,
    'CREATED': 201,
    'NO_CONTENT': 204,
    'BAD_REQUEST': 400,
    'UNAUTHORIZED': 401,
    'FORBIDDEN': 403,
    'NOT_FOUND': 404,
    'CONFLICT': 409,
    'INTERNAL_SERVER_ERROR': 500
} as const;

export class StatusCode {

    constructor(private code: number) {
    }

    public async shouldBe(expected: number | keyof typeof StatusCodes): Promise<void> {
        test.step('Check status code', async () => {
            const actualCode = typeof expected === 'number' ? expected : StatusCodes[expected];
            expect(actualCode).toEqual(this.code);
        });
    }
}