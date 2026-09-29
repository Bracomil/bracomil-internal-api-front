type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
type ErrorInterceptor = (error: any) => any | Promise<any>;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];
const errorInterceptors: ErrorInterceptor[] = [];

export function addRequestInterceptor(fn: RequestInterceptor) {
    requestInterceptors.push(fn);
}

export function addResponseInterceptor(fn: ResponseInterceptor) {
    responseInterceptors.push(fn);
}

export function addErrorInterceptor(fn: ErrorInterceptor) {
    errorInterceptors.push(fn);
}

export async function fetchWithInterceptors(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
    try {
        let modifiedInit = { ...init };
        for (const interceptor of requestInterceptors) {
            modifiedInit = await interceptor(modifiedInit);
        }
        console.log(requestInterceptors)
        console.log(input, modifiedInit)

        let response = await fetch(input, modifiedInit);

        for (const interceptor of responseInterceptors) {
            response = await interceptor(response);
        }

        return response;
    } catch (error) {
        let handledError = error;
        for (const interceptor of errorInterceptors) {
            handledError = await interceptor(handledError);
        }
        throw handledError;
    }
}