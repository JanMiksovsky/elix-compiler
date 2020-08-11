const fs = require("fs").promises;
const compile = require("./compile.js");

const demoHtml = "demo/SpinBox.html";
const demoCss = "demo/SpinBox.css";
const demoOutput = "demo/build/SpinBox.complete.ts";

async function main() {
  const html = (await fs.readFile(demoHtml)).toString();
  const css = (await fs.readFile(demoCss)).toString();
  const compiled = compile(html, css);
  // console.log(compiled);
  await fs.writeFile(demoOutput, compiled);
}

(async function () {
  await main();
})();
