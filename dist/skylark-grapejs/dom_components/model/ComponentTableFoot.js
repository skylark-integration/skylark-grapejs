/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./ComponentTableBody"],function(t){"use strict";return t.extend({defaults:{...t.prototype.defaults,type:"tfoot",tagName:"tfoot"}},{isComponent(t){let e="";return"TFOOT"==t.tagName&&(e={type:"tfoot"}),e}})});
//# sourceMappingURL=../../sourcemaps/dom_components/model/ComponentTableFoot.js.map
