Given a simplified JSON, where we only have objects and numbers, I have a JSON string:
`{ "a": 1, "b": { "c": 2, d: "3" }}`

which translates into a list of tokens.
```typescript
{ _tag: "LBRACE" }
{ _tag: "STRING", literal: "a" }
{ _tag: "COLON" }
{ _tag: "NUMBER", literal: 1 }
{ _tag: "COMMA" }
{ _tag: "STRING", literal: "b" }
{ _tag: "COLON" }
{ _tag: "LBRACE" }
{ _tag: "STRING", literal: "c" }
{ _tag: "COLON" }
{ _tag: "NUMBER", literal: 2 }
{ _tag: "COMMA" }
{ _tag: "STRING", literal: "d" }
{ _tag: "COLON" }
{ _tag: "NUMBER", literal: 3 }
{ _tag: "RBRACE" }
{ _tag: "RBRACE" }
```

This can be parsed by a predictive recursive descent parser, because we never need to look ahead more than one token.
```typescript
const parseJson = (tokens: Token[]): JsonVal => {
  switch (tokens.peek()._tag) {
    case "LBRACE":
      return parseObj(tokens)
    case "NUMBER":
      return parseNumber
    default:
      throw Error("Unexpected token: ", token)
  }
}

const parseNumber = (tokens: Token[]): number => {
  const t = tokens.consume()
  return parseNumber(t.literal)
}

const parseObj = (tokens: Token[]): object => {
  const _lbrace = tokens.consume()
  let attributes: [string, JsonVal][] = []
  while (tokens.peek()._tag !== "RBRACE") {
    const key = tokens.consume().literal
    const _colon = tokens.consume()
    const val = parseJson(tokens)
    attributes.push([key, val])
    if (tokens.peek()._tag === "COMMA") {
      const _comma = tokens.consume() 
    }
  }
  const _rbrace = tokens.consume()
}
```

Going back to `{ "a": 1, "b": { "c": 2, d: "3" }}`...

We keep track of the partially parsed vals while parsing nested vals by relying on the call stack. The state of the outer object is saved while we parse the inner object, because `attributes` is sitting on the call stack, waiting for the nested parseJson to return. 

The goal is to replicate that behaviour, but without using the call stack, but rather using a heap-allocated stack which while not inexhaustible, is probablly bigger than the call stack. So we ‘just’ need to refactor the code to use an explicit stack instead. 
