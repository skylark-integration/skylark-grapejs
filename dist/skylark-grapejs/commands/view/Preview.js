/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore"],function(e){"use strict";return{getPanels(e){return this.panels||(this.panels=e.Panels.getPanels()),this.panels},tglPointers(t,s){const i=t.Canvas.getBody().querySelectorAll(`.${this.ppfx}no-pointer`);e.each(i,e=>e.style.pointerEvents=s?"":"all")},run(e,t){this.sender=t,e.stopCommand("sw-visibility"),e.getModel().stopDefault();const s=this.getPanels(e),i=e.Canvas.getElement(),n=e.getEl(),l=e.Config.stylePrefix;if(!this.helper){const e=document.createElement("span");e.className=`${l}off-prv fa fa-eye-slash`,n.appendChild(e),e.onclick=(()=>this.stopCommand()),this.helper=e}this.helper.style.display="inline-block",this.tglPointers(e),s.forEach(e=>e.set("visible",!1));const a=i.style;a.width="100%",a.height="100%",a.top="0",a.left="0",a.padding="0",a.margin="0",e.refresh()},stop(e){const{sender:t={}}=this;t.set&&t.set("active",0);const s=this.getPanels(e),i=e.Panels.getButton("options","sw-visibility");i&&i.get("active")&&e.runCommand("sw-visibility"),e.getModel().runDefault(),s.forEach(e=>e.set("visible",!0)),e.Canvas.getElement().setAttribute("style",""),this.helper&&(this.helper.style.display="none"),e.refresh(),this.tglPointers(e,1)}}});
//# sourceMappingURL=../../sourcemaps/commands/view/Preview.js.map
