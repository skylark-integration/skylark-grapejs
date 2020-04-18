/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./Component"],function(t){"use strict";return t.extend({defaults:{...t.prototype.defaults,type:"tbody",tagName:"tbody",draggable:["table"],droppable:["tr"],columns:1,rows:1},initialize(e,o){t.prototype.initialize.apply(this,arguments);const s=this.get("components");let n=this.get("columns"),l=this.get("rows");if(!s.length){const t=[];for(;l--;){const e=[];let o=n;for(;o--;)e.push({type:"cell",classes:["cell"]});t.push({type:"row",classes:["row"],components:e})}s.add(t)}}},{isComponent(t){let e="";return"TBODY"==t.tagName&&(e={type:"tbody"}),e}})});
//# sourceMappingURL=../../sourcemaps/dom_components/model/ComponentTableBody.js.map
