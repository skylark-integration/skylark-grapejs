/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","skylark-underscore","./Trait","./TraitFactory"],function(t,e,i,r){"use strict";return t.Collection.extend({model:i,initialize(t,e={}){this.em=e.em||"",this.listenTo(this,"add",this.handleAdd),this.listenTo(this,"reset",this.handleReset)},handleReset(t,{previousModels:e=[]}={}){e.forEach(t=>t.trigger("remove"))},handleAdd(t){const e=this.target;e&&(t.target=e)},setTarget(t){this.target=t},add(i,s){const a=this.em;if(e.isString(i)||e.isArray(i)){const t=a&&a.get&&a.get("TraitManager"),s=t&&t.getConfig(),d=r(s);e.isString(i)&&(i=[i]);for(var n=0,o=i.length;n<o;n++){const t=i[n],r=e.isString(t)?d.build(t)[0]:t;r.target=this.target,i[n]=r}}return t.Collection.prototype.add.apply(this,[i,s])}})});
//# sourceMappingURL=../../sourcemaps/trait_manager/model/Traits.js.map
