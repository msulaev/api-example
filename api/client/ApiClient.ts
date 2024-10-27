import { Response } from './Response'

export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

export type RequestOptions = {
    body?: Record<string, unknown>,
    param?: Record<string, string>
}

export type ApiClient = {
    sendRequest(
        method: HttpMethod,
        url: string,
        options?: RequestOptions
    ): Promise<Response>
}