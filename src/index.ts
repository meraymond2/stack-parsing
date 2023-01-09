import { parse } from "./json"

const jsStr = `
{
  "name": "stack-parsing",
  "version": "1.0.0",
  "main": "out/index.js",
  "scripts": {
    "build": "npx esbuild src/index.ts --outdir=out --platform=node --bundle",
    "lint": "npx prettier -w src/*.ts src/**/*.ts",
    "start": "npm run build && node out/index.js"
  },
  "devDependencies": {
    "@types/lodash.isequal": "^4.5.5",
    "@types/node": "^14.17.34",
    "esbuild": "^0.11.23",
    "prettier": "^2.4.1",
    "typescript": "^4.5.2"
  }
}
`
const ast = parse(jsStr)

console.log(JSON.stringify(ast, null, 2))
