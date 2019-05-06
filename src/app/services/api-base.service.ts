import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';

@Injectable()
export abstract class ApiBase {
    protected abstract routePath: string;
    protected abstract apiBaseUrl: string;

    constructor(protected httpClient: HttpClient) { }

    protected get<TResult>(path: string, options?: ApiBase.Options): Promise<TResult> {
        return new Promise<TResult>((resolve, reject)=> {
            const url = this.buildURL(path);

            options = this.prepareOptions(options);

            return this.httpClient.get<TResult>(url, options)
                .subscribe(
                    result => resolve(result),
                    error => this.errorHandler(error, reject));
        });
    }

    protected post<TResult>(path: string, content?: any, options?: ApiBase.Options): Promise<TResult> {
        return new Promise<TResult>((resolve, reject) => {
            const url = this.buildURL(path);

            options = this.prepareOptions(options);

            this.httpClient.post<TResult>(url, content, options)
                .subscribe(
                    result => resolve(result),
                    error => this.errorHandler(error, reject));
        });
    }

    protected patch<TResult>(path: string, content?: any, options?: ApiBase.Options): Promise<TResult> {
        return new Promise<TResult>((resolve, reject) => {
            const url = this.buildURL(path);

            options = this.prepareOptions(options);

            this.httpClient.patch<TResult>(url, content, options)
                .subscribe(
                    result => resolve(result),
                    error => this.errorHandler(error, reject));
        });
    }

    protected delete<TResult>(path: string, content?: any, options?: ApiBase.Options): Promise<TResult> {
        return new Promise<TResult>((resolve, reject) => {
            const url = this.buildURL(path);

            options = this.prepareOptions(options);

            if (content) {
                (options as any).body = content;
            }
            
            this.httpClient.delete<TResult>(url, options)
                .subscribe(
                    result => resolve(result),
                    error => this.errorHandler(error, reject));
        });
    }

    private errorHandler(error: any, onError: (reason: any) => void): void {
        if (onError) {
            let errorMessage = new ApiBase.ErrorMessage();

            if (error instanceof HttpErrorResponse) {
                errorMessage = Object.assign<ApiBase.ErrorMessage, ApiBase.ErrorMessage>(errorMessage, error.error);
            }
            else {
                errorMessage.message = stringify(error);
            }

            onError(errorMessage);
        }
    }

    protected buildHeader(auth: boolean = true): { [header: string]: string | string[] } {
        var headers: any = {
            'Content-Type': 'application/json',
            'Accept-Language': 'pt-BR'
        };

        if (auth) {
            headers['Authorization'] = 'true';
        }
        
        return headers;
    }

    private prepareOptions(options: ApiBase.Options): ApiBase.Options {
        if (!options) {
            options = { };
        }

        if (options.headers) {
            options.headers = Object.assign(this.buildHeader(), options.headers);
        }
        else {
            options.headers = this.buildHeader();
        }

        return options;
    }

    protected buildURL(path: string): string {
        let url = this.apiBaseUrl;

        if (!url.endsWith("/")) {
            url += "/";
        }

        url += this.routePath;

        if (!path) {
            return url;
        }

        if (!url.endsWith("/") && !path.startsWith("/")) {
            url += "/";
        }

        return url + path;
    }
}

export namespace ApiBase {
    export type Options = {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    };

    export class ErrorMessage {
        public message: string;
        public error: string;
        public invalidField: string;
    }
}