const readline = require("readline")
const read_str = require("./reader");
const pr_str = require("./printer")
const {Symbol, List, Vector, HashMap} = require("./types")
const {Env} = require("./env");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const env = new Env(null)
env.set(new Symbol('+'), (...list) => list.reduce((x, y) => x + y))
env.set(new Symbol('-'), (...list) => list.reduce((x, y) => x - y))
env.set(new Symbol('*'), (...list) => list.reduce((x, y) => x * y))
env.set(new Symbol('/'), (...list) => list.reduce((x, y) => x / y))

const eval_ast = (ast, env) => {
  if (ast instanceof Symbol) {
    return env.get(ast)
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
    const newList = []
    for (const [k, v] of ast.hashMap.entries()) {
      newList.push(EVAL(k, env))
      newList.push(EVAL(v, env))
    }
    return new HashMap(newList)
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

  switch (ast.ast[0].symbol) {
    case "def!":
      return env.set(ast.ast[1], EVAL(ast.ast[2], env))
    case "let*":
      const newEnv = new Env(env)
      const bindings = ast.ast[1].ast
      for (let i = 0; i < bindings.length; i += 2) {
        newEnv.set(bindings[i], EVAL(bindings[i + 1], newEnv))
      }
      return EVAL(ast.ast[2], newEnv)
    default:
      const [func, ...args] = eval_ast(ast, env).ast;
      return func(...args)
  }
}

const PRINT = (ast) => pr_str(ast)

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
