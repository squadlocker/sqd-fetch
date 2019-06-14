import IApi from './IApi';
import AbstractApi from './AbstractApi';
import IRequestOptions from './IRequestOptions';
export default class Api extends AbstractApi implements IApi {
    protected resolve(response: Response, options: IRequestOptions): Promise<any>;
}
//# sourceMappingURL=Api.d.ts.map