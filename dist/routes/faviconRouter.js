"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const faviconPath = path_1.default.join(__dirname, "../../public/pokeball.ico");
const faviconRouter = (0, express_1.Router)();
faviconRouter.get("/favicon.ico", (req, res) => {
    res.sendFile(faviconPath);
});
exports.default = faviconRouter;
