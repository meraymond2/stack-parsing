export type Token =
  | LBrace
  | RBrace
  | LSquare
  | RSquare
  | Comma
  | Colon
  | StrLiteral
  | NumLiteral
  | TrueLiteral
  | FalseLiteral
  | NullLiteral

type LBrace = {
  _tag: "LBrace"
}

type RBrace = {
  _tag: "RBrace"
}

type LSquare = {
  _tag: "LSquare"
}

type RSquare = {
  _tag: "RSquare"
}

type Comma = {
  _tag: "Comma"
}

type Colon = {
  _tag: "Colon"
}

type StrLiteral = {
  _tag: "StrLiteral"
  literal: string
}

type NumLiteral = {
  _tag: "NumLiteral"
  literal: string
}

type TrueLiteral = {
  _tag: "TrueLiteral"
}

type FalseLiteral = {
  _tag: "FalseLiteral"
}

type NullLiteral = {
  _tag: "NullLiteral"
}
