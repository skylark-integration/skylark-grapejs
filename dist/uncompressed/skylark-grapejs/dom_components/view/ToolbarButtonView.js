define(['skylark-backbone'], function (Backbone) {
    'use strict';
    return Backbone.View.extend({
        events() {
            return this.model.get('events') || { mousedown: 'handleClick' };
        },
        attributes() {
            return this.model.get('attributes');
        },
        initialize(opts = {}) {
            const {
                config = {}
            } = opts;
            this.em = config.em;
            this.editor = config.editor;
        },
        handleClick(event) {
            event.preventDefault();
            event.stopPropagation();
            const {editor, em} = this;
            const {left, top} = editor.Canvas.getFrameEl().getBoundingClientRect();
            const calibrated = {
                ...event,
                clientX: event.clientX - left,
                clientY: event.clientY - top
            };
            em.trigger('toolbar:run:before');
            this.execCommand(calibrated);
        },
        execCommand(event) {
            const opts = { event };
            const command = this.model.get('command');
            const editor = this.editor;
            if (typeof command === 'function') {
                command(editor, null, opts);
            }
            if (typeof command === 'string') {
                editor.runCommand(command, opts);
            }
        },
        render() {
            const {editor, $el, model} = this;
            const id = model.get('id');
            const label = model.get('label');
            const pfx = editor.getConfig('stylePrefix');
            $el.addClass(`${ pfx }toolbar-item`);
            id && $el.addClass(`${ pfx }toolbar-item__${ id }`);
            label && $el.append(label);
            return this;
        }
    });
});