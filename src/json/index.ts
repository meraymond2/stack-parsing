import { JsonNum, JsonObj, JsonVal } from "./ast"
import { Token } from "./tokens"

export const parse = (jsonStr: string): JsonVal => {
  throw Error("todo")
}

const parseTokens = (ts: Token[]): JsonVal => {
  const stack: State[] = [Start]
  const output: JsonVal[] = []
  let tail = ts
  while (tail.length > 0) {
    const state = stack.pop() as State
    switch (state._tag) {
      case "Start": {
        const t = tail.shift() as Token
        switch (t._tag) {
          case "NumLiteral":
            output.push(JsonNum(t.literal))
            break
          case "LBrace":
            stack.push(ParsingObj([]))
            break
          default:
            throw Error(`Expected value, received: ${t._tag}`)
        }
        break
      }

      case "ParsingObj": {
        const t = tail.shift() as Token
        switch (t._tag) {
          case "StrLiteral":
            const _colon = consume(ts, "Colon")
            stack.push(AwaitingObjVal(state.attributes, t.literal))
            stack.push(Start)
            break
          case "RBrace":
            output.push(JsonObj(state.attributes))
            break
          default:
            throw Error(`Expected string, received: ${t._tag}`)
        }
        break
      }

      case "AwaitingObjVal": {
        const val = output.pop() as JsonVal
        if (tail[0]._tag === "Comma") ts.shift()
        stack.push(ParsingObj(state.attributes.concat([[state.key, val]])))
        break
      }

      default:
        throw Error(`Unreachable: ${state}`)
    }
  }
  return output[0]
}

const consume = (ts: Token[], tag: string): Token => {
  const t = ts.shift()
  if (t?._tag === tag) return t
  else throw Error(`Expected ${tag}, received ${t?._tag}.`)
}

type State = Start | ParsingObj | AwaitingObjVal

type Start = { _tag: "Start" }
const Start: Start = { _tag: "Start" }

type ParsingObj = {
  _tag: "ParsingObj"
  attributes: Array<[string, JsonVal]>
}
const ParsingObj = (attributes: Array<[string, JsonVal]>): ParsingObj => ({
  _tag: "ParsingObj",
  attributes,
})

type AwaitingObjVal = {
  _tag: "AwaitingObjVal"
  attributes: Array<[string, JsonVal]>
  key: string
}
const AwaitingObjVal = (attributes: Array<[string, JsonVal]>, key: string): AwaitingObjVal => ({
  _tag: "AwaitingObjVal",
  attributes,
  key,
})
