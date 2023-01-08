export type JsonVal = JsonObj | JsonNum

export type JsonObj = {
  _tag: "JsonObj"
  attributes: Array<[string, JsonVal]>
}
export const JsonObj = (attributes: Array<[string, JsonVal]>): JsonObj => ({
  _tag: "JsonObj",
  attributes,
})

export type JsonNum = {
  _tag: "JsonNum"
  literal: string
}
export const JsonNum = (literal: string): JsonNum => ({
  _tag: "JsonNum",
  literal,
})

// rest later
