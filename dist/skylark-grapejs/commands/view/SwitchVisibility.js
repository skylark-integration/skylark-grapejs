/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(function(){"use strict";return{run(s){this.toggleVis(s)},stop(s){this.toggleVis(s,0)},toggleVis(s,t=1){const e=t?"add":"remove";s.Canvas.getFrames().forEach(s=>{s.view.getBody().classList[e](`${this.ppfx}dashed`)})}}});
//# sourceMappingURL=../../sourcemaps/commands/view/SwitchVisibility.js.map
