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
            /**
             * 없으면 github page에서 아래와 같이 나온다
             * \(7\cdot 16^2 + 10\cdot 16^1 + 15\) \(7\cdot 256 + 10\cdot 16^1 + 15\) \(1,792 + 160 + 15\) \(1,967\)
             */
            {left: "\\(", right: "\\)", display: false},
            // https://stackoverflow.com/a/45301641 
            // inline에서 사용 시 display는 false
            {left: "$", right: "$", display: false}
        ],
        ignoredTags: ["script", "noscript", "style", "option"],
        leqno: true,    // If true, display math has \tags rendered on the left instead of the right
        fleqn: true     // If true, display math renders flush left with a 2em left margin
    });
}

function mermaidConfig(){
    var config = {
        theme:'forest',
        logLevel:'fatal',
        securityLevel:'loose',
        startOnLoad:true,
        arrowMarkerAbsolute:false,

        er:{
            diagramPadding:20,
            layoutDirection:'TB',
            minEntityWidth:100,
            minEntityHeight:75,
            entityPadding:15,
            stroke:'gray',
            fill:'honeydew',
            fontSize:12,
            useMaxWidth:true,
        },
        flowchart:{
            diagramPadding:8,
            htmlLabels:true,
            curve:'linear',
        },
        sequence:{
            diagramMarginX:50,
            diagramMarginY:10,
            actorMargin:50,
            width:150,
            height:65,
            boxMargin:10,
            boxTextMargin:5,
            noteMargin:10,
            messageMargin:35,
            messageAlign:'center',
            mirrorActors:true,
            bottomMarginAdj:1,
            useMaxWidth:true,
            rightAngles:false,
            showSequenceNumbers:false,
        },
        gantt:{
            titleTopMargin:25,
            barHeight:20,
            barGap:4,
            topPadding:50,
            leftPadding:75,
            gridLineStartPadding:35,
            fontSize:11,
            fontFamily:'"Open-Sans", "sans-serif"',
            numberSectionStyles:4,
            axisFormat:'%Y-%m-%d',
        }
    };
    mermaid.initialize(config);
    // https://github.com/mermaidjs/mermaid-gitbook/blob/master/content/usage.md#calling-mermaidinit
    // 원래는 자동으로 init이 실행되지만, 이 경우 수동으로 추가해서 자동으로 실행이 안 되는 듯 하니, 수동으로 init
    window.mermaid.init(undefined, document.querySelectorAll('.language-mermaid'));
}