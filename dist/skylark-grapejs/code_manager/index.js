/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","./config/config","./model/HtmlGenerator","./model/CssGenerator","./model/JsonGenerator","./model/JsGenerator","./model/CodeMirrorEditor","./view/EditorView"],function(e,r,t,n,i,o,a,d){"use strict";return()=>{var s={},l={},u={},w={},f={};return{getConfig:()=>s,config:s,EditorView:d,name:"CodeManager",init(e){for(var d in s=e||{},r)d in s||(s[d]=r[d]);var l=s.pStylePrefix;return l&&(s.stylePrefix=l+s.stylePrefix),u.html=new t,u.css=new n,u.json=new i,u.js=new o,f.CodeMirror=new a,this.loadDefaultGenerators().loadDefaultViewers(),this},addGenerator(e,r){return l[e]=r,this},getGenerator:e=>l[e]||null,getGenerators:()=>l,addViewer(e,r){return w[e]=r,this},getViewer:e=>w[e]||null,getViewers:()=>w,createViewer(r={}){const t=e.isUndefined(r.type)?"CodeMirror":r.type,n=this.getViewer(t)&&this.getViewer(t).clone(),i=document.createElement("div"),o=document.createElement("textarea");return i.appendChild(o),n.set(r),n.init(o),n.setElement(i),n},updateViewer(e,r){e.setContent(r)},getCode(e,r,t={}){t.em=s.em;var n=this.getGenerator(r);return n?n.build(e,t):""},loadDefaultGenerators(){for(var e in u)this.addGenerator(e,u[e]);return this},loadDefaultViewers(){for(var e in f)this.addViewer(e,f[e]);return this}}}});
//# sourceMappingURL=../sourcemaps/code_manager/index.js.map
