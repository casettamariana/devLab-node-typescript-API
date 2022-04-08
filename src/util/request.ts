import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface RequestConfig extends AxiosRequestConfig {}
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Response<T = any> extends AxiosResponse<T> {}

export interface ResponseError<T = any> extends AxiosError {
  config: RequestConfig;
  code?: string;
  request?: any;
  response?: Response<T>;
  isAxiosError: boolean;
  toJSON: () => object;
}

export class Request {
  constructor(private request = axios) {}

  public get<T>(url: string, config: RequestConfig = {}): Promise<Response<T>> {
    return this.request.get<T, Response<T>>(url, config);
  }

  public static isRequestError(error: Error): boolean {
    return !!(
      (error as ResponseError).response &&
      (error as ResponseError).response?.status
    );
  }

  public static extractErrorData(
    error: unknown
  ): Pick<Response, 'data' | 'status'> {
    const responseError = error as ResponseError;
    if (responseError.response && responseError.response.status) {
      return {
        data: responseError.response.data,
        status: responseError.response.status,
      };
    }
    throw Error(`The error ${error} is not a Request Error`);
  }
}
