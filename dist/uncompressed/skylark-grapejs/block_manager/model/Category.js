define([
	'skylark-backbone'
], function (Backbone) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            id: '',
            label: '',
            open: true,
            attributes: {}
        }
    });
});