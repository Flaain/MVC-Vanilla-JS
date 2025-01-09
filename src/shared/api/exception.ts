import { ApiResponseFailureResult, IApiException, RequestConfig } from "../model/types";

export class ApiException extends Error implements IApiException {
    readonly config: RequestConfig;
    readonly response: ApiResponseFailureResult;

    constructor(error: IApiException) {
        super(error.message);

        this.config = error.config;
        this.response = error.response;
    }
}