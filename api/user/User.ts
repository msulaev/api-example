import test from "@playwright/test";
import { ApiRoute } from "../ApiRoute";
import { UserInfoShema, UserParams } from "./UserParams";

export class User extends ApiRoute {

    public async delete(userId: string | number) {
        return test.step('Sending DELETE', async () => {
            return this.apiClient.sendRequest<{ success: string }>('DELETE', `${this.url}/${userId}`);
        });
    }

    public async createUser(createUserParams: UserParams) {
        return test.step('Sending POST', async () => {
            return this.apiClient.sendRequest<{ id: string }>('POST', this.url, { body: createUserParams });
        });
    }

    public async login(loginParams: UserParams) {
        return test.step('Sending POST for login', async () => {
            const { email, password } = loginParams;
            return this.apiClient.sendRequest('POST', `${this.url}/login`, { body: { email, password } });
        });
    }

    public async authUser() {
        return test.step('Sending GET for auth', async () => {
            return this.apiClient.sendRequest<{ user_id: number }>('GET', `${this.url}/auth`);
        });
    }

    public async userInfo(userId: string | number) {
        return test.step('Sending GET for user info', async () => {
            const resp = await this.apiClient.sendRequest<UserParams>('GET', `${this.url}/${userId}`);
            resp.setSchema(UserInfoShema);
            return resp;
        });
    }
}