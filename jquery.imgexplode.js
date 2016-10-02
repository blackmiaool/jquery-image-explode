(function ($) {
    "use strict";
    var wrapperName = "explode-wrapper";
    $.fn.explodeRestore = function () {
        this.each(function () { //explode separately
            const $dom = $(this);
            $dom.show();
            $dom.siblings().filter(`.${wrapperName}`).remove();
        });
    }
    $.fn.explode = function (opt) {
        if (!opt || typeof opt !== "object") {
            opt = {};
        }

        const {
            minWidth = 3,
                omitLastLine = false,
                radius = 80,
                minRadius = 20,
                release = true,
                recycle = true,
                fill = true,
                explodeTime = 300,
                maxAngle = 360,
                gravity = 0,
                round = false,
                groundDistance = 400,
        } = opt;

        let {
            maxWidth
        } = opt;

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

        if ($target.prop("tagName") === "IMG") {
            background = {
                kind: "image",
                src: $target.attr("src"),
            };
        } else {
            background = {
                kind: "color",
                color: $target.css("background-color"),
            };
        }
        const ctxWidth = Math.max(w, radius * 2);
        const ctxHeight = Math.max(h, radius * 2, groundDistance * 2);
        if (!maxWidth) {
            maxWidth = minorDimension / 4;
        }
        const $wrapper = $("<div></div>", {
            "class": wrapperName,
        });
        const syncStyles = ["width", "height", "margin-top", "margin-right", "margin-bottom", "margin-left", "position", "top", "right", "bottom", "left", "float", "display"];
        syncStyles.forEach((v) => {
            $wrapper.css(v, $target.css(v));
        });
        //        $wrapper.css("background-color", "black");
        if ($wrapper.css("position") === "static") {
            $wrapper.css("position", "relative");
        }
        const targetDisplay = $target.css("display");
        const startRatio = 0.3;


        const rags = generateRags();
        getRagsFinalState();

        let $canvas;
        let ctx;
        const {
            naturalWidth,
            naturalHeight
        } = $target[0];
        //generate rags' body


        $canvas = $("<canvas></canvas>");
        $canvas.css({
            position: "absolute",
            left: -ctxWidth / 2,
            right: -ctxWidth / 2,
            top: -ctxHeight / 2,
            bottom: -ctxHeight / 2,
            margin: "auto",
            width: ctxWidth,
            height: ctxHeight,
        });
        $canvas.attr({
            width: ctxWidth,
            height: ctxHeight,
        })
        $wrapper.append($canvas);
        const scaleX = w / naturalWidth;
        const scaleY = h / naturalHeight;
        rags.forEach((rag, i) => {
            const {
                left,
                top,
                width: ragWidth,
                height: ragHeight,
            } = rag;

            ctx = $canvas[0].getContext("2d");
            rag.naturalParams = [left / scaleX, top / scaleY, ragWidth / scaleX, ragHeight / scaleY];

        });





        let remainCnt = rags.length;
        $target.hide();
        $target.after($wrapper);

        explodeCanvas(afterExplode);



        function afterExplode(cb) {
            const time0 = Date.now();

            if (gravity) {
                return;
                let vy = 0;
                let ybias = 0;

                let lastTime = time0;
                let leftCnt = rags.length;
                draw();

                function draw() {
                    console.log("d");
                    const time = Date.now();

                    let ratio = (time - lastTime) / explodeTime;
                    lastTime = time;
                    if (ratio > 1) {
                        cb && cb();
                        return;
                    }
                    ybias += (vy * ratio);
                    //                        console.log(ratio,vy*ratio);
                    ctx.clearRect(0, 0, ctxWidth, ctxHeight)
                    ratio = Math.sin(ratio * Math.PI / 2);

                    rags.forEach((rag, i) => {
                        let yb = ybias;
                        let transYMax = ctxHeight / 2 + groundDistance - rag.height / 2;
                        if (rag.translateY0 + rag.translateY + ybias > transYMax) {
                            if (!rag.land) {
                                rag.land = 1;
                                leftCnt--;
                            }
                            yb = transYMax - rag.translateY - rag.translateY0;
                        }
                        //                            console.log(1)
                        const {
                            left,
                            top,
                            width: ragWidth,
                            height: ragHeight,
                        } = rag;
                        ctx.save();


                        ctx.translate(rag.translateX0 + rag.translateX, rag.translateY0 + rag.translateY + yb);
                        ctx.rotate(rag.finalAngleRad);

                        ctx.drawImage($target[0], ...rag.naturalParams, -ragWidth / 2, -ragHeight / 2, ragWidth, ragHeight);


                        ctx.restore();
                    });
                    vy += gravity;
                    if (leftCnt) {
                        window.requestAnimationFrame(draw);
                    }

                }
            }

        }




        function setContent($dom) {
            switch (background.kind) {
            case "image":
                $dom.css("background-image", `url("${background.src}")`);
                break;
            case "color":
                $dom.css("background-color", `${background.color}`);
                break;
            default:
            }
        }

        function explodeCanvas(cb) {
            const startTime = Date.now();
            let lastTime = startTime;
            let leftCnt = rags.length;
            let biasVy = 0;

            rags.forEach((rag, i) => {
                rag.vx = rag.translateX / explodeTime * 1000;
                rag.vy = rag.translateY / explodeTime * 1000;

                rag.biasx = rag.translateX0;
                rag.biasy = rag.translateY0;
                rag.transYMax = ctxHeight / 2 + groundDistance - rag.height / 2;
            })
            draw();


            function drawGravity() {
                const time = Date.now();

            }

            function draw() {
                const time = Date.now();
                let ratio;
                let angleRatio;
                ratio = (time - lastTime) / 1000;
                angleRatio = (time - startTime) / explodeTime;
                if (gravity) {
                    biasVy += (gravity * ratio) * 300;
                } else {
                    if (angleRatio > 1) {
                        cb && cb();
                        return;
                    }                    
                    ratio *= Math.cos(angleRatio * Math.PI / 2) * Math.PI / 2;
                }
                lastTime = time;
                ctx.clearRect(0, 0, ctxWidth, ctxHeight)
                rags.forEach((rag) => {
                    ctx.save();
                    const {
                        left,
                        top,
                        width: ragWidth,
                        height: ragHeight,
                    } = rag;

                    if (!rag.land) {
                        rag.biasx += rag.vx * ratio;
                        rag.biasy += (rag.vy + biasVy) * ratio;

                        if (gravity) {
                            if (rag.biasy > rag.transYMax) {
                                leftCnt--;
                                rag.land = true;
                                rag.lastAngle = rag.finalAngleRad * angleRatio;
                                rag.biasy = rag.transYMax;
                            }
                        }
                    }

                    ctx.translate(rag.biasx, rag.biasy);

                    if (rag.lastAngle) {
                        ctx.rotate(rag.lastAngle);
                    } else {
                        ctx.rotate(rag.finalAngleRad * angleRatio);
                    }

                    if (round) {
                        ctx.beginPath();
                        ctx.arc(0, 0, ragWidth / 2, 0, Math.PI * 2, false);
                        ctx.closePath();
                        ctx.clip();
                    }

                    ctx.drawImage($target[0], ...rag.naturalParams, -ragWidth / 2, -ragHeight / 2, ragWidth, ragHeight);
                    ctx.restore();
                });
                if (gravity && !leftCnt) {
                    cb();
                }else{
                    window.requestAnimationFrame(draw);    
                }
                

            }

        }

        function random(min, max) {
            return parseInt(Math.random() * (max + 1 - min), 10) + min;
        }

        //generate final position and angle of rags
        function getRagsFinalState() {
            rags.forEach((v, i) => {
                const finalAngle = (((Math.random() * maxAngle * 2) - maxAngle) / ((Math.random() + 2) * v.width)) * 10;
                const finalAngleRad = finalAngle * (Math.PI / 180);

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


                let ratio = ((1 - startRatio) * (1 - (v.width - minWidth) / (maxWidth - minWidth)) + startRatio) * Math.random();
                ratio = 1 - (1 - ratio) * (1 - minRadius / radius);
                const finalDistance = (radius - distance) * ratio + distance;
                const distanceSquare = distance * distance;
                const translateX = (finalDistance - distance) * Math.sqrt((distanceSquare - y * y) / (distanceSquare)) * (x > 0 ? 1 : -1);
                const translateY = (finalDistance - distance) * Math.sqrt((distanceSquare - x * x) / (distanceSquare)) * (y > 0 ? 1 : -1);
                const translateX0 = (ctxWidth - w) / 2 + v.left + v.width / 2;
                const translateY0 = (ctxHeight - h) / 2 + v.top + v.height / 2;
                const attach = {
                    finalDistance,
                    ratio,
                    x,
                    y,
                    distance,
                    translateX,
                    translateY,
                    translateX0,
                    translateY0,
                    finalAngleRad,
                    finalAngle,
                };
                if (Object.assign) {
                    Object.assign(v, attach);
                } else {
                    for (var i in attach) {
                        v[i] = attach[i];
                    }
                }
            })
        }
        //generate inital position and dimension of rags
        //rewrite it to fit for you demand
        function generateRags() {
            let rowCnt;
            if (omitLastLine) {
                rowCnt = Math.floor(h / maxWidth);
            } else {
                rowCnt = Math.ceil(h / maxWidth);
            }

            const rags = [];

            for (let row = 0; row < rowCnt; row++) {
                generateRow(row);
            }

            function generateRow(row) {
                let rowSum = 0;
                const topBase = row * maxWidth;

                function generate(width) {
                    const left = rowSum;
                    rowSum += width;
                    rags.push({
                        left,
                        top: topBase,
                        width,
                        height: width,
                    });
                    if (fill) {
                        for (let i = 1; i < parseInt(maxWidth / width); i++) {
                            rags.push({
                                left,
                                top: topBase + i * width,
                                width,
                                height: width,
                            });
                        }
                    }
                }
                let width;
                do {
                    if (width) {
                        generate(width);
                    }
                    width = random(minWidth, maxWidth);
                } while (w > rowSum + width);
                if (w - rowSum >= minWidth) {
                    generate(w - rowSum);
                }
            }

            return rags;
        }
    };
})(window.jQuery);