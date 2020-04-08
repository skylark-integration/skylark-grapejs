define([
    'skylark-backbone',
    './Command'
], function (Backbone, Command) {
    'use strict';
    return Backbone.Collection.extend({ model: Command });
});