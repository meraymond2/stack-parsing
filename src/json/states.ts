import { JsonVal } from "./ast"

export type State = Start | ParsingObj | AwaitingObjVal | ParsingArr | AwaitingArrVal

export type Start = { _tag: "Start" }
export const Start: Start = { _tag: "Start" }

export type ParsingObj = {
  _tag: "ParsingObj"
  attributes: Array<[string, JsonVal]>
}
export const ParsingObj = (attributes: Array<[string, JsonVal]>): ParsingObj => ({
  _tag: "ParsingObj",
  attributes,
})

export type AwaitingObjVal = {
  _tag: "AwaitingObjVal"
  attributes: Array<[string, JsonVal]>
  key: string
}
export const AwaitingObjVal = (attributes: Array<[string, JsonVal]>, key: string): AwaitingObjVal => ({
  _tag: "AwaitingObjVal",
  attributes,
  key,
})

export type ParsingArr = {
  _tag: "ParsingArr"
  items: JsonVal[]
}
export const ParsingArr = (items: JsonVal[]): ParsingArr => ({
  _tag: "ParsingArr",
  items,
})

export type AwaitingArrVal = {
  _tag: "AwaitingArrVal"
  items: JsonVal[]
}
export const AwaitingArrVal = (items: JsonVal[]): AwaitingArrVal => ({
  _tag: "AwaitingArrVal",
  items,
})
