import Cite from "https://esm.sh/citation-js";
//import "npm:@citation-js/plugin-csl";

const testFunction = () => {
  console.log("not called forever");
};

/**
 * @param text
 * @returns
 */
const textToBibHtml = (text: string) => {
  const example = new Cite({ id: "a", title: "Item A" });
  return text;

  const output = example.format("bibliography", {
    format: "html",
    template: "apa",
    lang: "en-US",
  });
  return output;
};

export { textToBibHtml };
