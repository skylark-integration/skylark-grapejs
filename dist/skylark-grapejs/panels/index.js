/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./config/config","./model/Panel","./model/Panels","./view/PanelView","./view/PanelsView"],function(e,t,n,r,a){"use strict";return()=>{var r,l,i={};return{name:"Panels",init(t){for(var s in i=t||{},e)s in i||(i[s]=e[s]);var g=i.pStylePrefix;return g&&(i.stylePrefix=g+i.stylePrefix),r=new n(i.defaults),l=new a({collection:r,config:i}),this},getPanels:()=>r,getPanelsEl:()=>l.el,addPanel:e=>r.add(e),removePanel:e=>r.remove(e),getPanel(e){var t=r.where({id:e});return t.length?t[0]:null},addButton(e,t){var n=this.getPanel(e);return n?n.get("buttons").add(t):null},removeButton(e,t){var n=this.getPanel(e);return n&&n.get("buttons").remove(t)},getButton(e,t){var n=this.getPanel(e);if(n){var r=n.get("buttons").where({id:t});return r.length?r[0]:null}return null},render:()=>l.render().el,active(){this.getPanels().each(e=>{e.get("buttons").each(e=>{e.get("active")&&e.trigger("updateActive")})})},disableButtons(){this.getPanels().each(e=>{e.get("buttons").each(e=>{e.get("disable")&&e.trigger("change:disable")})})},Panel:t}}});
//# sourceMappingURL=../sourcemaps/panels/index.js.map
