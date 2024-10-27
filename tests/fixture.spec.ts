import { test } from '../fixture/fixture';

test.describe('AUTH', () => {
    test('GET /auth', async ({ authApi }) => {
        const userIdResponse = await authApi.user.authUser();
        await userIdResponse.statusCode.shouldBe(200);
    });

    test('GET /user/:id', async ({ authApi }) => {
        const userInfoResponse = await authApi.user.userInfo(authApi.authUser!.id);
        await userInfoResponse.statusCode.shouldBe(200);
        await userInfoResponse.shouldHaveValidSchema();
    });
});