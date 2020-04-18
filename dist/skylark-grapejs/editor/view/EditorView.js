/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-jquery","skylark-backbone","../../utils/mixins"],function(e,t,i){"use strict";return t.View.extend({initialize(){const{model:e}=this;e.view=this,this.conf=e.config,this.pn=e.get("Panels"),this.cv=e.get("Canvas"),e.on("loaded",()=>{this.pn.active(),this.pn.disableButtons(),setTimeout(()=>{e.runDefault(),e.trigger("load",e.get("Editor"))})})},render(){const{model:t,$el:n,conf:s}=this,d=s.stylePrefix,o=e(s.el||`body ${s.container}`);return i.appendStyles(s.cssIcons,{unique:1,prepand:1}),n.empty(),s.width&&o.css("width",s.width),s.height&&o.css("height",s.height),n.append(this.cv.render()),n.append(this.pn.render()),n.attr("class",`${d}editor ${d}one-bg ${d}two-color`),o.addClass(`${d}editor-cont`).empty().append(n),this}})});
//# sourceMappingURL=../../sourcemaps/editor/view/EditorView.js.map
