const {Str} = require("./types");
const pr_str = (ast, print_readably = false) => {
  if (ast instanceof Str)
    return ast.toString(print_readably);
  return ast.toString();
};

module.exports = pr_str
