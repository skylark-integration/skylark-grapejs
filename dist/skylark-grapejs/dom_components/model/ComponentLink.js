/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-langx/langx","./ComponentText"],function(t,e){"use strict";return e.extend({defaults:{...e.prototype.defaults,type:"link",tagName:"a",traits:["title","href","target"]},getAttrToHTML(...t){const n=e.prototype.getAttrToHTML.apply(this,t);return delete n.onmousedown,n}},{isComponent(t){let e;if("A"==t.tagName){e={type:"link",editable:0};const n=t.childNodes,o=n.length;o||delete e.editable;for(let t=0;t<o;t++){const o=n[t];if(3==o.nodeType&&""!=o.textContent.trim()){delete e.editable;break}}}return e}})});
//# sourceMappingURL=../../sourcemaps/dom_components/model/ComponentLink.js.map
