define([
    "skylark-langx/langx",
    './Property'
], function (
    langx,
    Property
) {
    'use strict';
    var PropertyComposite = Property.extend({
        defaults: {
            ...Property.prototype.defaults,
            detached: 0,
            properties: [],
            separator: ' '
        },
        initialize(props = {}, opts = {}) {
            Property.callParentInit(Property, this, props, opts);
            const properties = this.get('properties') || [];
            //const Properties = require('./Properties').default; // modified by lwf
            this.set('properties', new PropertyComposite.Properties(properties));
            this.listenTo(this, 'change:value', this.updateValues);
            Property.callInit(this, props, opts);
        },
        clearValue(opts = {}) {
            this.get('properties').each(property => property.clearValue());
            return Property.prototype.clearValue.apply(this, arguments);
        },
        updateValues() {
            const values = this.getFullValue().split(this.getSplitSeparator());
            this.get('properties').each((property, i) => {
                const len = values.length;
                const value = values[i] || values[i % len + (len != 1 && len % 2 ? 1 : 0)];
            });
        },
        getSplitSeparator() {
            return new RegExp(`${ this.get('separator') }(?![^\\(]*\\))`);
        },
        getDefaultValue(defaultProps) {
            let value = this.get('defaults');
            if (value && !defaultProps) {
                return value;
            }
            value = '';
            const properties = this.get('properties');
            properties.each((prop, index) => value += `${ prop.getDefaultValue() } `);
            return value.trim();
        },
        getFullValue() {
            if (this.get('detached')) {
                return '';
            }
            return this.get('properties').getFullValue();
        },
        getPropertyAt(index) {
            return this.get('properties').at(index);
        }
    });

    return PropertyComposite;
});