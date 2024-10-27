export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

export type RequestOpetins = {
    body?: Record<string, unknown>,
    param?: Record<string, string>
}

export type ApiClient = {
    sendRequest(
        method: HttpMethod,
        url: string,
        options?: RequestOpetins
    ): Promise<Response>
}