/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./PropertyIntegerView","../../domain_abstract/ui/InputColor"],function(t,e){"use strict";return t.extend({setValue(t,e={}){e={...e,silent:1},this.inputInst.setValue(t,e)},onRender(){if(!this.input){const t=this.ppfx,i=new e({target:this.target,model:this.model,ppfx:t}).render();this.el.querySelector(`.${t}fields`).appendChild(i.el),this.$input=i.inputEl,this.$color=i.colorEl,this.input=this.$input.get(0),this.inputInst=i}}})});
//# sourceMappingURL=../../sourcemaps/style_manager/view/PropertyColorView.js.map
