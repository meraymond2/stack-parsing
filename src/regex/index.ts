import { Token, TokenIter } from "./tokens"

export const parse = (src: string): Token[] => {
  let iter = new TokenIter(src)
  let ts: Token[] = []
  while (iter.hasNext()) {
    ts.push(iter.next() as Token)
  }
  return ts
}
