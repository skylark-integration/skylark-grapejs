define([
    'skylark-underscore',
    'skylark-backbone'
], function (a, Backbone) {
    'use strict';
    const Model = Backbone.Model;
    const View = Backbone.View;
    return {
        types: [],
        initialize(models, opts) {
            var _this = this;
            this.model = function(attrs = {}, options = {}) { // modified by lwf
                let Model, View, type;
                if (attrs && attrs.type) {
                    const baseType = _this.getBaseType();
                    type = _this.getType(attrs.type);
                    Model = type ? type.model : baseType.model;
                    View = type ? type.view : baseType.view;
                } else {
                    const typeFound = _this.recognizeType(attrs);
                    type = typeFound.type;
                    Model = type.model;
                    View = type.view;
                    attrs = typeFound.attributes;
                }
                const model = new Model(attrs, options);
                model.typeView = View;
                return model;
            };
            const init = _this.init && _this.init.bind(_this);
            init && init();
        },
        recognizeType(value) {
            const types = this.getTypes();
            for (let i = 0; i < types.length; i++) {
                const type = types[i];
                let typeFound = type.isType(value);
                typeFound = typeof typeFound == 'boolean' && typeFound ? { type: type.id } : typeFound;
                if (typeFound) {
                    return {
                        type,
                        attributes: typeFound
                    };
                }
            }
            return {
                type: this.getBaseType(),
                attributes: value
            };
        },
        getBaseType() {
            const types = this.getTypes();
            return types[types.length - 1];
        },
        getTypes() {
            return this.types;
        },
        getType(id) {
            const types = this.getTypes();
            for (let i = 0; i < types.length; i++) {
                const type = types[i];
                if (type.id === id) {
                    return type;
                }
            }
        },
        addType(id, definition) {
            const type = this.getType(id);
            const baseType = this.getBaseType();
            const ModelInst = type ? type.model : baseType.model;
            const ViewInst = type ? type.view : baseType.view;
            let {model, view, isType} = definition;
            model = model instanceof Model || a.isFunction(model) ? model : ModelInst.extend(model || {});
            view = view instanceof View || a.isFunction(view) ? view : ViewInst.extend(view || {});
            if (type) {
                type.model = model;
                type.view = view;
                type.isType = isType || type.isType;
            } else {
                definition.id = id;
                definition.model = model;
                definition.view = view;
                definition.isType = isType || function (value) {
                    if (value && value.type == id) {
                        return true;
                    }
                };
                this.getTypes().unshift(definition);
            }
        }
    };
});