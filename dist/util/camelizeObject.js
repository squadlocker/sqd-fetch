"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camelcase_1 = __importDefault(require("camelcase"));
const decamelize_1 = __importDefault(require("decamelize"));
const hyphenize = arg => decamelize_1.default(arg, '-');
const isObject = x => x !== null && typeof x === 'object';
const recursivelyTransformObj = (obj, formatFn) => {
    const out = obj ? [] : {};
    for (const key of Object.keys(obj)) {
        const transformedKey = formatFn(key);
        if (isObject(obj[key])) {
            out[transformedKey] = recursivelyTransformObj(obj[key], formatFn);
        }
        else {
            out[transformedKey] = obj[key];
        }
    }
    return out;
};
exports.camelizeObject = (obj) => recursivelyTransformObj(obj, camelcase_1.default);
exports.hyphenizeObject = (obj) => recursivelyTransformObj(obj, hyphenize);
