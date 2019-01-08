import { AuthSchemes } from './Enums';
import ILoadingProvider from './ILoadingProvider';

export default interface IInitOptions {
	getToken?: (...args: any[]) => string;
	authScheme?: AuthSchemes;
	loadingProvider?: ILoadingProvider;
}
