import test from "@playwright/test";
import { Api } from "../api/Api";
import { UserParams } from "../api/user/UserParams";
import { faker } from '@faker-js/faker';

export class AuthApi extends Api {
    public authUser: UserParams | undefined;

    public async authenticateWithRandomUser() {
        await test.step('Authenticate with random user', async () => {
            const userParam = {
                username: faker.internet.username(),
                password: faker.internet.password(),
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
            }
            const createUserResponse = await this.user.createUser(userParam);
            await createUserResponse.statusCode.shouldBe(200);
            const userId = +(createUserResponse.body.id);
            this.authUser = {
                ...userParam,
                id: userId,
            }
            await super.auth(this.authUser);
        });
    }
}