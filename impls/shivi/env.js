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
    if (this.outer === null) {
      return null
    }
    return this.outer.find(key)
  }

  get(key) {
    const env = this.find(key.symbol)
    if (env !== null) {
      return env.data[key.symbol]
    } else {
      throw `${key.symbol} not found`
    }
  }
}

module.exports = {Env}
