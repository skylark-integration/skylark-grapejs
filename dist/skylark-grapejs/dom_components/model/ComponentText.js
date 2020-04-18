/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./Component"],function(t){"use strict";return t.extend({defaults:{...t.prototype.defaults,type:"text",droppable:!1,editable:!0},toHTML(){return this.trigger("sync:content",{silent:1}),t.prototype.toHTML.apply(this,arguments)}})});
//# sourceMappingURL=../../sourcemaps/dom_components/model/ComponentText.js.map
