define([
    'skylark-underscore',
    'skylark-backbone',
    'skylark-codemirror',
    'skylark-codemirror/mode/htmlmixed/htmlmixed',
    'skylark-codemirror/mode/css/css',
    './formatting'
], function (a, Backbone, CodeMirror) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            input: '',
            label: '',
            codeName: '',
            theme: 'hopscotch',
            readOnly: true,
            lineNumbers: true
        },
        init(el) {
            a.bindAll(this, 'onChange');
            this.editor = CodeMirror.fromTextArea(el, {
                dragDrop: false,
                lineWrapping: true,
                mode: this.get('codeName'),
                ...this.attributes
            });
            this.element = el;
            this.editor.on('change', this.onChange);
            return this;
        },
        onChange() {
            this.trigger('update', this);
        },
        getEditor() {
            return this.editor;
        },
        getElement() {
            return this.element;
        },
        setElement(el) {
            this.element = el;
            return this;
        },
        refresh() {
            this.getEditor().refresh();
            return this;
        },
        focus() {
            this.getEditor().focus();
            return this;
        },
        getContent() {
            const ed = this.getEditor();
            return ed && ed.getValue();
        },
        setContent(v, opts = {}) {
            const {editor} = this;
            if (!editor)
                return;
            editor.setValue(v);
            if (editor.autoFormatRange) {
                CodeMirror.commands.selectAll(editor);
                editor.autoFormatRange(editor.getCursor(true), editor.getCursor(false));
                CodeMirror.commands.goDocStart(editor);
            }
            !opts.noRefresh && setTimeout(() => this.refresh());
        }
    });
});