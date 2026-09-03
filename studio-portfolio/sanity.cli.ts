import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'zt9wetk3',
    dataset: 'production',
  },
  typegen: {
    enabled: true,
    path: '../Portfolio/src/**/*.{ts,tsx,js,jsx}',
    schema: 'schema.json',
    generates: '../Portfolio/src/sanity/sanity.types.ts',
    overloadClientMethods: true,
  },
})
