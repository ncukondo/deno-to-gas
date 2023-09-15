const main = (function() {
    const textToBibHtml = (text)=>{
        return text;
        const example = new Cite({
            id: "a",
            title: "Item A"
        });
        const output = example.format("bibliography", {
            format: "html",
            template: "apa",
            lang: "en-US"
        });
        return output;
    };
    console.log(textToBibHtml(""));
    return {
        textToBibHtml: textToBibHtml
    };
})();

function textToBibHtml(...args){ return main.textToBibHtml(...args);}