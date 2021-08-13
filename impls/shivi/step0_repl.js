const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const READ = (text) => text
const EVAL = (argv, env) => argv
const PRINT = (argv) => console.log(argv)

const rep = (str) => PRINT(EVAL(READ(str), {}))


const loop = () => {
  rl.question("user> ", (str) => {
    rep(str)
    loop()
  })
}

loop()

