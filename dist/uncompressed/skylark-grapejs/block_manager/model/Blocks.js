define([
    'skylark-backbone',
    './Block'
], function (Backbone, Block) {
    'use strict';
    return Backbone.Collection.extend({ model: Block });
});