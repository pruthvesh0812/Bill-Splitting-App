import type {CodegenConfig} from "@graphql-codegen/cli"

const config:CodegenConfig = {
    schema:"./graphQL/schema.gql",
    generates:{
        "./graphQL/graphQL-types.ts":{
            plugins:["typescript","typescript-resolvers"],
            config: {
                contextType: "./context#DataSourceContext"
              },
        }
    }
}

export default config