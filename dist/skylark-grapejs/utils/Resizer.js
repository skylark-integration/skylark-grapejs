/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-underscore","./mixins"],function(t,e,i){"use strict";var s={mousePosFetcher:null,updateTarget:null,ratioDefault:0,posFetcher:null,onStart:null,onMove:null,onEnd:null,onUpdateContainer:()=>{},step:1,minDim:32,maxDim:"",unitHeight:"px",unitWidth:"px",keyHeight:"height",keyWidth:"width",currentUnit:1,silentFrames:0,avoidContainerUpdate:0,keepAutoHeight:!1,keepAutoWidth:!1,autoHeight:!1,autoWidth:!1,tl:1,tc:1,tr:1,cl:1,cr:1,bl:1,bc:1,br:1},n=(t,e)=>{var i=e.prefix||"",s=document.createElement("i");return s.className=i+"resizer-h "+i+"resizer-h-"+t,s.setAttribute("data-"+i+"handler",t),s},o=(t,e)=>{var i=e||window,s=t.getBoundingClientRect();return{left:s.left+i.pageXOffset,top:s.top+i.pageYOffset,width:s.width,height:s.height}};return{init:h=>new class{constructor(t={}){return this.setOptions(t),e.bindAll(this,"handleKeyDown","handleMouseDown","move","stop"),this}getConfig(){return this.opts}setOptions(t={}){this.opts=e.defaults(t,s),this.setup()}setup(){const t=this.opts,e=t.prefix||"",i=t.appendTo||document.body;let s=this.container;for(s||((s=document.createElement("div")).className=`${e}resizer-c`,i.appendChild(s),this.container=s);s.firstChild;)s.removeChild(s.firstChild);const o={};["tl","tc","tr","cl","cr","bl","bc","br"].forEach(e=>o[e]=t[e]?n(e,t):"");for(let t in o){const e=o[t];e&&s.appendChild(e)}this.handlers=o,this.mousePosFetcher=t.mousePosFetcher,this.updateTarget=t.updateTarget,this.posFetcher=t.posFetcher,this.onStart=t.onStart,this.onMove=t.onMove,this.onEnd=t.onEnd,this.onUpdateContainer=t.onUpdateContainer}toggleFrames(t){if(this.opts.silentFrames){const i=document.querySelectorAll("iframe");e.each(i,e=>e.style.pointerEvents=t?"none":"")}}isHandler(t){var e=this.handlers;for(var i in e)if(e[i]===t)return!0;return!1}getFocusedEl(){return this.el}getDocumentEl(){return[this.el.ownerDocument,document]}getElementPos(t,e={}){var i=this.posFetcher||"";return i?i(t,e):o(t)}focus(t){t&&t===this.el||(this.el=t,this.updateContainer({forceShow:1}),i.on(this.getDocumentEl(),"mousedown",this.handleMouseDown))}blur(){this.container.style.display="none",this.el&&(i.off(this.getDocumentEl(),"mousedown",this.handleMouseDown),this.el=null)}start(t){if(0!==t.button)return;t.preventDefault(),t.stopPropagation();const s=this.el,n=this.opts||{};var o="data-"+n.prefix+"handler",h=this.getElementPos(s,{target:"el"});this.handlerAttr=t.target.getAttribute(o),this.clickedHandler=t.target,this.startDim={t:h.top,l:h.left,w:h.width,h:h.height},this.rectDim={t:h.top,l:h.left,w:h.width,h:h.height},this.startPos={x:t.clientX,y:t.clientY};var r=this.getDocumentEl();i.on(r,"mousemove",this.move),i.on(r,"keydown",this.handleKeyDown),i.on(r,"mouseup",this.stop),e.isFunction(this.onStart)&&this.onStart(t,{docs:r,config:n,el:s,resizer:this}),this.toggleFrames(1),this.move(t)}move(t){const e=this.onMove;var i=this.mousePosFetcher,s=i?i(t):{x:t.clientX,y:t.clientY};this.currentPos=s,this.delta={x:s.x-this.startPos.x,y:s.y-this.startPos.y},this.keys={shift:t.shiftKey,ctrl:t.ctrlKey,alt:t.altKey},this.rectDim=this.calc(this),this.updateRect(0),e&&e(t),0===t.which&&this.stop(t)}stop(t){const s=this.opts;var n=this.getDocumentEl();i.off(n,"mousemove",this.move),i.off(n,"keydown",this.handleKeyDown),i.off(n,"mouseup",this.stop),this.updateRect(1),this.toggleFrames(),e.isFunction(this.onEnd)&&this.onEnd(t,{docs:n,config:s})}updateRect(t){const i=this.el,s=this,n=this.opts,o=this.rectDim,h=this.updateTarget,r=this.getSelectedHandler(),{unitHeight:a,unitWidth:l,keyWidth:d,keyHeight:c}=n;if(e.isFunction(h))h(i,o,{store:t,selectedHandler:r,resizer:s,config:n});else{const t=i.style;t[d]=o.w+l,t[c]=o.h+a}this.updateContainer()}updateContainer(e={}){const{opts:i,container:s,el:n}=this,{style:o}=s;!i.avoidContainerUpdate&&n&&e.forceShow&&(o.display="block"),this.onUpdateContainer({el:s,resizer:this,opts:t.mixin({},i,e)})}getSelectedHandler(){var t=this.handlers;if(this.selectedHandler)for(let e in t)if(t[e]===this.selectedHandler)return e}handleKeyDown(t){27===t.keyCode&&(this.rectDim=this.startDim,this.stop(t))}handleMouseDown(t){var e=t.target;this.isHandler(e)?(this.selectedHandler=e,this.start(t)):e!==this.el&&(this.selectedHandler="",this.blur())}calc(t){let e;const s=this.opts||{},n=s.step,o=this.startDim,h=s.minDim,r=s.maxDim,a=t.delta.x,l=t.delta.y,d=o.w,c=o.h;var u={t:0,l:0,w:d,h:c};if(t){var m=t.handlerAttr;~m.indexOf("r")&&(e=i.normalizeFloat(d+a*n,n),e=Math.max(h,e),r&&(e=Math.min(r,e)),u.w=e),~m.indexOf("b")&&(e=i.normalizeFloat(c+l*n,n),e=Math.max(h,e),r&&(e=Math.min(r,e)),u.h=e),~m.indexOf("l")&&(e=i.normalizeFloat(d-a*n,n),e=Math.max(h,e),r&&(e=Math.min(r,e)),u.w=e),~m.indexOf("t")&&(e=i.normalizeFloat(c-l*n,n),e=Math.max(h,e),r&&(e=Math.min(r,e)),u.h=e);var p=s.ratioDefault?!t.keys.shift:t.keys.shift;if(m.indexOf("c")<0&&p){var f=o.w/o.h;u.w/u.h>f?u.h=Math.round(u.w/f):u.w=Math.round(u.h*f)}return~m.indexOf("l")&&(u.l=o.w-u.w),~m.indexOf("t")&&(u.t=o.h-u.h),u}}}(h)}});
//# sourceMappingURL=../sourcemaps/utils/Resizer.js.map
