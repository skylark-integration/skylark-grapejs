/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","skylark-backbone","./Selector"],function(e,t,r){"use strict";return t.Collection.extend({model:r,modelId:e=>`${e.name}_${e.type||r.TYPE_CLASS}`,getStyleable(){return e.filter(this.models,e=>e.get("active")&&!e.get("private"))},getValid({noDisabled:t}={}){return e.filter(this.models,e=>!e.get("private")).filter(e=>t?e.get("active"):1)},getFullString(e,t={}){const r=[];return(e||this).forEach(e=>r.push(e.getFullName(t))),r.join("").trim()}})});
//# sourceMappingURL=../../sourcemaps/selector_manager/model/Selectors.js.map
