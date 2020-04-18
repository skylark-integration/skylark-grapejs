/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-langx/langx","./config/config","./model/ParserCss","./model/ParserHtml"],function(s,e,r,t){"use strict";return()=>{let s,n,a={};return{compTypes:"",parserCss:null,parserHtml:null,name:"Parser",getConfig:()=>a,init(p={}){return(a={...e,...p}).Parser=this,s=t(a),n=r(a),this.em=a.em,this.parserCss=n,this.parserHtml=s,this},parseHtml(e){const{em:r,compTypes:t}=this;return s.compTypes=r?r.get("DomComponents").getTypes():t,s.parse(e,n)},parseCss:s=>n.parse(s)}}});
//# sourceMappingURL=../sourcemaps/parser/index.js.map
