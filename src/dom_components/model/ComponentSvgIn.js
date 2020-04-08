define(['./ComponentSvg'], function (Component) {
    'use strict';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            selectable: false,
            hoverable: false,
            layerable: false
        }
    }, {
        isComponent(el) {
            if (Component.isComponent(el) && el.tagName.toLowerCase() !== 'svg') {
                return {
                    tagName: el.tagName,
                    type: 'svg-in'
                };
            }
        }
    });
});