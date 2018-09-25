"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractApi_1 = __importDefault(require("./AbstractApi"));
class Api extends AbstractApi_1.default {
    async resolve(response) {
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
        return await response.json();
    }
}
exports.default = Api;
class FetchError extends Error {
}
