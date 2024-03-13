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
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerParam_1 = require("./swagger/swaggerParam");
const pokemonsRouter_1 = __importDefault(require("./routes/pokemonsRouter"));
const loginRouter_1 = __importDefault(require("./routes/loginRouter"));
const logoutRouter_1 = __importDefault(require("./routes/logoutRouter"));
const faviconRouter_1 = __importDefault(require("./routes/faviconRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.disable("x-powered-by");
app.use(express_1.default.static("public"));
const port = process.env.NODE_ENV === "development"
    ? process.env.PORT
    : process.env.PORT_P;
app.use((0, cors_1.default)({
    origin: `${process.env.NODE_ENV === "development"
        ? process.env.CLIENT_URL
        : process.env.CLIENT_URL_P}`,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)(`${process.env.NODE_ENV === "development"
    ? process.env.MORGAN_MODE
    : process.env.MORGAN_MODE_P}`));
app.use([logoutRouter_1.default, loginRouter_1.default, pokemonsRouter_1.default, faviconRouter_1.default]);
app.use("/api-docs", swagger_ui_express_1.default.serve, swaggerParam_1.swaggerParams);
app.listen(port, () => {
    console.log(`Server running on ${process.env.NODE_ENV === "development"
        ? process.env.SERVER_URL
        : process.env.SERVER_URL_P}:${port}`);
});
exports.default = app;
