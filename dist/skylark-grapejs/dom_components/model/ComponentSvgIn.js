/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./ComponentSvg"],function(e){"use strict";return e.extend({defaults:{...e.prototype.defaults,selectable:!1,hoverable:!1,layerable:!1}},{isComponent(t){if(e.isComponent(t)&&"svg"!==t.tagName.toLowerCase())return{tagName:t.tagName,type:"svg-in"}}})});
//# sourceMappingURL=../../sourcemaps/dom_components/model/ComponentSvgIn.js.map
