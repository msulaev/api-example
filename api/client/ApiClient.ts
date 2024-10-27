import { Response } from './Response'

export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

export type RequestOptions = {
    body?: Record<string, unknown> | string,
    param?: Record<string, string>
}

export type ApiClient = {
    sendRequest<Type extends Record<string, unknown> | string>(
        method: HttpMethod,
        url: string,
        options?: RequestOptions
    ): Promise<Response<Type>>

    setExtraHeaders(headers: Record<string, string>): void
}