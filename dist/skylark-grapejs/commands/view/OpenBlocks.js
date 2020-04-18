/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(function(){"use strict";return{run(e,n){const t=e.BlockManager,s=e.Panels;if(!this.blocks){t.render();const e="views-container",n=document.createElement("div"),i=s.getPanel(e)||s.addPanel({id:e});n.appendChild(t.getContainer()),i.set("appendContent",n).trigger("change:appendContent"),this.blocks=n}this.blocks.style.display="block"},stop(){const e=this.blocks;e&&(e.style.display="none")}}});
//# sourceMappingURL=../../sourcemaps/commands/view/OpenBlocks.js.map
