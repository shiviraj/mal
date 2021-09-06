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
  if (ast === undefined) {
    return new Nil()
  }
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

const listQuasiQuote = ast => {
  let result = new List([])
  for (let i = ast.count() - 1; i >= 0; i--) {
    const elt = ast.ast[i]
    if (elt instanceof List && elt.ast[0] instanceof Symbol && elt.ast[0].symbol === "splice-unquote") {
      result = new List([new Symbol("concat"), elt.ast[1], result])
    } else {
      result = new List([new Symbol("cons"), quasiquote(elt), result])
    }
  }
  return result
};

const quasiquote = (ast) => {
  if (ast instanceof List && ast.ast[0] instanceof Symbol && ast.ast[0].symbol === "unquote") {
    return ast.ast[1]
  }

  if (ast instanceof List) {
    return listQuasiQuote(ast);
  }

  if (ast instanceof Vector) {
    const result = listQuasiQuote(ast);
    return new List([new Symbol("vec"), result])
  }

  if (ast instanceof Symbol || ast instanceof HashMap) {
    return new List([new Symbol("quote"), ast]);
  }
  return ast;
}

const EVAL = (ast, env) => {
  while (true) {
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
        env = newEnv
        ast = ast.ast[2]
        break
      case "do":
        for (let i = 1; i < ast.ast.length - 1; i++) {
          EVAL(ast.ast[i], env)
        }
        ast = ast.ast[ast.ast.length - 1]
        break
      case "fn*":
        const binds = ast.ast[1].ast
        const fnBody = ast.ast[2]
        return new Fn(fnBody, binds, env)

      case "if":
        const resultOfCondition = EVAL(ast.ast[1], env)
        if (resultOfCondition === false || resultOfCondition === undefined || resultOfCondition instanceof Nil) {
          ast = ast.ast[3]
        } else {
          ast = ast.ast[2]
        }
        break

      case "str":
        if (!ast.ast[1]) return new Str("")
        const str = ast.ast.slice(1).reduce((result, ast) => result.concat(EVAL(ast, env)), "");
        return new Str(str)

      case "quote":
        return ast.ast[1]

      case "quasiquote":
        ast = quasiquote(ast.ast[1]);
        continue;

      case "quasiquoteexpand":
        return quasiquote(ast.ast[1]);

      default:
        const newList = eval_ast(ast, env);
        const fnToCall = newList.ast[0]
        if (fnToCall instanceof Fn) {
          ast = fnToCall.fnBody
          env = fnToCall.genEnv(newList.ast.slice(1))
        } else {
          return fnToCall.apply(fnToCall, newList.ast.slice(1))
        }
    }
  }
}

const PRINT = (ast) => pr_str(ast, true)

const rep = (str) => PRINT(EVAL(READ(str), core))

rep("(def! not (fn* (a) (if a false true)))")
rep("(def! load-file (fn* (f) (eval (read-string (str \"(do \" (slurp f) \"\nnil)\")))))");
core.set(new Symbol("eval"), (ast) => EVAL(ast, core))
core.set(new Symbol('*ARGV*'), new List([]));

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
