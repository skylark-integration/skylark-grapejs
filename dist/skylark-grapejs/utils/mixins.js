/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore"],function(e){"use strict";const t=window.Element.prototype,n=t.matches||t.webkitMatchesSelector||t.mozMatchesSelector||t.msMatchesSelector,o=(t,n={})=>{const r=e.isArray(t)?[...t]:[t];if(r.length){const e=r.shift();if(e&&(!n.unique||!document.querySelector(`link[href="${e}"]`))){const{head:t}=document,o=document.createElement("link");o.href=e,o.rel="stylesheet",n.prepand?t.insertBefore(o,t.firstChild):t.appendChild(o)}o(r)}},r=e=>e[0].toUpperCase()+e.toLowerCase().slice(1),i=e=>e&&3===e.nodeType,s=e=>e&&8===e.nodeType,l=e=>e.which||e.keyCode;return{isCommentNode:s,isTaggableNode:e=>e&&!i(e)&&!s(e),on:(e,t,n)=>{t=t.split(/\s+/),e=e instanceof Array?e:[e];for(let o=0;o<t.length;++o)e.forEach(e=>e.addEventListener(t[o],n))},off:(e,t,n)=>{t=t.split(/\s+/),e=e instanceof Array?e:[e];for(let o=0;o<t.length;++o)e.forEach(e=>e.removeEventListener(t[o],n))},hasDnd:e=>"draggable"in document.createElement("i")&&(e?e.get("Config").nativeDnD:1),upFirst:r,matches:n,getModel:(t,n)=>{let o=t;return e.isElement(t)&&(o=n(t).data("model")),o},getElRect:e=>{const t={top:0,left:0,width:0,height:0};if(!e)return t;let n;if(i(e)){const t=document.createRange();t.selectNode(e),n=t.getBoundingClientRect(),t.detach()}return n||(e.getBoundingClientRect?e.getBoundingClientRect():t)},camelCase:e=>{const t=e.split("-").filter(String);return t[0].toLowerCase()+t.slice(1).map(r)},isTextNode:i,getKeyCode:l,getKeyChar:e=>String.fromCharCode(l(e)),isEscKey:e=>27===l(e),getElement:t=>e.isElement(t)||i(t)?t:t&&t.getEl?t.getEl():void 0,shallowDiff:(t,n)=>{const o={},r=e.keys(n);for(let e in t)if(t.hasOwnProperty(e)){const i=t[e],s=n[e];r.indexOf(e)>=0?i!==s&&(o[e]=s):o[e]=null}for(let r in n)n.hasOwnProperty(r)&&e.isUndefined(t[r])&&(o[r]=n[r]);return o},normalizeFloat:(e,t=1,n=0)=>{let o=0;if(isNaN(e))return n;if(e=parseFloat(e),Math.floor(e)!==e){const e=t.toString().split(".")[1];o=e?e.length:0}return o?parseFloat(e.toFixed(o)):e},getPointerEvent:e=>e.touches&&e.touches[0]?e.touches[0]:e,getUnitFromValue:e=>e.replace(parseFloat(e),""),capitalize:e=>e&&e.charAt(0).toUpperCase()+e.substring(1),getViewEl:e=>e.__gjsv,setViewEl:(e,t)=>{e.__gjsv=t},appendStyles:o,isComponent:e=>e&&e.toHTML,isRule:e=>e&&e.toCSS}});
//# sourceMappingURL=../sourcemaps/utils/mixins.js.map
