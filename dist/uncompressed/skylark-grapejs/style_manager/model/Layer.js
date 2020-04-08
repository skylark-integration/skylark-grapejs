define([
    'skylark-backbone',
    './Properties'
], function (Backbone, Properties) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            index: '',
            value: '',
            values: {},
            active: false,
            preview: false,
            properties: []
        },
        initialize() {
            const prp = this.get('properties');
            var value = this.get('value');
            this.set('properties', prp instanceof Properties ? prp : new Properties(prp));
            const props = this.get('properties');
            props.forEach(this.onPropAdd, this);
            this.listenTo(props, 'add', this.onPropAdd);
            if (!value) {
                var val = '';
                var values = this.get('values');
                for (var prop in values) {
                    val += ' ' + values[prop];
                }
                this.set('value', val.trim());
            }
        },
        onPropAdd(prop) {
            const coll = this.collection;
            prop.parent = coll && coll.property;
        },
        getPropertyAt(index) {
            return this.get('properties').at(index);
        },
        getPropertyValue(property) {
            let result = '';
            this.get('properties').each(prop => {
                if (prop.get('property') == property) {
                    result = prop.getFullValue();
                }
            });
            return result;
        },
        getFullValue() {
            let result = [];
            this.get('properties').each(prop => result.push(prop.getFullValue()));
            return result.join(' ').trim();
        }
    });
});