/*
expr          -> alternation
alternation   -> concat ("|" concat)*
concatenation -> repetition repetition*
repetition    -> primary ("?" | "+" | "*")?
primary       -> block | char | charset
block         -> "(" expr ")"
char          -> [a-z]
charset       -> "{" char* "}"
*/

export type Node = Alternation | Concatenation | Repetition | Primary

export type Primary = Char | CharSet

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

// For now, for simplicity, skipping ranges
export type CharSet = {
  _tag: "CharSet"
  chars: string[]
}
export const CharSet = (chars: string[]): CharSet => ({ _tag: "CharSet", chars })
