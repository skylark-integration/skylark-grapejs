define([
    'skylark-backbone',
    './Panel'
], function (Backbone, Panel) {
    'use strict';
    return Backbone.Collection.extend({ model: Panel });
});