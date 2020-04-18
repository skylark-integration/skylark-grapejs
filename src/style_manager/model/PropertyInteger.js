define([
    "skylark-langx/langx",
    'skylark-underscore',
    './Property',
    '../../domain_abstract/ui/InputNumber'
], function (
    langx,
    a, 
    Property, 
    InputNumber
) {
    'use strict';
    return Property.extend({
        defaults: {
            ...Property.prototype.defaults,
            units: [],
            unit: '',
            step: 1,
            min: '',
            max: ''
        },
        initialize(props = {}, opts = {}) {
            Property.callParentInit(Property, this, props, opts);
            const unit = this.get('unit');
            const units = this.get('units');
            this.input = new InputNumber({ model: this });
            if (units.length && !unit) {
                this.set('unit', units[0]);
            }
            Property.callInit(this, props, opts);
        },
        clearValue(opts = {}) {
            this.set({
                value: undefined,
                unit: undefined
            }, opts);
            return this;
        },
        parseValue(val) {
            const parsed = Property.prototype.parseValue.apply(this, arguments);
            const {value, unit} = this.input.validateInputValue(parsed.value, { deepCheck: 1 });
            parsed.value = value;
            parsed.unit = unit;
            return parsed;
        },
        getFullValue() {
            let value = this.get('value');
            let unit = this.get('unit');
            value = !a.isUndefined(value) ? value : '';
            unit = !a.isUndefined(unit) && value ? unit : '';
            value = `${ value }${ unit }`;
            return Property.prototype.getFullValue.apply(this, [value]);
        }
    });
});