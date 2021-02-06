function renderMathInElementConfig(){
    // https://katex.org/docs/autorender.html
    renderMathInElement(document.body, {
        delimiters: [
            {left: "$$", right: "$$", display: true},
            // https://stackoverflow.com/a/45301641 
            // inline에서 사용 시 display는 false
            {left: "$", right: "$", display: false}
        ],
        ignoredTags: ["script", "noscript", "style", "option"],
        leqno: true,    // If true, display math has \tags rendered on the left instead of the right
        fleqn: true     // If true, display math renders flush left with a 2em left margin
    });
}