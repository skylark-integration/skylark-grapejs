/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-langx/langx","./ComponentText"],function(t,e){"use strict";return e.extend({defaults:{...e.prototype.defaults,tagName:"label",traits:["id","title","for"]}},{isComponent(t){if("LABEL"==t.tagName)return{type:"label"}}})});
//# sourceMappingURL=../../sourcemaps/dom_components/model/ComponentLabel.js.map
