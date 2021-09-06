const {Env} = require("./env");
const pr_str = require("./printer")
const {Symbol, Nil, List, Str, Atom, Vector} = require("./types");
const {isPrimitiveType} = require("./utils");
const read_str = require("./reader");
const fs = require("fs");

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

core.set(new Symbol("atom"), (arg) => new Atom(arg))
core.set(new Symbol("atom?"), (arg) => arg instanceof Atom)
core.set(new Symbol("deref"), (atom) => atom.value)
core.set(new Symbol("reset!"), (atom, value) => atom.set(value))

core.set(new Symbol("cons"), (element, seq) => seq.cons(element))
core.set(new Symbol("concat"), (...lists) => {
  const list = new List([])
  return lists.reduce((a, b) => a.concat(b), list)
})

core.set(new Symbol("read-string"), (str) => read_str(str))
core.set(new Symbol("slurp"), (filename) => fs.readFileSync(filename, "utf8"))
core.set(new Symbol("vec"), (seq) => new Vector([...seq.ast]))


module.exports = core
