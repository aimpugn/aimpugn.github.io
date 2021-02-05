document.addEventListener('DOMContentLoaded', (e) => {

});

function renderMathInElementConfig(){
    renderMathInElement(document.body, {
        delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "$", right: "$", display: false},
            {left: "\\(", right: "\\)", display: true},
            {left: "\\[", right: "\\]", display: true}
        ],
        ignoredTags: ["script", "noscript", "style", "option"],
        leqno: true,    // If true, display math has \tags rendered on the left instead of the right
        fleqn: true     // If true, display math renders flush left with a 2em left margin
    });
}