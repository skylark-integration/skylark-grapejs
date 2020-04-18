define([
    'skylark-underscore',
    'skylark-backbone',
    './Selector'
], function (a, Backbone, Selector) {
    'use strict';
    return Backbone.Collection.extend({
        model: Selector,
        modelId: attr => `${ attr.name }_${ attr.type || Selector.TYPE_CLASS }`,
        getStyleable() {
            return a.filter(this.models, item => item.get('active') && !item.get('private'));
        },
        getValid({noDisabled} = {}) {
            return a.filter(this.models, item => !item.get('private')).filter(item => noDisabled ? item.get('active') : 1);
        },
        getFullString(collection, opts = {}) {
            const result = [];
            const coll = collection || this;
            coll.forEach(selector => result.push(selector.getFullName(opts)));
            return result.join('').trim();
        }
    });
});