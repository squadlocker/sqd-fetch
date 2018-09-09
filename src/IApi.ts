export interface FetchMethod {
	(url: string, options?: object, apiUsesHyphens?: boolean): Promise<any>;
}

export default interface IApi {
	apiRoot: string;
	apiRequiresAuth: boolean;

	get: FetchMethod;
	post: FetchMethod;
	put: FetchMethod;
	patch: FetchMethod;
	delete: FetchMethod;
}
