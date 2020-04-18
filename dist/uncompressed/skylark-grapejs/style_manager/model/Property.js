define([
    "skylark-langx/langx",
    'skylark-backbone',
    'skylark-underscore',
    '../../utils/mixins'
], function (
    langx,
    Backbone, 
    a, 
    b
) {
    'use strict';
    const Property = Backbone.Model.extend({
        defaults: {
            name: '',
            property: '',
            type: '',
            defaults: '',
            info: '',
            value: '',
            icon: '',
            functionName: '',
            status: '',
            visible: true,
            fixedValues: [
                'initial',
                'inherit'
            ],
            full: 0,
            important: 0,
            toRequire: 0,
            requires: null,
            requiresParent: null
        },
        initialize(props = {}, opts = {}) {
            const id = this.get('id') || '';
            const name = this.get('name') || '';
            !this.get('property') && this.set('property', (name || id).replace(/ /g, '-'));
            const prop = this.get('property');
            !this.get('id') && this.set('id', prop);
            !name && this.set('name', b.capitalize(prop).replace(/-/g, ' '));
            Property.callInit(this, props, opts);
        },
        init() {
        },
        clearValue(opts = {}) {
            this.set({
                value: undefined,
                status: ''
            }, opts);
            return this;
        },
        setValue(value, complete = 1, opts = {}) {
            const parsed = this.parseValue(value);
            this.set(parsed, langx.mixin({},opts,{
                avoidStore: !complete
            }));
        },
        setValueFromInput(value, complete, opts = {}) {
            this.setValue(value, complete, langx.mixin({},opts,{
                fromInput: 1
            }));
        },
        parseValue(value, opts = {}) {
            const result = { value };
            const imp = '!important';
            if (a.isString(value) && value.indexOf(imp) !== -1) {
                result.value = value.replace(imp, '').trim();
                result.important = 1;
            }
            if (!this.get('functionName') && !opts.complete) {
                return result;
            }
            const args = [];
            let valueStr = `${ result.value }`;
            let start = valueStr.indexOf('(') + 1;
            let end = valueStr.lastIndexOf(')');
            const functionName = valueStr.substring(0, start - 1);
            if (functionName)
                result.functionName = functionName;
            args.push(start);
            if (end >= 0) {
                args.push(end);
            }
            result.value = String.prototype.substring.apply(valueStr, args);
            if (opts.numeric) {
                const num = parseFloat(result.value);
                result.unit = result.value.replace(num, '');
                result.value = num;
            }
            return result;
        },
        splitValues(values, separator = ',') {
            const res = [];
            const op = '(';
            const cl = ')';
            let curr = '';
            let acc = 0;
            (values || '').split('').forEach(str => {
                if (str == op) {
                    acc++;
                    curr = curr + op;
                } else if (str == cl && acc > 0) {
                    acc--;
                    curr = curr + cl;
                } else if (str === separator && acc == 0) {
                    res.push(curr);
                    curr = '';
                } else {
                    curr = curr + str;
                }
            });
            curr !== '' && res.push(curr);
            return res.map(i => i.trim());
        },
        getDefaultValue() {
            return this.get('defaults');
        },
        getFullValue(val) {
            const fn = this.get('functionName');
            const def = this.getDefaultValue();
            let value = a.isUndefined(val) ? this.get('value') : val;
            const hasValue = !a.isUndefined(value) && value !== '';
            if (value && def && value === def) {
                return def;
            }
            if (fn && hasValue) {
                value = `${ fn }(${ value })`;
            }
            if (hasValue && this.get('important')) {
                value = `${ value } !important`;
            }
            return value || '';
        }
    }, {
        callParentInit(property, ctx, props, opts = {}) {
            property.prototype.initialize.apply(ctx, [
                props,
                langx.mixin({},opts,{
                    skipInit: 1
                })
            ]);
        },
        callInit(context, props, opts = {}) {
            !opts.skipInit && context.init(props, opts);
        }
    });
    return Property;
});