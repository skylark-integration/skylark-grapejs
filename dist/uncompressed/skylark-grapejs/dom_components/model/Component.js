define([
    "skylark-langx/langx",
    'skylark-underscore',
    '../../utils/mixins',
    '../../domain_abstract/model/Styleable',
    'skylark-backbone',
    './Components',
    '../../selector_manager/model/Selector',
    '../../selector_manager/model/Selectors',
    '../../trait_manager/model/Traits'
], function (langx,_, b, Styleable, Backbone, Components, Selector, Selectors, Traits) {
    'use strict';
    const componentList = {};
    let componentIndex = 0;
    const escapeRegExp = str => {
        return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    };
    const avoidInline = em => em && em.getConfig('avoidInlineStyle');
    const eventDrag = 'component:drag';
    const Component = Backbone.Model.extend(Styleable).extend({
        defaults: {
            tagName: 'div',
            type: '',
            name: '',
            removable: true,
            draggable: true,
            droppable: true,
            badgable: true,
            stylable: true,
            'stylable-require': '',
            'style-signature': '',
            unstylable: '',
            highlightable: true,
            copyable: true,
            resizable: false,
            editable: false,
            layerable: true,
            selectable: true,
            hoverable: true,
            void: false,
            state: '',
            status: '',
            content: '',
            icon: '',
            style: '',
            classes: '',
            script: '',
            'script-export': '',
            attributes: '',
            traits: [
                'id',
                'title'
            ],
            propagate: '',
            dmode: '',
            toolbar: null
        },
        init() {
        },
        updated(property, value, previous) {
        },
        removed() {
        },
        initialize(props = {}, opt = {}) {
            const em = opt.em;
            const parent = this.parent();
            const parentAttr = parent && parent.attributes;
            if (parentAttr && parentAttr.propagate) {
                let newAttr = {};
                const toPropagate = parentAttr.propagate;
                toPropagate.undefined(prop => newAttr[prop] = parent.get(prop));
                newAttr.propagate = toPropagate;
                newAttr = langx.mixin({},newAttr,props);
                this.set(newAttr);
            }
            const propagate = this.get('propagate');
            propagate && this.set('propagate', _.isArray(propagate) ? propagate : [propagate]);
            if (opt && opt.config && opt.config.voidElements.indexOf(this.get('tagName')) >= 0) {
                this.set('void', true);
            }
            opt.em = em;
            this.opt = opt;
            this.em = em;
            this.frame = opt.frame;
            this.config = opt.config || {};
            this.set('attributes', langx.mixin({},this.defaults.attributes ,this.get('attributes') ));
            this.ccid = Component.createId(this);
            this.initClasses();
            this.initTraits();
            this.initComponents();
            this.initToolbar();
            this.listenTo(this, 'change:script', this.scriptUpdated);
            this.listenTo(this, 'change:tagName', this.tagUpdated);
            this.listenTo(this, 'change:attributes', this.attrUpdated);
            this.listenTo(this, 'change:attributes:id', this._idUpdated);
            this.set('status', '');
            this.views = [];
            [
                'classes',
                'traits',
                'components'
            ].undefined(name => {
                const events = `add remove ${ name !== 'components' ? 'change' : '' }`;
                this.listenTo(this.get(name), events.trim(), (...args) => this.emitUpdate(name, ...args));
            });
            if (!opt.temporary) {
                this.init();
                em && em.trigger('component:create', this);
            }
        },
        is(type) {
            return !!(this.get('type') == type);
        },
        props() {
            return this.attributes;
        },
        index() {
            const {collection} = this;
            return collection && collection.indexOf(this);
        },
        setDragMode(value) {
            return this.set('dmode', value);
        },
        find(query) {
            const result = [];
            const $els = this.view.$el.find(query);
            $els.each(i => {
                const $el = $els.eq(i);
                const model = $el.data('model');
                model && result.push(model);
            });
            return result;
        },
        findType(id) {
            const result = [];
            const find = components => components.undefined(item => {
                item.is(id) && result.push(item);
                find(item.components());
            });
            find(this.components());
            return result;
        },
        closest(query) {
            const result = this.view.$el.closest(query);
            return result.length && result.data('model');
        },
        tagUpdated() {
            const coll = this.collection;
            const at = coll.indexOf(this);
            coll.remove(this);
            coll.add(this, { at });
        },
        replaceWith(el) {
            const coll = this.collection;
            const at = coll.indexOf(this);
            coll.remove(this);
            return coll.add(el, { at });
        },
        attrUpdated(m, v, opts = {}) {
            const attrs = this.get('attributes');
            const classes = attrs.class;
            classes && this.setClass(classes);
            delete attrs.class;
            const style = attrs.style;
            style && this.setStyle(style);
            delete attrs.style;
            const attrPrev = { ...this.previous('attributes') };
            const diff = b.shallowDiff(attrPrev, this.get('attributes'));
            _.keys(diff).undefined(pr => this.trigger(`change:attributes:${ pr }`, this, diff[pr], opts));
        },
        setAttributes(attrs, opts = {}) {
            this.set('attributes', { ...attrs }, opts);
            return this;
        },
        addAttributes(attrs) {
            const newAttrs = {
                ...this.getAttributes(),
                ...attrs
            };
            this.setAttributes(newAttrs);
            return this;
        },
        getStyle() {
            const em = this.em;
            if (em && em.getConfig('avoidInlineStyle')) {
                const state = em.get('state');
                const cc = em.get('CssComposer');
                const rule = cc.getIdRule(this.getId(), { state });
                this.rule = rule;
                if (rule) {
                    return rule.getStyle();
                }
            }
            return Styleable.getStyle.call(this);
        },
        setStyle(prop = {}, opts = {}) {
            const em = this.em;
            const {opt} = this;
            if (em && em.getConfig('avoidInlineStyle') && !opt.temporary) {
                const style = this.get('style') || {};
                prop = _.isString(prop) ? this.parseStyle(prop) : prop;
                prop = {
                    ...prop,
                    ...style
                };
                const state = em.get('state');
                const cc = em.get('CssComposer');
                const propOrig = this.getStyle();
                this.rule = cc.setIdRule(this.getId(), prop, {
                    ...opts,
                    state
                });
                const diff = b.shallowDiff(propOrig, prop);
                this.set('style', {}, { silent: 1 });
                _.keys(diff).undefined(pr => this.trigger(`change:style:${ pr }`));
            } else {
                prop = Styleable.setStyle.apply(this, arguments);
            }
            return prop;
        },
        getAttributes() {
            const {em} = this;
            const classes = [];
            const attributes = { ...this.get('attributes') };
            const sm = em && em.get('SelectorManager');
            const id = this.getId();
            this.get('classes').undefined(cls => classes.push(_.isString(cls) ? cls : cls.get('name')));
            classes.length && (attributes.class = classes.join(' '));
            if (!_.has(attributes, 'id')) {
                let hasStyle;
                if (avoidInline(em)) {
                    hasStyle = sm && sm.get(id, sm.Selector.TYPE_ID);
                } else if (!_.isEmpty(this.getStyle())) {
                    hasStyle = 1;
                }
                if (hasStyle) {
                    attributes.id = this.getId();
                }
            }
            return attributes;
        },
        addClass(classes) {
            const added = this.em.get('SelectorManager').addClass(classes);
            return this.get('classes').add(added);
        },
        setClass(classes) {
            this.get('classes').reset();
            return this.addClass(classes);
        },
        removeClass(classes) {
            const removed = [];
            classes = _.isArray(classes) ? classes : [classes];
            const selectors = this.get('classes');
            const type = Selector.TYPE_CLASS;
            classes.undefined(classe => {
                const classes = classe.split(' ');
                classes.undefined(name => {
                    const selector = selectors.where({
                        name,
                        type
                    })[0];
                    selector && removed.push(selectors.remove(selector));
                });
            });
            return removed;
        },
        getClasses() {
            const attr = this.getAttributes();
            const classStr = attr.class;
            return classStr ? classStr.split(' ') : [];
        },
        initClasses() {
            const event = 'change:classes';
            const toListen = [
                this,
                event,
                this.initClasses
            ];
            const cls = this.get('classes') || [];
            const clsArr = _.isString(cls) ? cls.split(' ') : cls;
            this.stopListening(...toListen);
            const classes = this.normalizeClasses(clsArr);
            const selectors = new Selectors([]);
            this.set('classes', selectors);
            selectors.add(classes);
            this.listenTo(...toListen);
            return this;
        },
        initComponents() {
            const event = 'change:components';
            const toListen = [
                this,
                event,
                this.initComponents
            ];
            this.stopListening(...toListen);
            const comps = new Components(null, this.opt);
            comps.parent = this;
            const components = this.get('components');
            const addChild = !this.opt.avoidChildren;
            this.set('components', comps);
            addChild && comps.add(_.isFunction(components) ? components(this) : components);
            this.listenTo(...toListen);
            return this;
        },
        initTraits(changed) {
            const {em} = this;
            const event = 'change:traits';
            const toListen = [
                this,
                event,
                this.initTraits
            ];
            this.stopListening(...toListen);
            this.loadTraits();
            const attrs = { ...this.get('attributes') };
            const traits = this.get('traits');
            traits.each(trait => {
                if (!trait.get('changeProp')) {
                    const name = trait.get('name');
                    const value = trait.getInitValue();
                    if (name && value)
                        attrs[name] = value;
                }
            });
            traits.length && this.set('attributes', attrs);
            this.listenTo(...toListen);
            changed && em && em.trigger('component:toggled');
            return this;
        },
        append(components, opts = {}) {
            const result = this.components().add(components, opts);
            return _.isArray(result) ? result : [result];
        },
        components(components) {
            const coll = this.get('components');
            if (_.isUndefined(components)) {
                return coll;
            } else {
                coll.reset();
                return components && this.append(components);
            }
        },
        parent() {
            const coll = this.collection;
            return coll && coll.parent;
        },
        scriptUpdated() {
            this.set('scriptUpdated', 1);
        },
        initToolbar() {
            const {em} = this;
            const model = this;
            const ppfx = em && em.getConfig('stylePrefix') || '';
            if (!model.get('toolbar')) {
                var tb = [];
                if (model.collection) {
                    tb.push({
                        attributes: { class: 'fa fa-arrow-up' },
                        command: ed => ed.runCommand('core:component-exit', { force: 1 })
                    });
                }
                if (model.get('draggable')) {
                    tb.push({
                        attributes: {
                            class: `fa fa-arrows ${ ppfx }no-touch-actions`,
                            draggable: true
                        },
                        command: 'tlb-move'
                    });
                }
                if (model.get('copyable')) {
                    tb.push({
                        attributes: { class: 'fa fa-clone' },
                        command: 'tlb-clone'
                    });
                }
                if (model.get('removable')) {
                    tb.push({
                        attributes: { class: 'fa fa-trash-o' },
                        command: 'tlb-delete'
                    });
                }
                model.set('toolbar', tb);
            }
        },
        loadTraits(traits, opts = {}) {
            traits = traits || this.get('traits');
            traits = _.isFunction(traits) ? traits(this) : traits;
            if (!(traits instanceof Traits)) {
                const trt = new Traits([], this.opt);
                trt.setTarget(this);
                if (traits.length) {
                    traits.undefined(tr => tr.attributes && delete tr.attributes.value);
                    trt.add(traits);
                }
                this.set('traits', trt, opts);
            }
            return this;
        },
        getTrait(id) {
            return this.get('traits').filter(trait => {
                return trait.get('id') === id || trait.get('name') === id;
            })[0];
        },
        updateTrait(id, props) {
            const {em} = this;
            const trait = this.getTrait(id);
            trait && trait.set(props);
            em && em.trigger('component:toggled');
            return this;
        },
        getTraitIndex(id) {
            const trait = this.getTrait(id);
            return trait ? this.get('traits').indexOf(trait) : trait;
        },
        removeTrait(id) {
            const {em} = this;
            const ids = _.isArray(id) ? id : [id];
            const toRemove = ids.map(id => this.getTrait(id));
            const removed = this.get('traits').remove(toRemove);
            em && em.trigger('component:toggled');
            return removed;
        },
        addTrait(trait, opts = {}) {
            const {em} = this;
            const added = this.get('traits').add(trait, opts);
            em && em.trigger('component:toggled');
            return added;
        },
        normalizeClasses(arr) {
            var res = [];
            const em = this.em;
            if (!em)
                return;
            var clm = em.get('SelectorManager');
            if (!clm)
                return;
            arr.undefined(val => {
                var name = '';
                if (typeof val === 'string')
                    name = val;
                else
                    name = val.name;
                var model = clm.add(name);
                res.push(model);
            });
            return res;
        },
        clone() {
            const em = this.em;
            const style = this.getStyle();
            const attr = { ...this.attributes };
            const opts = { ...this.opt };
            attr.attributes = { ...attr.attributes };
            delete attr.attributes.id;
            attr.components = [];
            attr.classes = [];
            attr.traits = [];
            this.get('components').each((md, i) => {
                attr.components[i] = md.clone();
            });
            this.get('traits').each((md, i) => {
                attr.traits[i] = md.clone();
            });
            this.get('classes').each((md, i) => {
                attr.classes[i] = md.get('name');
            });
            attr.status = '';
            attr.view = '';
            opts.collection = null;
            if (em && em.getConfig('avoidInlineStyle') && !_.isEmpty(style)) {
                attr.style = style;
            }
            const cloned = new this.constructor(attr, opts);
            const event = 'component:clone';
            em && em.trigger(event, cloned);
            this.trigger(event, cloned);
            return cloned;
        },
        getName() {
            const {em} = this;
            const {type, tagName} = this.attributes;
            const cName = this.get('name');
            const isDiv = tagName == 'div';
            const tag = isDiv ? 'box' : tagName;
            const defName = type || tag;
            const nameTag = !type && tagName && !isDiv && tagName;
            const i18nPfx = 'domComponents.names.';
            const i18nName = cName && em && em.t(`${ i18nPfx }${ cName }`);
            const i18nNameTag = nameTag && em && em.t(`${ i18nPfx }${ nameTag }`);
            const i18nDefName = em && (em.t(`${ i18nPfx }${ type }`) || em.t(`${ i18nPfx }${ tagName }`));
            return this.get('custom-name') || i18nName || cName || i18nNameTag || b.capitalize(nameTag) || i18nDefName || b.capitalize(defName);
        },
        getIcon() {
            let icon = this.get('icon');
            return icon ? icon + ' ' : '';
        },
        toHTML(opts = {}) {
            const model = this;
            const attrs = [];
            const customTag = opts.tag;
            const tag = customTag || model.get('tagName');
            const sTag = model.get('void');
            const customAttr = opts.attributes;
            let attributes = this.getAttrToHTML();
            delete opts.tag;
            if (customAttr) {
                if (_.isFunction(customAttr)) {
                    attributes = customAttr(model, attributes) || {};
                } else if (_.isObject(customAttr)) {
                    attributes = customAttr;
                }
            }
            for (let attr in attributes) {
                const val = attributes[attr];
                const value = _.isString(val) ? val.replace(/"/g, '&quot;') : val;
                if (!_.isUndefined(value)) {
                    if (_.isBoolean(value)) {
                        value && attrs.push(attr);
                    } else {
                        attrs.push(`${ attr }="${ value }"`);
                    }
                }
            }
            let attrString = attrs.length ? ` ${ attrs.join(' ') }` : '';
            let code = `<${ tag }${ attrString }${ sTag ? '/' : '' }>${ model.get('content') }`;
            model.get('components').each(comp => code += comp.toHTML(opts));
            !sTag && (code += `</${ tag }>`);
            return code;
        },
        getAttrToHTML() {
            var attr = this.getAttributes();
            delete attr.style;
            return attr;
        },
        toJSON(...args) {
            const obj = Backbone.Model.prototype.toJSON.apply(this, args);
            obj.attributes = this.getAttributes();
            delete obj.attributes.class;
            delete obj.toolbar;
            delete obj.traits;
            if (this.em.getConfig('avoidDefaults')) {
                const defaults = _.result(this, 'defaults');
                _.forEach(defaults, (value, key) => {
                    if ([
                            'type',
                            'content'
                        ].indexOf(key) === -1 && obj[key] === value) {
                        delete obj[key];
                    }
                });
                if (_.isEmpty(obj.type)) {
                    delete obj.type;
                }
                _.forEach([
                    'attributes',
                    'style'
                ], prop => {
                    if (_.isEmpty(defaults[prop]) && _.isEmpty(obj[prop])) {
                        delete obj[prop];
                    }
                });
                _.forEach([
                    'classes',
                    'components'
                ], prop => {
                    if (_.isEmpty(defaults[prop]) && !obj[prop].length) {
                        delete obj[prop];
                    }
                });
            }
            return obj;
        },
        getId() {
            let attrs = this.get('attributes') || {};
            return attrs.id || this.ccid || this.cid;
        },
        setId(id, opts) {
            const attrs = { ...this.get('attributes') };
            attrs.id = id;
            this.set('attributes', attrs, opts);
            return this;
        },
        getEl(frame) {
            const view = this.getView(frame);
            return view && view.el;
        },
        getView(frame) {
            let {view, views} = this;
            if (frame) {
                view = views.filter(view => view._getFrame() === frame.view)[0];
            }
            return view;
        },
        getCurrentView() {
            const frame = (this.em.get('currentFrame') || {}).model;
            return this.getView(frame);
        },
        getScriptString(script) {
            var scr = script || this.get('script');
            if (!scr) {
                return scr;
            }
            if (typeof scr == 'function') {
                var scrStr = scr.toString().trim();
                scrStr = scrStr.replace(/^function[\s\w]*\(\)\s?\{/, '').replace(/\}$/, '');
                scr = scrStr.trim();
            }
            var config = this.em.getConfig();
            var tagVarStart = escapeRegExp(config.tagVarStart || '{[ ');
            var tagVarEnd = escapeRegExp(config.tagVarEnd || ' ]}');
            var reg = new RegExp(`${ tagVarStart }([\\w\\d-]*)${ tagVarEnd }`, 'g');
            scr = scr.replace(reg, (match, v) => {
                this.scriptUpdated();
                const result = this.attributes[v] || '';
                return _.isArray(result) || typeof result == 'object' ? JSON.stringify(result) : result;
            });
            return scr;
        },
        emitUpdate(property, ...args) {
            const em = this.em;
            const event = 'component:update' + (property ? `:${ property }` : '');
            property && this.updated(property, property && this.get(property), property && this.previous(property), ...args);
            this.trigger(event, ...args);
            em && em.trigger(event, this, ...args);
        },
        onAll(clb) {
            if (_.isFunction(clb)) {
                clb(this);
                this.components().undefined(model => model.onAll(clb));
            }
            return this;
        },
        remove() {
            const coll = this.collection;
            return coll && coll.remove(this);
        },
        resetId(opts = {}) {
            const {em} = this;
            const oldId = this.getId();
            if (!oldId)
                return;
            const newId = Component.createId(this);
            this.setId(newId);
            const rule = em && em.get('CssComposer').getIdRule(oldId);
            const selector = rule && rule.get('selectors').at(0);
            selector && selector.set('name', newId);
            return this;
        },
        _getStyleRule({id} = {}) {
            const {em} = this;
            const idS = id || this.getId();
            return em && em.get('CssComposer').getIdRule(idS);
        },
        _getStyleSelector(opts) {
            const rule = this._getStyleRule(opts);
            return rule && rule.get('selectors').at(0);
        },
        _idUpdated(m, v, opts = {}) {
            if (opts.idUpdate)
                return;
            const {ccid} = this;
            const {id} = this.get('attributes') || {};
            const idPrev = (this.previous('attributes') || {}).id || ccid;
            const list = Component.getList(this);
            if (list[id]) {
                return this.setId(idPrev, { idUpdate: 1 });
            }
            delete list[idPrev];
            list[id] = this;
            this.ccid = id;
            const selector = this._getStyleSelector({ id: idPrev });
            selector && selector.set({
                name: id,
                label: id
            });
        }
    }, {
        isComponent(el) {
            return { tagName: el.tagName ? el.tagName.toLowerCase() : '' };
        },
        createId(model) {
            const list = Component.getList(model);
            let {id} = model.get('attributes');
            let nextId;
            if (id) {
                nextId = Component.getIncrementId(id, list);
                model.setId(nextId);
            } else {
                nextId = Component.getNewId(list);
            }
            list[nextId] = model;
            return nextId;
        },
        getNewId(list) {
            const count = Object.undefined(list).length;
            const ilen = count.toString().length + 2;
            const uid = (Math.random() + 1.1).toString(36).slice(-ilen);
            let newId = `i${ uid }`;
            while (list[newId]) {
                newId = Component.getNewId(list);
            }
            return newId;
        },
        getIncrementId(id, list) {
            let counter = 1;
            let newId = id;
            while (list[newId]) {
                counter++;
                newId = `${ id }-${ counter }`;
            }
            return newId;
        },
        getList(model) {
            const domc = model.opt && model.opt.domc;
            return domc ? domc.componentsById : {};
        },
        checkId(components, styles = [], list = {}) {
            const comps = _.isArray(components) ? components : [components];
            comps.undefined(comp => {
                const {attributes = {}, components} = comp;
                const {id} = attributes;
                if (id && list[id]) {
                    const newId = Component.getIncrementId(id, list);
                    attributes.id = newId;
                    _.isArray(styles) && styles.undefined(style => {
                        const {selectors} = style;
                        selectors.undefined((sel, idx) => {
                            if (sel === `#${ id }`)
                                selectors[idx] = `#${ newId }`;
                        });
                    });
                }
                components && Component.checkId(components, styles, list);
            });
        }
    });
    
    Component.eventDrag = eventDrag;
    
    return Component;
});