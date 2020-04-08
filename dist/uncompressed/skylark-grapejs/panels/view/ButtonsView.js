define([
    'skylark-backbone',
    './ButtonView',
    'skylark-underscore'
], function (Backbone, ButtonView, a) {
    'use strict';
    return Backbone.View.extend({
        initialize(o) {
            this.opt = o || {};
            this.config = this.opt.config || {};
            this.pfx = this.config.stylePrefix || '';
            this.parentM = this.opt.parentM || null;
            this.listenTo(this.collection, 'add', this.addTo);
            this.listenTo(this.collection, 'reset remove', this.render);
            this.className = this.pfx + 'buttons';
        },
        addTo(model) {
            this.addToCollection(model);
        },
        addToCollection(model, fragmentEl) {
            var fragment = fragmentEl || null;
            var viewObject = ButtonView;
            var view = new viewObject({
                model,
                config: this.config,
                parentM: this.parentM
            });
            var rendered = view.render().el;
            if (fragment) {
                fragment.appendChild(rendered);
            } else {
                this.$el.append(rendered);
            }
            return rendered;
        },
        render() {
            var fragment = document.createDocumentFragment();
            this.$el.empty();
            this.collection.each(function (model) {
                this.addToCollection(model, fragment);
            }, this);
            this.$el.append(fragment);
            this.$el.attr('class', a.result(this, 'className'));
            return this;
        }
    });
});