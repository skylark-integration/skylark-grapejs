define([    
    "skylark-langx/langx",
    './ComponentText'
], function (langx,Component) {
    'use strict';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            tagName: 'label',
            traits: [
                'id',
                'title',
                'for'
            ]
        }
    }, {
        isComponent(el) {
            if (el.tagName == 'LABEL') {
                return { type: 'label' };
            }
        }
    });
});