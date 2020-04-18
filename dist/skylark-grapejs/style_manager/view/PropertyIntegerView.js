/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","./PropertyView"],function(t,e){"use strict";const i=t.$;return e.extend({templateInput:()=>"",init(){const t=this.model;this.listenTo(t,"change:unit",this.modelValueChanged),this.listenTo(t,"el:change",this.elementUpdated),this.listenTo(t,"change:units",this.render)},setValue(t){const e=this.model.parseValue(t);t=`${e.value}${e.unit}`,this.inputInst.setValue(t,{silent:1})},onRender(){const t=this.ppfx;if(!this.input){const e=this.model.input;e.ppfx=t,e.render(),this.el.querySelector(`.${t}fields`).appendChild(e.el),this.$input=e.inputEl,this.unit=e.unitEl,this.$unit=i(this.unit),this.input=this.$input.get(0),this.inputInst=e}},clearCached(){e.prototype.clearCached.apply(this,arguments),this.unit=null,this.$unit=null}})});
//# sourceMappingURL=../../sourcemaps/style_manager/view/PropertyIntegerView.js.map
