import { parse } from "./regex"

const regexSrc = "ca+?s|t|z"

const ast = parse(regexSrc)
console.log(JSON.stringify(ast, null, 2))
