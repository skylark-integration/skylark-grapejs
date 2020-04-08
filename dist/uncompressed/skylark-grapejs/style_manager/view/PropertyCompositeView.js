define([
    'skylark-backbone',
    './PropertyView'
], function (Backbone, PropertyView) {
    'use strict';
    const $ = Backbone.$;
    return PropertyView.extend({
        templateInput() {
            const pfx = this.pfx;
            return `
      <div class="${ pfx }field ${ pfx }composite">
        <span id="${ pfx }input-holder"></span>
      </div>
    `;
        },
        inputValueChanged(...args) {
            if (!this.model.get('detached')) {
                PropertyView.prototype.inputValueChanged.apply(this, args);
            }
        },
        clear(e) {
            const props = this.properties;
            props && props.forEach(propView => propView.clear());
            PropertyView.prototype.clear.apply(this, arguments);
        },
        onRender() {
            var model = this.model;
            var props = model.get('properties') || [];
            var self = this;
            this.properties = [];
            if (props.length) {
                if (!this.$input) {
                    this.$input = $('<input type="hidden" value="0">');
                    this.input = this.$input.get(0);
                }
                if (!this.props) {
                    this.props = model.get('properties');
                }
                if (!this.$props) {
                    this.props.each(function (prop, index) {
                        if (prop && prop.get('type') == 'composite') {
                            this.props.remove(prop);
                            console.warn('Nested composite types not yet allowed.');
                        }
                        prop.parent = model;
                    }, this);
                    var PropertiesView = require('./PropertiesView').default;
                    var propsView = new PropertiesView(this.getPropsConfig());
                    this.$props = propsView.render().$el;
                    this.properties = propsView.properties;
                    this.$el.find(`#${ this.pfx }input-holder`).append(this.$props);
                }
            }
        },
        getPropsConfig(opts) {
            var that = this;
            const model = this.model;
            var result = {
                config: {
                    ...this.config,
                    highlightComputed: 0
                },
                collection: this.props,
                target: this.target,
                propTarget: this.propTarget,
                onChange(el, view, opts) {
                    model.set('value', model.getFullValue(), opts);
                },
                customValue(property, mIndex) {
                    return that.valueOnIndex(mIndex, property);
                }
            };
            if (model.get('detached')) {
                delete result.onChange;
            }
            return result;
        },
        valueOnIndex(index, view) {
            let value;
            const targetValue = this.getTargetValue({ ignoreDefault: 1 });
            if (targetValue) {
                const values = targetValue.split(this.model.getSplitSeparator());
                value = values[index];
            } else {
                value = view && view.getTargetValue({
                    ignoreCustomValue: 1,
                    ignoreDefault: 1
                });
            }
            return value;
        },
        clearCached() {
            PropertyView.prototype.clearCached.apply(this, arguments);
            this.$input = null;
            this.props = null;
            this.$props = null;
        }
    });
});