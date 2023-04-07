import { Alternation, Char, CharSet, Concatenation, Node, Repetition } from "./ast"
import { OpToken, Char as CharToken, Token, TokenIter } from "./tokens"

export const parse = (src: string): Node => {
  let ts = new TokenIter(src)
  let stack: State[] = [AlterationStart]
  let out: Node[] = []

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
          stack.push(AlterationAssemble)
          stack.push(ConcatenationStart)
        }
        break
      case "AlterationAssemble": {
        const right = out.pop() as Node
        const left = out.pop() as Node
        out.push(Alternation(left, right))
        stack.push(AlterationCont)
        break
      }
      case "ConcatenationStart":
        stack.push(ConcatenationCont)
        stack.push(RepetitionStart)
        break
      // TODO: This could be an array rather than nested trees, but don't change
      // it unless it's obviously faster.
      case "ConcatenationCont":
        if (ts.hasNext() && ts.peek()?._tag !== ")" && ts.peek()?._tag !== "|") {
          stack.push(ConcatenationAssemble)
          stack.push(RepetitionStart)
        }
        break
      case "ConcatenationAssemble": {
        const right = out.pop() as Node
        const left = out.pop() as Node
        out.push(Concatenation(left, right))
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
          const primary = out.pop() as Node
          out.push(Repetition(primary, op._tag))
        }
        break
      }
      case "PrimaryStart": {
        const next = ts.next()
        if (!next) throw Error("Expected character")
        if (next._tag === "(") {
          stack.push(BlockAssemble)
          stack.push(AlterationStart)
          break
        } else if (next._tag === "{") {
          let chars: string[] = []
          while (ts.peek()?._tag === "Char") {
            const char = ts.next() as CharToken
            chars.push(char.literal)
          }
          const closing = ts.next()
          if (closing?._tag !== "}") throw Error("Expected }")
          out.push(CharSet(chars))
          break
        }
        if (next._tag !== "Char") throw Error("Expected character")
        out.push(Char(next.literal))
        break
      }
      case "BlockAssemble": {
        const next = ts.next()
        if (!next || next._tag !== ")") throw Error("Expected )")
        break
      }
    }
  }
  if (out.length > 1) throw Error("Unreachable")
  return out[0]
}

type AlterationStart = { _tag: "AlterationStart" }
const AlterationStart: AlterationStart = { _tag: "AlterationStart" }
type AlterationCont = { _tag: "AlterationCont" }
const AlterationCont: AlterationCont = { _tag: "AlterationCont" }
type AlterationAssemble = { _tag: "AlterationAssemble" }
const AlterationAssemble: AlterationAssemble = { _tag: "AlterationAssemble" }
type ConcatenationStart = { _tag: "ConcatenationStart" }
const ConcatenationStart: ConcatenationStart = { _tag: "ConcatenationStart" }
type ConcatenationCont = { _tag: "ConcatenationCont" }
const ConcatenationCont: ConcatenationCont = { _tag: "ConcatenationCont" }
type ConcatenationAssemble = { _tag: "ConcatenationAssemble" }
const ConcatenationAssemble: ConcatenationAssemble = { _tag: "ConcatenationAssemble" }
type RepetitionStart = { _tag: "RepetitionStart" }
const RepetitionStart: RepetitionStart = { _tag: "RepetitionStart" }
type RepetitionOp = { _tag: "RepetitionOp" }
const RepetitionOp: RepetitionOp = { _tag: "RepetitionOp" }
type PrimaryStart = { _tag: "PrimaryStart" }
const PrimaryStart: PrimaryStart = { _tag: "PrimaryStart" }
type BlockAssemble = { _tag: "BlockAssemble" }
const BlockAssemble: BlockAssemble = { _tag: "BlockAssemble" }

type State =
  | AlterationStart
  | AlterationCont
  | AlterationAssemble
  | ConcatenationStart
  | ConcatenationCont
  | ConcatenationAssemble
  | RepetitionStart
  | RepetitionOp
  | PrimaryStart
  | BlockAssemble
