const {Env} = require("./env");
const pr_str = require("./printer")
const {Symbol, Fn, Nil, List, Str} = require("./types");
const {isPrimitiveType} = require("./utils");

const core = new Env(null)
core.set(new Symbol('+'), new Fn((...list) => list.reduce((x, y) => x + y)))
core.set(new Symbol('-'), new Fn((...list) => list.reduce((x, y) => x - y)))
core.set(new Symbol('*'), new Fn((...list) => list.reduce((x, y) => x * y)))
core.set(new Symbol('/'), new Fn((...list) => list.reduce((x, y) => x / y)))

core.set(new Symbol('='), new Fn((x, y) => {
  return isPrimitiveType(x) ? x === y : x.equals(y);
}))
core.set(new Symbol('<'), new Fn((x, y) => x < y))
core.set(new Symbol('>'), new Fn((x, y) => x > y))
core.set(new Symbol('<='), new Fn((x, y) => x <= y))
core.set(new Symbol('>='), new Fn((x, y) => x >= y))

core.set(new Symbol("prn"), new Fn((x = new Nil()) => {
  console.log(pr_str(x))
  return new Nil()
}))
core.set(new Symbol("println"), new Fn((x = new Nil()) => {
  console.log(pr_str(x))
  return new Nil()
}))
core.set(new Symbol("pr-str"), new Fn((...args) => {
  return new Str(args.map(pr_str).join(""))
}))
core.set(new Symbol("list"), new Fn((...args) => new List(args)))
core.set(new Symbol("list?"), new Fn((x) => x instanceof List))
core.set(new Symbol("empty?"), new Fn((x) => x.isEmpty()))
core.set(new Symbol("count"), new Fn((x) => x.count()))

module.exports = core
