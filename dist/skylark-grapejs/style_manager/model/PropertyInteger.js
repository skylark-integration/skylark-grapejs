/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-underscore","./Property","../../domain_abstract/ui/InputNumber"],function(t,e,i,n){"use strict";return i.extend({defaults:{...i.prototype.defaults,units:[],unit:"",step:1,min:"",max:""},initialize(t={},e={}){i.callParentInit(i,this,t,e);const u=this.get("unit"),l=this.get("units");this.input=new n({model:this}),l.length&&!u&&this.set("unit",l[0]),i.callInit(this,t,e)},clearValue(t={}){return this.set({value:void 0,unit:void 0},t),this},parseValue(t){const e=i.prototype.parseValue.apply(this,arguments),{value:n,unit:u}=this.input.validateInputValue(e.value,{deepCheck:1});return e.value=n,e.unit=u,e},getFullValue(){let t=this.get("value"),n=this.get("unit");return t=`${t=e.isUndefined(t)?"":t}${n=!e.isUndefined(n)&&t?n:""}`,i.prototype.getFullValue.apply(this,[t])}})});
//# sourceMappingURL=../../sourcemaps/style_manager/model/PropertyInteger.js.map
