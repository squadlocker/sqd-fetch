import IApi from './IApi';
import AbstractApi from './AbstractApi';
export default class Api extends AbstractApi implements IApi {
    protected resolve(response: Response): Promise<any>;
}
//# sourceMappingURL=Api.d.ts.map