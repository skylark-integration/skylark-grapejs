define([
    '../../utils/mixins',
    './ComponentView'
], function (mixins, ComponentView) {
    'use strict';
    const compProt = ComponentView.prototype;
    return ComponentView.extend({
        events: {
            dblclick: 'onActive',
            input: 'onInput'
        },
        initialize(o) {
            compProt.initialize.apply(this, arguments);
            this.disableEditing = this.disableEditing.bind(this);
            const model = this.model;
            const em = this.em;
            this.listenTo(model, 'focus', this.onActive);
            this.listenTo(model, 'change:content', this.updateContentText);
            this.listenTo(model, 'sync:content', this.syncContent);
            this.rte = em && em.get('RichTextEditor');
        },
        updateContentText(m, v, opts = {}) {
            !opts.fromDisable && this.disableEditing();
        },
        onActive(e) {
            if (this.rteEnabled || !this.model.get('editable')) {
                return;
            }
            e && e.stopPropagation && e.stopPropagation();
            const {rte, em} = this;
            if (rte) {
                try {
                    this.activeRte = rte.enable(this, this.activeRte);
                } catch (err) {
                    em.logError(err);
                }
            }
            this.toggleEvents(1);
        },
        onDisable() {
            this.disableEditing();
        },
        disableEditing() {
            const {model, rte, activeRte, em} = this;
            const editable = model.get('editable');
            if (rte && editable) {
                try {
                    rte.disable(this, activeRte);
                } catch (err) {
                    em.logError(err);
                }
                this.syncContent();
            }
            this.toggleEvents();
        },
        getContent() {
            const {rte} = this;
            const {activeRte} = rte || {};
            let content = '';
            if (activeRte && typeof activeRte.getContent === 'function') {
                content = activeRte.getContent();
            } else {
                content = this.getChildrenContainer().innerHTML;
            }
            return content;
        },
        syncContent(opts = {}) {
            const {model, rte, rteEnabled} = this;
            if (!rteEnabled && !opts.force)
                return;
            const content = this.getContent();
            const comps = model.components();
            const contentOpt = {
                fromDisable: 1,
                ...opts
            };
            comps.length && comps.reset(null, opts);
            model.set('content', '', contentOpt);
            if (rte.customRte) {
                model.set('content', content, contentOpt);
            } else {
                const clean = model => {
                    const textable = !!model.get('textable');
                    const selectable = ![
                        'text',
                        'default',
                        ''
                    ].some(type => model.is(type)) || textable;
                    model.set({
                        _innertext: !selectable,
                        editable: selectable && model.get('editable'),
                        selectable: selectable,
                        hoverable: selectable,
                        removable: textable,
                        draggable: textable,
                        highlightable: 0,
                        copyable: textable,
                        ...!textable && { toolbar: '' }
                    }, opts);
                    model.get('components').each(model => clean(model));
                };
                !opts.silent && model.trigger('change:content', model, '', contentOpt);
                comps.add(content, opts);
                comps.each(model => clean(model));
                comps.trigger('resetNavigator');
            }
        },
        onInput() {
            const {em} = this;
            em && em.trigger('component:update', this.model);
        },
        disablePropagation(e) {
            e.stopPropagation();
        },
        toggleEvents(enable) {
            const {em} = this;

            const method = enable ? 'on' : 'off';
            em.setEditing(enable);
            this.rteEnabled = !!enable;
            var elDocs = [
                this.el.ownerDocument,
                document
            ];
            mixins.off(elDocs, 'mousedown', this.disableEditing);
            mixins[method](elDocs, 'mousedown', this.disableEditing);
            em[method]('toolbar:run:before', this.disableEditing);
            this.$el.off('mousedown', this.disablePropagation);
            this.$el[method]('mousedown', this.disablePropagation);
            if (this.config.draggableComponents) {
                let {el} = this;
                while (el) {
                    el.draggable = enable ? !1 : !0;
                    el = el.parentNode;
                    el && el.tagName == 'BODY' && (el = 0);
                }
            }
        }
    });
});