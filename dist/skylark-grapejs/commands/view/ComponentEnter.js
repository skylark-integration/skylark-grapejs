/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(function(){"use strict";return{run(e){if(!e.Canvas.hasFocus())return;const t=[];e.getSelectedAll().forEach(e=>{const n=e.components(),s=n&&n.at(0);s&&t.push(s)}),t.length&&e.select(t)}}});
//# sourceMappingURL=../../sourcemaps/commands/view/ComponentEnter.js.map
