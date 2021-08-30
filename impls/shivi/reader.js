const {
  List,
  Vector,
  Nil,
  HashMap,
  Symbol,
  Quote,
  QuasiQuote,
  UnQuote,
  SpliceUnQuote,
  Deref,
  WithMeta, Keyword
} = require("./types")

class Reader {
  constructor(tokens) {
    this.tokens = tokens.slice()
    this.position = 0
  }

  peek() {
    return this.tokens[this.position]
  }

  next() {
    const token = this.peek()
    if (token)
      this.position++
    return token
  }
}

const tokenize = (str) => {
  const regexp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g
  const result = []
  let match;
  while ((match = regexp.exec(str)[1]) !== "") {
    if (match[0] !== ";")
      result.push(match)
  }
  return result
}

const read_seq = (reader, closing) => {
  const ast = []
  let token
  while ((token = reader.peek()) !== closing) {
    if (token === undefined) {
      throw "unbalanced"
    } else {
      ast.push(read_form(reader))
    }
  }
  reader.next()
  return ast;
};

const read_atom = (reader) => {
  const token = reader.next()
  if (token.match(/^-?[0-9]+$/)) {
    return parseInt(token)
  }
  if (token.match(/^-?[0-9]+\.[0-9]+$/)) {
    return parseFloat(token)
  }
  if (token.match(/^"(?:\\.|[^\\"])*"$/)) {
    return token.slice(1, token.length - 1)
      .replace(/\\(.)/g, function (_, c) {
        return c === "n" ? "\n" : c
      })
  }
  if (token[0] === "\"") {
    throw new Error("expected '\"', got EOF");
  }
  if (token === "true") {
    return true
  }
  if (token === "false") {
    return false
  }
  if (token === "nil") {
    return new Nil()
  }
  // if (token.startsWith('"')) {
  //   if (token.match(/^"?.*[^\\]"$/g)) {
  //     return new Str(token.substring(1, token.length - 1))
  //   }
  //   if (token.endsWith('"') && token.length > 1) {
  //     let occurences = 0
  //     token.slice(1, -1).split(/\\/g).reverse().some((item, index) => {
  //       occurences = index
  //       return item
  //     })
  //     if (occurences % 2 === 0) {
  //       return new Str(token.substring(1, token.length - 1))
  //     }
  //   }
  //   throw "unbalanced"
  // }
  if (token.startsWith("'")) {
    return new Quote(read_form(reader))
  }
  if (token.startsWith("`")) {
    return new QuasiQuote(read_form(reader))
  }
  if (token.startsWith("~@")) {
    return new SpliceUnQuote(read_form(reader))
  }
  if (token.startsWith("~")) {
    return new UnQuote(read_form(reader))
  }
  if (token.startsWith("@")) {
    return new Deref(read_form(reader))
  }
  if (token.startsWith("^")) {
    return new WithMeta(read_form(reader))
  }
  if (token.startsWith(":")) {
    return new Keyword(token.slice(1))
  }
  return new Symbol(token)
}


const read_list = (reader) => {
  const ast = read_seq(reader, ")")
  return new List(ast)
};

const read_vector = (reader) => {
  const ast = read_seq(reader, "]");
  return new Vector(ast)
};

const read_hashMap = (reader) => {
  const ast = read_seq(reader, "}");
  if (ast.length % 2) {
    throw "unbalanced"
  }
  return new HashMap(ast)
};

const read_form = (reader) => {
  const token = reader.peek()
  switch (token[0]) {
    case "(":
      reader.next()
      return read_list(reader)
    case "[":
      reader.next()
      return read_vector(reader)
    case "{":
      reader.next()
      return read_hashMap(reader)
    case "]":
    case ")":
    case "}":
      reader.next()
      throw "unexpected"
  }
  return read_atom(reader)
};

const read_str = (str) => {
  const tokens = tokenize(str)
  const reader = new Reader(tokens)
  return read_form(reader)
}

module.exports = read_str

