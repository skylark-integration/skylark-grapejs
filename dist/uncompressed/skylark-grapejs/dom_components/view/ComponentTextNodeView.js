define(['skylark-backbone'], function (Backbone) {
    'use strict';
    return Backbone.View.extend({
        initialize() {
            const {$el, model} = this;
            $el.data('model', model);
            model.view = this;
        },
        _createElement() {
            return document.createTextNode(this.model.get('content'));
        }
    });
});