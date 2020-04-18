/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","./BrowserParserCss","./BrowserParserCss"],function(e,r,s){"use strict";return(t={})=>({parse(e){let s=[];const{parserCss:c,em:o={}}=t,a=o&&o.get&&o.get("Editor");return(c?c(e,a):r(e)).forEach(e=>s=s.concat(this.checkNode(e))),s},checkNode(r){const{selectors:t,style:c}=r;if(e.isString(t)){const e=[],o=s.parseSelector(t),a=o.result,n=o.add.join(", "),d={atRule:r.atRule,mediaText:r.params};if(a.length?a.forEach(r=>{e.push(s.createNode(r,c,d))}):e.push(s.createNode([],c,d)),n){e[e.length-1].selectorsAdd=n}r=e}return r}})});
//# sourceMappingURL=../../sourcemaps/parser/model/ParserCss.js.map
