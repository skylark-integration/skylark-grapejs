/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./config/config","./model/Modal","./view/ModalView"],function(e,t,n){"use strict";return()=>{var o,i,r={};return{name:"Modal",getConfig:()=>r,init(s={}){const l=(r={...e,...s}).em;this.em=l;var c=r.pStylePrefix;return c&&(r.stylePrefix=c+r.stylePrefix),(o=new t(r)).on("change:open",(e,t)=>((e,t)=>{t&&t.trigger(`modal:${e?"open":"close"}`)})(t,l)),i=new n({model:o,config:r}),this},postRender(e){const t=e.model.getConfig().el||e.el;this.render().appendTo(t)},open(e={}){return e.title&&this.setTitle(e.title),e.content&&this.setContent(e.content),i.show(),this},close(){return i.hide(),this},onceClose(e){return this.em.once("modal:close",e),this},onceOpen(e){return this.em.once("modal:open",e),this},isOpen:()=>!!o.get("open"),setTitle(e){return o.set("title",e),this},getTitle:()=>o.get("title"),setContent(e){return o.set("content"," "),o.set("content",e),this},getContent:()=>o.get("content"),getContentEl:()=>i.getContent().get(0),getModel:()=>o,render:()=>i.render().$el}}});
//# sourceMappingURL=../sourcemaps/modal_dialog/index.js.map
