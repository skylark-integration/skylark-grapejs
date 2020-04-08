define([
    'skylark-backbone',
    './Category'
], function (Backbone, Category) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            activate: 0,
            select: 0,
            resetId: 0,
            label: '',
            media: '',
            content: '',
            category: '',
            attributes: {}
        },
        initialize(opts = {}) {
            let category = this.get('category');
            if (category) {
                if (typeof category == 'string') {
                    var catObj = new Category({
                        id: category,
                        label: category
                    });
                }
            }
        }
    });
});