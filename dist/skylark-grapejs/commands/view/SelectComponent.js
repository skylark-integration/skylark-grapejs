/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","skylark-underscore","../../utils/mixins","../../dom_components/view/ToolbarView","../../dom_components/model/Toolbar"],function(e,t,o,s,i){"use strict";const l=e.$;let n;return{init(e){t.bindAll(this,"onHover","onOut","onClick","onFrameScroll","onFrameUpdated")},enable(){this.frameOff=this.canvasOff=this.adjScroll=null,this.startSelectComponent(),n=1},startSelectComponent(){this.toggleSelectComponent(1),this.em.getSelected()&&this.onSelect()},stopSelectComponent(){this.toggleSelectComponent()},toggleSelectComponent(e){const{em:t}=this,s=e?"on":"off",i=(e,t)=>{o[s](t,"mouseover",this.onHover),o[s](t,"mouseleave",this.onOut),o[s](t,"click touchend",this.onClick),o[s](e,"scroll",this.onFrameScroll)};o[s](window,"resize",this.onFrameUpdated),t[s]("component:toggled",this.onSelect,this),t[s]("change:componentHovered",this.onHovered,this),t[s]("component:resize component:styleUpdate",this.updateGlobalPos,this),t[s]("change:canvasOffset",this.updateAttached,this),t[s]("frame:updated",this.onFrameUpdated,this),t.get("Canvas").getFrames().forEach(e=>{const{view:t}=e;i(t.getWindow(),t.getBody())})},onHover(e){e.stopPropagation();const t=e.target,s=o.getViewEl(t),i=s&&s._getFrame(),n=l(t);let a=n.data("model");if(!a){let e=n.parent();for(;!a&&e.length>0;)a=e.data("model"),e=e.parent()}if(a&&!a.get("hoverable")){let e=a&&a.parent();for(;e&&!e.get("hoverable");)e=e.parent();a=e}this.currentDoc=t.ownerDocument,this.em.setHovered(a),i&&this.em.set("currentFrame",i)},onFrameUpdated(){this.updateLocalPos(),this.updateGlobalPos()},onHovered(e,t){let s={};t&&t.views.forEach(e=>{const i=e.el,l=this.getElementPos(i);s={el:i,pos:l,component:t,view:o.getViewEl(i)},this.updateToolsLocal(s),i.ownerDocument===this.currentDoc&&(this.elHovered=s)})},onSelect:t.debounce(function(){const{em:e}=this,t=e.getSelected(),s=e.get("currentFrame")||{},i=t&&t.getView(s.model);let l=i&&i.el,n={};if(l){n={el:l,pos:this.getElementPos(l),component:t,view:o.getViewEl(l)}}this.elSelected=n,this.updateToolsGlobal(),this.updateToolsLocal(n)}),updateGlobalPos(){const e=this.getElSelected();e.el&&(e.pos=this.getElementPos(e.el),this.updateToolsGlobal())},updateLocalPos(){const e=this.getElHovered();e.el&&(e.pos=this.getElementPos(e.el),this.updateToolsLocal())},getElHovered(){return this.elHovered||{}},getElSelected(){return this.elSelected||{}},onOut(){this.currentDoc=null,this.em.setHovered(0),this.canvas.getFrames().forEach(e=>{const t=e.view.getToolsEl();this.toggleToolsEl(0,0,{el:t})})},toggleToolsEl(e,t,o={}){const s=o.el||this.canvas.getToolsEl(t);return s.style.opacity=e?1:0,s},showElementOffset(e,t,o={}){n&&this.editor.runCommand("show-offset",{el:e,elPos:t,view:o.view,force:1,top:0,left:0})},hideElementOffset(e){this.editor.stopCommand("show-offset",{view:e})},showFixedElementOffset(e,t){this.editor.runCommand("show-offset",{el:e,elPos:t,state:"Fixed"})},hideFixedElementOffset(e,t){this.editor&&this.editor.stopCommand("show-offset",{state:"Fixed"})},hideHighlighter(e){this.canvas.getHighlighter(e).style.opacity=0},onClick(e){e.stopPropagation(),e.preventDefault();const{em:t}=this;if(t.get("_cmpDrag"))return t.set("_cmpDrag");const o=l(e.target);let s=o.data("model");if(!s){let e=o.parent();for(;!s&&e.length>0;)s=e.data("model"),e=e.parent()}if(s)if(s.get("selectable"))this.select(s,e);else{let t=s.parent();for(;t&&!t.get("selectable");)t=t.parent();this.select(t,e)}},select(e,o={}){if(!e)return;const s=o.ctrlKey||o.metaKey,{shiftKey:i}=o,{editor:l,em:n}=this,a=l.getConfig("multipleSelection");if(s&&a)l.selectToggle(e);else if(i&&a){n.clearSelection(l.Canvas.getWindow());const o=e.collection,s=o.indexOf(e);l.getSelectedAll();let i,a;if(l.getSelectedAll().forEach(e=>{const l=e.collection,n=l.indexOf(e);l===o&&(n<s?i=t.isUndefined(i)?n:Math.max(i,n):n>s&&(a=t.isUndefined(a)?n:Math.min(a,n)))}),!t.isUndefined(i))for(;i!==s;)l.selectAdd(o.at(i)),i++;if(!t.isUndefined(a))for(;a!==s;)l.selectAdd(o.at(a)),a--;l.selectAdd(e)}else l.select(e,{scroll:{}});this.initResize(e)},updateBadge(e,t,o={}){const s=l(e).data("model");if(!s||!s.get("badgable"))return;const i=this.getBadge(o);if(!o.posOnly){const e=this.canvas.getConfig(),t=s.getIcon(),o=`${e.pStylePrefix||""}badge`,l=e.customBadgeLabel,n=`${t?`<div class="${o}__icon">${t}</div>`:""}\n        <div class="${o}__name">${s.getName()}</div>`;i.innerHTML=l?l(s):n}const n=i.style;n.display="block";const a=i?i.offsetHeight:0,r=0-a,d=o.topOff-a<0?-o.topOff:r,c=o.leftOff<0?-o.leftOff:0;n.top=d+"px",n.left=c+"px"},showHighlighter(e){this.canvas.getHighlighter(e).style.opacity=""},initResize(e){const{em:s,canvas:i}=this,l=s?s.get("Editor"):"",a=`${(s?s.get("Config"):"").stylePrefix||""}resizing`,r=!t.isElement(e)&&o.isTaggableNode(e)?e:s.getSelected(),d=r.get("resizable"),c=t.isElement(e)?e:r.getEl();let h,g={};var p=(e,t,o)=>{const s=o.docs;s&&s.forEach(t=>{const o=t.body,s=o.className||"";o.className=("add"==e?`${s} ${a}`:s.replace(a,"")).trim()})};l&&d?(g={onStart(e,t={}){const{el:l,config:a,resizer:d}=t,{keyHeight:c,keyWidth:g,currentUnit:f,keepAutoHeight:m,keepAutoWidth:u}=a;p("add",0,t),h=s.get("StyleManager").getModelToStyle(r),i.toggleFramesEvents();const v=getComputedStyle(l),E=h.getStyle();let w=E[g];a.autoWidth=u&&"auto"===w,isNaN(parseFloat(w))&&(w=v[g]);let b=E[c];a.autoHeight=m&&"auto"===b,isNaN(parseFloat(b))&&(b=v[c]),d.startDim.w=parseFloat(w),d.startDim.h=parseFloat(b),n=0,f&&(a.unitHeight=o.getUnitFromValue(b),a.unitWidth=o.getUnitFromValue(w))},onMove(){l.trigger("component:resize")},onEnd(e,t){p("remove",0,t),l.trigger("component:resize"),i.toggleFramesEvents(1),n=1},updateTarget(e,t,o={}){if(!h)return;const{store:l,selectedHandler:n,config:a}=o,{keyHeight:r,keyWidth:d,autoHeight:c,autoWidth:g,unitWidth:p,unitHeight:f}=a,m=["tc","bc"].indexOf(n)>=0,u=["cl","cr"].indexOf(n)>=0,v={},E=l?"":1;if(!m){const e=i.getBody().offsetWidth,o=t.w<e?t.w:e;v[d]=g?"auto":`${o}${p}`}u||(v[r]=c?"auto":`${t.h}${f}`),h.addStyle({...v,en:E},{avoidStore:!l});const w=`update:component:style:${r} update:component:style:${d}`;s&&s.trigger(w,null,null,{noEmit:1})}},"object"==typeof d&&(g={...g,...d}),this.resizer=l.runCommand("resize",{el:c,options:g,force:1})):(l.stopCommand("resize"),this.resizer=null)},updateToolbar(e){var t=this.config.em,o=e==t?t.getSelected():e,l=this.canvas.getToolbarEl(),n=l.style;if(o){var a=o.get("toolbar");if(t.get("Config").showToolbar&&a&&a.length){if(n.opacity="",n.display="",!this.toolbar){l.innerHTML="",this.toolbar=new i(a);var r=new s({collection:this.toolbar,editor:this.editor,em:t});l.appendChild(r.render().el)}this.toolbar.reset(a),n.top="-100px",n.left=0}else n.display="none"}else n.opacity=0},updateToolbarPos(e){const{style:t}=this.canvas.getToolbarEl();t.top=`${e.top}px`,t.left=`${e.left}px`,t.opacity=""},getCanvasPosition(){return this.canvas.getCanvasView().getPosition()},getBadge(e={}){return this.canvas.getBadgeEl(e.view)},onFrameScroll(){this.updateTools()},updateTools(){this.updateToolsLocal(),this.updateGlobalPos()},isCompSelected:e=>e&&"selected"===e.get("status"),updateToolsLocal(e){const{el:t,pos:o,view:s,component:i}=e||this.getElHovered();if(!t)return void(this.lastHovered=0);const l=i.get("hoverable"),n=this.lastHovered!==t,a=n?{}:{posOnly:1};n&&l&&(this.lastHovered=t,this.showHighlighter(s),this.showElementOffset(t,o,{view:s})),this.isCompSelected(i)&&(this.hideHighlighter(s),this.hideElementOffset(s));const{style:r}=this.toggleToolsEl(1,s),d=this.canvas.canvasRectOffset(t,o),c=d.top,h=d.left;this.updateBadge(t,o,{...a,view:s,topOff:c,leftOff:h}),r.top=c+"px",r.left=h+"px",r.width=o.width+"px",r.height=o.height+"px"},updateToolsGlobal(){const{el:e,pos:t,component:o}=this.getElSelected();if(!e)return this.toggleToolsEl(),void(this.lastSelected=0);const{canvas:s}=this;this.lastSelected!==e&&(this.lastSelected=e,this.updateToolbar(o));const{style:i}=this.toggleToolsEl(1),l=s.getTargetToElementFixed(e,s.getToolbarEl(),{pos:t}),n=l.canvasOffsetTop,a=l.canvasOffsetLeft;i.top=n+"px",i.left=a+"px",i.width=t.width+"px",i.height=t.height+"px",this.updateToolbarPos({top:l.top,left:l.left})},updateAttached:t.debounce(function(){this.updateToolsGlobal()}),getElementPos(e){return this.canvas.getCanvasView().getElementPos(e)},hideBadge(){this.getBadge().style.display="none"},cleanPrevious(e){e&&e.set({status:"",state:""})},getContentWindow(){return this.canvas.getWindow()},run(e){this.editor=e&&e.get("Editor"),this.enable()},stop(e,t,o={}){const{em:s,editor:i}=this;this.stopSelectComponent(),!o.preserveSelected&&s.setSelected(null),this.onOut(),this.toggleToolsEl(),i&&i.stopCommand("resize")}}});
//# sourceMappingURL=../../sourcemaps/commands/view/SelectComponent.js.map