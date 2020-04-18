/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-underscore","./Property","../../domain_abstract/ui/InputNumber"],function(t,e,i){"use strict";return e.extend({defaults:{...e.prototype.defaults,units:[],unit:"",step:1,min:"",max:""},initialize(t={},n={}){e.callParentInit(e,this,t,n);const u=this.get("unit"),l=this.get("units");this.input=new i({model:this}),l.length&&!u&&this.set("unit",l[0]),e.callInit(this,t,n)},clearValue(t={}){return this.set({value:void 0,unit:void 0},t),this},parseValue(t){const i=e.prototype.parseValue.apply(this,arguments),{value:n,unit:u}=this.input.validateInputValue(i.value,{deepCheck:1});return i.value=n,i.unit=u,i},getFullValue(){let i=this.get("value"),n=this.get("unit");return i=`${i=t.isUndefined(i)?"":i}${n=!t.isUndefined(n)&&i?n:""}`,e.prototype.getFullValue.apply(this,[i])}})});
//# sourceMappingURL=../../sourcemaps/style_manager/model/PropertyInteger.js.map
