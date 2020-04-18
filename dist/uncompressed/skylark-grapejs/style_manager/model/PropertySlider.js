define([
    "skylark-langx/langx",
	'./PropertyInteger'
], function (
	langx,
	Property
) {
    'use strict';
    return Property.extend({
        defaults: {
            ...Property.prototype.defaults,
            showInput: 1
        }
    });
});