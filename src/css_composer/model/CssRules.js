define([
    'skylark-backbone',
    './CssRule'
], function (Backbone, CssRule) {
    'use strict';
    return Backbone.Collection.extend({
        initialize(models, opt) {
            if (opt && opt.em)
                this.editor = opt.em;
            this.model = (attrs, options) => {
                var model;
                if (!options.em && opt && opt.em)
                    options.em = opt.em;
                switch (1) {
                default:
                    model = new CssRule(attrs, options);
                }
                return model;
            };
        },
        add(models, opt = {}) {
            if (typeof models === 'string') {
                models = this.editor.get('Parser').parseCss(models);
            }
            opt.em = this.editor;
            return Backbone.Collection.prototype.add.apply(this, [
                models,
                opt
            ]);
        }
    });
});