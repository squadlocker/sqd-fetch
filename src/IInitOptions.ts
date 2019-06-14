import { AuthSchemes } from './Enums';
import ISqdProvider from './ISqdProvider';

export default interface IInitOptions {
	getToken?: (...args: any[]) => string;
	authScheme?: AuthSchemes;
	sqdProviders?: ISqdProvider[];
}
