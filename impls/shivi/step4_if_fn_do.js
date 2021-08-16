const readline = require("readline")
const read_str = require("./reader");
const pr_str = require("./printer")
const {Symbol, List, Vector, HashMap, Nil, Fn, Str} = require("./types")
const core = require("./core");
const {Env} = require("./env");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
  if (ast === undefined) {
    return new Nil()
  }
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
      let evaluatedResult = new Nil()
      ast.ast.slice(2).forEach((x) => (evaluatedResult = EVAL(x, newEnv)))
      return evaluatedResult

    case "do":
      let result = new Nil()
      for (let i = 1; i < ast.ast.length; i++) {
        result = EVAL(ast.ast[i], env)
      }
      return result
    case "fn*":
      const binds = ast.ast[1].ast
      const fnBody = ast.ast[2]
      const fn = (...args) => {
        const newFnEnv = new Env(env, binds, args)
        return EVAL(fnBody, newFnEnv)
      };
      return new Fn(fn)

    case "if":
      const resultOfCondition = EVAL(ast.ast[1], env)
      return (resultOfCondition === false || resultOfCondition === undefined || resultOfCondition instanceof Nil)
        ? EVAL(ast.ast[3], env)
        : EVAL(ast.ast[2], env)

    case "str":
      if (!ast.ast[1]) return new Str("")
      return ast.ast.slice(1).reduce((result, ast) => result.concat(EVAL(ast, env)), new Str(""))
    default:
      const [func, ...args] = eval_ast(ast, env).ast;
      return func.apply(args)
  }
}

const PRINT = (ast) => pr_str(ast)

const rep = (str) => PRINT(EVAL(READ(str), core))
rep("(def! not (fn* (a) (if a false true)))")

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
