/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./TraitView","domain_abstract/ui/InputColor"],function(t,e){"use strict";return t.extend({templateInput:"",getInputEl(){if(!this.input){const t=this.model,i=this.getModelValue(),n=new e({model:t,target:this.config.em,contClass:this.ppfx+"field-color",ppfx:this.ppfx}).render();n.setValue(i,{fromTarget:1}),this.input=n.el}return this.input}})});
//# sourceMappingURL=../../sourcemaps/trait_manager/view/TraitColorView.js.map
