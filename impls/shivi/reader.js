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

const read_list = (reader) => {
  const ast = []
  let token
  while ((token = reader.peek()) !== ")") {
    if (!token) {
      throw "unbalanced"
    } else {
      ast.push(read_form(reader))
    }
  }
  reader.next()
  return ast
};

const read_atom = (reader) => {
  const token = reader.next()
  if (token.match(/^-?[0-9]+$/)) {
    return parseInt(token)
  }
  if (token.match(/^-?[0-9]+\.[0-9]+$/)) {
    return parseFloat(token)
  }
  return token
};

const read_form = (reader) => {
  const token = reader.peek()
  switch (token[0]) {
    case "(":
      reader.next()
      return read_list(reader)
  }
  return read_atom(reader)
};

const read_str = (str) => {
  const tokens = tokenize(str)
  const reader = new Reader(tokens)
  return read_form(reader)
}

module.exports = read_str

