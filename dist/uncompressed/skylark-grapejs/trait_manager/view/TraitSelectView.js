define([
    'skylark-backbone',
    'skylark-underscore',
    './TraitView'
], function (Backbone, a, TraitView) {
    'use strict';
    const $ = Backbone.$;
    return TraitView.extend({
        init() {
            this.listenTo(this.model, 'change:options', this.rerender);
        },
        templateInput() {
            const {ppfx, clsField} = this;
            return `<div class="${ clsField }">
      <div data-input></div>
      <div class="${ ppfx }sel-arrow">
        <div class="${ ppfx }d-s-arrow"></div>
      </div>
    </div>`;
        },
        getInputEl() {
            if (!this.$input) {
                const {model, em} = this;
                const propName = model.get('name');
                const opts = model.get('options') || [];
                let input = '<select>';
                opts.forEach(el => {
                    let attrs = '';
                    let name, value, style;
                    if (a.isString(el)) {
                        name = el;
                        value = el;
                    } else {
                        name = el.name || el.label || el.value;
                        value = `${ a.isUndefined(el.value) ? el.id : el.value }`.replace(/"/g, '&quot;');
                        style = el.style ? el.style.replace(/"/g, '&quot;') : '';
                        attrs += style ? ` style="${ style }"` : '';
                    }
                    const resultName = em.t(`traitManager.traits.options.${ propName }.${ value }`) || name;
                    input += `<option value="${ value }"${ attrs }>${ resultName }</option>`;
                });
                input += '</select>';
                this.$input = $(input);
                const val = model.getTargetValue();
                !a.isUndefined(val) && this.$input.val(val);
            }
            return this.$input.get(0);
        }
    });
});