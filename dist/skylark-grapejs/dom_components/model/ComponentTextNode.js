/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./Component"],function(e){"use strict";return e.extend({defaults:{...e.prototype.defaults,droppable:!1,layerable:!1,editable:!0},toHTML(){return this.get("content").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}},{isComponent(e){var t="";return 3===e.nodeType&&(t={type:"textnode",content:e.textContent}),t}})});
//# sourceMappingURL=../../sourcemaps/dom_components/model/ComponentTextNode.js.map
