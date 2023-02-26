export class TokenIter {
  private src: string
  private pos: number

  constructor(src: string) {
    this.src = src
    this.pos = 0
  }

  peek = (): Token | null => {
    if (this.pos >= this.src.length) return null
    const c = this.src[this.pos]

    switch (c) {
      case "(":
        return { _tag: "(" }
      case ")":
        return { _tag: ")" }
      case "|":
        return { _tag: "|" }
      case "?":
        return { _tag: "?" }
      case "+": {
        const tag = this.src[this.pos + 1] === "?" ? "+?" : "+"
        return { _tag: tag }
      }
      case "*": {
        const tag = this.src[this.pos + 1] === "?" ? "*?" : "*"
        return { _tag: tag }
      }
      default:
        return { _tag: "Char", literal: c }
    }
  }

  hasNext = (): boolean => Boolean(this.peek())

  next = (): Token | null => {
    const t = this.peek()
    if (t === null) return null
    switch (t._tag) {
      case "(":
      case ")":
      case "|":
      case "?":
      case "+":
      case "*":
      case "Char":
        this.pos++
        break
      case "+?":
      case "*?":
        this.pos += 2
        break
    }
    return t
  }
}

type TokenTag = "Char" | "(" | ")" | "|" | "?" | "+" | "+?" | "*" | "*?"

type Char = {
  _tag: "Char"
  literal: string
}

type LBracket = { _tag: "(" }
type RBracket = { _tag: ")" }
type Pipe = { _tag: "|" }
type Question = { _tag: "?" }
type Plus = { _tag: "+" }
type PlusQuestion = { _tag: "+?" }
type Star = { _tag: "*" }
type StarQuestion = { _tag: "*?" }

export type OpToken = Question | Plus | PlusQuestion | Star | StarQuestion
export type Token = Char | LBracket | RBracket | Pipe | Question | Plus | PlusQuestion | Star | StarQuestion
