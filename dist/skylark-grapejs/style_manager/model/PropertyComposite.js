/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-langx/langx","./Property"],function(e,t){"use strict";var r=t.extend({defaults:{...t.prototype.defaults,detached:0,properties:[],separator:" "},initialize(e={},a={}){t.callParentInit(t,this,e,a);const s=this.get("properties")||[];this.set("properties",new r.Properties(s)),this.listenTo(this,"change:value",this.updateValues),t.callInit(this,e,a)},clearValue(e={}){return this.get("properties").each(e=>e.clearValue()),t.prototype.clearValue.apply(this,arguments)},updateValues(){const e=this.getFullValue().split(this.getSplitSeparator());this.get("properties").each((t,r)=>{const a=e.length;e[r]||e[r%a+(1!=a&&a%2?1:0)]})},getSplitSeparator(){return new RegExp(`${this.get("separator")}(?![^\\(]*\\))`)},getDefaultValue(e){let t=this.get("defaults");if(t&&!e)return t;return t="",this.get("properties").each((e,r)=>t+=`${e.getDefaultValue()} `),t.trim()},getFullValue(){return this.get("detached")?"":this.get("properties").getFullValue()},getPropertyAt(e){return this.get("properties").at(e)}});return r});
//# sourceMappingURL=../../sourcemaps/style_manager/model/PropertyComposite.js.map
