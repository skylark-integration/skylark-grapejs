/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","../../navigator/index"],function(e,n){"use strict";e.$;return{run(e){const n=e.LayerManager,t=e.Panels;if(!this.layers){const e="views-container",a=document.createElement("div"),s=t.getPanel(e)||t.addPanel({id:e});a.appendChild(n.render()),s.set("appendContent",a).trigger("change:appendContent"),this.layers=a}this.layers.style.display="block"},stop(){const e=this.layers;e&&(e.style.display="none")}}});
//# sourceMappingURL=../../sourcemaps/commands/view/OpenLayers.js.map
