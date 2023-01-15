import { JsonVal, stringify } from "./ast"
import { parseTokens } from "./parser"
import { initIter } from "./tokens"

export const parse = (jsonStr: string): JsonVal => parseTokens(initIter(jsonStr))

export { stringify }
