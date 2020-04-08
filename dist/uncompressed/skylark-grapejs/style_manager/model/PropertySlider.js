define([
    "skylark-langx/langx",
	'./PropertyInteger'
], function (Property) {
    'use strict';
    return Property.extend({
        defaults: {
            ...Property.prototype.defaults,
            showInput: 1
        }
    });
});