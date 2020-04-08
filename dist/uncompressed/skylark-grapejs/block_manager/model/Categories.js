define([
    'skylark-backbone',
    './Category'
], function (Backbone, Category) {
    'use strict';
    return Backbone.Collection.extend({ model: Category });
});