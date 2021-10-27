const fs = require("fs");
const Scanner = require("./scanner");
const arguments = process.argv.slice(2);
const memoria = require('./memory').memory;

function main(args) {
  if (args.length > 1) {
    throw new Error("Unknown arguments provided");
  } else if (args.length === 1) {
    runFile(args[0]);
  } else {
    runPrompt();
  }
}

async function runFile(path) {
  const script = await fs.promises.readFile(path);
  run(script.toString());
}

function run(source){
  const scanner = new Scanner.scanner(source);
  const tokens = scanner.scanTokens();

  console.log('TABLA TOKENS\n');
  console.table(tokens)
  console.log('TABLA DE SIMBOLOS\n',memoria,'\n');
}

main(arguments);
