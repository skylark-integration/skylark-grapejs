/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-langx/langx","./Property"],function(t,i){"use strict";return i.extend({defaults:()=>({...i.prototype.defaults,options:[],full:1}),initialize(...t){i.prototype.initialize.apply(this,t),this.listenTo(this,"change:options",this.onOptionChange)},onOptionChange(){this.set("list",this.get("options"))},getOptions(){const{options:t,list:i}=this.attributes;return t&&t.length?t:i},setOptions(t=[]){return this.set("options",t),this},addOption(t){if(t){const i=this.getOptions();this.setOptions([...i,t])}return this}})});
//# sourceMappingURL=../../sourcemaps/style_manager/model/PropertyRadio.js.map
