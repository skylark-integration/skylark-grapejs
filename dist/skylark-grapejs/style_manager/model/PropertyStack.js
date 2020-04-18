/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-langx/langx","./PropertyComposite","./Layers"],function(e,t,r){"use strict";return t.extend({defaults:e.mixin({},...t.prototype.defaults,{layers:[],layerSeparator:", ",prepend:0,preview:0}),initialize(e={},a={}){t.callParentInit(t,this,e,a);const s=this.get("layers"),l=new r(s);l.property=this,l.properties=this.get("properties"),this.set("layers",l),t.callInit(this,e,a)},getLayers(){return this.get("layers")},getCurrentLayer(){return this.getLayers().filter(e=>e.get("active"))[0]},getFullValue(){return this.get("detached")?"":this.get("layers").getFullValue()},getValueFromStyle(e={}){const t=this.getLayers().getLayersFromStyle(e);return new r(t).getFullValue()},clearValue(){return this.getLayers().reset(),t.prototype.clearValue.apply(this,arguments)},getLayersFromTarget(e){}})});
//# sourceMappingURL=../../sourcemaps/style_manager/model/PropertyStack.js.map
