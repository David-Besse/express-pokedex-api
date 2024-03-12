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
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const getErrorMessage_1 = __importDefault(require("../utils/getErrorMessage"));
const pokemonsRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
pokemonsRouter
    .route("/api/pokemons/:id")
    .get(authMiddleware_1.default, [
    (0, express_validator_1.param)("id")
        .trim()
        .escape()
        .isInt({ min: 1, max: 999 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const pokemonId = parseInt(req.params.id);
    try {
        const pokemonFound = yield prisma.pokemon.findUnique({
            where: {
                id: pokemonId,
            },
        });
        yield prisma.$disconnect();
        if (!pokemonFound) {
            return res.status(404).json({ message: (0, getErrorMessage_1.default)(404) });
        }
        res.status(200).json(pokemonFound);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: (0, getErrorMessage_1.default)(500) });
        yield prisma.$disconnect();
        process.exit(1);
    }
}))
    .put(authMiddleware_1.default, [
    (0, express_validator_1.param)("id")
        .trim()
        .escape()
        .isInt({ min: 1, max: 999 })
        .withMessage("Invalid pokemon ID: must be an integer between 1 and 999"),
    (0, express_validator_1.body)("name")
        .optional()
        .trim()
        .escape()
        .isLength({ min: 1, max: 50 })
        .withMessage("Name must be between 1 and 50 characters"),
    (0, express_validator_1.body)("hp")
        .optional()
        .trim()
        .escape()
        .isInt({ min: 1, max: 999 })
        .customSanitizer((value) => parseInt(value))
        .withMessage("HP must be an integer between 1 and 999"),
    (0, express_validator_1.body)("cp")
        .optional()
        .trim()
        .escape()
        .isInt({ min: 1, max: 999 })
        .customSanitizer((value) => parseInt(value))
        .withMessage("CP must be an integer between 1 and 999"),
    (0, express_validator_1.body)("picture")
        .optional()
        .trim()
        .isURL()
        .withMessage("Invalid picture URL"),
    (0, express_validator_1.body)("types")
        .optional()
        .trim()
        .escape()
        .isArray({ min: 1, max: 3 })
        .withMessage("Types must be an array with 1 to 3 elements"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const pokemonId = parseInt(req.params.id);
    try {
        const isPokemonUpdated = yield prisma.pokemon.update({
            where: {
                id: pokemonId,
            },
            data: req.body,
        });
        if (!isPokemonUpdated) {
            return res.status(404).json({ message: (0, getErrorMessage_1.default)(404) });
        }
        res.status(200).json(isPokemonUpdated);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: (0, getErrorMessage_1.default)(500) });
        yield prisma.$disconnect();
        process.exit(1);
    }
    finally {
        yield prisma.$disconnect();
    }
}))
    .delete(authMiddleware_1.default, [
    (0, express_validator_1.param)("id")
        .trim()
        .escape()
        .isInt({ min: 1, max: 999 })
        .withMessage("Invalid pokemon ID: must be an integer between 1 and 999"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const pokemonId = parseInt(req.params.id);
    const pokemonFound = yield prisma.pokemon.delete({
        where: {
            id: pokemonId,
        },
    });
    if (!pokemonFound) {
        res.status(404).json({ message: (0, getErrorMessage_1.default)(404) });
        return;
    }
    res.status(200).json({ message: "Pokemon deleted" });
}));
pokemonsRouter
    .route("/api/pokemons")
    .get(authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pokemonsList = yield prisma.pokemon.findMany();
        yield prisma.$disconnect();
        res.status(200).json(pokemonsList);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: (0, getErrorMessage_1.default)(500) });
        yield prisma.$disconnect();
        process.exit(1);
    }
}))
    .post(authMiddleware_1.default, [
    (0, express_validator_1.body)("name")
        .optional()
        .trim()
        .escape()
        .isLength({ min: 1, max: 50 })
        .withMessage("Name must be between 1 and 50 characters"),
    (0, express_validator_1.body)("hp")
        .optional()
        .trim()
        .escape()
        .isInt({ min: 1, max: 999 })
        .customSanitizer((value) => parseInt(value))
        .withMessage("HP must be an integer between 1 and 999"),
    (0, express_validator_1.body)("cp")
        .optional()
        .trim()
        .escape()
        .isInt({ min: 1, max: 999 })
        .customSanitizer((value) => parseInt(value))
        .withMessage("CP must be an integer between 1 and 999"),
    (0, express_validator_1.body)("picture")
        .optional()
        .trim()
        .isURL()
        .withMessage("Invalid picture URL"),
    (0, express_validator_1.body)("types")
        .optional()
        .trim()
        .isArray({ min: 1, max: 3 })
        .withMessage("Types must be an array with 1 to 3 elements"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const newPokemon = yield prisma.pokemon.create({
        data: req.body,
    });
    res.status(201).json(newPokemon);
}));
exports.default = pokemonsRouter;
