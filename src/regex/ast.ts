/*
expr          -> alternation
alternation   -> concat ("|" concat)*
concatenation -> repetition repetition*
repetition    -> primary ("?" | "+" | "*")?
primary       -> block | char
block         -> "(" expr ")"
char          -> [a-z]
*/

// TODO: do primaries, including blocks and char sets later.
export type Node = Alternation | Concatenation | Repetition | Char

export type Alternation = {
  _tag: "Alternation"
  left: Node
  right: Node
}
export const Alternation = (left: Node, right: Node): Alternation => ({
  _tag: "Alternation",
  left,
  right,
})

export type Concatenation = { _tag: "Concatenation"; left: Node; right: Node }
export const Concatenation = (left: Node, right: Node): Concatenation => ({
  _tag: "Concatenation",
  left,
  right,
})

type RepetitionOp = "?" | "+" | "*" | "+?" | "*?"

export type Repetition = {
  _tag: "Reptition"
  node: Node
  op: "?" | "+" | "*" | "+?" | "*?"
}
export const Repetition = (node: Node, op: RepetitionOp): Repetition => ({
  _tag: "Reptition",
  node,
  op,
})

export type Char = {
  _tag: "Char"
  char: string
}

export const Char = (char: string): Char => ({ _tag: "Char", char })
