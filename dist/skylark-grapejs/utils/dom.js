/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore"],function(e){"use strict";const t=(t,n,r)=>{const{childNodes:i}=t,d=i.length,a=e.isUndefined(r)?d:r;e.isString(n)&&(t.insertAdjacentHTML("beforeEnd",n),n=t.lastChild,t.removeChild(n)),a>=d?t.appendChild(n):t.insertBefore(n,i[a])};return{motionsEv:"transitionend oTransitionEnd transitionend webkitTransitionEnd",empty:e=>{for(;e.firstChild;)e.removeChild(e.firstChild)},replaceWith:(e,t)=>{e.parentNode.replaceChild(t,e)},appendAtIndex:t,append:(e,n)=>t(e,n),createEl:(t,n="",r)=>{const i=document.createElement(t);return n&&e.each(n,(e,t)=>i.setAttribute(t,e)),r&&(e.isString(r)?i.innerHTML=r:i.appendChild(r)),i},createCustomEvent:(e,t)=>{let n;try{n=new window[t](e.type,e)}catch(e){(n=document.createEvent(t)).initEvent(e.type,!0,!0)}return n.keyCodeVal=e.keyCode,n._parentEvent=e,["keyCode","which"].forEach(e=>{Object.defineProperty(n,e,{get(){return this.keyCodeVal}})}),n},appendVNodes:(t,n=[])=>{(Array.isArray(n)?n:[n]).forEach(n=>{const r=n.tag||"div",i=n.attributes||{},d=document.createElement(r);e.each(i,(e,t)=>{d.setAttribute(t,e)}),t.appendChild(d)})}}});
//# sourceMappingURL=../sourcemaps/utils/dom.js.map
