"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mainRouter = (0, express_1.Router)();
mainRouter.get("/", (req, res) => {
    res.send("Hello welcome to Pokedex API ! This is the main route, check /api/docs for more information");
});
exports.default = mainRouter;
