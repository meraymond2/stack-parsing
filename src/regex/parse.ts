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
        stack.push(AlterationPipe)
        stack.push(ConcatenationStart)
        break
      case "AlterationPipe":
        if (ts.peek()?._tag === "|") {
          ts.next()
          stack.push(AlterationEnd)
          stack.push(ConcatenationStart)
        }
        break
      case "AlterationEnd": {
        const right = output.pop() as Node
        const left = output.pop() as Node
        output.push(Alternation(left, right))
        break
      }
      case "ConcatenationStart":
        stack.push(ConcatenationRightCheck)
        stack.push(RepetitionStart)
        break
      case "ConcatenationRightCheck":
        // while (src.hasNext() && src.peek() !== ")" && src.peek() !== "|") {
        if (ts.peek()?._tag !== ")" && ts.peek()?._tag !== "|") {
          stack.push(ConcatenationEnd)
          stack.push(RepetitionStart)
        }
        break
      case "ConcatenationEnd": {
        const right = output.pop() as Node
        const left = output.pop() as Node
        output.push(Concatenation(left, right))
        break
      }
      case "RepetitionStart": {
        const t = ts.next()
        if (t === null) throw Error("Unexpected end of input.") // todo: fix, is wrong
        if (t._tag !== "Char") throw Error("Expected character")
        const char = Char(t.literal)
        // this will change when I have more than one primary, but for now do it here
        const next = ts.peek()
        if (next && ["?", "+", "*", "+?", "*?"].includes(next._tag)) {
          const op = ts.next() as OpToken
          output.push(Repetition(char, op._tag))
        } else {
          output.push(char)
        }
        break
      }
      case "RepetitionOp":
        break
    }
  }

  return output[0]
}

/*
What does this function do? It parses a sub-node, and then checks for a pipe.
Then if there's a pipe, it parses another subnode, and returns the whole thing,
otherwise it returns the subnode.

What we need to adapt to the stack is the temporary state. It needs to:
- parse a Concatenation and put it on the output stack
- check for a pipe
- if there's a pipe, parse another Concatenation and put _that_ on the output stack
  - then pop them both off and put an Alternation on the output stack
- else, pop off the concat and put it on the output stack

We need states or instructions for what to do next, and what to do after that,
not in that order.

It'll be something
like:
- ParseAlternation
  - which just does [CheckPipe, ParseConcatenation]
-
- put CheckForRightHandSide on the stack
- put StartParsingConcatenation on the stack
*/
// I think I could probably make AlterationStart just [ AlterationPipe, ConcatenationStart ] instead
// but I'd get into things around nested arrays
type AlterationStart = { _tag: "AlterationStart" }
const AlterationStart: AlterationStart = { _tag: "AlterationStart" }
type AlterationPipe = { _tag: "AlterationPipe" }
const AlterationPipe: AlterationPipe = { _tag: "AlterationPipe" }
type AlterationEnd = { _tag: "AlterationEnd" }
const AlterationEnd: AlterationEnd = { _tag: "AlterationEnd" }
type ConcatenationStart = { _tag: "ConcatenationStart" }
const ConcatenationStart: ConcatenationStart = { _tag: "ConcatenationStart" }
type ConcatenationRightCheck = { _tag: "ConcatenationRightCheck" }
const ConcatenationRightCheck: ConcatenationRightCheck = { _tag: "ConcatenationRightCheck" }
type ConcatenationEnd = { _tag: "ConcatenationEnd" }
const ConcatenationEnd: ConcatenationEnd = { _tag: "ConcatenationEnd" }
type RepetitionStart = { _tag: "RepetitionStart" }
const RepetitionStart: RepetitionStart = { _tag: "RepetitionStart" }
type RepetitionOp = { _tag: "RepetitionOp" }
const RepetitionOp: RepetitionOp = { _tag: "RepetitionOp" }

type State =
  | AlterationStart
  | AlterationPipe
  | AlterationEnd
  | ConcatenationStart
  | ConcatenationRightCheck
  | ConcatenationEnd
  | RepetitionStart
  | RepetitionOp
