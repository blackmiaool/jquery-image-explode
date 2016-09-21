(function($) {
    $.fn.explode = function({
        minWidth = 1,
        maxWidth,
        omitLastLine = true
    }) {
        const $target = this;
        let w = $target.width();
        let h = $target.height();
        let minorDimension = Math.min(w, h);
        let backgroundImage=$target.attr("src");
        if (!maxWidth) {
            maxWidth = minorDimension / 2;
        }
        let $wrapper = $(`<div></div>`, {
            class: "explode-wrapper",
        });
        let syncStyles = ["width", "height", "margin-top", "margin-right", "margin-bottom", "margin-left", "position", "top", "right", "bottom", "left"];
        syncStyles.forEach(function(v) {
            $wrapper.css(v, $target.css(v));
        });
//        $wrapper.css("background-color", "black");
        if ($wrapper.css("position") === "static") {
            $wrapper.css("position", "relative");
        }

        this.replaceWith($wrapper);

        function random(min, max) {
            max++;
            return parseInt(Math.random() * (max - min)) + min;
        }
        window.random = random;

        function generateRags({
            w,
            h,
            minWidth,
            maxWidth,
            omitLastLine
        }) {
            let rowCnt;
            if (omitLastLine) {
                rowCnt = Math.floor(h / maxWidth);
            } else {
                rowCnt = Math.ceil(h / maxWidth);
            }
            let value;

            let ret = [];
            for (var row = 0; row < rowCnt; row++) {
                let rowSum = 0;
                let column = 0;
                do {
                    if (value) {
                        rowSum += value;
                        if (ret[row] === undefined) {
                            ret[row] = [];
                        }
                        ret[row][column] = value;
                        column++;
                    }
                    value = random(minWidth, maxWidth);
                } while (w > rowSum + value);
                ret[row][column] = w-rowSum;
            }
            
           
            return ret;
        }
        let ragMap = generateRags({
            w,
            h,
            minWidth,
            maxWidth,
            omitLastLine
        });
        let ragTop=0;  
        let rags=[];
        ragMap.forEach(function(v, row) {
            let left=0;
            v.forEach(function(u, column, a) {
                
                const $dom=$(`<div></div>`,{});
                $dom.css({
                        width:u,
                        height:u,
                        position:"absolute",
                        left,
                        top:ragTop,
                        "background-image":`url("${backgroundImage}")`,
                        "background-size":`${w}px ${h}px`,
                        "background-position": `${-left}px ${-ragTop}px`
                    });
                rags.push({
                    $dom,
                    left,
                    top:ragTop,
                    width:u,
                })
                left+=u;
                $wrapper.append($dom);
            });
            ragTop+=maxWidth;
        });
        let centerX=w/2;
        let centerY=h/2;
        rags.forEach(function(v,i){            
            v.$dom.css("transition","0.3s all ease-out");
            
            let rand1=(Math.random()+2)*v.width;
            let degMax=720;
            let rand2=(Math.random()*degMax-degMax/2)/((Math.random()+2)*v.width)*10;
//            rand=Math.max(rand,3)
            let ratio=8/rand1;
            setTimeout(function(){
                v.$dom.css("transform",`translate(${(v.left-centerX)*ratio}px,${(v.top-centerY+maxWidth)*ratio}px) rotate(${rand2}deg)`);    
            })            
        })
    }
})(jQuery);