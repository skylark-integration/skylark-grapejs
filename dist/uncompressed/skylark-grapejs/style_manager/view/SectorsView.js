define([
    'skylark-backbone',
    'skylark-underscore',
    '../../utils/mixins',
    '../../utils/dom',
    './SectorView'
], function (Backbone, a, b, c, SectorView) {
    'use strict';
    const helperCls = 'hc-state';
    return Backbone.View.undefined({
        initialize(o = {}) {
            const config = o.config || {};
            this.pfx = config.stylePrefix || '';
            this.ppfx = config.pStylePrefix || '';
            this.target = o.target || {};
            this.config = config;
            const target = {};
            a.extend(target, Backbone.Events);
            const body = document.body;
            const dummy = document.createElement(`el-${ new Date().getTime() }`);
            body.appendChild(dummy);
            target.computedDefault = { ...window.getComputedStyle(dummy) };
            body.removeChild(dummy);
            this.propTarget = target;
            const coll = this.collection;
            const events = 'component:toggled component:update:classes change:state change:device frame:resized';
            this.listenTo(coll, 'add', this.addTo);
            this.listenTo(coll, 'reset', this.render);
            this.listenTo(this.target, events, this.targetUpdated);
        },
        addTo(model, coll, opts = {}) {
            this.addToCollection(model, null, opts);
        },
        toggleStateCls(targets = [], enable) {
            targets.forEach(trg => {
                const el = trg.getEl();
                el && el.classList[enable ? 'add' : 'remove'](helperCls);
            });
        },
        targetUpdated(trg) {
            const em = this.target;
            const pt = this.propTarget;
            const targets = em.getSelectedAll();
            let model = em.getSelected();
            const mdToClear = trg && !!trg.toHTML ? trg : model;
            mdToClear && this.toggleStateCls([mdToClear]);
            if (!model)
                return;
            const config = em.get('Config');
            const state = !config.devicePreviewMode ? em.get('state') : '';
            const {componentFirst} = em.get('SelectorManager').getConfig();
            const el = model.getEl();
            pt.helper = null;
            pt.targets = null;
            if (el && b.isTaggableNode(el)) {
                const stateStr = state ? `:${ state }` : null;
                pt.computed = window.getComputedStyle(el, stateStr);
            }
            const appendStateRule = (style = {}) => {
                const cc = em.get('CssComposer');
                const rules = cc.getAll();
                let helperRule = cc.getClassRule(helperCls);
                if (!helperRule) {
                    helperRule = cc.setClassRule(helperCls);
                } else {
                    rules.remove(helperRule);
                    rules.add(helperRule);
                }
                helperRule.set('important', 1);
                helperRule.setStyle(style);
                pt.helper = helperRule;
            };
            model = em.get('StyleManager').getModelToStyle(model);
            if (state) {
                appendStateRule(model.getStyle());
                this.toggleStateCls(targets, 1);
            }
            pt.model = model;
            if (componentFirst)
                pt.targets = targets;
            pt.trigger('update');
        },
        setTarget(target, opts = {}) {
            const em = this.target;
            const trgs = a.isArray(target) ? target : [target];
            const {targetIsClass, stylable} = opts;
            const models = [];
            trgs.forEach(target => {
                let model = target;
                if (a.isString(target)) {
                    let rule;
                    const rules = em.get('CssComposer').getAll();
                    if (targetIsClass) {
                        rule = rules.filter(rule => rule.get('selectors').getFullString() === target)[0];
                    }
                    if (!rule) {
                        rule = rules.filter(rule => rule.get('selectorsAdd') === target)[0];
                    }
                    if (!rule) {
                        rule = rules.add({
                            selectors: [],
                            selectorsAdd: target
                        });
                    }
                    stylable && rule.set({ stylable });
                    model = rule;
                }
                models.push(model);
            });
            const pt = this.propTarget;
            pt.targets = models;
            pt.trigger('update');
            return models;
        },
        addToCollection(model, fragmentEl, opts = {}) {
            const {pfx, target, propTarget, config, el} = this;
            const appendTo = fragmentEl || el;
            const rendered = new SectorView({
                model,
                id: `${ pfx }${ model.get('id') }`,
                name: model.get('name'),
                properties: model.get('properties'),
                target,
                propTarget,
                config
            }).render().el;
            c.appendAtIndex(appendTo, rendered, opts.at);
            return rendered;
        },
        render() {
            const frag = document.createDocumentFragment();
            const $el = this.$el;
            const pfx = this.pfx;
            const ppfx = this.ppfx;
            $el.empty();
            this.collection.each(model => this.addToCollection(model, frag));
            $el.append(frag);
            $el.addClass(`${ pfx }sectors ${ ppfx }one-bg ${ ppfx }two-color`);
            return this;
        }
    });
});