/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./Component"],function(t){"use strict";return t.extend({defaults:{...t.prototype.defaults,type:"row",tagName:"tr",draggable:["thead","tbody","tfoot"],droppable:["th","td"]},initialize(e,o){t.prototype.initialize.apply(this,arguments);const i=[],n=this.get("components");n.each(t=>t.is("cell")&&i.push(t)),n.reset(i)}},{isComponent(t){let e="";return"TR"==t.tagName&&(e={type:"row"}),e}})});
//# sourceMappingURL=../../sourcemaps/dom_components/model/ComponentTableRow.js.map
