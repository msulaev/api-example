import { APIRequestContext } from '@playwright/test';
import { PlaywrightApiClient } from './client/PlaywrightApiClient';
import { Get500 } from './get500/Get500';
import { CheckTypes } from './check-types/CheckTypes';
import { Hello } from './Hello/Hello';

export class Api {
    private apiClient: PlaywrightApiClient;
    public hello: Hello;
    public get500: Get500;
    public checkType: CheckTypes;

    constructor(private request: APIRequestContext) {
        this.apiClient = new PlaywrightApiClient(this.request);
        this.hello = new Hello(this.apiClient, 'hello');
        this.get500 = new Get500(this.apiClient, 'get_500');
        this.checkType = new CheckTypes(this.apiClient, 'check_type');
    }
}