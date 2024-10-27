import { Api } from '../api/Api';
import { test as base } from '@playwright/test';
import { AuthApi } from './authApi';

type CustomFixtures = {
    api: Api,
    authApi: AuthApi,
}

export const test = base.extend<CustomFixtures>({
    api: async ({ request }, use) => {
        await use(new Api(request));
    },
    authApi: async ({ request }, use) => {
        const api = new AuthApi(request);
        await api.authenticateWithRandomUser();

        await use(api);

        if (api.authUser && api.authUser.id !== undefined) {
            await api.user.delete(api.authUser.id);
        }
    }
});

export { expect } from '@playwright/test';