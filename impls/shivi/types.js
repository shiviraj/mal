const {isPrimitiveType} = require("./utils");
const {Env} = require("./env");

class List {
  constructor(ast) {
    this.ast = ast
  }

  isEmpty() {
    return this.count() === 0
  }

  count() {
    return this.ast.length
  }

  equals(list) {
    if (!(list instanceof List || list instanceof Vector) || this.count() !== list.count()) return false
    for (let i = 0; i < this.ast.length; i++) {
      if (
        (typeof this.ast[i] !== typeof list.ast[i]) ||
        (!isPrimitiveType(this.ast[i]) && !this.ast[i].equals(list.ast[i]))
      ) return false
    }
    return true
  }

  toString() {
    return `(${this.ast.map(ast => ast.toString()).join(" ")})`
  }
}

class Vector {
  constructor(ast) {
    this.ast = ast
  }

  isEmpty() {
    return this.count() === 0
  }

  count() {
    return this.ast.length
  }

  equals(vector) {
    if (!(vector instanceof Vector || vector instanceof List) || this.count() !== vector.count()) return false
    for (let i = 0; i < this.count(); i++) {
      if (
        (typeof this.ast[i] !== typeof vector.ast[i]) ||
        (!isPrimitiveType(this.ast[i]) && !this.ast[i].equals(vector.ast[i]))
      ) return false
    }
    return true
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
}

class Quote {
  constructor(ast) {
    this.ast = ast
  }

  toString() {
    return `(quote ${this.ast.toString()})`
  }
}

class QuasiQuote {
  constructor(ast) {
    this.ast = ast
  }

  toString() {
    return `(quasiquote ${this.ast.toString()})`
  }
}


class UnQuote {
  constructor(ast) {
    this.ast = ast
  }

  toString() {
    return `(unquote ${this.ast.toString()})`
  }
}

class SpliceUnQuote {
  constructor(ast) {
    this.ast = ast
  }

  toString() {
    return `(splice-unquote ${this.ast.toString()})`
  }
}

class Deref {
  constructor(symbol) {
    this.symbol = symbol
  }

  toString() {
    return `(deref ${this.symbol.toString()})`
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

module.exports = {
  List,
  Vector,
  Nil,
  Str,
  HashMap,
  Symbol,
  Keyword,
  Quote,
  QuasiQuote,
  UnQuote,
  SpliceUnQuote,
  Deref,
  WithMeta, Fn
}
