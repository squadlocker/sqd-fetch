import IApi from './IApi';
import { camelizeObject, hyphenizeObject } from './util/camelizeObject';

export default class Api implements IApi {
	apiRoot: string;
	apiRequiresAuth: boolean;

	constructor(apiRoot: string, requiresAuth: boolean) {
		this.apiRoot = apiRoot;
		this.apiRequiresAuth = requiresAuth;
	}

	private async fetch(url: string, options?: object, apiUsesHyphens?: boolean): Promise<any> {
		if (!options) {
			options = {};
		}

		type thing = {derp: string};
		// TODO: hyphenize body if !!body && apiUsesHyphens
		const root = this.apiRoot.endsWith('/') ? this.apiRoot : this.apiRoot + '/';
		const request = new Request(root + url, options);

		// return await fetch(request);
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

	async get(url: string, options?: object, apiUsesHyphens?: boolean): Promise<any> {

	}
}

class FetchError extends Error {
	response?: any;
}
