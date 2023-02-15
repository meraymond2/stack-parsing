import { parse } from "./regex"

const regexSrc = "foo|bar+?"

const ts = parse(regexSrc)
console.log(ts)
