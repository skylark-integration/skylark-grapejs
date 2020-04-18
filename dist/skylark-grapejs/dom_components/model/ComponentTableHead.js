/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./ComponentTableBody"],function(e){"use strict";return e.extend({defaults:{...e.prototype.defaults,type:"thead",tagName:"thead"}},{isComponent(e){let t="";return"THEAD"==e.tagName&&(t={type:"thead"}),t}})});
//# sourceMappingURL=../../sourcemaps/dom_components/model/ComponentTableHead.js.map
