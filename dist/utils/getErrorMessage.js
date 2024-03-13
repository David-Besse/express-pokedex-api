"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getErrorMessage = (status) => {
    switch (status) {
        case 400:
            return "Bad request";
        case 401:
            return "Unauthorized";
        case 404:
            return "Not found";
        case 500:
            return "Internal server error";
        default:
            return "Unknown error";
    }
};
exports.default = getErrorMessage;
