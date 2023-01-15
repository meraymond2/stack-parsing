import { JsonArr, JsonFalse, JsonNull, JsonNum, JsonObj, JsonStr, JsonTrue, JsonVal } from "./ast"
import { AwaitingArrVal, AwaitingObjVal, ParsingArr, ParsingObj, Start, State } from "./states"
import { advance, consume, TokenIter } from "./tokens"

export const parseTokens = (ts: TokenIter): JsonVal => {
  const stack: State[] = [Start]
  const output: JsonVal[] = []
  while (ts.next) {
    const state = stack.pop() as State
    switch (state._tag) {
      case "Start": {
        const t = ts.next
        ts = advance(ts)
        switch (t._tag) {
          case "NumLiteral":
            output.push(JsonNum(t.literal))
            break
          case "StrLiteral":
            output.push(JsonStr(t.literal))
            break
          case "TrueLiteral":
            output.push(JsonTrue)
            break
          case "FalseLiteral":
            output.push(JsonFalse)
            break
          case "NullLiteral":
            output.push(JsonNull)
            break
          case "LBrace":
            stack.push(ParsingObj([]))
            break
          case "LSquare":
            stack.push(ParsingArr([]))
            break
          default:
            throw Error(`Expected value, received: ${t._tag}`)
        }
        break
      }

      case "ParsingObj": {
        const t = ts.next
        ts = advance(ts) // consume key or closing brace (confusing, should move below)
        switch (t._tag) {
          case "StrLiteral":
            ts = consume(ts, "Colon")
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
        // TODO: make sure comma exists where it should
        if (ts.next._tag === "Comma") {
          ts = advance(ts)
        }
        stack.push(ParsingObj(state.attributes.concat([[state.key, val]])))
        break
      }

      case "ParsingArr": {
        const t = ts.next
        if (t._tag === "RSquare") {
          ts = advance(ts)
          output.push(JsonArr(state.items))
        } else {
          stack.push(AwaitingArrVal(state.items))
          stack.push(Start)
        }
        break
      }

      case "AwaitingArrVal": {
        const val = output.pop() as JsonVal
        // TODO: make sure comma exists where it should
        if (ts.next._tag === "Comma") {
          ts = advance(ts)
        }
        stack.push(ParsingArr(state.items.concat(val)))
        break
      }

      default:
        throw Error(`Unreachable: ${state}`)
    }
  }
  return output[0]
}
