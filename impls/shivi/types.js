const {isPrimitiveType} = require("./utils");
const {Env} = require("./env");

class MalSequence {
  constructor(ast) {
    this.ast = ast
  }

  startsWith(str) {
    return this.ast[0] === str
  }

  isEmpty() {
    return this.count() === 0
  }

  count() {
    return this.ast.length
  }

  cons(element) {
    return new List([element, ...this.ast])
  }

  concat(other) {
    return new List(this.ast.concat(other.ast))
  }

  equals(other) {
    if (!(other instanceof MalSequence) || this.count() !== other.count()) return false
    for (let i = 0; i < this.count(); i++) {
      if (
        (typeof this.ast[i] !== typeof other.ast[i]) ||
        (!isPrimitiveType(this.ast[i]) && !this.ast[i].equals(other.ast[i]))
      ) return false
    }
    return true
  }

}

class List extends MalSequence {

  toString() {
    return `(${this.ast.map(ast => ast.toString()).join(" ")})`
  }

}

class Vector extends MalSequence {

  constructor(ast) {
    super();
    this.ast = ast.slice()
  }

  toString() {
    return `[${this.ast.map(ast => ast.toString()).join(" ")}]`
  }
}

class Nil {
  count() {
    return 0
  }

  equals(nil) {
    return nil instanceof Nil
  }

  toString() {
    return "nil"
  }
}

class Str {
  constructor(value) {
    this.value = value
  }

  concat(obj) {
    const objValue = (obj instanceof Str) ? obj.value : obj.toString();
    return new Str(this.value + objValue);
  }

  equals(str) {
    return this.value === str.value
  }

  toString(print_readably) {
    const string = `"${this.value}"`;
    if (print_readably)
      return `${string.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}`
    return string
  }
}

class HashMap {
  constructor(ast) {
    this.hashMap = new Map()
    for (let i = 0; i < ast.length; i += 2) {
      this.hashMap.set(ast[i], ast[i + 1])
    }
  }

  isEmpty() {
    return this.count() === 0
  }

  count() {
    return this.hashMap.size
  }

  toString() {
    let str = ""
    let separator = ""
    for (let [k, v] of this.hashMap.entries()) {
      str = `${str}${separator}${k.toString()} ${v.toString()}`
      separator = " "
    }
    return `{${str}}`
  }
}

class Keyword {
  constructor(keyword) {
    this.keyword = keyword
  }

  equals(keyword) {
    if (!(keyword instanceof Keyword)) return false
    return this.keyword === keyword.keyword
  }

  toString() {
    return `:${this.keyword}`
  }
}

class Symbol {
  constructor(symbol) {
    this.symbol = symbol
  }

  toString() {
    return `${this.symbol}`
  }

  equals(other) {
    if (!(other instanceof Symbol)) return false
    return this.symbol === other.symbol
  }
}

class WithMeta {
  constructor(ast) {
    this.ast = ast
  }

  toString() {
    return `(with-meta ${this.ast.toString()})`
  }
}

class Fn {
  constructor(fnBody, binds, env) {
    this.fnBody = fnBody
    this.binds = binds
    this.env = env
  }

  genEnv(args) {
    return new Env(this.env, this.binds, args)
  }

  toString() {
    return `#<function>`
  }
}

class Atom {
  constructor(value) {
    this.value = value
  }

  set(value) {
    this.value = value
    return value
  }

  toString() {
    return `(atom ${this.value})`
  }
}

module.exports = {
  Atom,
  List,
  Vector,
  Nil,
  Str,
  HashMap,
  Symbol,
  Keyword,
  WithMeta,
  Fn
}
