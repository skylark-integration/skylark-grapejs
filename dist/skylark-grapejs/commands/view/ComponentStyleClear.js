/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore"],function(e){"use strict";return{run(t,r,s={}){const{target:n}=s,o=t.DomComponents,a=n.get("type"),c=[];if(!o.getWrapper().find(`[data-gjs-type="${a}"]`).length){const r=t.CssComposer.getAll();let s=n.get("style-signature");s=e.isArray(s)?s:[s],r.forEach(e=>{const t=e.selectorsToString();s.forEach(r=>{r&&t.indexOf(r)>=0&&c.push(e)})}),r.remove(c)}return c}}});
//# sourceMappingURL=../../sourcemaps/commands/view/ComponentStyleClear.js.map
