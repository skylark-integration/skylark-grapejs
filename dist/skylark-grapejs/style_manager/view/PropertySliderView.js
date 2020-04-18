/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./PropertyIntegerView"],function(e){"use strict";return e.extend({events:()=>({...e.prototype.events,"change [type=range]":"inputValueChanged","input [type=range]":"inputValueChangedSoft",change:""}),templateInput(e){const t=this.ppfx;return`\n      <div class="${t}field ${t}field-range">\n        <input type="range"\n          min="${e.get("min")}"\n          max="${e.get("max")}"\n          step="${e.get("step")}"/>\n      </div>\n    `},getSliderEl(){return this.slider||(this.slider=this.el.querySelector("input[type=range]")),this.slider},inputValueChanged(){const e=this.model,t=e.get("step");this.getInputEl().value=this.getSliderEl().value;const n=this.getInputValue()-t;e.set("value",n,{avoidStore:1}).set("value",n+t),this.elementUpdated()},inputValueChangedSoft(){this.getInputEl().value=this.getSliderEl().value,this.model.set("value",this.getInputValue(),{avoidStore:1}),this.elementUpdated()},setValue(t){const n=this.model.parseValue(t);this.getSliderEl().value=parseFloat(n.value),e.prototype.setValue.apply(this,arguments)},onRender(){e.prototype.onRender.apply(this,arguments),this.model.get("showInput")||(this.inputInst.el.style.display="none")},clearCached(){e.prototype.clearCached.apply(this,arguments),this.slider=null}})});
//# sourceMappingURL=../../sourcemaps/style_manager/view/PropertySliderView.js.map
