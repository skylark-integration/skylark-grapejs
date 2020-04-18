/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./TraitView","domain_abstract/ui/InputNumber"],function(t,i){"use strict";return t.extend({getValueForTarget(){const{model:t}=this,{value:i,unit:e}=t.attributes;return i?i+e:""},getInputEl(){if(!this.input){var t=this.getModelValue(),e=new i({contClass:this.ppfx+"field-int",model:this.model,ppfx:this.ppfx});this.input=e.render(),this.$input=this.input.inputEl,this.$unit=this.input.unitEl,this.model.set("value",t),this.$input.val(t),this.input=e.el}return this.input}})});
//# sourceMappingURL=../../sourcemaps/trait_manager/view/TraitNumberView.js.map
