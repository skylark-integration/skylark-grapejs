define(['skylark-backbone'], function (Backbone) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            title: '',
            content: '',
            open: false
        }
    });
});