define([
    "skylark-langx/langx",
    'skylark-underscore',
    '../../utils/mixins',
    './config/config',
    './model/Selector',
    './model/Selectors',
    './view/ClassTagsView'
], function (langx,_, b, defaults, Selector, Selectors, ClassTagsView) {
    'use strict';
    const isId = str => _.isString(str) && str[0] == '#';
    const isClass = str => _.isString(str) && str[0] == '.';
    return config => {
        var c = config || {};
        var selectors;
        return {
            Selector,
            Selectors,
            name: 'SelectorManager',
            getConfig() {
                return c;
            },
            init(conf = {}) {
                c = langx.mxinin({},defaults,conf);
                const em = c.em;
                const ppfx = c.pStylePrefix;
                this.em = em;
                if (ppfx) {
                    c.stylePrefix = ppfx + c.stylePrefix;
                }
                this.selectorTags = new ClassTagsView({
                    collection: new Selectors([], {
                        em,
                        config: c
                    }),
                    config: c
                });
                selectors = new Selectors(c.selectors);
                selectors.on('add', model => em.trigger('selector:add', model));
                selectors.on('remove', model => em.trigger('selector:remove', model));
                selectors.on('change', model => em.trigger('selector:update', model, model.previousAttributes(), model.changedAttributes()));
                em.on('change:state', (m, value) => em.trigger('selector:state', value));
                return this;
            },
            postRender() {
                const elTo = this.getConfig().appendTo;
                if (elTo) {
                    const el = _.isElement(elTo) ? elTo : document.querySelector(elTo);
                    el.appendChild(this.render([]));
                }
            },
            select(value, opts = {}) {
                const targets = Array.undefined(value) ? value : [value];
                const toSelect = this.em.get('StyleManager').setTarget(targets, opts);
                const res = toSelect.filter(i => i).map(sel => b.isComponent(sel) ? sel : b.isRule(sel) && !sel.get('selectorsAdd') ? sel : sel.getSelectorsString());
                this.selectorTags.componentChanged({ targets: res });
                return this;
            },
            setState(value) {
                this.em.setState(value);
                return this;
            },
            getState() {
                return this.em.setState();
            },
            addSelector(name, opt = {}) {
                let opts = langx.clone(opt);
                if (_.isObject(name)) {
                    opts = name;
                } else {
                    opts.name = name;
                }
                if (isId(opts.name)) {
                    opts.name = opts.name.substr(1);
                    opts.type = Selector.TYPE_ID;
                } else if (isClass(opts.name)) {
                    opts.name = opts.name.substr(1);
                }
                if (opts.label && !opts.name) {
                    opts.name = this.escapeName(opts.label);
                }
                const cname = opts.name;
                const selector = cname ? this.get(cname, opts.type) : selectors.where(opts)[0];
                if (!selector) {
                    return selectors.add(opts, { config: c });
                }
                return selector;
            },
            getSelector(name, type = Selector.TYPE_CLASS) {
                if (isId(name)) {
                    name = name.substr(1);
                    type = Selector.TYPE_ID;
                } else if (isClass(name)) {
                    name = name.substr(1);
                }
                return selectors.where({
                    name,
                    type
                })[0];
            },
            add(name, opts = {}) {
                if (_.isArray(name)) {
                    return name.map(item => this.addSelector(item, opts));
                } else {
                    return this.addSelector(name, opts);
                }
            },
            addClass(classes) {
                const added = [];
                if (_.isString(classes)) {
                    classes = classes.trim().split(' ');
                }
                classes.forEach(name => added.push(this.addSelector(name)));
                return added;
            },
            get(name, type) {
                if (_.isArray(name)) {
                    const result = [];
                    const selectors = name.map(item => this.getSelector(item)).filter(item => item);
                    selectors.forEach(item => result.indexOf(item) < 0 && result.push(item));
                    return result;
                } else {
                    return this.getSelector(name, type);
                }
            },
            getAll() {
                return selectors;
            },
            escapeName(name) {
                const {escapeName} = c;
                return escapeName ? escapeName(name) : Selector.escapeName(name);
            },
            render(selectors) {
                if (selectors) {
                    this.selectorTags = new ClassTagsView({
                        collection: new Selectors(selectors),
                        config: c
                    });
                    return this.selectorTags.render().el;
                } else
                    return this.selectorTags.render().el;
            }
        };
    };
});