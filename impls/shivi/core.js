const {Env} = require("./env");
const pr_str = require("./printer")
const {Symbol, Fn, Nil, List, Str} = require("./types");
const {isPrimitiveType} = require("./utils");

const core = new Env(null)
core.set(new Symbol('+'), (...list) => list.reduce((x, y) => x + y))
core.set(new Symbol('-'), (...list) => list.reduce((x, y) => x - y))
core.set(new Symbol('*'), (...list) => list.reduce((x, y) => x * y))
core.set(new Symbol('/'), (...list) => list.reduce((x, y) => x / y))

core.set(new Symbol('='), (x, y) => {
  return isPrimitiveType(x) ? x === y : x.equals(y);
})
core.set(new Symbol('<'), (x, y) => x < y)
core.set(new Symbol('>'), (x, y) => x > y)
core.set(new Symbol('<='), (x, y) => x <= y)
core.set(new Symbol('>='), (x, y) => x >= y)

core.set(new Symbol("prn"), (...list) => {
  console.log(list.map(x => pr_str(x, true)).join(" "))
  return new Nil()
})
core.set(new Symbol("println"), (x = "") => {
  console.log(pr_str(x))
  return new Nil()
})
core.set(new Symbol("pr-str"), (...args) => {
  return new Str(args.map((arg) => pr_str(arg, true)).join(" "))
})
core.set(new Symbol("list"), (...args) => new List(args))
core.set(new Symbol("list?"), (x) => x instanceof List)
core.set(new Symbol("empty?"), (x) => x.isEmpty())
core.set(new Symbol("count"), (x) => x.count())

module.exports = core
