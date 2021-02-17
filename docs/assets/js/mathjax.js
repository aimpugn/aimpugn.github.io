function renderMathInElementConfig(){
    // https://katex.org/docs/autorender.html
    renderMathInElement(document.body, {
        delimiters: [
            {left: "$$", right: "$$", display: true},
            /**
             * 없으면 github page에서 아래와 같이 나온다
             * \[\text{load factor} = \frac{\text{저장된 데이터 개수}}{\text{버킷의 개수}} = \frac{n}{k}\]
             */
            {left: "\\[", right: "\\]", display: true},
            // https://stackoverflow.com/a/45301641 
            // inline에서 사용 시 display는 false
            {left: "$", right: "$", display: false}
        ],
        ignoredTags: ["script", "noscript", "style", "option"],
        leqno: true,    // If true, display math has \tags rendered on the left instead of the right
        fleqn: true     // If true, display math renders flush left with a 2em left margin
    });
}