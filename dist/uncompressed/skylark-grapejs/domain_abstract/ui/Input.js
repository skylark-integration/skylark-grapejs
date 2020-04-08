define(['skylark-backbone'], function (Backbone) {
    'use strict';
    const $ = Backbone.$;
    return Backbone.View.extend({
        events: { change: 'handleChange' },
        template() {
            return `<span class="${ this.holderClass() }"></span>`;
        },
        inputClass() {
            return `${ this.ppfx }field`;
        },
        holderClass() {
            return `${ this.ppfx }input-holder`;
        },
        initialize(opts = {}) {
            const ppfx = opts.ppfx || '';
            this.opts = opts;
            this.ppfx = ppfx;
            this.em = opts.target || {};
            this.listenTo(this.model, 'change:value', this.handleModelChange);
        },
        elementUpdated() {
            this.model.trigger('el:change');
        },
        setValue(value) {
            const model = this.model;
            let val = value || model.get('defaults');
            const input = this.getInputEl();
            input && (input.value = val);
        },
        handleModelChange(model, value, opts) {
            this.setValue(value, opts);
        },
        handleChange(e) {
            e.stopPropagation();
            const value = this.getInputEl().value;
            this.model.set({ value }, { fromInput: 1 });
            this.elementUpdated();
        },
        getInputEl() {
            if (!this.inputEl) {
                const {model} = this;
                const plh = model.get('placeholder') || model.get('defaults') || '';
                this.inputEl = $(`<input type="text" placeholder="${ plh }">`);
            }
            return this.inputEl.get(0);
        },
        render() {
            this.inputEl = null;
            const el = this.$el;
            el.addClass(this.inputClass());
            el.html(this.template());
            el.find(`.${ this.holderClass() }`).append(this.getInputEl());
            return this;
        }
    });
});