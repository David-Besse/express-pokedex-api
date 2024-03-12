"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const pokemonsRouter_1 = __importDefault(require("./routes/pokemonsRouter"));
const loginRouter_1 = __importDefault(require("./routes/loginRouter"));
const logoutRouter_1 = __importDefault(require("./routes/logoutRouter"));
const mainRouter_1 = __importDefault(require("./routes/mainRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.disable("x-powered-by");
const port = process.env.PORT || 8080;
app.use((0, cors_1.default)({
    origin: `${process.env.NODE_ENV === "development"
        ? "http://localhost:4200"
        : "https://pokedex-david-besse.vercel.app"}`,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use([logoutRouter_1.default, loginRouter_1.default, pokemonsRouter_1.default, mainRouter_1.default]);
const swagOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Pokedex API",
            version: "1.0.0",
            description: "This is a simple restful API for my Angular Pokedex project",
            contact: {
                name: "David Besse",
                url: "https://github.com/David-Besse/express-pokedex-api",
                email: "davidb.webdev@gmail.com",
            },
        },
        servers: [
            {
                url: `${process.env.SERVER_URI}:${port}`,
                description: "Main server",
            },
        ],
    },
    apis: ["./src/routes/*.ts"],
};
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup((0, swagger_jsdoc_1.default)(swagOptions)));
app.listen(port, () => {
    console.log(`Server running on ${process.env.SERVER_URI}:${port}`);
});
