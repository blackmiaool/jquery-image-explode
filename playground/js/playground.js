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
        value: 0,
        initValue: 500,
    },
    imageUrl: {
        name: "imageUrl",
        type: "string",
        title: "You can use base64 image",
        value: "../try-jquery.jpg",
        initValue: "../try-jquery.jpg",
    },
};
const params = [
    {
        name: "minWidth",
        type: "number",
        title: "Minimum rag size",
        min: 1,
        max: 100,
        value: 0,
        initValue: 3,
    },
    {
        name: "maxWidth",
        type: "number",
        title: "Maximum rag size(px)",
        min: 1,
        max: 100,
        value: 0,
        initValue: 12,
    },
    {
        name: "radius",
        type: "number",
        title: "Explode radius(px)",
        min: 50,
        max: 300,
        value: 0,
        initValue: 235,
    },
    {
        name: "release",
        type: "boolean",
        title: "If release rags after explosion",
        value: false,
        initValue: false,
    },
    {
        name: "recycle",
        type: "boolean",
        title: "If recycle rags after explosion",
        value: false,
        initValue: false,
    },
    {
        name: "explodeTime",
        type: "number",
        title: "The time during the explosion",
        min: 50,
        max: 1000,
        value: 0,
        initValue: 231,
    },
    {
        name: "canvas",
        type: "boolean",
        title: "If use canvas",
        value: true,
        initValue: true,
    },
    {
        name: "round",
        type: "boolean",
        title: "If use round rags",
        value: false,
        initValue: false,
    },
    {
        name: "minAngle",
        type: "number",
        title: "The minimum angle rags rotate",
        min: 0,
        max: 5000,
        value: 0,
        initValue: 0,
    },
    {
        name: "maxAngle",
        type: "number",
        title: "The maximum angle rags rotate",
        min: 0,
        max: 1000,
        value: 0,
        initValue: 360,
    },
    {
        name: "gravity",
        type: "number",
        title: "If enable gravity effect",
        min: 0,
        max: 30,
        value: 0,
        initValue: 10,
    },
];
ng.controller("RootController", ["$scope", "$rootScope", "$timeout", function (sp, rsp, $timeout) {

    function explode() {
        $("img").explodeRestore();
        $timeout(function () {
            let p = {};
            params.forEach(function (v) {
                let value;
                if (v.type === "number") {
                    value = parseInt(v.value);
                }
                p[v.name] = value;
            });

            console.log(p);
            $("img").explode(p);
        }, 600);
    }

    function timeoutFunc() {
        timeout = 0;
        explode();
    }
    let timeout;
    //    let timeout = setTimeout(timeoutFunc, settings.previewDelay.value);
    function update(v, p){
        if (JSON.stringify(v) === JSON.stringify(p)) {
            return;
        }

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(timeoutFunc, settings.previewDelay.value);
    }
    sp.$watch("params", update, true);
    sp.$watch("settings", update, true);

    function setDefaultValue(obj) {
        for (var i in obj) {
            obj[i].value = obj[i].initValue;
        }
    }
    $timeout(function () {
        setDefaultValue(settings);
        setDefaultValue(params);
    });
    extend(sp, {
        explode,
        params,
        settings
    });
}]);