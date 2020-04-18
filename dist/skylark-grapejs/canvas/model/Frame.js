/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","../../dom_components/model/Component","../../css_composer/model/CssRules","skylark-underscore"],function(t,e,s,r){"use strict";return t.Model.extend({defaults:{wrapper:"",width:null,height:null,head:"",x:0,y:0,root:0,components:0,styles:0,attributes:{}},initialize(t,i={}){const{root:a,styles:d,components:o}=this.attributes;this.set("head",[]),this.em=i.em;const n={em:i.em,config:i.em.get("DomComponents").getConfig(),frame:this};!a&&this.set("root",new e({type:"wrapper",components:o||[]},n)),(!d||r.isString(d))&&this.set("styles",new s(d,n))},remove(){this.view=0;const t=this.collection;return t&&t.remove(this)},getHead(){return[...this.get("head")]},setHead(t){return this.set("head",[...t])},addHeadItem(t){const e=this.getHead();e.push(t),this.setHead(e)},getHeadByAttr(t,e,s){return this.getHead().filter(r=>r.attributes&&r.attributes[t]==e&&(!s||s===r.tag))[0]},removeHeadByAttr(t,e,s){const r=this.getHead(),i=this.getHeadByAttr(t,e,s),a=r.indexOf(i);a>=0&&(r.splice(a,1),this.setHead(r))},addLink(t){!this.getHeadByAttr("href",t,"link")&&this.addHeadItem({tag:"link",attributes:{href:t,rel:"stylesheet"}})},removeLink(t){this.removeHeadByAttr("href",t,"link")},addScript(t){!this.getHeadByAttr("src",t,"script")&&this.addHeadItem({tag:"script",attributes:{src:t}})},removeScript(t){this.removeHeadByAttr("src",t,"script")},_emitUpdated(t={}){this.em.trigger("frame:updated",{frame:this,...t})}})});
//# sourceMappingURL=../../sourcemaps/canvas/model/Frame.js.map
