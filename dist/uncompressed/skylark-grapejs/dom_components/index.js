define([
    'skylark-backbone',
    'skylark-underscore',
    './config/config',
    './model/Component',
    './model/Components',
    './view/ComponentView',
    './view/ComponentsView',
    './model/ComponentTableCell',
    './view/ComponentTableCellView',
    './model/ComponentTableRow',
    './view/ComponentTableRowView',
    './model/ComponentTable',
    './view/ComponentTableView',
    './model/ComponentTableHead',
    './view/ComponentTableHeadView',
    './model/ComponentTableBody',
    './view/ComponentTableBodyView',
    './model/ComponentTableFoot',
    './view/ComponentTableFootView',
    './model/ComponentMap',
    './view/ComponentMapView',
    './model/ComponentLink',
    './view/ComponentLinkView',
    './model/ComponentLabel',
    './view/ComponentLabelView',
    './model/ComponentVideo',
    './view/ComponentVideoView',
    './model/ComponentImage',
    './view/ComponentImageView',
    './model/ComponentScript',
    './view/ComponentScriptView',
    './model/ComponentSvg',
    './model/ComponentSvgIn',
    './view/ComponentSvgView',
    './model/ComponentComment',
    './view/ComponentCommentView',
    './model/ComponentTextNode',
    './view/ComponentTextNodeView',
    './model/ComponentText',
    './view/ComponentTextView',
    './model/ComponentWrapper'
], function (Backbone, _, defaults, Component, Components, ComponentView, ComponentsView, ComponentTableCell, ComponentTableCellView, ComponentTableRow, ComponentTableRowView, ComponentTable, ComponentTableView, ComponentTableHead, ComponentTableHeadView, ComponentTableBody, ComponentTableBodyView, ComponentTableFoot, ComponentTableFootView, ComponentMap, ComponentMapView, ComponentLink, ComponentLinkView, ComponentLabel, ComponentLabelView, ComponentVideo, ComponentVideoView, ComponentImage, ComponentImageView, ComponentScript, ComponentScriptView, ComponentSvg, ComponentSvgIn, ComponentSvgView, ComponentComment, ComponentCommentView, ComponentTextNode, ComponentTextNodeView, ComponentText, ComponentTextView, ComponentWrapper) {
    'use strict';
    return () => {
        var c = {};
        let em;
        const componentsById = {};
        var component, componentView;
        var componentTypes = [
            {
                id: 'cell',
                model: ComponentTableCell,
                view: ComponentTableCellView
            },
            {
                id: 'row',
                model: ComponentTableRow,
                view: ComponentTableRowView
            },
            {
                id: 'table',
                model: ComponentTable,
                view: ComponentTableView
            },
            {
                id: 'thead',
                model: ComponentTableHead,
                view: ComponentTableHeadView
            },
            {
                id: 'tbody',
                model: ComponentTableBody,
                view: ComponentTableBodyView
            },
            {
                id: 'tfoot',
                model: ComponentTableFoot,
                view: ComponentTableFootView
            },
            {
                id: 'map',
                model: ComponentMap,
                view: ComponentMapView
            },
            {
                id: 'link',
                model: ComponentLink,
                view: ComponentLinkView
            },
            {
                id: 'label',
                model: ComponentLabel,
                view: ComponentLabelView
            },
            {
                id: 'video',
                model: ComponentVideo,
                view: ComponentVideoView
            },
            {
                id: 'image',
                model: ComponentImage,
                view: ComponentImageView
            },
            {
                id: 'script',
                model: ComponentScript,
                view: ComponentScriptView
            },
            {
                id: 'svg-in',
                model: ComponentSvgIn,
                view: ComponentSvgView
            },
            {
                id: 'svg',
                model: ComponentSvg,
                view: ComponentSvgView
            },
            {
                id: 'comment',
                model: ComponentComment,
                view: ComponentCommentView
            },
            {
                id: 'textnode',
                model: ComponentTextNode,
                view: ComponentTextNodeView
            },
            {
                id: 'text',
                model: ComponentText,
                view: ComponentTextView
            },
            {
                id: 'wrapper',
                model: ComponentWrapper,
                view: ComponentView
            },
            {
                id: 'default',
                model: Component,
                view: ComponentView
            }
        ];
        return {
            Component,
            Components,
            ComponentsView,
            componentTypes,
            componentsById,
            name: 'DomComponents',
            getConfig() {
                return c;
            },
            storageKey() {
                var keys = [];
                var smc = c.stm && c.stm.getConfig() || {};
                if (smc.storeHtml)
                    keys.push('html');
                if (smc.storeComponents)
                    keys.push('components');
                return keys;
            },
            init(config) {
                c = config || {};
                em = c.em;
                this.em = em;
                if (em) {
                    c.components = em.config.components || c.components;
                }
                for (var name in defaults) {
                    if (!(name in c))
                        c[name] = defaults[name];
                }
                var ppfx = c.pStylePrefix;
                if (ppfx)
                    c.stylePrefix = ppfx + c.stylePrefix;
                if (em) {
                    c.modal = em.get('Modal') || '';
                    c.am = em.get('AssetManager') || '';
                    em.get('Parser').compTypes = componentTypes;
                    em.on('change:componentHovered', this.componentHovered, this);
                    const selected = em.get('selected');
                    em.listenTo(selected, 'add', (sel, c, opts) => this.selectAdd(sel, opts));
                    em.listenTo(selected, 'remove', (sel, c, opts) => this.selectRemove(sel, opts));
                }
                let components = c.components;
                let wrapper = { ...c.wrapper };
                wrapper['custom-name'] = c.wrapperName;
                wrapper.wrapper = 1;
                wrapper.type = 'wrapper';
                if (components && components.constructor === Object && components.wrapper) {
                    wrapper = { ...components };
                    components = components.components || [];
                    wrapper.components = [];
                    if (em) {
                        em.config.components = components;
                        c.components = components;
                    }
                }
                component = new Component(wrapper, {
                    em,
                    config: c,
                    componentTypes,
                    domc: this
                });
                component.set({ attributes: { id: 'wrapper' } });
                componentView = new ComponentView({
                    model: component,
                    config: c,
                    componentTypes
                });
                return this;
            },
            onLoad() {
                this.setComponents(c.components);
            },
            postLoad(em) {
                this.handleChanges(this.getWrapper(), null, { avoidStore: 1 });
            },
            handleChanges(model, value, opts = {}) {
                const comps = model.components();
                const um = em.get('UndoManager');
                const handleUpdates = em.handleUpdates.bind(em);
                const handleChanges = this.handleChanges.bind(this);
                const handleChangesColl = this.handleChangesColl.bind(this);
                const handleRemoves = this.handleRemoves.bind(this);
                um && um.add(model);
                um && comps && um.add(comps);
                const evn = 'change:style change:content change:attributes change:src';
                [
                    [
                        model,
                        evn,
                        handleUpdates
                    ],
                    [
                        model,
                        'change:components',
                        handleChangesColl
                    ],
                    [
                        comps,
                        'add',
                        handleChanges
                    ],
                    [
                        comps,
                        'remove',
                        handleRemoves
                    ],
                    [
                        model.get('classes'),
                        'add remove',
                        handleUpdates
                    ]
                ].forEach(els => {
                    em.stopListening(els[0], els[1], els[2]);
                    em.listenTo(els[0], els[1], els[2]);
                });
                !opts.avoidStore && handleUpdates('', '', opts);
                comps.each(model => this.handleChanges(model, value, opts));
            },
            handleChangesColl(model, coll) {
                const um = em.get('UndoManager');
                if (um && coll instanceof Backbone.Collection) {
                    const handleChanges = this.handleChanges.bind(this);
                    const handleRemoves = this.handleRemoves.bind(this);
                    um.add(coll);
                    [
                        [
                            coll,
                            'add',
                            handleChanges
                        ],
                        [
                            coll,
                            'remove',
                            handleRemoves
                        ]
                    ].forEach(els => {
                        em.stopListening(els[0], els[1], els[2]);
                        em.listenTo(els[0], els[1], els[2]);
                    });
                }
            },
            handleRemoves(model, value, opts = {}) {
                !opts.avoidStore && em.handleUpdates(model, value, opts);
            },
            load(data = '') {
                const {em} = this;
                let result = '';
                if (!data && c.stm) {
                    data = c.em.getCacheLoad();
                }
                const {components, html} = data;
                if (components) {
                    if (_.isObject(components) || _.isArray(components)) {
                        result = components;
                    } else {
                        try {
                            result = JSON.parse(components);
                        } catch (err) {
                            em && em.logError(err);
                        }
                    }
                } else if (html) {
                    result = html;
                }
                const isObj = result && result.constructor === Object;
                if (result && result.length || isObj) {
                    this.clear();
                    if (isObj) {
                        this.getWrapper().set(result);
                    } else {
                        this.getComponents().add(result);
                    }
                }
                return result;
            },
            store(noStore) {
                if (!c.stm) {
                    return;
                }
                var obj = {};
                var keys = this.storageKey();
                if (keys.indexOf('html') >= 0) {
                    obj.html = c.em.getHtml();
                }
                if (keys.indexOf('components') >= 0) {
                    const {em} = this;
                    const storeWrap = c.storeWrapper;
                    const toStore = storeWrap ? this.getWrapper() : this.getComponents();
                    obj.components = JSON.stringify(toStore);
                }
                if (!noStore) {
                    c.stm.store(obj);
                }
                return obj;
            },
            getComponent() {
                return component;
            },
            getWrapper() {
                return this.getComponent();
            },
            getComponents() {
                return this.getWrapper().get('components');
            },
            addComponent(component) {
                return this.getComponents().add(component);
            },
            render() {
                return componentView.render().el;
            },
            clear() {
                this.getComponents().map(i => i).forEach(i => i.remove());
                return this;
            },
            setComponents(components) {
                this.clear().addComponent(components);
            },
            addType(type, methods) {
                const {em} = this;
                const {model = {}, view = {}, isComponent, extend, extendView, extendFn = [], extendFnView = []} = methods;
                const compType = this.getType(type);
                const extendType = this.getType(extend);
                const extendViewType = this.getType(extendView);
                const typeToExtend = extendType ? extendType : compType ? compType : this.getType('default');
                const modelToExt = typeToExtend.model;
                const viewToExt = extendViewType ? extendViewType.view : typeToExtend.view;
                const getExtendedObj = (fns, target, srcToExt) => fns.reduce((res, next) => {
                    const fn = target[next];
                    const parentFn = srcToExt.prototype[next];
                    if (fn && parentFn) {
                        res[next] = function (...args) {
                            parentFn.bind(this)(...args);
                            fn.bind(this)(...args);
                        };
                    }
                    return res;
                }, {});
                if (typeof model === 'object') {
                    methods.model = modelToExt.extend({
                        ...model,
                        ...getExtendedObj(extendFn, model, modelToExt),
                        defaults: langx.mixin({},
                            modelToExt.prototype.defaults,
                            _.result(model, 'defaults') 
                        )
                    }, { isComponent: compType && !extendType && !isComponent ? modelToExt.isComponent : isComponent || (() => 0) });
                }
                if (typeof view === 'object') {
                    methods.view = viewToExt.extend(langx.mixin({},
                        view,
                        getExtendedObj(extendFnView, view, viewToExt)
                    ));
                }
                if (compType) {
                    compType.model = methods.model;
                    compType.view = methods.view;
                } else {
                    methods.id = type;
                    componentTypes.unshift(methods);
                }
                const event = `component:type:${ compType ? 'update' : 'add' }`;
                em && em.trigger(event, compType || methods);
                return this;
            },
            getType(type) {
                var df = componentTypes;
                for (var it = 0; it < df.length; it++) {
                    var dfId = df[it].id;
                    if (dfId == type) {
                        return df[it];
                    }
                }
                return;
            },
            removeType(id) {
                const df = componentTypes;
                const type = this.getType(id);
                if (!type)
                    return;
                const index = df.indexOf(type);
                df.splice(index, 1);
                return type;
            },
            getTypes() {
                return componentTypes;
            },
            selectAdd(component, opts = {}) {
                if (component) {
                    component.set({ status: 'selected' });
                    [
                        'component:selected',
                        'component:toggled'
                    ].forEach(event => this.em.trigger(event, component, opts));
                }
            },
            selectRemove(component, opts = {}) {
                if (component) {
                    const {em} = this;
                    component.set({
                        status: '',
                        state: ''
                    });
                    [
                        'component:deselected',
                        'component:toggled'
                    ].forEach(event => this.em.trigger(event, component, opts));
                }
            },
            componentHovered() {
                const em = c.em;
                const model = em.get('componentHovered');
                const previous = em.previous('componentHovered');
                const state = 'hovered';
                previous && previous.get('status') == state && previous.set({
                    status: '',
                    state: ''
                });
                model && _.isEmpty(model.get('status')) && model.set('status', state);
            }
        };
    };
});