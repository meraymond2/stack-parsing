import { parse } from "./json"
import { readFileSync } from "fs"

const jsStr = readFileSync(process.argv[2]).toString()

const ast = parse(jsStr)
console.log(JSON.stringify(ast, null, 2))
