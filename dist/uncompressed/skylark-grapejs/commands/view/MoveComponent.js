define([
    'skylark-underscore',
    'skylark-backbone',
    '../../utils/mixins',
    './SelectComponent',
    './SelectPosition'
], function (a, Backbone, b, SelectComponent, SelectPosition) {
    'use strict';
    const $ = Backbone.$;
    return a.extend({}, SelectPosition, SelectComponent, {
        init(o) {
            SelectComponent.init.apply(this, arguments);
            a.bindAll(this, 'initSorter', 'rollback', 'onEndMove');
            this.opt = o;
            this.hoverClass = this.ppfx + 'highlighter-warning';
            this.badgeClass = this.ppfx + 'badge-warning';
            this.noSelClass = this.ppfx + 'no-select';
        },
        enable(...args) {
            SelectComponent.enable.apply(this, args);
            this.getBadgeEl().addClass(this.badgeClass);
            this.getHighlighterEl().addClass(this.hoverClass);
            var wp = this.$wrapper;
            wp.css('cursor', 'move');
            wp.undefined('mousedown', this.initSorter);
            wp.addClass(this.noSelClass);
        },
        toggleClipboard() {
        },
        initSorter(e) {
            var el = $(e.target).data('model');
            var drag = el.get('draggable');
            if (!drag)
                return;
            this.cacheEl = null;
            this.startSelectPosition(e.target, this.frameEl.contentDocument);
            this.sorter.draggable = drag;
            this.sorter.onEndMove = this.onEndMove.bind(this);
            this.stopSelectComponent();
            this.$wrapper.undefined('mousedown', this.initSorter);
            b.on(this.getContentWindow(), 'keydown', this.rollback);
        },
        initSorterFromModel(model) {
            var drag = model.get('draggable');
            if (!drag)
                return;
            this.cacheEl = null;
            var el = model.view.el;
            this.startSelectPosition(el, this.frameEl.contentDocument);
            this.sorter.draggable = drag;
            this.sorter.onEndMove = this.onEndMoveFromModel.bind(this);
            this.stopSelectComponent();
            b.on(this.getContentWindow(), 'keydown', this.rollback);
        },
        initSorterFromModels(models) {
            this.cacheEl = null;
            const lastModel = models[models.length - 1];
            const frame = (this.em.get('currentFrame') || {}).model;
            const el = lastModel.getEl(frame);
            const doc = el.ownerDocument;
            this.startSelectPosition(el, doc, { onStart: this.onStart });
            this.sorter.draggable = lastModel.get('draggable');
            this.sorter.toMove = models;
            this.sorter.onMoveClb = this.onDrag;
            this.sorter.onEndMove = this.onEndMoveFromModel.bind(this);
            this.stopSelectComponent();
            b.on(this.getContentWindow(), 'keydown', this.rollback);
        },
        onEndMoveFromModel() {
            b.off(this.getContentWindow(), 'keydown', this.rollback);
        },
        onEndMove() {
            this.enable();
            b.off(this.getContentWindow(), 'keydown', this.rollback);
        },
        onSelect(e, el) {
        },
        rollback(e, force) {
            var key = e.which || e.keyCode;
            if (key == 27 || force) {
                this.sorter.moved = false;
                this.sorter.endMove();
            }
            return;
        },
        getBadgeEl() {
            if (!this.$badge)
                this.$badge = $(this.getBadge());
            return this.$badge;
        },
        getHighlighterEl() {
            if (!this.$hl)
                this.$hl = $(this.canvas.getHighlighter());
            return this.$hl;
        },
        stop(...args) {
            SelectComponent.stop.apply(this, args);
            this.getBadgeEl().removeClass(this.badgeClass);
            this.getHighlighterEl().removeClass(this.hoverClass);
            var wp = this.$wrapper;
            wp.css('cursor', '').unbind().removeClass(this.noSelClass);
        }
    });
});