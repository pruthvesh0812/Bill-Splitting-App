"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    schema: "./graphQL/schema.gql",
    generates: {
        "./graphQL/graphQL-types.ts": {
            plugins: ["typescript", "typescript-resolvers"],
            config: {
                contextType: "./context#DataSourceContext"
            },
        }
    }
};
exports.default = config;
