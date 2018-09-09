import IApi, { FetchMethod } from './IApi';
import { FetchOptions, InternalFetch } from './FetchOptions';
import { camelizeObject, hyphenizeObject } from './util/camelizeObject';
import { HttpMethods } from './Enums';

export default class Api implements IApi {
	readonly apiRoot: string;
	readonly apiRequiresAuth: boolean;
	// TODO: implement auth / token management

	constructor(apiRoot: string, requiresAuth: boolean) {
		this.apiRoot = apiRoot;
		this.apiRequiresAuth = requiresAuth;
	}

	private async fetch(url: string, options: FetchOptions & InternalFetch, apiUsesHyphens?: boolean): Promise<any> {
		// when working with certain frameworks, e.g. Rails, apis will expect and return objects where properties
		// are in hypen-case. 
		if (!!options.body && apiUsesHyphens) {
			options.body = hyphenizeObject(options.body);
		}

		const root = this.apiRoot.endsWith('/') ? this.apiRoot : this.apiRoot + '/';
		const request = new Request(root + url, options);

		const response = await fetch(request);
		if (!response.ok) {
			// allows us to handle error status codes AND custom error responses in a catch
			// block we pass in an Error object so that we can have access to the stacktrace.

			// In some catch block, access the status with err.response.status
			// access any custom response body with err.response.json().then(json => {...})
			const e = new FetchError;
			e.response = response;
			return Promise.reject(e);
		}

		if (response.status === 204) {
			return { status: 204, success: true };
		}

		const json = await response.json();
		if (!apiUsesHyphens) return json;
		return camelizeObject(json);
	}

	async get(url: string, options?: FetchOptions, apiUsesHyphens?: boolean): Promise<any> {
		const fetchOptions: InternalFetch = this.createInternalFetch(HttpMethods.GET, options);
		return this.fetch(url, fetchOptions, apiUsesHyphens);
	}

	async post(url: string, options?: FetchOptions, apiUsesHyphens?: boolean): Promise<any> {
		const fetchOptions: InternalFetch = this.createInternalFetch(HttpMethods.POST, options);
		return this.fetch(url, fetchOptions, apiUsesHyphens);
	}

	async put(url: string, options?: FetchOptions, apiUsesHyphens?: boolean): Promise<any> {
		const fetchOptions: InternalFetch = this.createInternalFetch(HttpMethods.PUT, options);
		return this.fetch(url, fetchOptions, apiUsesHyphens);
	}

	async patch(url: string, options?: FetchOptions, apiUsesHyphens?: boolean): Promise<any> {
		const fetchOptions: InternalFetch = this.createInternalFetch(HttpMethods.PATCH, options);
		return this.fetch(url, fetchOptions, apiUsesHyphens);
	}

	async delete(url: string, options?: FetchOptions, apiUsesHyphens?: boolean): Promise<any> {
		const fetchOptions: InternalFetch = this.createInternalFetch(HttpMethods.DELETE, options);
		return this.fetch(url, fetchOptions, apiUsesHyphens);
	}

	private createInternalFetch(method: HttpMethods, options?: FetchOptions): InternalFetch {
		return options ? { ...options, method } : { method };
	}
}

class FetchError extends Error {
	response?: any;
}
