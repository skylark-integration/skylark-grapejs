define(['./ComponentTextView'], function (ComponentView) {
    'use strict';
    return ComponentView.extend({
        render(...args) {
            ComponentView.prototype.render.apply(this, args);
            this.el.addEventListener('click', this.prevDef, true);
            return this;
        }
    });
});