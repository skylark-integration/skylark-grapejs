define([
    'skylark-backbone',
    'skylark-underscore'
], function (Backbone, a) {
    'use strict';
    return Backbone.View.extend({
        initialize(o) {
            this.opts = o || {};
            this.config = o.config || {};
            this.em = this.config.em;
            const coll = this.collection;
            this.listenTo(coll, 'add', this.addTo);
            this.listenTo(coll, 'reset', this.resetChildren);
            this.listenTo(coll, 'remove', this.removeChildren);
        },
        removeChildren(removed, coll, opts = {}) {
            const {em} = this.config;
            const tempRemove = opts.temporary;
            removed.views.forEach(view => {
                if (!view)
                    return;
                view.remove.apply(view);
                const {childrenView, scriptContainer} = view;
                childrenView && childrenView.stopListening();
                scriptContainer && scriptContainer.remove();
            });
            removed.components().forEach(it => this.removeChildren(it, coll, opts));
            if (em && !tempRemove) {
                const id = removed.getId();
                const domc = em.get('DomComponents');
                delete domc.componentsById[id];
                const allRules = em.get('CssComposer').getAll();
                allRules.remove(allRules.filter(rule => rule.getSelectors().getFullString() === `#${ id }`));
                if (!removed.opt.temporary) {
                    const cm = em.get('Commands');
                    const hasSign = removed.get('style-signature');
                    const optStyle = { target: removed };
                    hasSign && cm.run('core:component-style-clear', optStyle);
                    removed.removed();
                    em.trigger('component:remove', removed);
                }
            }
        },
        addTo(model, coll = {}, opts = {}) {
            const em = this.config.em;
            const i = this.collection.indexOf(model);
            this.addToCollection(model, null, i);
            if (em && !opts.temporary) {
                const triggerAdd = model => {
                    em.trigger('component:add', model);
                    model.components().forEach(comp => triggerAdd(comp));
                };
                triggerAdd(model);
            }
        },
        addToCollection(model, fragmentEl, index) {
            if (!this.compView)
                this.compView = require('./ComponentView').default;
            const {config, opts, em} = this;
            const fragment = fragmentEl || null;
            const dt = opts.componentTypes || em && em.get('DomComponents').getTypes();
            const type = model.get('type');
            let viewObject = this.compView;
            for (let it = 0; it < dt.length; it++) {
                if (dt[it].id == type) {
                    viewObject = dt[it].view;
                    break;
                }
            }
            const view = new viewObject({
                model,
                config,
                componentTypes: dt
            });
            let rendered = view.render().el;
            if (fragment) {
                fragment.appendChild(rendered);
            } else {
                const parent = this.parentEl;
                const children = parent.childNodes;
                if (!a.isUndefined(index)) {
                    const lastIndex = children.length == index;
                    if (lastIndex) {
                        index--;
                    }
                    if (lastIndex || !children.length) {
                        parent.appendChild(rendered);
                    } else {
                        parent.insertBefore(rendered, children[index]);
                    }
                } else {
                    parent.appendChild(rendered);
                }
            }
            return rendered;
        },
        resetChildren() {
            this.parentEl.innerHTML = '';
            this.collection.each(model => this.addToCollection(model));
        },
        render(parent) {
            const el = this.el;
            const frag = document.createDocumentFragment();
            this.parentEl = parent || this.el;
            this.collection.each(model => this.addToCollection(model, frag));
            el.innerHTML = '';
            el.appendChild(frag);
            return this;
        }
    });
});