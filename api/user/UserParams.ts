import { JSONSchemaType } from 'ajv';

export type UserParams = {
    id?: string | number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
}

export const UserInfoShema: JSONSchemaType<UserParams> = {
    title: 'User info',
    type: 'object',
    properties: {
        id: { type: ['string', 'number'], nullable: true },
        username: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string', nullable: true },
    },
    required: ['username', 'firstName', 'lastName', 'email'],
}