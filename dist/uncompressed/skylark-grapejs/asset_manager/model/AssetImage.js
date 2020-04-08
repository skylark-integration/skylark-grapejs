define([
    "skylark-langx/langx",
    './Asset'
], function (langx,Asset) {
    'use strict';
    return Asset.extend({
        defaults: langx.mixin({},Asset.prototype.defaults,{
            type: 'image',
            unitDim: 'px',
            height: 0,
            width: 0
        })
    });
});