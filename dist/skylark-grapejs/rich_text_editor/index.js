/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./model/RichTextEditor","../../utils/mixins","./config/config"],function(t,e,i){"use strict";return()=>{let n,s,o,a,r,c={};const l=()=>{const t=n.style;t.top="-1000px",t.left="-1000px",t.display="none"};return{customRte:null,name:"RichTextEditor",getConfig:()=>c,init(t={}){const o=(c={...i,...t}).pStylePrefix;return o&&(c.stylePrefix=o+c.stylePrefix),this.pfx=c.stylePrefix,s=c.actions||[],(n=document.createElement("div")).className=`${o}rte-toolbar ${o}one-bg`,r=this.initRte(document.createElement("div")),e.on(n,"mousedown",t=>t.stopPropagation()),this},destroy(){const{customRte:t}=this;r&&r.destroy(),t&&t.destroy&&t.destroy(),n=0,r=0,this.actionbar=0,this.actions=0},postRender(t){const e=t.model.get("Canvas");n.style.pointerEvents="all",l(),e.getToolsEl().appendChild(n)},initRte(e){const i=this.pfx,s=n,o=this.actionbar,a=this.actions||[...c.actions],l=new t({el:e,classes:{actionbar:`${i}actionbar`,button:`${i}action`,active:`${i}active`,inactive:`${i}inactive`,disabled:`${i}disabled`},actions:a,actionbar:o,actionbarContainer:s});return r&&r.setEl(e),l.actionbar&&(this.actionbar=l.actionbar),l.actions&&(this.actions=l.actions),l},add(t,e={}){e.name=t,r.addAction(e,{sync:1})},get(t){let e;return r.getActions().forEach(i=>{i.name==t&&(e=i)}),e},getAll:()=>r.getActions(),remove(t){const e=this.getAll(),i=this.get(t);if(i){const t=i.btn,n=e.indexOf(i);t.parentNode.removeChild(t),e.splice(n,1)}return i},getToolbarEl:()=>n,updatePosition(){const t=c.em.get("Canvas"),{style:e}=n,i=t.getTargetToElementFixed(o,n,{event:"rteToolbarPosUpdate"});e.top=i.top+"px",e.left="0px"},enable(t,e){o=t.el;const i=c.em.get("Canvas"),s=c.em,r=t.getChildrenContainer(),l=this.customRte;if(a=i.getElementPos(o),n.style.display="",e=l?l.enable(r,e):this.initRte(r).enable(),s){setTimeout(this.updatePosition.bind(this),0);const i="change:canvasOffset canvasScroll frame:scroll component:update";s.undefined(i,this.updatePosition,this),s.undefined(i,this.updatePosition,this),s.trigger("rte:enable",t,e)}return e},disable(t,e){const i=c.em,n=this.customRte;var s=t.getChildrenContainer();n?n.disable(s,e):e&&e.disable(),l(),i&&i.trigger("rte:disable",t,e)}}}});
//# sourceMappingURL=../sourcemaps/rich_text_editor/index.js.map
