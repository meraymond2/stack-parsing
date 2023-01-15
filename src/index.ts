import { readFileSync } from "fs"
import { parse, stringify } from "./json"

const filePath = "package.json"
const jsStr = readFileSync(filePath).toString()

const ast = parse(jsStr)
console.log(stringify(ast))
