define([
    './TraitView',
    '../../domain_abstract/ui/InputNumber'
], function (TraitView, InputNumber) {
    'use strict';
    return TraitView.extend({
        getValueForTarget() {
            const {model} = this;
            const {value, unit} = model.attributes;
            return value ? value + unit : '';
        },
        getInputEl() {
            if (!this.input) {
                var value = this.getModelValue();
                var inputNumber = new InputNumber({
                    contClass: this.ppfx + 'field-int',
                    model: this.model,
                    ppfx: this.ppfx
                });
                this.input = inputNumber.render();
                this.$input = this.input.inputEl;
                this.$unit = this.input.unitEl;
                this.model.set('value', value);
                this.$input.val(value);
                this.input = inputNumber.el;
            }
            return this.input;
        }
    });
});