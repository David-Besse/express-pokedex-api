"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken_1 = require("../utils/generateToken");
const getErrorMessage_1 = __importDefault(require("../utils/getErrorMessage"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.path === "/api/login" || req.path === "/api/logout") {
        return next();
    }
    const accessToken = req.signedCookies["access_token"];
    const refreshToken = req.signedCookies["refresh_token"];
    try {
        let accessTokenVerified;
        if (accessToken) {
            accessTokenVerified = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        }
        let refreshTokenVerified;
        if (refreshToken) {
            refreshTokenVerified = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        }
        if (!refreshTokenVerified) {
            res.status(401).send("No refresh token found in the request");
            return next();
        }
        if (!accessTokenVerified) {
            const newAccessToken = (0, generateToken_1.generateAccessToken)(refreshToken.userId);
            res.cookie("access_token", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict",
                signed: true,
            });
        }
        return next();
    }
    catch (error) {
        return res.status(401).send({ error: (0, getErrorMessage_1.default)(401) });
    }
});
exports.default = authMiddleware;
