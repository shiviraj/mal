const {Nil} = require("./types");

class Env {
  constructor(env) {
    this.outer = env
    this.data = {}
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
