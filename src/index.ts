import { parse } from "./json"
import { Token } from "./json/tokens"

const _jstr = `{ "a": 1, "b": { "c": 2, d: "3" }}`
const tokens: Token[] = [
  { _tag: "LBrace" },
  { _tag: "StrLiteral", literal: "a" },
  { _tag: "Colon" },
  { _tag: "NumLiteral", literal: "1" },
  { _tag: "Comma" },
  { _tag: "StrLiteral", literal: "b" },
  { _tag: "Colon" },
  { _tag: "LBrace" },
  { _tag: "StrLiteral", literal: "c" },
  { _tag: "Colon" },
  { _tag: "NumLiteral", literal: "2" },
  { _tag: "Comma" },
  { _tag: "StrLiteral", literal: "d" },
  { _tag: "Colon" },
  { _tag: "NumLiteral", literal: "3" },
  { _tag: "RBrace" },
  { _tag: "RBrace" },
]

const ast = parse(tokens)

console.log(JSON.stringify(ast, null, 2))
