/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","./Properties"],function(e,t){"use strict";return e.Model.extend({defaults:{index:"",value:"",values:{},active:!1,preview:!1,properties:[]},initialize(){const e=this.get("properties");var r=this.get("value");this.set("properties",e instanceof t?e:new t(e));const i=this.get("properties");if(i.forEach(this.onPropAdd,this),this.listenTo(i,"add",this.onPropAdd),!r){var s="",o=this.get("values");for(var p in o)s+=" "+o[p];this.set("value",s.trim())}},onPropAdd(e){const t=this.collection;e.parent=t&&t.property},getPropertyAt(e){return this.get("properties").at(e)},getPropertyValue(e){let t="";return this.get("properties").each(r=>{r.get("property")==e&&(t=r.getFullValue())}),t},getFullValue(){let e=[];return this.get("properties").each(t=>e.push(t.getFullValue())),e.join(" ").trim()}})});
//# sourceMappingURL=../../sourcemaps/style_manager/model/Layer.js.map
