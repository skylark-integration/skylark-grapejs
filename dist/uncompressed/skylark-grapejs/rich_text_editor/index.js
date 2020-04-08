define([
    './model/RichTextEditor',
    '../../utils/mixins',
    './config/config'
], function (RichTextEditor, a, defaults) {
    'use strict';
    return () => {
        let config = {};
        let toolbar, actions, lastEl, lastElPos, globalRte;
        const hideToolbar = () => {
            const style = toolbar.style;
            const size = '-1000px';
            style.top = size;
            style.left = size;
            style.display = 'none';
        };
        return {
            customRte: null,
            name: 'RichTextEditor',
            getConfig() {
                return config;
            },
            init(opts = {}) {
                config = {
                    ...defaults,
                    ...opts
                };
                const ppfx = config.pStylePrefix;
                if (ppfx) {
                    config.stylePrefix = ppfx + config.stylePrefix;
                }
                this.pfx = config.stylePrefix;
                actions = config.actions || [];
                toolbar = document.createElement('div');
                toolbar.className = `${ ppfx }rte-toolbar ${ ppfx }one-bg`;
                globalRte = this.initRte(document.createElement('div'));
                a.on(toolbar, 'mousedown', e => e.stopPropagation());
                return this;
            },
            destroy() {
                const {customRte} = this;
                globalRte && globalRte.destroy();
                customRte && customRte.destroy && customRte.destroy();
                toolbar = 0;
                globalRte = 0;
                this.actionbar = 0;
                this.actions = 0;
            },
            postRender(ev) {
                const canvas = ev.model.get('Canvas');
                toolbar.style.pointerEvents = 'all';
                hideToolbar();
                canvas.getToolsEl().appendChild(toolbar);
            },
            initRte(el) {
                const pfx = this.pfx;
                const actionbarContainer = toolbar;
                const actionbar = this.actionbar;
                const actions = this.actions || [...config.actions];
                const classes = {
                    actionbar: `${ pfx }actionbar`,
                    button: `${ pfx }action`,
                    active: `${ pfx }active`,
                    inactive: `${ pfx }inactive`,
                    disabled: `${ pfx }disabled`
                };
                const rte = new RichTextEditor({
                    el,
                    classes,
                    actions,
                    actionbar,
                    actionbarContainer
                });
                globalRte && globalRte.setEl(el);
                if (rte.actionbar) {
                    this.actionbar = rte.actionbar;
                }
                if (rte.actions) {
                    this.actions = rte.actions;
                }
                return rte;
            },
            add(name, action = {}) {
                action.name = name;
                globalRte.addAction(action, { sync: 1 });
            },
            get(name) {
                let result;
                globalRte.getActions().forEach(action => {
                    if (action.name == name) {
                        result = action;
                    }
                });
                return result;
            },
            getAll() {
                return globalRte.getActions();
            },
            remove(name) {
                const actions = this.getAll();
                const action = this.get(name);
                if (action) {
                    const btn = action.btn;
                    const index = actions.indexOf(action);
                    btn.parentNode.removeChild(btn);
                    actions.splice(index, 1);
                }
                return action;
            },
            getToolbarEl() {
                return toolbar;
            },
            updatePosition() {
                const un = 'px';
                const canvas = config.em.get('Canvas');
                const {style} = toolbar;
                const pos = canvas.getTargetToElementFixed(lastEl, toolbar, { event: 'rteToolbarPosUpdate' });
                style.top = pos.top + un;
                style.left = 0 + un;
            },
            enable(view, rte) {
                lastEl = view.el;
                const canvas = config.em.get('Canvas');
                const em = config.em;
                const el = view.getChildrenContainer();
                const customRte = this.customRte;
                lastElPos = canvas.getElementPos(lastEl);
                toolbar.style.display = '';
                rte = customRte ? customRte.enable(el, rte) : this.initRte(el).enable();
                if (em) {
                    setTimeout(this.updatePosition.bind(this), 0);
                    const event = 'change:canvasOffset canvasScroll frame:scroll component:update';
                    em.undefined(event, this.updatePosition, this);
                    em.undefined(event, this.updatePosition, this);
                    em.trigger('rte:enable', view, rte);
                }
                return rte;
            },
            disable(view, rte) {
                const em = config.em;
                const customRte = this.customRte;
                var el = view.getChildrenContainer();
                if (customRte) {
                    customRte.disable(el, rte);
                } else {
                    rte && rte.disable();
                }
                hideToolbar();
                em && em.trigger('rte:disable', view, rte);
            }
        };
    };
});