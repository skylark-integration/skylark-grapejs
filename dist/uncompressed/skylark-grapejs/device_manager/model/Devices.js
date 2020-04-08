define([
    'skylark-backbone',
    './Device'
], function (Backbone, Device) {
    'use strict';
    return Backbone.Collection.extend({
        model: Device,
        comparator: (left, right) => {
            const max = Number.MAX_VALUE;
            return (right.get('priority') || max) - (left.get('priority') || max);
        },
        getSorted() {
            return this.sort();
        }
    });
});