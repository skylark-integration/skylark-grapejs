/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-langx/langx","./config/config","./model/ParserCss","./model/ParserHtml"],function(e,s,r,t){"use strict";return()=>{let n,a,i={};return{compTypes:"",parserCss:null,parserHtml:null,name:"Parser",getConfig:()=>i,init(m={}){return(i=e.mixin({},s,m)).Parser=this,n=new t(i),a=new r(i),this.em=i.em,this.parserCss=a,this.parserHtml=n,this},parseHtml(e){const{em:s,compTypes:r}=this;return n.compTypes=s?s.get("DomComponents").getTypes():r,n.parse(e,a)},parseCss:e=>a.parse(e)}}});
//# sourceMappingURL=../sourcemaps/parser/index.js.map
