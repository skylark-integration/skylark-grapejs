/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./Component"],function(t){"use strict";return t.extend({defaults:{...t.prototype.defaults,type:"table",tagName:"table",droppable:["tbody","thead","tfoot"]},initialize(e,o){t.prototype.initialize.apply(this,arguments);const n=this.get("components");!n.length&&n.add({type:"tbody"})}},{isComponent(t){let e="";return"TABLE"==t.tagName&&(e={type:"table"}),e}})});
//# sourceMappingURL=../../sourcemaps/dom_components/model/ComponentTable.js.map
