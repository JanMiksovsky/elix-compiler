const JSDOM = require("jsdom").JSDOM;

let generatedIdCount = 0;

function compile(source) {
  const dom = new JSDOM(source);
  const window = dom.window;
  const template = window.document.querySelector("template");
  const references = findReferences(template.content);
  const render = generateRender(references);
  const shadow = serializeTemplateContents(template);
  return `import { ids, firstRender, raiseChangeEvents, render, state, template } from "elix/src/core/internal";
import { templateFrom } from "elix/src/core/htmlLiterals";
import SpinBox from "./SpinBox";
export default class SpinBoxComplete extends SpinBox {
${render}
  get [template]() {
    return templateFrom.html\`${shadow}\`;
  }
}
customElements.define("spin-box", SpinBoxComplete);
`;
}

function generateRender(references) {
  if (references.length === 0) {
    return "";
  }

  const eventReferences = references.filter(({ name }) =>
    name.startsWith("on")
  );
  const events = eventReferences.map(({ id, name, value }) => {
    const eventName = name.slice(2);
    const event = `      this[ids].${id}.addEventListener("${eventName}", () => {
        this[raiseChangeEvents] = true;
        this.${value}();
        this[raiseChangeEvents] = false;
      });
`;
    return event;
  });
  const eventBlock = events.join("");
  const firstRenderBlock =
    events.length > 0
      ? `    if (this[firstRender]) {
${eventBlock}    }
`
      : "";

  const updateReferences = references.filter(
    ({ name }) => !name.startsWith("on")
  );
  const updates = updateReferences.map(
    ({ id, name, value }) =>
      `    if (changed.${value}) {
      (this[ids].${id} as any).${name} = this[state].${value};
    }`
  );
  const updateBlock = updates.join("\n");

  const render = `  [render](changed) {
    super[render](changed);
${firstRenderBlock}${updateBlock}
  }
`;
  return render;
}

function findReferences(tree) {
  const nodes = walkTree(tree);
  const references = [];
  for (let node of nodes) {
    if (node.attributes) {
      for (let attribute of [...node.attributes]) {
        if (isReference(attribute.value)) {
          const name = attribute.name;
          references.push({
            id: ensureId(node),
            name,
            value: attribute.value.slice(1, -1), // Remove braces
          });
          // Since we'll compile the attribute, remove it from the node.
          node.removeAttribute(name);
        }
      }
    }
    if (isReference(node.textContent)) {
      references.push({
        id: ensureId(node),
        name: "textContent",
        value: node.textContent.slice(1, -1), // Remove braces
      });
      // Since we'll compile the text content, remove it from the node.
      node.textContent = "";
    }
  }
  return references;
}

function ensureId(node) {
  if (!node.id) {
    node.id = `_id${generatedIdCount++}`;
  }
  return node.id;
}

function isReference(text) {
  return text.startsWith("{") && text.endsWith("}");
}

function serializeTemplateContents(template) {
  const dom = JSDOM.fragment("<div></div>");
  const div = dom.firstChild;
  const clone = template.content.cloneNode(true);
  div.append(clone);
  return div.innerHTML;
}

function* walkTree(node) {
  yield node;
  const childNodes = node.childNodes;
  if (childNodes) {
    for (let i = 0; i < childNodes.length; i++) {
      yield* walkTree(childNodes[i]);
    }
  }
}

module.exports = compile;
