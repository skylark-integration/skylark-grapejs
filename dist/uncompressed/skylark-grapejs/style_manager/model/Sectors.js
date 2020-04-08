define([
    'skylark-backbone',
    './Sector'
], function (Backbone, Sector) {
    'use strict';
    return Backbone.Collection.extend({ model: Sector });
});