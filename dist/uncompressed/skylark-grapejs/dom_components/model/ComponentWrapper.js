define(['./Component'], function (Component) {
    'use strict';
    return Component.extend({}, {
        isComponent() {
            return false;
        }
    });
});