define(['./Component'], function (Component) {
    'use strict';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            type: 'text',
            droppable: false,
            editable: true
        },
        toHTML() {
            this.trigger('sync:content', { silent: 1 });
            return Component.prototype.toHTML.apply(this, arguments);
        }
    });
});