define([
    "skylark-langx/langx",
    'skylark-backbone',
    '../../domain_abstract/model/TypeableCollection',
    './Property',
    './PropertyStack',
    './../view/PropertyStackView',
    './PropertyComposite',
    './../view/PropertyCompositeView',
    './../view/PropertyFileView',
    './../view/PropertyColorView',
    './PropertySelect',
    './../view/PropertySelectView',
    './PropertyRadio',
    './../view/PropertyRadioView',
    './PropertySlider',
    './../view/PropertySliderView',
    './PropertyInteger',
    './../view/PropertyIntegerView',
    './../view/PropertyView'
], function (langx,Backbone, TypeableCollection, Property, PropertyStack, PropertyStackView, PropertyComposite, PropertyCompositeView, PropertyFileView, PropertyColorView, PropertySelect, PropertySelectView, PropertyRadio, PropertyRadioView, PropertySlider, PropertySliderView, PropertyInteger, PropertyIntegerView, PropertyView) {
    'use strict';
    return Backbone.Collection.extend(TypeableCollection).extend({
        types: [
            {
                id: 'stack',
                model: PropertyStack,
                view: PropertyStackView,
                isType(value) {
                    if (value && value.type == 'stack') {
                        return value;
                    }
                }
            },
            {
                id: 'composite',
                model: PropertyComposite,
                view: PropertyCompositeView,
                isType(value) {
                    if (value && value.type == 'composite') {
                        return value;
                    }
                }
            },
            {
                id: 'file',
                model: Property,
                view: PropertyFileView,
                isType(value) {
                    if (value && value.type == 'file') {
                        return value;
                    }
                }
            },
            {
                id: 'color',
                model: Property,
                view: PropertyColorView,
                isType(value) {
                    if (value && value.type == 'color') {
                        return value;
                    }
                }
            },
            {
                id: 'select',
                model: PropertySelect,
                view: PropertySelectView,
                isType(value) {
                    if (value && value.type == 'select') {
                        return value;
                    }
                }
            },
            {
                id: 'radio',
                model: PropertyRadio,
                view: PropertyRadioView,
                isType(value) {
                    if (value && value.type == 'radio') {
                        return value;
                    }
                }
            },
            {
                id: 'slider',
                model: PropertySlider,
                view: PropertySliderView,
                isType(value) {
                    if (value && value.type == 'slider') {
                        return value;
                    }
                }
            },
            {
                id: 'integer',
                model: PropertyInteger,
                view: PropertyIntegerView,
                isType(value) {
                    if (value && value.type == 'integer') {
                        return value;
                    }
                }
            },
            {
                id: 'base',
                model: Property,
                view: PropertyView,
                isType(value) {
                    value.type = 'base';
                    return value;
                }
            }
        ],
        deepClone() {
            const collection = this.clone();
            collection.reset(collection.map(model => {
                const cloned = model.clone();
                cloned.typeView = model.typeView;
                return cloned;
            }));
            return collection;
        },
        parseValue(value) {
            const properties = [];
            const values = value.split(' ');
            values.forEach((value, i) => {
                const property = this.at(i);
                if (!property)
                    return;
                properties.push(langx.mixin({},property.attributes,{ value }));
            });
            return properties;
        },
        getFullValue() {
            let result = '';
            this.each(model => result += `${ model.getFullValue() } `);
            return result.trim();
        }
    });
});