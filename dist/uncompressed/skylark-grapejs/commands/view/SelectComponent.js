define([
    'skylark-backbone',
    'skylark-underscore',
    '../../utils/mixins',
    '../../dom_components/view/ToolbarView',
    '../../dom_components/model/Toolbar'
], function (Backbone, a, mixins, ToolbarView, Toolbar) {
    'use strict';
    const $ = Backbone.$;
    let showOffsets;
    return {
        init(o) {
            a.bindAll(this, 'onHover', 'onOut', 'onClick', 'onFrameScroll', 'onFrameUpdated');
        },
        enable() {
            this.frameOff = this.canvasOff = this.adjScroll = null;
            this.startSelectComponent();
            showOffsets = 1;
        },
        startSelectComponent() {
            this.toggleSelectComponent(1);
            this.em.getSelected() && this.onSelect();
        },
        stopSelectComponent() {
            this.toggleSelectComponent();
        },
        toggleSelectComponent(enable) {
            const {em} = this;
            const method = enable ? 'on' : 'off';

            const trigger = (win, body) => {
                mixins[method](body, 'mouseover', this.onHover);
                mixins[method](body, 'mouseleave', this.onOut);
                mixins[method](body, 'click touchend', this.onClick);
                mixins[method](win, 'scroll', this.onFrameScroll);
            };
            mixins[method](window, 'resize', this.onFrameUpdated);
            em[method]('component:toggled', this.onSelect, this);
            em[method]('change:componentHovered', this.onHovered, this);
            em[method]('component:resize component:styleUpdate', this.updateGlobalPos, this);
            em[method]('change:canvasOffset', this.updateAttached, this);
            em[method]('frame:updated', this.onFrameUpdated, this);
            em.get('Canvas').getFrames().forEach(frame => {
                const {view} = frame;
                trigger(view.getWindow(), view.getBody());
            });
        },
        onHover(e) {
            e.stopPropagation();
            const trg = e.target;
            const view = mixins.getViewEl(trg);
            const frameView = view && view._getFrame();
            const $el = $(trg);
            let model = $el.data('model');
            if (!model) {
                let parent = $el.parent();
                while (!model && parent.length > 0) {
                    model = parent.data('model');
                    parent = parent.parent();
                }
            }
            if (model && !model.get('hoverable')) {
                let parent = model && model.parent();
                while (parent && !parent.get('hoverable'))
                    parent = parent.parent();
                model = parent;
            }
            this.currentDoc = trg.ownerDocument;
            this.em.setHovered(model);
            frameView && this.em.set('currentFrame', frameView);
        },
        onFrameUpdated() {
            this.updateLocalPos();
            this.updateGlobalPos();
        },
        onHovered(em, component) {
            let result = {};
            if (component) {
                component.views.forEach(view => {
                    const el = view.el;
                    const pos = this.getElementPos(el);
                    result = {
                        el,
                        pos,
                        component,
                        view: mixins.getViewEl(el)
                    };
                    this.updateToolsLocal(result);
                    if (el.ownerDocument === this.currentDoc)
                        this.elHovered = result;
                });
            }
        },
        onSelect: a.debounce(function () {
            const {em} = this;
            const component = em.getSelected();
            const currentFrame = em.get('currentFrame') || {};
            const view = component && component.getView(currentFrame.model);
            let el = view && view.el;
            let result = {};
            if (el) {
                const pos = this.getElementPos(el);
                result = {
                    el,
                    pos,
                    component,
                    view: mixins.getViewEl(el)
                };
            }
            this.elSelected = result;
            this.updateToolsGlobal();
            this.updateToolsLocal(result);
        }),
        updateGlobalPos() {
            const sel = this.getElSelected();
            if (!sel.el)
                return;
            sel.pos = this.getElementPos(sel.el);
            this.updateToolsGlobal();
        },
        updateLocalPos() {
            const sel = this.getElHovered();
            if (!sel.el)
                return;
            sel.pos = this.getElementPos(sel.el);
            this.updateToolsLocal();
        },
        getElHovered() {
            return this.elHovered || {};
        },
        getElSelected() {
            return this.elSelected || {};
        },
        onOut() {
            this.currentDoc = null;
            this.em.setHovered(0);
            this.canvas.getFrames().forEach(frame => {
                const el = frame.view.getToolsEl();
                this.toggleToolsEl(0, 0, { el });
            });
        },
        toggleToolsEl(on, view, opts = {}) {
            const el = opts.el || this.canvas.getToolsEl(view);
            el.style.opacity = on ? 1 : 0;
            return el;
        },
        showElementOffset(el, pos, opts = {}) {
            if (!showOffsets)
                return;
            this.editor.runCommand('show-offset', {
                el,
                elPos: pos,
                view: opts.view,
                force: 1,
                top: 0,
                left: 0
            });
        },
        hideElementOffset(view) {
            this.editor.stopCommand('show-offset', { view });
        },
        showFixedElementOffset(el, pos) {
            this.editor.runCommand('show-offset', {
                el,
                elPos: pos,
                state: 'Fixed'
            });
        },
        hideFixedElementOffset(el, pos) {
            if (this.editor)
                this.editor.stopCommand('show-offset', { state: 'Fixed' });
        },
        hideHighlighter(view) {
            this.canvas.getHighlighter(view).style.opacity = 0;
        },
        onClick(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            const {em} = this;
            if (em.get('_cmpDrag'))
                return em.set('_cmpDrag');
            const $el = $(ev.target);
            let model = $el.data('model');
            if (!model) {
                let parent = $el.parent();
                while (!model && parent.length > 0) {
                    model = parent.data('model');
                    parent = parent.parent();
                }
            }
            if (model) {
                if (model.get('selectable')) {
                    this.select(model, ev);
                } else {
                    let parent = model.parent();
                    while (parent && !parent.get('selectable'))
                        parent = parent.parent();
                    this.select(parent, ev);
                }
            }
        },
        select(model, event = {}) {
            if (!model)
                return;
            const ctrlKey = event.ctrlKey || event.metaKey;
            const {shiftKey} = event;
            const {editor, em} = this;
            const multiple = editor.getConfig('multipleSelection');
            if (ctrlKey && multiple) {
                editor.selectToggle(model);
            } else if (shiftKey && multiple) {
                em.clearSelection(editor.Canvas.getWindow());
                const coll = model.collection;
                const index = coll.indexOf(model);
                const selAll = editor.getSelectedAll();
                let min, max;
                editor.getSelectedAll().forEach(sel => {
                    const selColl = sel.collection;
                    const selIndex = selColl.indexOf(sel);
                    if (selColl === coll) {
                        if (selIndex < index) {
                            min = a.isUndefined(min) ? selIndex : Math.max(min, selIndex);
                        } else if (selIndex > index) {
                            max = a.isUndefined(max) ? selIndex : Math.min(max, selIndex);
                        }
                    }
                });
                if (!a.isUndefined(min)) {
                    while (min !== index) {
                        editor.selectAdd(coll.at(min));
                        min++;
                    }
                }
                if (!a.isUndefined(max)) {
                    while (max !== index) {
                        editor.selectAdd(coll.at(max));
                        max--;
                    }
                }
                editor.selectAdd(model);
            } else {
                editor.select(model, { scroll: {} });
            }
            this.initResize(model);
        },
        updateBadge(el, pos, opts = {}) {
            const model = $(el).data('model');
            if (!model || !model.get('badgable'))
                return;
            const badge = this.getBadge(opts);
            if (!opts.posOnly) {
                const config = this.canvas.getConfig();
                const icon = model.getIcon();
                const ppfx = config.pStylePrefix || '';
                const clsBadge = `${ ppfx }badge`;
                const customeLabel = config.customBadgeLabel;
                const badgeLabel = `${ icon ? `<div class="${ clsBadge }__icon">${ icon }</div>` : '' }
        <div class="${ clsBadge }__name">${ model.getName() }</div>`;
                badge.innerHTML = customeLabel ? customeLabel(model) : badgeLabel;
            }
            const un = 'px';
            const bStyle = badge.style;
            bStyle.display = 'block';
            const badgeH = badge ? badge.offsetHeight : 0;
            const posTop = 0 - badgeH;
            const top = opts.topOff - badgeH < 0 ? -opts.topOff : posTop;
            const left = opts.leftOff < 0 ? -opts.leftOff : 0;
            bStyle.top = top + un;
            bStyle.left = left + un;
        },
        showHighlighter(view) {
            this.canvas.getHighlighter(view).style.opacity = '';
        },
        initResize(elem) {
            const {em, canvas} = this;
            const editor = em ? em.get('Editor') : '';
            const config = em ? em.get('Config') : '';
            const pfx = config.stylePrefix || '';
            const resizeClass = `${ pfx }resizing`;
            const model = !a.isElement(elem) && mixins.isTaggableNode(elem) ? elem : em.getSelected();
            const resizable = model.get('resizable');
            const el = a.isElement(elem) ? elem : model.getEl();
            let options = {};
            let modelToStyle;
            var toggleBodyClass = (method, e, opts) => {
                const docs = opts.docs;
                docs && docs.forEach(doc => {
                    const body = doc.body;
                    const cls = body.className || '';
                    body.className = (method == 'add' ? `${ cls } ${ resizeClass }` : cls.replace(resizeClass, '')).trim();
                });
            };
            if (editor && resizable) {
                options = {
                    onStart(e, opts = {}) {
                        const {el, config, resizer} = opts;
                        const {keyHeight, keyWidth, currentUnit, keepAutoHeight, keepAutoWidth} = config;
                        toggleBodyClass('add', e, opts);
                        modelToStyle = em.get('StyleManager').getModelToStyle(model);
                        canvas.toggleFramesEvents();
                        const computedStyle = getComputedStyle(el);
                        const modelStyle = modelToStyle.getStyle();
                        let currentWidth = modelStyle[keyWidth];
                        config.autoWidth = keepAutoWidth && currentWidth === 'auto';
                        if (isNaN(parseFloat(currentWidth))) {
                            currentWidth = computedStyle[keyWidth];
                        }
                        let currentHeight = modelStyle[keyHeight];
                        config.autoHeight = keepAutoHeight && currentHeight === 'auto';
                        if (isNaN(parseFloat(currentHeight))) {
                            currentHeight = computedStyle[keyHeight];
                        }
                        resizer.startDim.w = parseFloat(currentWidth);
                        resizer.startDim.h = parseFloat(currentHeight);
                        showOffsets = 0;
                        if (currentUnit) {
                            config.unitHeight = mixins.getUnitFromValue(currentHeight);
                            config.unitWidth = mixins.getUnitFromValue(currentWidth);
                        }
                    },
                    onMove() {
                        editor.trigger('component:resize');
                    },
                    onEnd(e, opts) {
                        toggleBodyClass('remove', e, opts);
                        editor.trigger('component:resize');
                        canvas.toggleFramesEvents(1);
                        showOffsets = 1;
                    },
                    updateTarget(el, rect, options = {}) {
                        if (!modelToStyle) {
                            return;
                        }
                        const {store, selectedHandler, config} = options;
                        const {keyHeight, keyWidth, autoHeight, autoWidth, unitWidth, unitHeight} = config;
                        const onlyHeight = [
                            'tc',
                            'bc'
                        ].indexOf(selectedHandler) >= 0;
                        const onlyWidth = [
                            'cl',
                            'cr'
                        ].indexOf(selectedHandler) >= 0;
                        const style = {};
                        const en = !store ? 1 : '';
                        if (!onlyHeight) {
                            const bodyw = canvas.getBody().offsetWidth;
                            const width = rect.w < bodyw ? rect.w : bodyw;
                            style[keyWidth] = autoWidth ? 'auto' : `${ width }${ unitWidth }`;
                        }
                        if (!onlyWidth) {
                            style[keyHeight] = autoHeight ? 'auto' : `${ rect.h }${ unitHeight }`;
                        }
                        modelToStyle.addStyle({
                            ...style,
                            en
                        }, { avoidStore: !store });
                        const updateEvent = `update:component:style`;
                        const eventToListen = `${ updateEvent }:${ keyHeight } ${ updateEvent }:${ keyWidth }`;
                        em && em.trigger(eventToListen, null, null, { noEmit: 1 });
                    }
                };
                if (typeof resizable == 'object') {
                    options = {
                        ...options,
                        ...resizable
                    };
                }
                this.resizer = editor.runCommand('resize', {
                    el,
                    options,
                    force: 1
                });
            } else {
                editor.stopCommand('resize');
                this.resizer = null;
            }
        },
        updateToolbar(mod) {
            var em = this.config.em;
            var model = mod == em ? em.getSelected() : mod;
            var toolbarEl = this.canvas.getToolbarEl();
            var toolbarStyle = toolbarEl.style;
            if (!model) {
                toolbarStyle.opacity = 0;
                return;
            }
            var toolbar = model.get('toolbar');
            var showToolbar = em.get('Config').showToolbar;
            if (showToolbar && toolbar && toolbar.length) {
                toolbarStyle.opacity = '';
                toolbarStyle.display = '';
                if (!this.toolbar) {
                    toolbarEl.innerHTML = '';
                    this.toolbar = new Toolbar(toolbar);
                    var toolbarView = new ToolbarView({
                        collection: this.toolbar,
                        editor: this.editor,
                        em
                    });
                    toolbarEl.appendChild(toolbarView.render().el);
                }
                this.toolbar.reset(toolbar);
                toolbarStyle.top = '-100px';
                toolbarStyle.left = 0;
            } else {
                toolbarStyle.display = 'none';
            }
        },
        updateToolbarPos(pos) {
            const unit = 'px';
            const {style} = this.canvas.getToolbarEl();
            style.top = `${ pos.top }${ unit }`;
            style.left = `${ pos.left }${ unit }`;
            style.opacity = '';
        },
        getCanvasPosition() {
            return this.canvas.getCanvasView().getPosition();
        },
        getBadge(opts = {}) {
            return this.canvas.getBadgeEl(opts.view);
        },
        onFrameScroll() {
            this.updateTools();
        },
        updateTools() {
            this.updateToolsLocal();
            this.updateGlobalPos();
        },
        isCompSelected(comp) {
            return comp && comp.get('status') === 'selected';
        },
        updateToolsLocal(data) {
            const {el, pos, view, component} = data || this.getElHovered();
            if (!el) {
                this.lastHovered = 0;
                return;
            }
            const isHoverEn = component.get('hoverable');
            const isNewEl = this.lastHovered !== el;
            const badgeOpts = isNewEl ? {} : { posOnly: 1 };
            if (isNewEl && isHoverEn) {
                this.lastHovered = el;
                this.showHighlighter(view);
                this.showElementOffset(el, pos, { view });
            }
            if (this.isCompSelected(component)) {
                this.hideHighlighter(view);
                this.hideElementOffset(view);
            }
            const unit = 'px';
            const {style} = this.toggleToolsEl(1, view);
            const frameOff = this.canvas.canvasRectOffset(el, pos);
            const topOff = frameOff.top;
            const leftOff = frameOff.left;
            this.updateBadge(el, pos, {
                ...badgeOpts,
                view,
                topOff,
                leftOff
            });
            style.top = topOff + unit;
            style.left = leftOff + unit;
            style.width = pos.width + unit;
            style.height = pos.height + unit;
        },
        updateToolsGlobal() {
            const {el, pos, component} = this.getElSelected();
            if (!el) {
                this.toggleToolsEl();
                this.lastSelected = 0;
                return;
            }
            const {canvas} = this;
            const isNewEl = this.lastSelected !== el;
            if (isNewEl) {
                this.lastSelected = el;
                this.updateToolbar(component);
            }
            const unit = 'px';
            const {style} = this.toggleToolsEl(1);
            const targetToElem = canvas.getTargetToElementFixed(el, canvas.getToolbarEl(), { pos });
            const topOff = targetToElem.canvasOffsetTop;
            const leftOff = targetToElem.canvasOffsetLeft;
            style.top = topOff + unit;
            style.left = leftOff + unit;
            style.width = pos.width + unit;
            style.height = pos.height + unit;
            this.updateToolbarPos({
                top: targetToElem.top,
                left: targetToElem.left
            });
        },
        updateAttached: a.debounce(function () {
            this.updateToolsGlobal();
        }),
        getElementPos(el) {
            return this.canvas.getCanvasView().getElementPos(el);
        },
        hideBadge() {
            this.getBadge().style.display = 'none';
        },
        cleanPrevious(model) {
            model && model.set({
                status: '',
                state: ''
            });
        },
        getContentWindow() {
            return this.canvas.getWindow();
        },
        run(editor) {
            this.editor = editor && editor.get('Editor');
            this.enable();
        },
        stop(ed, sender, opts = {}) {
            const {em, editor} = this;
            this.stopSelectComponent();
            !opts.preserveSelected && em.setSelected(null);
            this.onOut();
            this.toggleToolsEl();
            editor && editor.stopCommand('resize');
        }
    };
});