const readline = require("readline")
const read_str = require("./reader");
const pr_str = require("./printer")
const {Symbol, List, Vector, HashMap} = require("./types")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const env = {
  '+': (...list) => list.reduce((x, y) => x + y),
  '-': (...list) => list.reduce((x, y) => x - y),
  '*': (...list) => list.reduce((x, y) => x * y),
  '/': (...list) => list.reduce((x, y) => x / y),
  'PI': Math.PI
}

const eval_ast = (ast, env) => {
  if (ast instanceof Symbol) {
    return env[ast.symbol]
  }
  if (ast instanceof List) {
    const newAst = ast.ast.map(item => EVAL(item, env));
    return new List(newAst)
  }
  if (ast instanceof Vector) {
    const newAst = ast.ast.map(item => EVAL(item, env));
    return new Vector(newAst)
  }
  if (ast instanceof HashMap) {
    const newAst = ast.ast.map((item, index) => index % 2 ? EVAL(item, env) : item);
    return new HashMap(newAst)
  }
  return ast
}

const READ = (str) => read_str(str)

const EVAL = (ast, env) => {
  if (!(ast instanceof List)) {
    return eval_ast(ast, env)
  }
  if (ast.isEmpty()) {
    return ast
  }
  const [func, ...args] = eval_ast(ast, env).ast;
  return func(...args)
}
const PRINT = (ast) => {
  return pr_str(ast);
}

const rep = (str) => PRINT(EVAL(READ(str), env))

const loop = () => {
  rl.question("user> ", (str) => {
    try {
      console.log(rep(str));
    } catch (e) {
      console.error(e)
    } finally {
      loop()
    }
  })
}

loop()
