"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerParams = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
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
                url: `${process.env.NODE_ENV === "development"
                    ? process.env.SERVER_URL + ":" + process.env.PORT
                    : process.env.SERVER_URL_P + ":" + process.env.PORT_P}`,
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "access_token",
                },
                cookieRefresh: {
                    type: "apiKey",
                    in: "cookie",
                    name: "refresh_token",
                },
            },
        },
    },
    apis: ["./src/routes/*.ts"],
};
const swaggerSpecs = (0, swagger_jsdoc_1.default)(swagOptions);
exports.swaggerParams = swagger_ui_express_1.default.setup(swaggerSpecs);
