import type {CodegenConfig} from "@graphql-codegen/cli"

const config:CodegenConfig = {
    schema:"./graphQL/schemas/schema.gql",
    generates:{
        "./graphQL/types/graphQL-types.ts":{
            plugins:["typescript","typescript-resolvers"],
            config: {
                contextType: "./context#DataSourceContext"
              },
        }
    }
}

export default config