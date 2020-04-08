define([
    'skylark-backbone',
    './Button'
], function (Backbone, Button) {
    'use strict';
    return Backbone.Collection.extend({
        model: Button,
        deactivateAllExceptOne(except, r) {
            this.forEach((model, index) => {
                if (model !== except) {
                    model.set('active', false);
                    if (r && model.get('buttons').length)
                        model.get('buttons').deactivateAllExceptOne(except, r);
                }
            });
        },
        deactivateAll(ctx, sender) {
            const context = ctx || '';
            this.forEach(model => {
                if (model.get('context') == context && model !== sender) {
                    model.set('active', false, { silent: 1 });
                    model.trigger('updateActive', { fromCollection: 1 });
                }
            });
        },
        disableAllButtons(ctx) {
            var context = ctx || '';
            this.forEach((model, index) => {
                if (model.get('context') == context) {
                    model.set('disable', true);
                }
            });
        },
        disableAllButtonsExceptOne(except, r) {
            this.forEach((model, index) => {
                if (model !== except) {
                    model.set('disable', true);
                    if (r && model.get('buttons').length)
                        model.get('buttons').disableAllButtonsExceptOne(except, r);
                }
            });
        }
    });
});