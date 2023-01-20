import { JsonVal, stringify } from "./ast"
import { parseTokens } from "./parser"
import { TokenIter } from "./tokens"

export const parse = (jsonStr: string): JsonVal => parseTokens(new TokenIter(jsonStr))

export { stringify }
