define([
    'skylark-underscore',
    './PropertyCompositeView',
    './LayersView',
    '../../code_manager/model/CssGenerator'
], function (a, PropertyCompositeView, LayersView, CssGenerator) {
    'use strict';
    const cssGen = new CssGenerator();
    return PropertyCompositeView.extend({
        templateInput() {
            const pfx = this.pfx;
            const ppfx = this.ppfx;
            return `
      <div class="${ pfx }field ${ pfx }stack">
        <button type="button" id="${ pfx }add" data-add-layer>+</button>
        <div data-layers-wrapper></div>
      </div>
    `;
        },
        init() {
            const model = this.model;
            const pfx = this.pfx;
            model.set('stackIndex', null);
            this.events[`click [data-add-layer]`] = 'addLayer';
            this.listenTo(model, 'change:stackIndex', this.indexChanged);
            this.listenTo(model, 'updateValue', this.inputValueChanged);
            this.delegateEvents();
        },
        targetUpdated(...args) {
            if (!this.model.get('detached')) {
                PropertyCompositeView.prototype.targetUpdated.apply(this, args);
            } else {
                const {status} = this._getTargetData();
                this.setStatus(status);
                this.checkVisibility();
            }
            this.refreshLayers();
        },
        getLayers() {
            return this.model.get('layers');
        },
        indexChanged(e) {
            const model = this.model;
            this.getLayers().active(model.get('stackIndex'));
        },
        addLayer() {
            const model = this.model;
            const layers = this.getLayers();
            const prepend = model.get('prepend');
            const properties = model.get('properties').deepClone();
            properties.each(property => property.set('value', ''));
            const layer = layers.add({ properties }, {
                active: 1,
                ...prepend && { at: 0 }
            });
            this.inputValueChanged();
            model.set('stackIndex', layers.indexOf(layer));
        },
        inputValueChanged() {
            const model = this.model;
            this.elementUpdated();
            if (!model.get('detached')) {
                model.set('value', this.getLayerValues());
            } else {
                model.get('properties').each(prop => prop.trigger('change:value'));
            }
        },
        setValue() {
        },
        getLayerValues() {
            return this.getLayers().getFullValue();
        },
        _getClassRule(opts = {}) {
            const {em} = this;
            const {
                skipAdd = 1
            } = opts;
            const selected = em.getSelected();
            const targetAlt = em.get('StyleManager').getModelToStyle(selected, {
                skipAdd,
                useClasses: 1
            });
            return targetAlt !== selected && targetAlt;
        },
        _getParentTarget(target, opts = {}) {
            const {em, model} = this;
            const property = model.get('property');
            const isValid = opts.isValid || (rule => rule.getStyle()[property]);
            const targetsDevice = em.get('CssComposer').getAll().filter(rule => rule.selectorsToString() === target.getSelectorsString());
            const map = targetsDevice.reduce((acc, rule) => {
                acc[rule.getAtRule()] = rule;
                return acc;
            }, {});
            const mapSorted = cssGen.sortMediaObject(map);
            const sortedRules = mapSorted.map(item => item.value);
            const currIndex = sortedRules.indexOf(target);
            const rulesToCheck = sortedRules.splice(0, currIndex);
            let result;
            for (let i = rulesToCheck.length - 1; i > -1; i--) {
                const rule = rulesToCheck[i];
                if (isValid(rule)) {
                    result = rule;
                    break;
                }
            }
            return result;
        },
        refreshLayers() {
            let layersObj = [];
            const {model, em} = this;
            const layers = this.getLayers();
            const detached = model.get('detached');
            const property = model.get('property');
            const target = this.getTarget();
            const valueComput = this.getComputedValue();
            const selected = em.getSelected();
            let resultValue, style, targetAlt, targetAltDevice, valueTargetAlt, valueTrgAltDvc;
            if (detached) {
                style = target ? target.getStyle() : {};
                const hasDetachedStyle = rule => {
                    const name = model.get('properties').at(0).get('property');
                    return rule && !a.isUndefined(rule.getStyle()[name]);
                };
                if (!a.keys(style).length && valueComput && selected) {
                    const parentOpts = { isValid: rule => hasDetachedStyle(rule) };
                    targetAltDevice = this._getParentTarget(target, parentOpts);
                    if (targetAltDevice) {
                        style = targetAltDevice.getStyle();
                    } else {
                        targetAlt = this._getClassRule();
                        valueTargetAlt = hasDetachedStyle(targetAlt) && targetAlt.getStyle();
                        targetAltDevice = !valueTargetAlt && this._getParentTarget(this._getClassRule({ skipAdd: 0 }), parentOpts);
                        valueTrgAltDvc = hasDetachedStyle(targetAltDevice) && targetAltDevice.getStyle();
                        style = valueTargetAlt || valueTrgAltDvc || {};
                    }
                }
                resultValue = style;
                layersObj = layers.getLayersFromStyle(style);
            } else {
                const valueTrg = this.getTargetValue({ ignoreDefault: 1 });
                let value = valueTrg;
                if (!value && valueComput) {
                    targetAltDevice = this._getParentTarget(target);
                    if (targetAltDevice) {
                        value = targetAltDevice.getStyle()[property];
                    } else {
                        targetAlt = this._getClassRule();
                        valueTargetAlt = targetAlt && targetAlt.getStyle()[property];
                        targetAltDevice = !valueTargetAlt && this._getParentTarget(this._getClassRule({ skipAdd: 0 }));
                        valueTrgAltDvc = targetAltDevice && targetAltDevice.getStyle()[property];
                        value = valueTargetAlt || valueTrgAltDvc || valueComput;
                    }
                }
                value = value == model.getDefaultValue() ? '' : value;
                resultValue = value;
                layersObj = layers.getLayersFromValue(value);
            }
            const toAdd = model.getLayersFromTarget(target, {
                resultValue,
                layersObj
            }) || layersObj;
            layers.reset();
            layers.add(toAdd);
            model.set({ stackIndex: null }, { silent: true });
        },
        getTargetValue(opts = {}) {
            let result = PropertyCompositeView.prototype.getTargetValue.call(this, opts);
            const {detached} = this.model.attributes;
            if (a.isUndefined(result) && !detached) {
                result = this.model.getValueFromStyle(this.getTarget().getStyle());
            }
            return result;
        },
        onRender() {
            const self = this;
            const model = this.model;
            const fieldEl = this.el.querySelector('[data-layers-wrapper]');
            const PropertiesView = require('./PropertiesView').default;
            const propsConfig = {
                target: this.target,
                propTarget: this.propTarget,
                onChange(el, view, opt) {
                    const subModel = view.model;
                    if (model.get('detached')) {
                        const subProp = subModel.get('property');
                        const defVal = subModel.getDefaultValue();
                        const values = self.getLayers().getPropertyValues(subProp, defVal);
                        view.updateTargetStyle(values, null, opt);
                    } else {
                        if (model.get('status') == 'updated') {
                            const value = model.getFullValue();
                            model.set('value', value, opt);
                            !value && view.updateTargetStyle(value, null, opt);
                        }
                    }
                }
            };
            const layers = new LayersView({
                collection: this.getLayers(),
                stackModel: model,
                preview: model.get('preview'),
                config: this.config,
                propsConfig
            }).render().el;
            new PropertiesView({
                target: this.target,
                collection: this.model.get('properties'),
                stackModel: model,
                config: this.config,
                onChange: propsConfig.onChange,
                propTarget: propsConfig.propTarget
            }).render();
            fieldEl.appendChild(layers);
        }
    });
});