define([
    'skylark-backbone',
    './PanelView'
], function (Backbone, PanelView) {
    'use strict';
    return Backbone.View.extend({
        initialize(o) {
            this.opt = o || {};
            this.config = this.opt.config || {};
            this.pfx = this.config.stylePrefix || '';
            const items = this.collection;
            this.listenTo(items, 'add', this.addTo);
            this.listenTo(items, 'reset', this.render);
            this.listenTo(items, 'remove', this.onRemove);
            this.className = this.pfx + 'panels';
        },
        onRemove(model) {
            const view = model.view;
            view && view.remove();
        },
        addTo(model) {
            this.addToCollection(model);
        },
        addToCollection(model, fragmentEl) {
            const fragment = fragmentEl || null;
            const config = this.config;
            const el = model.get('el');
            const view = new PanelView({
                el,
                model,
                config
            });
            const rendered = view.render().el;
            const appendTo = model.get('appendTo');
            if (el) {
            } else if (appendTo) {
                var appendEl = document.querySelector(appendTo);
                appendEl.appendChild(rendered);
            } else {
                if (fragment) {
                    fragment.appendChild(rendered);
                } else {
                    this.$el.append(rendered);
                }
            }
            view.initResize();
            return rendered;
        },
        render() {
            const $el = this.$el;
            const frag = document.createDocumentFragment();
            $el.empty();
            this.collection.each(model => this.addToCollection(model, frag));
            $el.append(frag);
            $el.attr('class', this.className);
            return this;
        }
    });
});