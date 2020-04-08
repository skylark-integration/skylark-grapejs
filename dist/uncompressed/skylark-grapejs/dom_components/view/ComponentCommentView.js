define(['./ComponentTextNodeView'], function (ComponentView) {
    'use strict';
    return ComponentView.extend({
        _createElement() {
            return document.createComment(this.model.get('content'));
        }
    });
});