export class TokenIter {
  private str: string
  private pos: number
  private current: Token | null

  constructor(str: string) {
    this.str = str
    const [token, pos] = lexToken(str, 0)
    this.pos = pos
    this.current = token
  }

  next = (): Token | null => {
    const token = this.current
    this.advance()
    return token
  }

  peek = (): Token | null => this.current

  hasNext = (): boolean => Boolean(this.current)

  match = (tag: TokenTag) => {
    if (this.current?._tag === tag) return this.advance()
    throw Error(`Expected ${tag}, received: ${this.current?._tag}`)
  }

  advance = () => {
    const [token, pos] = lexToken(this.str, this.pos)
    this.pos = pos
    this.current = token
  }
}

const lexToken = (input: string, pos: number): [Token | null, number] => {
  while (pos < input.length && ws(input[pos])) pos++
  if (pos === input.length) return [null, pos]

  const char = input[pos]
  if (char === "{") return [{ _tag: "LBrace" }, pos + 1]
  else if (char === "}") return [{ _tag: "RBrace" }, pos + 1]
  else if (char === "[") return [{ _tag: "LSquare" }, pos + 1]
  else if (char === "]") return [{ _tag: "RSquare" }, pos + 1]
  else if (char === ",") return [{ _tag: "Comma" }, pos + 1]
  else if (char === ":") return [{ _tag: "Colon" }, pos + 1]
  else if (input.slice(pos, pos + 4) === "true") return [{ _tag: "TrueLiteral" }, pos + 4]
  else if (input.slice(pos, pos + 5) === "false") return [{ _tag: "FalseLiteral" }, pos + 5]
  else if (input.slice(pos, pos + 4) === "null") return [{ _tag: "NullLiteral" }, pos + 4]
  else if (char === `"`) {
    const start = pos
    let escaped = false
    pos++ // consume opening quote
    while (pos < input.length - 1) {
      if (input[pos] === `"` && !escaped) {
        pos++ // consume closing quote
        return [{ _tag: "StrLiteral", literal: input.slice(start, pos) }, pos]
      } else if (input[pos] === "\\") {
        escaped = !escaped
        pos++
      } else {
        escaped = false
        pos++
      }
    }
  } else {
    const numMatch = jsonNumber.exec(input.slice(pos))
    if (numMatch) {
      const literal = numMatch[0]
      return [{ _tag: "NumLiteral", literal }, pos + literal.length]
    }
  }
  throw Error(`Unexpected character at ${pos}: ${char}.`)
}

const jsonNumber = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?((e|E)(-|\+)?[0-9]+)?/

const ws = (char: string): boolean => {
  const codePoint = char.charCodeAt(0)
  return (
    codePoint === 0x20 || // space
    codePoint === 0x0a || // LF
    codePoint === 0x0d || // CF
    codePoint === 0x09 // tab
  )
}

type TokenTag =
  | "LBrace"
  | "RBrace"
  | "LSquare"
  | "RSquare"
  | "Comma"
  | "Colon"
  | "TrueLiteral"
  | "FalseLiteral"
  | "NullLiteral"
  | "StrLiteral"
  | "NumLiteral"

export type Token =
  | LBrace
  | RBrace
  | LSquare
  | RSquare
  | Comma
  | Colon
  | TrueLiteral
  | FalseLiteral
  | NullLiteral
  | StrLiteral
  | NumLiteral

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

type TrueLiteral = {
  _tag: "TrueLiteral"
}

type FalseLiteral = {
  _tag: "FalseLiteral"
}

type NullLiteral = {
  _tag: "NullLiteral"
}

type StrLiteral = {
  _tag: "StrLiteral"
  literal: string
}

type NumLiteral = {
  _tag: "NumLiteral"
  literal: string
}
