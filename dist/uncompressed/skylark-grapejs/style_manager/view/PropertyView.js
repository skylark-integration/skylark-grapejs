define([
    'skylark-backbone',
    'skylark-underscore',
    '../../utils/mixins'
], function (Backbone, a, b) {
    'use strict';
    const clearProp = 'data-clear-style';
    return Backbone.View.extend({
        template(model) {
            const pfx = this.pfx;
            return `
      <div class="${ pfx }label">
        ${ this.templateLabel(model) }
      </div>
      <div class="${ this.ppfx }fields">
        ${ this.templateInput(model) }
      </div>
    `;
        },
        templateLabel(model) {
            const {pfx, em} = this;
            const {parent} = model;
            const {icon = '', info = '', id, name} = model.attributes;
            const label = em && em.t(`styleManager.properties.${ id }`) || name;
            return `
      <span class="${ pfx }icon ${ icon }" title="${ info }">
        ${ label }
      </span>
      ${ !parent ? `<b class="${ pfx }clear" ${ clearProp }>&Cross;</b>` : '' }
    `;
        },
        templateInput(model) {
            return `
      <div class="${ this.ppfx }field">
        <input placeholder="${ model.getDefaultValue() }"/>
      </div>
    `;
        },
        events: {
            change: 'inputValueChanged',
            [`click [${ clearProp }]`]: 'clear'
        },
        initialize(o = {}) {
            a.bindAll(this, 'targetUpdated');
            this.config = o.config || {};
            const em = this.config.em;
            this.em = em;
            this.pfx = this.config.stylePrefix || '';
            this.ppfx = this.config.pStylePrefix || '';
            this.target = o.target || {};
            this.propTarget = o.propTarget || {};
            this.onChange = o.onChange;
            this.onInputRender = o.onInputRender || {};
            this.customValue = o.customValue || {};
            const model = this.model;
            this.property = model.get('property');
            this.input = null;
            const pfx = this.pfx;
            this.inputHolderId = '#' + pfx + 'input-holder';
            this.sector = model.collection && model.collection.sector;
            model.view = this;
            if (!model.get('value')) {
                model.set('value', model.getDefaultValue());
            }
            em && em.on(`update:component:style:${ this.property }`, this.targetUpdated);
            const requires = model.get('requires');
            requires && Object.keys(requires).forEach(property => {
                em && em.on(`component:styleUpdate:${ property }`, this.targetUpdated);
            });
            this.listenTo(this.propTarget, 'update styleManager:update', this.targetUpdated);
            this.listenTo(model, 'destroy remove', this.remove);
            this.listenTo(model, 'change:value', this.modelValueChanged);
            this.listenTo(model, 'targetUpdated', this.targetUpdated);
            this.listenTo(model, 'change:visible', this.updateVisibility);
            this.listenTo(model, 'change:status', this.updateStatus);
            this.listenTo(model, 'change:name change:className change:full', this.render);
            const init = this.init && this.init.bind(this);
            init && init();
        },
        updateStatus() {
            const {model} = this;
            const status = model.get('status');
            const parent = model.parent;
            const pfx = this.pfx;
            const ppfx = this.ppfx;
            const config = this.config;
            const updatedCls = `${ ppfx }four-color`;
            const computedCls = `${ ppfx }color-warn`;
            const labelEl = this.$el.children(`.${ pfx }label`);
            const clearStyleEl = this.getClearEl();
            const clearStyle = clearStyleEl ? clearStyleEl.style : {};
            labelEl.removeClass(`${ updatedCls } ${ computedCls }`);
            clearStyle.display = 'none';
            switch (status) {
            case 'updated':
                !parent && labelEl.addClass(updatedCls);
                if (config.clearProperties) {
                    clearStyle.display = 'inline';
                }
                break;
            case 'computed':
                labelEl.addClass(computedCls);
                break;
            }
        },
        clear(ev) {
            ev && ev.stopPropagation();
            this.model.clearValue();
            setTimeout(() => this.targetUpdated());
        },
        getClearEl() {
            if (!this.clearEl) {
                this.clearEl = this.el.querySelector(`[${ clearProp }]`);
            }
            return this.clearEl;
        },
        getTarget() {
            return this.getTargetModel();
        },
        getTargets() {
            const {targets} = this.propTarget;
            return targets || [this.getTarget()];
        },
        getTargetModel() {
            return this.propTarget && this.propTarget.model;
        },
        getHelperModel() {
            return this.propTarget && this.propTarget.helper;
        },
        inputValueChanged(e) {
            e && e.stopPropagation();
            this.model.setValue(this.getInputValue(), 1, { fromInput: 1 });
            this.elementUpdated();
        },
        elementUpdated() {
            this.setStatus('updated');
        },
        setStatus(value) {
            this.model.set('status', value);
            const parent = this.model.parent;
            parent && value == 'updated' && parent.set('status', value);
        },
        emitUpdateTarget: a.debounce(function () {
            const em = this.config.em;
            em && em.trigger('styleManager:update:target', this.getTarget());
        }),
        _getTargetData() {
            const {model, config} = this;
            const targetValue = this.getTargetValue({ ignoreDefault: 1 });
            const defaultValue = model.getDefaultValue();
            const computedValue = this.getComputedValue();
            let value = '';
            let status = '';
            if (targetValue) {
                value = targetValue;
                if (config.highlightChanged) {
                    status = 'updated';
                }
            } else if (computedValue && config.showComputed && computedValue != defaultValue) {
                value = computedValue;
                if (config.highlightComputed) {
                    status = 'computed';
                }
            } else {
                value = defaultValue;
                status = '';
            }
            return {
                value,
                status,
                targetValue,
                defaultValue,
                computedValue
            };
        },
        targetUpdated(mod, val, opts = {}) {
            this.emitUpdateTarget();
            if (!this.checkVisibility()) {
                return;
            }
            const config = this.config;
            const em = config.em;
            const {model} = this;
            const property = model.get('property');
            
            //const {
            //    status,
            //    value,
            //    ...targetData
            //} = this._getTargetData();

            const targetData = this._getTargetData()
            this.setStatus(targetData.status);
            model.setValue(targetData.value, 0, {
                fromTarget: 1,
                ...opts
            });
            if (em) {
                const data = {
                //    status,
                //    value,
                    ...targetData
                };
                em.trigger('styleManager:change', this, property, targetData.value, data);
                em.trigger(`styleManager:change:${ property }`, this, targetData.value, data);
                this._emitUpdate(data);
            }
        },
        _emitUpdate(addData = {}) {
            const {em, model} = this;
            if (!em)
                return;
            const property = model.get('property');
            const data = {
                ...this._getEventData(),
                ...addData
            };
            const {id} = data;
            em.trigger('style:update', data);
            em.trigger(`style:update:${ property }`, data);
            property !== id && em.trigger(`style:update:${ id }`, data);
        },
        _getEventData() {
            const {model} = this;
            return {
                propertyView: this,
                targets: this.getTargets(),
                value: model.getFullValue(),
                property: model,
                id: model.get('id'),
                name: model.get('property')
            };
        },
        checkVisibility() {
            var result = 1;
            if (this.config.hideNotStylable) {
                if (!this.isTargetStylable() || !this.isComponentStylable()) {
                    this.hide();
                    result = 0;
                } else {
                    this.show();
                }
                if (this.sector) {
                    this.sector.trigger('updateVisibility');
                }
            }
            return result;
        },
        getTargetValue(opts = {}) {
            let result;
            const {model} = this;
            const target = this.getTargetModel();
            const customFetchValue = this.customValue;
            if (!target) {
                return result;
            }
            result = target.getStyle()[model.get('property')];
            if (!result && !opts.ignoreDefault) {
                result = model.getDefaultValue();
            }
            if (typeof customFetchValue == 'function' && !opts.ignoreCustomValue) {
                let index = model.collection.indexOf(model);
                let customValue = customFetchValue(this, index, result);
                if (customValue) {
                    result = customValue;
                }
            }
            return result;
        },
        getComputedValue() {
            const target = this.propTarget;
            const computed = target.computed || {};
            const computedDef = target.computedDefault || {};
            const avoid = this.config.avoidComputed || [];
            const property = this.model.get('property');
            const notToSkip = avoid.indexOf(property) < 0;
            const value = computed[property];
            const valueDef = computedDef[b.camelCase(property)];
            return computed && notToSkip && valueDef !== value && value || '';
        },
        getInputValue() {
            const input = this.getInputEl();
            return input ? input.value : '';
        },
        modelValueChanged(e, val, opt = {}) {
            const model = this.model;
            const value = model.getFullValue();
            if (!opt.fromInput) {
                this.setValue(value);
            }
            this.getTargets().forEach(target => this.__updateTarget(target, opt));
        },
        __updateTarget(target, opt = {}) {
            const {model} = this;
            const {em} = this.config;
            const prop = model.get('property');
            const value = model.getFullValue();
            const onChange = this.onChange;
            if (!target || !this.isTargetStylable(target) || !this.isComponentStylable()) {
                return;
            }
            if (!opt.fromTarget) {
                if (onChange && !opt.fromParent) {
                    onChange(target, this, opt);
                } else {
                    this.updateTargetStyle(value, null, {
                        ...opt,
                        target
                    });
                }
            }
            const component = em && em.getSelected();
            if (em && component) {
                !opt.noEmit && em.trigger('component:update', component);
                em.trigger('component:styleUpdate', component, prop);
                em.trigger(`component:styleUpdate:${ prop }`, component);
            }
            this._emitUpdate();
        },
        updateTargetStyle(value, name = '', opts = {}) {
            const property = name || this.model.get('property');
            const target = opts.target || this.getTarget();
            const style = target.getStyle();
            if (value) {
                style[property] = value;
            } else {
                delete style[property];
            }
            target.setStyle(style, opts);
            const helper = this.getHelperModel();
            helper && helper.setStyle(style, opts);
        },
        isTargetStylable(target) {
            const trg = target || this.getTarget();
            const model = this.model;
            const id = model.get('id');
            const property = model.get('property');
            const toRequire = model.get('toRequire');
            const unstylable = trg.get('unstylable');
            const stylableReq = trg.get('stylable-require');
            const requires = model.get('requires');
            const requiresParent = model.get('requiresParent');
            const sectors = this.sector ? this.sector.collection : null;
            const selected = this.em ? this.em.getSelected() : null;
            let stylable = trg.get('stylable');
            if (a.isArray(stylable)) {
                stylable = stylable.indexOf(property) >= 0;
            }
            if (a.isArray(unstylable)) {
                stylable = unstylable.indexOf(property) < 0;
            }
            if (toRequire) {
                stylable = !target || stylableReq && (stylableReq.indexOf(id) >= 0 || stylableReq.indexOf(property) >= 0);
            }
            if (sectors && requires) {
                const properties = Object.keys(requires);
                sectors.undefined(sector => {
                    sector.get('properties').undefined(model => {
                        if (a.includes(properties, model.id)) {
                            const values = requires[model.id];
                            stylable = stylable && a.includes(values, model.get('value'));
                        }
                    });
                });
            }
            if (requiresParent) {
                const parent = selected && selected.parent();
                const parentEl = parent && parent.getEl();
                if (parentEl) {
                    const styles = window.getComputedStyle(parentEl);
                    a.each(requiresParent, (values, property) => {
                        stylable = stylable && styles[property] && a.includes(values, styles[property]);
                    });
                } else {
                    stylable = false;
                }
            }
            return stylable;
        },
        isComponentStylable() {
            const em = this.em;
            const component = em && em.getSelected();
            if (!component) {
                return true;
            }
            return this.isTargetStylable(component);
        },
        setRawValue(value) {
            this.setValue(this.model.parseValue(value));
        },
        setValue(value) {
            const model = this.model;
            let val = a.isUndefined(value) ? model.getDefaultValue() : value;
            const input = this.getInputEl();
            input && (input.value = val);
        },
        getInputEl() {
            if (!this.input) {
                this.input = this.el.querySelector('input');
            }
            return this.input;
        },
        updateVisibility() {
            this.el.style.display = this.model.get('visible') ? 'block' : 'none';
        },
        show() {
            this.model.set('visible', 1);
        },
        hide() {
            this.model.set('visible', 0);
        },
        cleanValue() {
            this.setValue('');
        },
        clearCached() {
            this.clearEl = null;
            this.input = null;
            this.$input = null;
        },
        render() {
            this.clearCached();
            const pfx = this.pfx;
            const model = this.model;
            const el = this.el;
            const property = model.get('property');
            const full = model.get('full');
            const cls = model.get('className') || '';
            const className = `${ pfx }property`;
            el.innerHTML = this.template(model);
            el.className = `${ className } ${ pfx }${ model.get('type') } ${ className }__${ property } ${ cls }`.trim();
            el.className += full ? ` ${ className }--full` : '';
            this.updateStatus();
            const onRender = this.onRender && this.onRender.bind(this);
            onRender && onRender();
            this.setValue(model.get('value'), { targetUpdate: 1 });
        }
    });
});