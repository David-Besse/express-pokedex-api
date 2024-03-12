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
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../utils/generateToken");
const prisma = new client_1.PrismaClient();
const loginRouter = (0, express_1.Router)();
loginRouter.post("/api/login", [
    (0, express_validator_1.body)("email").trim().isEmail().withMessage("Email: is not valid"),
    (0, express_validator_1.body)("password")
        .trim()
        .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
        .withMessage("Password: is not valid"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const findUser = yield prisma.user.findUnique({
        where: { email: email },
    });
    if (!findUser) {
        return res.status(401).json({ message: "Invalid email" });
    }
    const isPasswordCorrect = yield bcrypt_1.default.compare(password, findUser.password);
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid password" });
    }
    const accessToken = (0, generateToken_1.generateAccessToken)(findUser.id);
    const refreshToken = (0, generateToken_1.generateRefreshToken)(findUser.id);
    res
        .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        signed: true,
    })
        .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        signed: true,
    })
        .status(200)
        .json({ email: findUser.email });
    return;
}));
exports.default = loginRouter;
