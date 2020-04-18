define([
    "skylark-langx/langx",
	'./PropertyRadio'
], function (
	langx,
	Property
) {
    'use strict';
    return Property.extend({
        defaults: () => ({
            ...Property.prototype.defaults(),
            full: 0
        })
    });
});