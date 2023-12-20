import 'data:text/javascript,console.log("hello!")'
import thing from "data:text/javascript, export default function Thing () { return 'a thing' } export const named = 'named thing' "

const data ="data:text/javascript, export default function Thing () { return 'a thing' } export const named = 'named thing' "


const stuff = await import("data:text/javascript, export default function Thing () { return 'a thing' } export const named = 'named thing' ")
const foo = await import(data)



console.log('stuff', stuff, stuff.default())
console.log('foo', foo, foo.default())
console.log('thing', stuff, stuff.default())
