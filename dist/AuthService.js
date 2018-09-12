"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthService {
    constructor(authScheme, retrieveToken) {
        this.getToken = () => this._token;
        this.authScheme = authScheme;
        this._retrieveToken = retrieveToken;
    }
    setToken() {
        this._token = this._retrieveToken();
    }
}
exports.default = AuthService;
