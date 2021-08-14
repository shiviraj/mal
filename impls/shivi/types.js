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

module.exports = {List, Vector, Nil, Str, HashMap, Symbol}
