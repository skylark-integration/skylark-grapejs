define(['skylark-backbone'], function (Backbone) {
    'use strict';
    const $ = Backbone.$;
    return Backbone.View.extend({
        initialize(o) {
            this.config = o || {};
            this.editorModel = this.em = this.config.em || {};
            this.pfx = this.config.stylePrefix;
            this.ppfx = this.config.pStylePrefix;
            this.hoverClass = this.pfx + 'hover';
            this.badgeClass = this.pfx + 'badge';
            this.plhClass = this.pfx + 'placeholder';
            this.freezClass = this.ppfx + 'freezed';
            this.canvas = this.em.get && this.em.get('Canvas');
            if (this.em.get)
                this.setElement(this.getCanvas());
            if (this.canvas) {
                this.$canvas = this.$el;
                this.canvasTool = this.getCanvasTools();
            }
            this.init(this.config);
        },
        onFrameScroll(e) {
        },
        getCanvas() {
            return this.canvas.getElement();
        },
        getCanvasBody() {
            return this.canvas.getBody();
        },
        getCanvasWrapper() {
            return this.canvas.getWrapperEl();
        },
        getCanvasTools() {
            return this.canvas.getToolsEl();
        },
        offset(el) {
            var rect = el.getBoundingClientRect();
            return {
                top: rect.top + el.ownerDocument.body.scrollTop,
                left: rect.left + el.ownerDocument.body.scrollLeft
            };
        },
        init(o) {
        },
        callRun(editor, options = {}) {
            const id = this.id;
            editor.trigger(`run:${ id }:before`, options);
            if (options && options.abort) {
                editor.trigger(`abort:${ id }`, options);
                return;
            }
            const sender = options.sender || editor;
            const result = this.run(editor, sender, options);
            editor.trigger(`run:${ id }`, result, options);
            editor.trigger('run', id, result, options);
            return result;
        },
        callStop(editor, options = {}) {
            const id = this.id;
            const sender = options.sender || editor;
            editor.trigger(`stop:${ id }:before`, options);
            const result = this.stop(editor, sender, options);
            editor.trigger(`stop:${ id }`, result, options);
            editor.trigger('stop', id, result, options);
            return result;
        },
        stopCommand() {
            this.em.get('Commands').stop(this.id);
        },
        run(em, sender) {
        },
        stop(em, sender) {
        }
    });
});