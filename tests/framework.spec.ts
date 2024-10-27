import { test } from '../fixture/fixture';
import { faker } from '@faker-js/faker';
import { Api } from '../api/Api';
import { HttpMethod } from '../api/client/ApiClient';
import { UserParams } from '../api/user/UserParams';


test.describe('API tests', () => {
    test('GET /hello', async ({ api }) => {
        const name = 'someone';
        const response = await api.hello.get({ name: name });
        await response.statusCode.shouldBe(200);
        await response.shouldBe({ answer: `Hello, someone` });
        await response.shouldHave({ property: 'answer', witValue: `Hello, someone` });
    });

    test('GET /get500', async ({ api }) => {
        const response = await api.get500.get();
        await response.statusCode.shouldBe(500);
    });

    const EXPECTED_METHODS = ['get', 'post', 'delete', 'patch'] as const;
    EXPECTED_METHODS.forEach((methodName) => {
        test(`GET check method ${methodName}`, async ({ api }) => {
            const response = await api.checkType.check({ method: methodName.toUpperCase() as unknown as HttpMethod });
            await response.statusCode.shouldBe(200);
            await response.shouldContain(methodName.toUpperCase());
        });
    });
});

test.describe('AUTH', () => {
    let userId: number;
    let userParam: UserParams;
    test.beforeEach('Create user', async ({ api }) => {
        userParam = {
            username: faker.internet.username(),
            password: faker.internet.password(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
        }

        const createUserResponse = await api.user.createUser(userParam);
        await createUserResponse.statusCode.shouldBe(200);
        userId = +(createUserResponse.body.id)

        await api.auth(userParam);

    });
    test('GET /auth', async ({ api }) => {
        const userIdResponse = await api.user.authUser();
        await userIdResponse.statusCode.shouldBe(200);
        userId = userIdResponse.body['user_id'];
    });

    test('GET /user/:id', async ({ api }) => {
        const userInfoResponse = await api.user.userInfo(userId);
        await userInfoResponse.statusCode.shouldBe(200);
        const { password, ...userParamWithoutPassword } = userParam;
        await userInfoResponse.shouldBe({ ...userParamWithoutPassword, id: userId.toString() });
        await userInfoResponse.shouldHaveValidSchema();
    });

    test.afterEach(async ({ api }) => {
        const response = await api.user.delete(userId);
        await response.shouldBe({ success: '!' });
    });
});