/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(function(){"use strict";return{run(e){if(!e.Canvas.hasFocus())return;const t=[];e.getSelectedAll().forEach(e=>{const n=e.collection,c=n.indexOf(e),s=n.at(c+1);t.push(s||e)}),t.length&&e.select(t)}}});
//# sourceMappingURL=../../sourcemaps/commands/view/ComponentNext.js.map
