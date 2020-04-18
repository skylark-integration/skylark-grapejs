/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./Component"],function(e){"use strict";return e.extend({defaults:{...e.prototype.defaults,type:"script",droppable:!1,draggable:!1,layerable:!1}},{isComponent(e){if("SCRIPT"==e.tagName){var t={type:"script"};return e.src&&(t.src=e.src,t.onload=e.onload),t}}})});
//# sourceMappingURL=../../sourcemaps/dom_components/model/ComponentScript.js.map
