define([
    'skylark-backbone',
    'skylark-underscore',
    '../model/Components',
    './ComponentsView',
    '../../selector_manager/model/Selectors',
    '../../utils/dom',
    '../../utils/mixins'
], function (Backbone, a, Components, ComponentsView, Selectors, b, c) {
    'use strict';
    var ComponentView = Backbone.View.extend({
        className() {
            return this.getClasses();
        },
        tagName() {
            return this.model.get('tagName');
        },
        initialize(opt = {}) {
            const model = this.model;
            const config = opt.config || {};
            const em = config.em;
            const modelOpt = model.opt || {};
            const {$el, el} = this;
            const {draggableComponents} = config;
            this.opts = opt;
            this.modelOpt = modelOpt;
            this.config = config;
            this.em = em || '';
            this.pfx = config.stylePrefix || '';
            this.ppfx = config.pStylePrefix || '';
            this.attr = model.get('attributes');
            this.classe = this.attr.class || [];
            this.listenTo(model, 'change:style', this.updateStyle);
            this.listenTo(model, 'change:attributes change:_innertext', this.renderAttributes);
            this.listenTo(model, 'change:highlightable', this.updateHighlight);
            this.listenTo(model, 'change:status', this.updateStatus);
            this.listenTo(model, 'change:script', this.reset);
            this.listenTo(model, 'change:content', this.updateContent);
            this.listenTo(model, 'change', this.handleChange);
            this.listenTo(model, 'active', this.onActive);
            this.listenTo(model, 'disable', this.onDisable);
            $el.data('model', model);
            c.setViewEl(el, this);
            model.view = this;
            this._getFrame() && model.views.push(this);
            this.initClasses();
            this.initComponents({ avoidRender: 1 });
            this.events = {
                ...this.events,
                ...draggableComponents && { dragstart: 'handleDragStart' }
            };
            this.delegateEvents();
            !modelOpt.temporary && this.init(this._clbObj());
        },
        _clbObj() {
            const {em, model, el} = this;
            return {
                editor: em && em.getEditor(),
                model,
                el
            };
        },
        init() {
        },
        removed() {
        },
        onActive() {
        },
        onDisable() {
        },
        remove() {
            Backbone.View.prototype.remove.apply(this, arguments);
            const {model} = this;
            const frame = this._getFrame() || {};
            const frameM = frame.model;
            model.components().forEach(comp => {
                const view = comp.getView(frameM);
                view && view.remove();
            });
            const {views} = model;
            views.splice(views.indexOf(this), 1);
            this.removed(this._clbObj());
            return this;
        },
        handleDragStart(event) {
            event.preventDefault();
            event.stopPropagation();
            this.em.get('Commands').run('tlb-move', {
                target: this.model,
                event
            });
        },
        initClasses() {
            const {model} = this;
            const event = 'change:classes';
            const classes = model.get('classes');
            if (classes instanceof Selectors) {
                this.stopListening(model, event, this.initClasses);
                this.listenTo(model, event, this.initClasses);
                this.listenTo(classes, 'add remove change', this.updateClasses);
                classes.length && this.importClasses();
            }
        },
        initComponents(opts = {}) {
            const {model, $el, childrenView} = this;
            const event = 'change:components';
            const comps = model.get('components');
            const toListen = [
                model,
                event,
                this.initComponents
            ];
            if (comps instanceof Components) {
                $el.data('collection', comps);
                childrenView && childrenView.remove();
                this.stopListening(...toListen);
                !opts.avoidRender && this.renderChildren();
                this.listenTo(...toListen);
            }
        },
        handleChange() {
            const {model} = this;
            const chgArr = a.keys(model.changed);
            if (chgArr.length === 1 && chgArr[0] === 'status')
                return;
            model.emitUpdate();
            for (let prop in model.changed) {
                model.emitUpdate(prop);
            }
        },
        importClasses() {
            var clm = this.config.em.get('SelectorManager');
            if (clm) {
                this.model.get('classes').each(m => {
                    clm.add(m.get('name'));
                });
            }
        },
        updateStatus(opts = {}) {
            const em = this.em;
            const el = this.el;
            const status = this.model.get('status');
            const pfx = this.pfx;
            const ppfx = this.ppfx;
            const selectedCls = `${ ppfx }selected`;
            const selectedParentCls = `${ selectedCls }-parent`;
            const freezedCls = `${ ppfx }freezed`;
            const hoveredCls = `${ ppfx }hovered`;
            const toRemove = [
                selectedCls,
                selectedParentCls,
                freezedCls,
                hoveredCls
            ];
            this.$el.removeClass(toRemove.join(' '));
            var actualCls = el.getAttribute('class') || '';
            var cls = '';
            switch (status) {
            case 'selected':
                cls = `${ actualCls } ${ selectedCls }`;
                break;
            case 'selected-parent':
                cls = `${ actualCls } ${ selectedParentCls }`;
                break;
            case 'freezed':
                cls = `${ actualCls } ${ freezedCls }`;
                break;
            case 'freezed-selected':
                cls = `${ actualCls } ${ freezedCls } ${ selectedCls }`;
                break;
            case 'hovered':
                cls = !opts.avoidHover ? `${ actualCls } ${ hoveredCls }` : '';
                break;
            }
            cls = cls.trim();
            cls && el.setAttribute('class', cls);
        },
        updateHighlight() {
            const hl = this.model.get('highlightable');
            this.setAttribute('data-highlightable', hl ? 1 : '');
        },
        updateStyle() {
            const {model, em, el} = this;
            if (em && em.getConfig('avoidInlineStyle')) {
                if (model.get('_innertext')) {
                    el.removeAttribute('id');
                } else {
                    el.id = model.getId();
                }
                const style = model.getStyle();
                !a.isEmpty(style) && model.setStyle(style);
            } else {
                this.setAttribute('style', model.styleToString());
            }
        },
        updateClasses() {
            const str = this.model.get('classes').pluck('name').join(' ');
            this.setAttribute('class', str);
            this.updateStatus();
        },
        setAttribute(name, value) {
            const el = this.$el;
            value ? el.attr(name, value) : el.removeAttr(name);
        },
        getClasses() {
            return this.model.getClasses().join(' ');
        },
        updateAttributes() {
            const attrs = [];
            const {model, $el, el, config} = this;
            const {highlightable, textable, type, _innertext} = model.attributes;
            const {draggableComponents} = config;
            const defaultAttr = {
                'data-gjs-type': type || 'default',
                ...draggableComponents && !_innertext ? { draggable: true } : {},
                ...highlightable ? { 'data-highlightable': 1 } : {},
                ...textable ? {
                    contenteditable: 'false',
                    'data-gjs-textable': 'true'
                } : {}
            };
            a.each(el.attributes, attr => attrs.push(attr.nodeName));
            attrs.forEach(attr => $el.removeAttr(attr));
            const attr = {
                ...defaultAttr,
                ...model.getAttributes()
            };
            a.keys(attr).forEach(key => attr[key] === false && delete attr[key]);
            $el.attr(attr);
            this.updateStyle();
        },
        updateContent() {
            this.getChildrenContainer().innerHTML = this.model.get('content');
        },
        prevDef(e) {
            e.preventDefault();
        },
        updateScript() {
            const {model, em} = this;
            if (!model.get('script'))
                return;
            em && em.get('Canvas').getCanvasView().updateScript(this);
        },
        getChildrenContainer() {
            var container = this.el;
            if (typeof this.getChildrenSelector == 'function') {
                container = this.el.querySelector(this.getChildrenSelector());
            } else if (typeof this.getTemplate == 'function') {
            }
            return container;
        },
        getOffsetRect() {
            const rect = {};
            const target = this.el;
            let gtop = 0;
            let gleft = 0;
            const assignRect = el => {
                const {offsetParent} = el;
                if (offsetParent) {
                    gtop += offsetParent.offsetTop;
                    gleft += offsetParent.offsetLeft;
                    assignRect(offsetParent);
                } else {
                    rect.top = target.offsetTop + gtop;
                    rect.left = target.offsetLeft + gleft;
                    rect.bottom = rect.top + target.offsetHeight;
                    rect.right = rect.left + target.offsetWidth;
                }
            };
            assignRect(target);
            return rect;
        },
        isInViewport({rect} = {}) {
            const {el} = this;
            const elDoc = el.ownerDocument;
            const {body} = elDoc;
            const {frameElement} = elDoc.defaultView;
            const {top, left} = rect || this.getOffsetRect();
            const frame = this._getFrame().getOffsetRect();
            return top >= frame.scrollTop && left >= frame.scrollLeft && top <= frame.scrollBottom && left <= frameElement.offsetWidth + body.scrollLeft;
        },
        scrollIntoView(opts = {}) {
            const rect = this.getOffsetRect();
            const isInViewport = this.isInViewport({ rect });
            if (!isInViewport || opts.force) {
                const {el} = this;
                if (opts.behavior !== 'smooth') {
                    el.ownerDocument.defaultView.scrollTo(0, rect.top);
                } else {
                    el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        ...opts
                    });
                }
            }
        },
        reset() {
            const {el} = this;
            this.el = '';
            this._ensureElement();
            this._setData();
            b.replaceWith(el, this.el);
            this.render();
        },
        _setData() {
            const {model} = this;
            const collection = model.components();
            const view = this;
            this.$el.data({
                model,
                collection,
                view
            });
        },
        _getFrame() {
            return this.config.frameView;
        },
        renderChildren() {
            this.updateContent();
            const container = this.getChildrenContainer();
            const view = new ComponentsView({
                collection: this.model.get('components'),
                config: this.config,
                componentTypes: this.opts.componentTypes
            });
            view.render(container);
            this.childrenView = view;
            const childNodes = Array.prototype.slice.call(view.el.childNodes);
            for (var i = 0, len = childNodes.length; i < len; i++) {
                container.appendChild(childNodes.shift());
            }
        },
        renderAttributes() {
            this.updateAttributes();
            this.updateClasses();
        },
        render() {
            this.renderAttributes();
            if (this.modelOpt.temporary)
                return this;
            this.renderChildren();
            this.updateScript();
            this.postRender();
            return this;
        },
        postRender() {
            const {em, model, modelOpt} = this;
            if (!modelOpt.temporary) {
                this.onRender(this._clbObj());
                em && em.trigger('component:mount', model);
            }
        },
        onRender() {
        }
    });

    ComponentsView.ComponentView = ComponentView;

    return ComponentView;
});