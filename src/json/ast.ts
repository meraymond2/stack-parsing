export type JsonVal = JsonObj | JsonNum | JsonArr | JsonStr | JsonTrue | JsonFalse | JsonNull

export type JsonObj = {
  _tag: "JsonObj"
  attributes: Array<[string, JsonVal]>
}
export const JsonObj = (attributes: Array<[string, JsonVal]>): JsonObj => ({
  _tag: "JsonObj",
  attributes,
})

export type JsonArr = {
  _tag: "JsonArr"
  items: JsonVal[]
}
export const JsonArr = (items: JsonVal[]): JsonArr => ({
  _tag: "JsonArr",
  items,
})

export type JsonNum = {
  _tag: "JsonNum"
  literal: string
}
export const JsonNum = (literal: string): JsonNum => ({
  _tag: "JsonNum",
  literal,
})

export type JsonStr = {
  _tag: "JsonStr"
  literal: string
}
export const JsonStr = (literal: string): JsonStr => ({
  _tag: "JsonStr",
  literal,
})

export type JsonTrue = {
  _tag: "JsonTrue"
}
export const JsonTrue: JsonTrue = { _tag: "JsonTrue" }

export type JsonFalse = {
  _tag: "JsonFalse"
}
export const JsonFalse: JsonFalse = { _tag: "JsonFalse" }

export type JsonNull = {
  _tag: "JsonNull"
}
export const JsonNull: JsonNull = { _tag: "JsonNull" }
