import { parse } from "./regex"

const regexSrc = "(c|a)+?s|t|z|{abc123}"

const ast = parse(regexSrc)
console.log(JSON.stringify(ast, null, 2))
