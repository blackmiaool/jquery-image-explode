(function ($) {

    $.fn.explode = function ({
        minWidth = 3,
        maxWidth,
        omitLastLine = true,
        radius = 8,
        release = true,
        recycle = true,
        fill = true,
    }) {
        const $target = this;
        const args = arguments;
        $target.each(function () { //explode separately
            const $dom = $(this);
            if ($dom.prop("tagName") === "IMG") {
                if (!$dom.prop("complete")) {
                    $dom.on("load", function () {
                        $dom.explode.apply($dom, args);
                    });
                }
            }
        });



        const w = $target.width();
        const h = $target.height();
        const minorDimension = Math.min(w, h);
        let background;

        if ($target.prop('tagName') === 'IMG') {
            background = {
                kind: 'image',
                src: $target.attr('src'),
            };
        } else {
            background = {
                kind: 'color',
                color: $target.css('background-color'),
            };
        }

        if (!maxWidth) {
            maxWidth = minorDimension / 4;
        }
        const $wrapper = $('<div></div>', {
            "class": 'explode-wrapper',
        });
        const syncStyles = ['width', 'height', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'position', 'top', 'right', 'bottom', 'left',"float"];
        syncStyles.forEach((v) => {
            $wrapper.css(v, $target.css(v));
        });
        //        $wrapper.css("background-color", "black");
        if ($wrapper.css('position') === 'static') {
            $wrapper.css('position', 'relative');
        }
        const targetDisplay = $target.css("display");


        function random(min, max) {
            return parseInt(Math.random() * (max + 1 - min), 10) + min;
        }

        //generate position and dimension of rags
        //rewrite it to fit for you demand
        function generateRags() {
            let rowCnt;
            if (omitLastLine) {
                rowCnt = Math.floor(h / maxWidth);
            } else {
                rowCnt = Math.ceil(h / maxWidth);
            }
            let width;
            const rags = [];
            const ret = [];
            for (let row = 0; row < rowCnt; row++) {
                let rowSum = 0;
                let column = 0;
                const topBase = row * maxWidth;

                function generate(width) {
                    const left = rowSum;
                    rowSum += width;
                    rags.push({
                        left,
                        top: topBase,
                        width,
                    });
                    if (fill) {
                        for (let i = 1; i < parseInt(maxWidth / width); i++) {
                            rags.push({
                                left,
                                top: topBase + i * width,
                                width,
                            });
                        }
                    }
                }
                do {
                    if (width) {
                        generate(width);
                        column++;
                    }
                    width = random(minWidth, maxWidth);
                } while (w > rowSum + width);
                if (w - rowSum >= minWidth) {
                    generate(w - rowSum);
                }

            }
            return rags;
        }
        const rags = generateRags();
        let ragTop = 0;

        function setContent($dom) {
            switch (background.kind) {
            case 'image':
                $dom.css('background-image', `url("${background.src}")`);
                break;
            case 'color':
                $dom.css('background-color', `${background.color}`);
                break;
            default:
            }
        }
        rags.forEach((rag) => {
            const $dom = $('<div></div>', {});
            const {
                left,
                top,
                width
            } = rag;

            $dom.css({
                width,
                height: width,
                position: 'absolute',
                left,
                top,
                'background-size': `${w}px ${h}px`,
                'background-position': `${-left}px ${-top}px`,
            });
            setContent($dom);
            rag.$dom = $dom;
            $wrapper.append($dom);
        });

        let remainCnt = rags.length;
        const degMax = 720;
        rags.forEach((v, i) => {
            v.$dom.css('transition', '0.3s all ease-out');

            const rand1 = (Math.random() + 2) * v.width;

            v.finalAngle = (((Math.random() * degMax) - (degMax / 2)) / ((Math.random() + 2) * v.width)) * 10;
            //            rand=Math.max(rand,3)

            //coordinate based on center point
            let x = v.left + v.width / 2 - w / 2;
            let y = v.top + v.width / 2 - h / 2;

            if (x === 0) {
                x = i % 2 ? -1 : 1;
            }
            if (y === 0) {
                y = (i % 4 < 2) ? -1 : 1;
            }

            const distance = Math.sqrt(x * x + y * y);
            const startRatio = 0.3;
            const width = v.width;

            const ratio = ((1 - startRatio) * (1 - v.width / maxWidth) + startRatio) * Math.random();
            const distanceResult = (radius - distance) * ratio + distance;

            const distanceSquare = distance * distance;
            v.translateX = (distanceResult - distance) * Math.sqrt((distanceSquare - y * y) / (distanceSquare)) * (x > 0 ? 1 : -1);
            v.translateY = (distanceResult - distance) * Math.sqrt((distanceSquare - x * x) / (distanceSquare)) * (y > 0 ? 1 : -1);
            if (release) {
                setTimeout(() => {
                    v.$dom.fadeOut({
                        done: function () {
                            v.$dom.remove();
                            remainCnt--;
                            if (!remainCnt) {
                                //                                $target.css("display",targetDisplay);
                                $target.fadeIn();
                                $wrapper.remove();
                            }
                        },
                    });
                }, 3000 / ratio);
            }
        });

        rags[0].$dom.on("transitionstart", function () {
            console.log(1)
        });
        $target.hide();
        $target.after($wrapper);
        $wrapper.css({
            'background-size': `${w}px ${h}px`,
            'background-position': `${0}px ${0}px`,
        });
        setContent($wrapper);
        setTimeout(function () {

            for (let i in rags) {
                const rag = rags[i];
                rag.$dom.css('transform', `translate(${rag.translateX}px,${rag.translateY}px) rotate(${rag.finalAngle}deg)`);
            }
            setTimeout(function () {
                $wrapper.css("background-image", "none");
            });
        });
    };
})(jQuery);