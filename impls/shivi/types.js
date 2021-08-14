class List {
  constructor(ast) {
    this.ast = ast
  }

  isEmpty() {
    return this.ast.length === 0
  }

  toString() {
    return `(${this.ast.map(ast => ast.toString()).join(" ")})`
  }
}

class Vector {
  constructor(ast) {
    this.ast = ast
  }

  toString() {
    return `[${this.ast.map(ast => ast.toString()).join(" ")}]`
  }
}

class Nil {
  toString() {
    return "nil"
  }
}

class Str {
  constructor(value) {
    this.value = value
  }

  toString() {
    return `"${this.value}"`
  }
}

class HashMap {
  constructor(ast) {
    this.ast = ast
  }

  toString() {
    return `{${this.ast.map(ast => ast.toString()).join(" ")}}`
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

module.exports = {List, Vector, Nil, Str, HashMap, Symbol, Quote, QuasiQuote, UnQuote, SpliceUnQuote, Deref, WithMeta}
