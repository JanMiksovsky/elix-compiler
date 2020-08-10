const fs = require("fs").promises;
const compile = require("./compile.js");

const demoSource = "demo/SpinBox.html";
const demoOutput = "demo/SpinBox.complete.ts";

async function main() {
  const buffer = await fs.readFile(demoSource);
  const source = buffer.toString();
  const compiled = compile(source);
  // console.log(compiled);
  await fs.writeFile(demoOutput, compiled);
}

(async function () {
  await main();
})();
