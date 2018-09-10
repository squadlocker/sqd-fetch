"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthService {
    constructor(authScheme, getToken) {
        this.authScheme = authScheme;
        this._getToken = getToken;
    }
    setToken() {
        this.token = this._getToken();
    }
}
exports.default = AuthService;
