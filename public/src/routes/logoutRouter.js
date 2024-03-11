"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const logoutRouter = (0, express_1.Router)();
logoutRouter
    .route("/api/logout")
    .post(authMiddleware_1.default, (req, res) => {
    res
        .clearCookie("access_token")
        .clearCookie("refresh_token")
        .status(200)
        .send({
        message: true,
    });
});
exports.default = logoutRouter;
