/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","skylark-backbone","./Layer"],function(e,t,r){"use strict";return t.Collection.extend({model:r,initialize(){this.idx=1,this.on("add",this.onAdd),this.on("reset",this.onReset)},onAdd(e,t,r){r.noIncrement||e.set("index",this.idx++),r.active&&this.active(this.indexOf(e))},onReset(){this.idx=1},getSeparator(){const{property:e}=this;return e?e.get("layerSeparator"):", "},getLayersFromValue(e){const t=[];return e.replace(/\(([\w\s,.]*)\)/g,t=>{var r=t.replace(/,\s*/g,",");e=e.replace(t,r)}),(e?e.split(this.getSeparator()):[]).forEach(e=>{t.push({properties:this.properties.parseValue(e)})}),t},getLayersFromStyle(e){const t=[],r=this.properties;r.pluck("property");return r.each(r=>{const s=e[r.get("property")];(s?s.split(", "):[]).forEach((e,s)=>{e=r.parseValue(e.trim()).value;const i=t[s],a={...r.attributes,...{value:e}};i?i.properties.push(a):t[s]={properties:[a]}})}),t.forEach(e=>{const t=e.properties.map(e=>e.property);r.each(r=>{const s=r.get("property");t.indexOf(s)<0&&e.properties.push({...r.attributes})})}),t},active(e){this.each(e=>e.set("active",0));const t=this.at(e);t&&t.set("active",1)},getFullValue(){let e=[];return this.each(t=>e.push(t.getFullValue())),e.join(this.getSeparator())},getPropertyValues(t,r){const s=[];return this.each(i=>{const a=i.getPropertyValue(t);a?s.push(a):!e.isUndefined(r)&&s.push(r)}),s.join(", ")}})});
//# sourceMappingURL=../../sourcemaps/style_manager/model/Layers.js.map
