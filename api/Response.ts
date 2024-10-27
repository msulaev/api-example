type ResponseProps = {
    statusCode: number,
    body: Record<string, unknown> | string
    headers: Record<string, string>
}

export class Response {
    public statusCode: number;
    public body: Record<string, unknown> | string;
    public headers: Record<string, string>;

    constructor({ statusCode, body, headers }: ResponseProps) {
        this.statusCode = statusCode;
        this.body = body;
        this.headers = headers;
    }
}