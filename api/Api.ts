import test, { APIRequestContext } from '@playwright/test';
import { PlaywrightApiClient } from './client/PlaywrightApiClient';
import { Get500 } from './get500/Get500';
import { CheckTypes } from './check-types/CheckTypes';
import { Hello } from './Hello/Hello';
import { User } from './user/User';
import { UserParams } from './user/UserParams';

export class Api {
    private apiClient: PlaywrightApiClient;
    public hello: Hello;
    public get500: Get500;
    public checkType: CheckTypes;
    public user: User;

    constructor(private request: APIRequestContext) {
        this.apiClient = new PlaywrightApiClient(this.request);
        this.hello = new Hello(this.apiClient, 'hello');
        this.get500 = new Get500(this.apiClient, 'get_500');
        this.checkType = new CheckTypes(this.apiClient, 'check_type');
        this.user = new User(this.apiClient, 'user');
    }

    public async auth(userParam: UserParams) {
        return test.step('Auth', async () => {
            const loginResponse = await this.user.login(userParam);
            await loginResponse.statusCode.shouldBe(200);
            this.apiClient.setExtraHeaders({
                'x-csrf-token': loginResponse.headers['x-csrf-token'],
                cookie: loginResponse.headers['Set-Cookie']
            })
        });
    }
}