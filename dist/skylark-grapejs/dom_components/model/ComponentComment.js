/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-langx/langx","./ComponentTextNode"],function(t,e){"use strict";return e.extend({defaults:{...e.prototype.defaults},toHTML(){return`\x3c!--${this.get("content")}--\x3e`}},{isComponent(t){if(8==t.nodeType)return{tagName:"NULL",type:"comment",content:t.textContent}}})});
//# sourceMappingURL=../../sourcemaps/dom_components/model/ComponentComment.js.map
