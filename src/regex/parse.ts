import { Alternation, Char, Concatenation, Node, Repetition } from "./ast"
import { OpToken, TokenIter } from "./tokens"

export const parse = (src: string): Node => {
  let ts = new TokenIter(src)
  let stack: State[] = [AlterationStart]
  let output: Node[] = []

  while (stack.length) {
    const state = stack.pop() as State
    switch (state._tag) {
      case "AlterationStart":
        stack.push(AlterationCont)
        stack.push(ConcatenationStart)
        break
      case "AlterationCont":
        if (ts.hasNext() && ts.peek()?._tag === "|") {
          ts.next()
          stack.push(AlterationEnd)
          stack.push(ConcatenationStart)
        }
        break
      case "AlterationEnd": {
        const right = output.pop() as Node
        const left = output.pop() as Node
        output.push(Alternation(left, right))
        stack.push(AlterationCont)
        break
      }
      case "ConcatenationStart":
        stack.push(ConcatenationCont)
        stack.push(RepetitionStart)
        break
      // TODO: This could be an array rather than nested trees
      case "ConcatenationCont":
        if (ts.hasNext() && ts.peek()?._tag !== ")" && ts.peek()?._tag !== "|") {
          stack.push(ConcatenationEnd)
          stack.push(RepetitionStart)
        }
        break
      case "ConcatenationEnd": {
        const right = output.pop() as Node
        const left = output.pop() as Node
        output.push(Concatenation(left, right))
        stack.push(ConcatenationCont)
        break
      }
      case "RepetitionStart":
        stack.push(RepetitionOp)
        stack.push(PrimaryStart)
        break
      case "RepetitionOp": {
        const next = ts.peek()
        if (next && ["?", "+", "*", "+?", "*?"].includes(next._tag)) {
          const op = ts.next() as OpToken
          const primary = output.pop() as Node
          output.push(Repetition(primary, op._tag))
        }
        break
      }
      case "PrimaryStart": {
        // TODO: check for other primary tokens, like ( and [
        const t = ts.next()
        if (!t || t._tag !== "Char") throw Error("Expected character")
        output.push(Char(t.literal))
      }
    }
  }
  if (output.length > 1) throw Error("Unreachable")
  return output[0]
}

type AlterationStart = { _tag: "AlterationStart" }
const AlterationStart: AlterationStart = { _tag: "AlterationStart" }
type AlterationCont = { _tag: "AlterationCont" }
const AlterationCont: AlterationCont = { _tag: "AlterationCont" }
type AlterationEnd = { _tag: "AlterationEnd" }
const AlterationEnd: AlterationEnd = { _tag: "AlterationEnd" }
type ConcatenationStart = { _tag: "ConcatenationStart" }
const ConcatenationStart: ConcatenationStart = { _tag: "ConcatenationStart" }
type ConcatenationCont = { _tag: "ConcatenationCont" }
const ConcatenationCont: ConcatenationCont = { _tag: "ConcatenationCont" }
type ConcatenationEnd = { _tag: "ConcatenationEnd" }
const ConcatenationEnd: ConcatenationEnd = { _tag: "ConcatenationEnd" }
type RepetitionStart = { _tag: "RepetitionStart" }
const RepetitionStart: RepetitionStart = { _tag: "RepetitionStart" }
type RepetitionOp = { _tag: "RepetitionOp" }
const RepetitionOp: RepetitionOp = { _tag: "RepetitionOp" }
type PrimaryStart = { _tag: "PrimaryStart" }
const PrimaryStart: PrimaryStart = { _tag: "PrimaryStart" }

type State =
  | AlterationStart
  | AlterationCont
  | AlterationEnd
  | ConcatenationStart
  | ConcatenationCont
  | ConcatenationEnd
  | RepetitionStart
  | RepetitionOp
  | PrimaryStart
