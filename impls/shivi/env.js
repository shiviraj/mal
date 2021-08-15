const {Nil} = require("./types");

class Env {
  constructor(env, binds = [], exprs = []) {
    this.outer = env
    this.data = {}
    for (let i = 0; i < binds.length; i++) {
      this.data[binds[i]] = exprs[i]
    }
  }

  set(key, value) {
    this.data[key.symbol] = value
    return value
  }

  find(key) {
    if (key in this.data) {
      return this
    }
    if (!this.outer) {
      return new Nil()
    }
    return this.outer.find(key)
  }

  get(key) {
    const env = this.find(key.symbol)
    if (env instanceof Nil) {
      throw `${key.symbol} not found`
    }
    return env.data[key.symbol]
  }
}

module.exports = {Env}
