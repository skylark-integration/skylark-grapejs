/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","../../utils/mixins","../../parser/model/ParserHtml"],function(t,e,s){"use strict";const r=s().parseStyle;return{parseStyle:r,extendStyle(t){return{...this.getStyle(),...t}},getStyle(){return{...this.get("style")||{}}},setStyle(s={},i={}){t.isString(s)&&(s=r(s));const l=this.getStyle(),n={...s};this.set("style",n,i);const g=e.shallowDiff(l,n);return t.keys(g).forEach(t=>{const e=this.em;this.trigger(`change:style:${t}`),e&&(e.trigger("styleable:change",this,t),e.trigger(`styleable:change:${t}`,this,t))}),n},addStyle(t,e="",s={}){"string"==typeof t?t={prop:e}:s=e||{},t=this.extendStyle(t),this.setStyle(t,s)},removeStyle(t){let e=this.getStyle();delete e[t],this.setStyle(e)},styleToString(e={}){const s=[],r=this.getStyle();for(let i in r){const l=e.important,n=t.isArray(l)?l.indexOf(i)>=0:l,g=`${r[i]}${n?" !important":""}`,o="__"==i.substr(0,2);g&&!o&&s.push(`${i}:${g};`)}return s.join("")},getSelectors(){return this.get("selectors")||this.get("classes")},getSelectorsString(){return this.selectorsToString?this.selectorsToString():this.getSelectors().getFullString()}}});
//# sourceMappingURL=../../sourcemaps/domain_abstract/model/Styleable.js.map
