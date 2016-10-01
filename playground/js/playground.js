var ng = angular.module("app", []);

function extend(dest, src) {
    for (var i in src) {
        dest[i] = src[i];
    }
}
const settings = {
    previewDelay: {
        name: "previewDelay",
        type: "number",
        title: "Delay time of exploding after adjusting params(ms)",
        min: 100,
        max: 3000,
        value: 500,
    },
    imageUrl: {
        name: "imageUrl",
        type: "string",
        title: "You can use base64 image",
        min: 1,
        max: 100,
        value: 12
    },
};
const params = [
    {
        name: "minWidth",
        type: "number",
        title: "Minimum rag size",
        min: 1,
        max: 100,
        value: 3
    },
    {
        name: "maxWidth",
        type: "number",
        title: "Maximum rag size(px)",
        min: 1,
        max: 100,
        value: 12
    },
    {
        name: "radius",
        type: "number",
        title: "Explode radius(px)",
        min: 50,
        max: 300,
        value: 235,
    },
    {
        name: "release",
        type: "boolean",
        title: "If release rags after explosion",
        value: false,
    },
    {
        name: "recycle",
        type: "boolean",
        title: "If recycle rags after explosion",
        value: false,
    },
    {
        name: "explodeTime",
        type: "number",
        title: "The time during the explosion",
        min: 50,
        max: 1000,
        value: 231,
    },
    {
        name: "canvas",
        type: "boolean",
        title: "If use canvas",
        value: true,
    },
    {
        name: "round",
        type: "boolean",
        title: "If use round rags",
        value: false,
    },
    {
        name: "minAngle",
        type: "number",
        title: "The minimum angle rags rotate",
        min: 0,
        max: 5000,
        value: 0,
    },
    {
        name: "maxAngle",
        type: "number",
        title: "The maximum angle rags rotate",
        min: 0,
        max: 1000,
        value: 360,
    },
    {
        name: "gravity",
        type: "number",
        title: "If enable gravity effect",
        min: 0,
        max: 30,
        value: 10,
    },
];
ng.controller("RootController", ["$scope", "$rootScope", function (sp, rsp) {

    function explode() {
        $("img").explodeRestore();
        setTimeout(function () {
            let p = {};
            params.forEach(function (v) {
                if (v.type === "number") {
                    v.value = parseInt(v.value);
                }
                p[v.name] = v.value;
            });

            console.log(p);
            $("img").explode(p);
        }, 600);
    }
    function timeoutFunc(){
        timeout = 0;
        explode();
    }
    let timeout;
//    let timeout = setTimeout(timeoutFunc, settings.previewDelay.value);
    sp.$watch("params", function (v,p) {
        if(JSON.stringify(v)===JSON.stringify(p)){
            return;
        }

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(timeoutFunc, settings.previewDelay.value);
    }, true);
    extend(sp, {
        explode,
        params,
        settings
    })
}]);