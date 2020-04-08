define([
    "skylark-langx/langx",
	'./PropertyRadio'
], function (Property) {
    'use strict';
    return Property.extend({
        defaults: () => ({
            ...Property.prototype.defaults(),
            full: 0
        })
    });
});