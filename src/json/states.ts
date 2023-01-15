import { JsonVal } from "./ast"

export type State = ParseVal | ParsingObj | ParseObjVal | ParsingArr | ParseArrVal

/*
Expecting: any token that represents or begins a value
Action: parse the value’s tokens and put the result onto the output stack
*/
export type ParseVal = { _tag: "ParseVal" }
export const ParseVal: ParseVal = { _tag: "ParseVal" }

/*
Expecting: either a StrLiteral (key) or a closing RBrace
Action: if there is a key, add ParseObjVal with the key and ParseVal to the
stack. If it’s a closing brace, move the state to the output stack.
*/
export type ParsingObj = {
  _tag: "ParsingObj"
  attributes: Array<[string, JsonVal]>
}
export const ParsingObj = (attributes: Array<[string, JsonVal]>): ParsingObj => ({
  _tag: "ParsingObj",
  attributes,
})

/*
Expecting: N/A
Action: take the most recently parsed value, combine it with the key, add it to
the attributes-state, and push the new attributes onto the stack in ParsingObj
*/
export type ParseObjVal = {
  _tag: "ParseObjVal"
  attributes: Array<[string, JsonVal]>
  key: string
}
export const ParseObjVal = (attributes: Array<[string, JsonVal]>, key: string): ParseObjVal => ({
  _tag: "ParseObjVal",
  attributes,
  key,
})

/*
Expecting: a closing RSquare or a value token
Action: If it’s a closing brace, push a new Arr value to the output stack,
otherwise push ParseArrVal and ParseVal to the stack.
*/
export type ParsingArr = {
  _tag: "ParsingArr"
  items: JsonVal[]
}
export const ParsingArr = (items: JsonVal[]): ParsingArr => ({
  _tag: "ParsingArr",
  items,
})

/*
Expecting: N/A
Action: pop the most recently parsed value, and add it to the array-state. Add
a new ParsingArr to the stack with the updated state.
*/
export type ParseArrVal = {
  _tag: "ParseArrVal"
  items: JsonVal[]
}
export const ParseArrVal = (items: JsonVal[]): ParseArrVal => ({
  _tag: "ParseArrVal",
  items,
})

// I could possibly combine the ParseObjVal & ParseVal into a single state to
// save an iteration, but I’m not 100% that would work, and I haven’t bothered
// to try it.
