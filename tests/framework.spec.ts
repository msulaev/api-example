import { expect, test } from '@playwright/test';

test.describe('AUTH', () => {
    //test.use({ storageState: "./state.json" });
    let csrf;
    let cookie;
    let userId;
    type extraHeader = {
        'x-csrf-token': string,
        cookie: string
    };
    let extraHeaders: extraHeader;
    let userParams;

    test.beforeEach(async ({ request }) => {
        userParams = {
            username: '1bblala',
            firstName: '1bblala',
            lastName: '1bblala',
            email: 'bb1lala@gmail.com',
            password: '1bblala',
        }
        const userCreateResponse = await request.post('user', { data: userParams });
        await expect(userCreateResponse).toBeOK();

        const login = await request.post('user/login', { data: { email: userParams.email, password: userParams.password } });
        csrf = login.headers()['x-csrf-token'];
        cookie = login.headers()['set-cookie'];
        extraHeaders = { 'x-csrf-token': csrf, cookie: cookie };
        userId = (await login.json() as { user_id: number }).user_id;
        extraHeaders = { 'x-csrf-token': csrf, cookie: cookie };
       // request.storageState({ path: "./state.json" });
    });

    test('Auth with correct credentials', async ({ request }) => {
        const userIdResp = await request.get(`user/auth`, { headers: extraHeaders });
        const actualId = (await userIdResp.json() as { user_id: number }).user_id;
        expect(actualId).toEqual(userId);

    });

    test('get user', async ({ request }) => {
        const userIdResp = await request.get(`user/${userId}`, { headers: extraHeaders });
        expect(await userIdResp.json()).toEqual(expect.objectContaining({ "email": "bb1lala@gmail.com" }));
    });

    test.afterEach(async ({ request }) => {
        const deleteResp = await request.delete(`user/${userId}`, { headers: extraHeaders });
        await expect(deleteResp).toBeOK();
    });
});
