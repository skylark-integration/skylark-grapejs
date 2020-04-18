/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","./FrameView","skylark-underscore","../../utils/dom","../../utils/Dragger"],function(e,t,a,s,i){"use strict";return e.View.extend({events:{"click [data-action-remove]":"remove","mousedown [data-action-move]":"startDrag"},initialize(e={},s={}){a.bindAll(this,"onScroll","frameLoaded","updateOffset","remove","startDrag");const{model:i}=this,r={...e.config||s,frameWrapView:this},{canvasView:d,em:n}=r;this.cv=d,this.config=r,this.em=n,this.canvas=n&&n.get("Canvas"),this.ppfx=r.pStylePrefix||"",this.frame=new t({model:i,config:r}),this.classAnim=`${this.ppfx}frame-wrapper--anim`,this.listenTo(i,"loaded",this.frameLoaded),this.listenTo(i,"change:x change:y",this.updatePos),this.listenTo(i,"change:width change:height",this.updateSize),this.updatePos(),this.setupDragger()},setupDragger(){const{canvas:e,model:t}=this;let a,s,r;const d=t=>{e.toggleFramesEvents(t)};this.dragger=new i({onStart:()=>{const{x:e,y:i}=t.attributes;r=this.em.getZoomMultiplier(),a=e,s=i,d()},onEnd:()=>d(1),setPosition:e=>{t.set({x:a+e.x*r,y:s+e.y*r})}})},startDrag(e){e&&this.dragger.start(e)},remove(){return e.View.prototype.remove.apply(this,arguments),this.frame.remove(),this},updateOffset:a.debounce(function(){const{em:e,$el:t,frame:a}=this;e.runDefault({preserveSelected:1}),t.removeClass(this.classAnim),a.model._emitUpdated()}),updatePos(e){const{model:t,el:a}=this,{x:s,y:i}=t.attributes,{style:r}=a;this.frame.rect=0,r.left=isNaN(s)?s:`${s}px`,r.top=isNaN(i)?i:`${i}px`,e&&this.updateOffset()},updateSize:a.debounce(function(){this.updateDim()}),updateDim(){const{em:e,el:t,$el:i,model:r,classAnim:d}=this,{width:n,height:o}=r.attributes,{style:l}=t,v=l.width||"",m=l.height||"",f=n||"",p=o||"",c=v==f&&m==p;if(this.frame.rect=0,i.addClass(d),l.width=a.isNumber(f)?`${f}px`:f,l.height=a.isNumber(p)?`${p}px`:p,a.isNull(n)||a.isNull(o)){const e={...n?{}:{width:t.offsetWidth},...o?{}:{height:t.offsetHeight}};r.set(e,{silent:1})}e.stopDefault({preserveSelected:1}),c?this.updateOffset():i.one(s.motionsEv,this.updateOffset)},onScroll(){const{frame:e,em:t}=this;t.trigger("frame:scroll",{frame:e,body:e.getBody(),target:e.getWindow()})},frameLoaded(){const{frame:e}=this;e.getWindow().onscroll=this.onScroll,this.updateDim()},render(){const{frame:e,$el:t,ppfx:a,cv:i,model:r,el:d}=this,{onRender:n}=r.attributes;e.render(),t.empty().attr({class:`${a}frame-wrapper`}).append(`\n      <div class="${a}frame-wrapper__top gjs-two-color" data-frame-top>\n        <div class="${a}frame-wrapper__name" data-action-move>\n          ${r.get("name")||""}\n        </div>\n        <div class="${a}frame-wrapper__top-r">\n          <div class="${a}frame-wrapper__icon" data-action-remove style="display: none">\n            <svg viewBox="0 0 24 24"><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"></path></svg>\n          </div>\n        </div>\n      </div>\n      <div class="${a}frame-wrapper__right" data-frame-right></div>\n      <div class="${a}frame-wrapper__left" data-frame-left></div>\n      <div class="${a}frame-wrapper__bottom" data-frame-bottom></div>\n      `).append(e.el);const o=s.createEl("div",{class:`${a}tools`,style:"pointer-events:none; opacity: 0"},`\n      <div class="${a}highlighter" data-hl></div>\n      <div class="${a}badge" data-badge></div>\n      <div class="${a}placeholder">\n        <div class="${a}placeholder-int"></div>\n      </div>\n      <div class="${a}ghost"></div>\n      <div class="${a}toolbar" style="pointer-events:all"></div>\n      <div class="${a}resizer"></div>\n      <div class="${a}offset-v" data-offset>\n        <div class="gjs-marginName" data-offset-m>\n          <div class="gjs-margin-v-el gjs-margin-v-top" data-offset-m-t></div>\n          <div class="gjs-margin-v-el gjs-margin-v-bottom" data-offset-m-b></div>\n          <div class="gjs-margin-v-el gjs-margin-v-left" data-offset-m-l></div>\n          <div class="gjs-margin-v-el gjs-margin-v-right" data-offset-m-r></div>\n        </div>\n        <div class="gjs-paddingName" data-offset-m>\n          <div class="gjs-padding-v-el gjs-padding-v-top" data-offset-p-t></div>\n          <div class="gjs-padding-v-el gjs-padding-v-bottom" data-offset-p-b></div>\n          <div class="gjs-padding-v-el gjs-padding-v-left" data-offset-p-l></div>\n          <div class="gjs-padding-v-el gjs-padding-v-right" data-offset-p-r></div>\n        </div>\n      </div>\n      <div class="${a}offset-fixed-v"></div>\n    `);return this.elTools=o,i.toolsWrapper.appendChild(o),n&&n({el:d,elTop:d.querySelector("[data-frame-top]"),elRight:d.querySelector("[data-frame-right]"),elBottom:d.querySelector("[data-frame-bottom]"),elLeft:d.querySelector("[data-frame-left]"),frame:r,frameWrapperView:this,remove:this.remove,startDrag:this.startDrag}),this}})});
//# sourceMappingURL=../../sourcemaps/canvas/view/FrameWrapView.js.map
