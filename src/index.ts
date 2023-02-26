import { parse } from "./regex"

const regexSrc = "ca+?s|t"

const ast = parse(regexSrc)
console.log(ast)
