/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone"],function(t){"use strict";const e=t.$;return t.View.extend({events:{change:"handleChange"},template(){return`<span class="${this.holderClass()}"></span>`},inputClass(){return`${this.ppfx}field`},holderClass(){return`${this.ppfx}input-holder`},initialize(t={}){const e=t.ppfx||"";this.opts=t,this.ppfx=e,this.em=t.target||{},this.listenTo(this.model,"change:value",this.handleModelChange)},elementUpdated(){this.model.trigger("el:change")},setValue(t){const e=this.model;let s=t||e.get("defaults");const l=this.getInputEl();l&&(l.value=s)},handleModelChange(t,e,s){this.setValue(e,s)},handleChange(t){t.stopPropagation();const e=this.getInputEl().value;this.model.set({value:e},{fromInput:1}),this.elementUpdated()},getInputEl(){if(!this.inputEl){const{model:t}=this,s=t.get("placeholder")||t.get("defaults")||"";this.inputEl=e(`<input type="text" placeholder="${s}">`)}return this.inputEl.get(0)},render(){this.inputEl=null;const t=this.$el;return t.addClass(this.inputClass()),t.html(this.template()),t.find(`.${this.holderClass()}`).append(this.getInputEl()),this}})});
//# sourceMappingURL=../../sourcemaps/domain_abstract/ui/Input.js.map
