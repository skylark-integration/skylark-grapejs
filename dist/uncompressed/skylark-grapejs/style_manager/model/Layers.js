define([
    'skylark-underscore',
    'skylark-backbone',
    './Layer'
], function (a, Backbone, Layer) {
    'use strict';
    return Backbone.Collection.extend({
        model: Layer,
        initialize() {
            this.idx = 1;
            this.on('add', this.onAdd);
            this.on('reset', this.onReset);
        },
        onAdd(model, c, opts) {
            if (!opts.noIncrement)
                model.set('index', this.idx++);
            opts.active && this.active(this.indexOf(model));
        },
        onReset() {
            this.idx = 1;
        },
        getSeparator() {
            const {property} = this;
            return property ? property.get('layerSeparator') : ', ';
        },
        getLayersFromValue(value) {
            const layers = [];
            value.replace(/\(([\w\s,.]*)\)/g, match => {
                var cleaned = match.replace(/,\s*/g, ',');
                value = value.replace(match, cleaned);
            });
            const layerValues = value ? value.split(this.getSeparator()) : [];
            layerValues.forEach(layerValue => {
                layers.push({ properties: this.properties.parseValue(layerValue) });
            });
            return layers;
        },
        getLayersFromStyle(styleObj) {
            const layers = [];
            const properties = this.properties;
            const propNames = properties.pluck('property');
            properties.each(propModel => {
                const style = styleObj[propModel.get('property')];
                const values = style ? style.split(', ') : [];
                values.forEach((value, i) => {
                    value = propModel.parseValue(value.trim()).value;
                    const layer = layers[i];
                    const propertyObj = {
                        ...propModel.attributes,
                        ...{ value }
                    };
                    if (layer) {
                        layer.properties.push(propertyObj);
                    } else {
                        layers[i] = { properties: [propertyObj] };
                    }
                });
            });
            layers.forEach(layer => {
                const layerProprs = layer.properties.map(prop => prop.property);
                properties.each(propModel => {
                    const propertyName = propModel.get('property');
                    if (layerProprs.indexOf(propertyName) < 0) {
                        layer.properties.push({ ...propModel.attributes });
                    }
                });
            });
            return layers;
        },
        active(index) {
            this.each(layer => layer.set('active', 0));
            const layer = this.at(index);
            layer && layer.set('active', 1);
        },
        getFullValue() {
            let result = [];
            this.each(layer => result.push(layer.getFullValue()));
            return result.join(this.getSeparator());
        },
        getPropertyValues(property, defValue) {
            const result = [];
            this.each(layer => {
                const value = layer.getPropertyValue(property);
                value ? result.push(value) : !a.isUndefined(defValue) && result.push(defValue);
            });
            return result.join(', ');
        }
    });
});