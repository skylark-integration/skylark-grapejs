/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(function(){"use strict";return{run(e,t,n={}){if(!e.Canvas.hasFocus()&&!n.force)return;const r=[];e.getSelectedAll().forEach(e=>{let t=e.parent();for(;t&&!t.get("selectable");)t=t.parent();t&&r.push(t)}),r.length&&e.select(r)}}});
//# sourceMappingURL=../../sourcemaps/commands/view/ComponentExit.js.map
