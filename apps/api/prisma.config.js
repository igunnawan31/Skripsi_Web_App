"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var node_fs_1 = require("node:fs");
var dotenv_1 = require("dotenv");
var config_1 = require("prisma/config");
var nodeEnv = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : 'development';
var envFile = ".env.".concat(nodeEnv);
(0, dotenv_1.config)({
    path: "../../.env",
});
if (node_fs_1.default.existsSync(envFile)) {
    dotenv_1.default.config({ path: envFile });
    console.log("[prisma] Loaded environment from ".concat(envFile));
}
else {
    dotenv_1.default.config();
    console.log('[prisma] Loaded default .env file');
}
var databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set.');
}
exports.default = (0, config_1.defineConfig)({
    schema: node_path_1.default.join('prisma', 'schema.prisma'),
    migrations: {
        path: node_path_1.default.join('prisma', 'migrations'),
        seed: 'tsx prisma/seed.ts',
    },
    views: {
        path: node_path_1.default.join('prisma', 'views'),
    },
    typedSql: {
        path: node_path_1.default.join('prisma', 'queries'),
    },
    datasource: {
        url: databaseUrl,
    },
});
