/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["../../utils/mixins"],function(t){"use strict";const e=1,s=0,i=-1,n=t=>{const e=t.selection().anchorNode,s=e&&e.parentNode,i=e&&e.nextSibling;return s&&"A"==s.nodeName||i&&"A"==i.nodeName},a={bold:{name:"bold",icon:"<b>B</b>",attributes:{title:"Bold"},result:t=>t.exec("bold")},italic:{name:"italic",icon:"<i>I</i>",attributes:{title:"Italic"},result:t=>t.exec("italic")},underline:{name:"underline",icon:"<u>U</u>",attributes:{title:"Underline"},result:t=>t.exec("underline")},strikethrough:{name:"strikethrough",icon:"<strike>S</strike>",attributes:{title:"Strike-through"},result:t=>t.exec("strikeThrough")},link:{icon:'<span style="transform:rotate(45deg)">&supdsub;</span>',name:"link",attributes:{style:"font-size:1.4rem;padding:0 4px 2px;",title:"Link"},state:(t,i)=>t&&t.selection()&&n(t)?e:s,result:t=>{n(t)?t.exec("unlink"):t.insertHTML(`<a class="link" href="">${t.selection()}</a>`)}}};return class{constructor(t={}){const e=t.el;if(e._rte)return e._rte;e._rte=this,this.setEl(e),this.updateActiveActions=this.updateActiveActions.bind(this);const s=t.actions||[];s.forEach((t,e)=>{"string"==typeof t?t=a[t]:a[t.name]&&(t={...a[t.name],...t}),s[e]=t});const i=s.length?s:Object.keys(a).map(t=>a[t]);t.classes={...{actionbar:"actionbar",button:"action",active:"active",disabled:"disabled",inactive:"inactive"},...t.classes};const n=t.classes;let c=t.actionbar;if(this.actionbar=c,this.settings=t,this.classes=n,this.actions=i,!c){const e=t.actionbarContainer;(c=document.createElement("div")).className=n.actionbar,e.appendChild(c),this.actionbar=c,i.forEach(t=>this.addAction(t))}return t.styleWithCSS&&this.exec("styleWithCSS"),this.syncActions(),this}destroy(){this.el=0,this.doc=0,this.actionbar=0,this.settings={},this.classes={},this.actions=[]}setEl(t){this.el=t,this.doc=t.ownerDocument}updateActiveActions(){this.getActions().forEach(t=>{const n=t.btn,a=t.update,{active:c,inactive:o,disabled:l}={...this.classes},r=t.state,h=t.name,d=this.doc;if(n.className=n.className.replace(c,"").trim(),n.className=n.className.replace(o,"").trim(),n.className=n.className.replace(l,"").trim(),r)switch(r(this,d)){case e:n.className+=` ${c}`;break;case s:n.className+=` ${o}`;break;case i:n.className+=` ${l}`}else d.queryCommandSupported(h)&&d.queryCommandState(h)&&(n.className+=` ${c}`);a&&a(this,t)})}enable(){return this.enabled?this:(this.actionbarEl().style.display="",this.el.contentEditable=!0,t.on(this.el,"mouseup keyup",this.updateActiveActions),this.syncActions(),this.updateActiveActions(),this.el.focus(),this.enabled=1,this)}disable(){return this.actionbarEl().style.display="none",this.el.contentEditable=!1,t.off(this.el,"mouseup keyup",this.updateActiveActions),this.enabled=0,this}syncActions(){this.getActions().forEach(t=>{if(this.settings.actionbar&&(!t.state||t.state&&t.state(this,this.doc)>=0)){const e=t.event||"click";t.btn[`on${e}`]=(e=>{t.result(this,t),this.updateActiveActions()})}})}addAction(t,e={}){const s=e.sync,i=document.createElement("span"),n=t.icon,a=t.attributes||{};i.className=this.classes.button,t.btn=i;for(let t in a)i.setAttribute(t,a[t]);"string"==typeof n?i.innerHTML=n:i.appendChild(n),this.actionbarEl().appendChild(i),s&&(this.actions.push(t),this.syncActions())}getActions(){return this.actions}selection(){return this.doc.getSelection()}exec(t,e=null){this.doc.execCommand(t,!1,e)}actionbarEl(){return this.actionbar}insertHTML(t){let e;const s=this.doc,i=s.getSelection();if(i&&i.rangeCount){const n=s.createElement("div"),a=i.getRangeAt(0);a.deleteContents(),n.innerHTML=t,Array.prototype.slice.call(n.childNodes).forEach(t=>{a.insertNode(t),e=t}),i.removeAllRanges(),i.addRange(a),this.el.focus()}}}});
//# sourceMappingURL=../../sourcemaps/rich_text_editor/model/RichTextEditor.js.map
