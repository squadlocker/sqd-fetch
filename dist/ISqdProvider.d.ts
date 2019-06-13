export default interface ISqdProvider {
    onBegin: (options: any) => {
        return(options: any): any;
    };
    onResolve: (options: any, response: any) => {
        return(options: any, response: any): any;
    };
    onFail: (options: any, response: any, error: any) => {
        return(options: any, response: any, error: any): any;
    };
}
//# sourceMappingURL=ISqdProvider.d.ts.map