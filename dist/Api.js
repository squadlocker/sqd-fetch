"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractApi_1 = __importDefault(require("./AbstractApi"));
class Api extends AbstractApi_1.default {
    async resolve(response, handleLoading) {
        if (!!this.loadingProvider && handleLoading) {
            this.loadingProvider.onResolve();
        }
        if (response.status === 204) {
            return { status: 204, success: true };
        }
        return await response.json();
    }
}
exports.default = Api;
class FetchError extends Error {
}
