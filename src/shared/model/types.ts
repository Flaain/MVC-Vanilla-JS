import { ApiException } from "../api/exception";

export type ObserverSubscriber = <T>(updateType: string, data: T) => void;
export type RequestOptionsWithoutBody = Omit<RequestOptions, 'body'>;
export type RequestBody = Record<string, any> | FormData | string; 
export type InterceptorResponseSuccessFunction = <T>(response: ApiBaseResult<T>) => ApiBaseResult<T>['data'] | Promise<ApiBaseResult<T>['data']>
export type InterceptorResponseFailureFunction = (error: ApiException) => any;
export type InterceptorRequestSuccessFunction = (options: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type InterceptorRequestFailureFunction = (error: ApiException) => any;
export type ApiSearchParams = Record<string, undefined | null | string | number | boolean | Array<string | number | boolean>>;

export interface ModalConfig {
    id?: string;
    title?: string;
    withCloseButton?: boolean;
    withHeader?: boolean;
    bodyClassName?: string;
    content: string;
    closeHandler?: (modal?: ModalConfig) => void;
}

export interface Meta {
    total_items: number,
    total_pages: number,
    current_page: number,
    per_page: number,
    remaining_count: number
}

export interface WithMeta<T> {
    meta: Meta,
    items: Array<T>
}

export interface IView {
    remove(): void;
}

export enum ApiExceptionCode {
    INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
    FORM = 'FORM'
}

export interface IApiException {
    message: string;
    config: RequestConfig;
    response: ApiResponseFailureResult;
}

export interface BaseApi {
    baseUrl: string;
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
}

export interface ApiBaseResult<T> {
    success: Response['ok'];
    status: Response['status'];
    statusText: Response['statusText'];
    url: URL;
    data: T
}

export interface ApiBaseSuccessData {
    message: string;
}

export interface ApiBaseFailureData {
    message: string;
    timestamp: string;
    errorCode?: ApiExceptionCode;
    errors?: Array<{ path: string; message: string }>;
}

export interface ApiResponseFailureResult extends ApiBaseResult<ApiBaseFailureData> {
    headers: Record<string, string>;
}

export interface RequestConfig extends RequestInit {
    url: URL;
    timestamp?: string;
    _retry?: boolean;
    headers?: Record<string, string>;
    params?: ApiSearchParams;
}

export interface RequestOptions extends Omit<RequestInit, 'method'> {
    headers?: Record<string, string>;
    params?: ApiSearchParams;
}

export interface RequestInterceptor {
  onSuccess?: InterceptorRequestSuccessFunction;
  onFailure?: InterceptorRequestFailureFunction;
}

export interface InterceptorsHandlers {
    request: {
        use: (onSuccess?: InterceptorRequestSuccessFunction, onFailure?: InterceptorRequestFailureFunction) => RequestInterceptor;
        eject: (interceptor: RequestInterceptor) => boolean;
    };
    response: {
        use: (onSuccess?: InterceptorResponseSuccessFunction, onFailure?: InterceptorResponseFailureFunction) => ResponseInterceptor;
        eject: (interceptor: ResponseInterceptor) => boolean;
    }
}

export interface ResponseInterceptor {
  onSuccess?: InterceptorResponseSuccessFunction;
  onFailure?: InterceptorResponseFailureFunction;
}

export interface Interceptors {
    request: Set<RequestInterceptor>;
    response: Set<ResponseInterceptor>;
}