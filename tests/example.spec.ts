import { test, expect } from '@playwright/test';

test.describe('API tests', () => {
  test('GET /hello', async ({ request }) => {
    const response = (await request.get('hello'));
    const body = await response.json() as { answer: string };
    expect(body.answer).toEqual('Hello, someone');
  });

  test('GET /hello with QS', async ({ request }) => {
    const name = 'John';
    const response = (await request.get(`hello?name=${name}`));
    const body = await response.json() as { answer: string };
    expect(body.answer).toEqual(`Hello, ${name}`);
  });

  test('GET /get_500', async ({ request }) => {
    const response = (await request.get('get_500'));
    expect(response.status()).toEqual(500);
  });

  const EXPECTED_METHODS = ['get', 'post', 'delete', 'patch'] as const;
  EXPECTED_METHODS.forEach((method) => {
    test(`GET check method ${method}`, async ({ request }) => {
      const response = (await request[method]('check_type'));
      const body = await response.text()
      expect(body).toContain(method.toUpperCase());
    });
  });
});

test.describe('AUTH', () => {
  test.use({ storageState: "./state.json" });
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
    request.storageState({ path: "./state.json" });
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