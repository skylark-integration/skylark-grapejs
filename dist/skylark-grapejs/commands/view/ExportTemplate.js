/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone"],function(t){"use strict";const e=t.$;return{run(t,i,o={}){i&&i.set&&i.set("active",0);const s=t.getConfig(),n=t.Modal,r=s.stylePrefix;if(this.cm=t.CodeManager||null,!this.$editors){const t=this.buildEditor("htmlmixed","hopscotch","HTML"),i=this.buildEditor("css","hopscotch","CSS");this.htmlEditor=t.el,this.cssEditor=i.el;const o=e(`<div class="${r}export-dl"></div>`);o.append(t.$el).append(i.$el),this.$editors=o}n.open({title:s.textViewCode,content:this.$editors}).getModel().once("change:open",()=>t.stopCommand(this.id)),this.htmlEditor.setContent(t.getHtml()),this.cssEditor.setContent(t.getCss())},stop(t){const e=t.Modal;e&&e.close()},buildEditor(t,e,i){const o=document.createElement("textarea");!this.codeMirror&&(this.codeMirror=this.cm.getViewer("CodeMirror"));const s=this.codeMirror.clone().set({label:i,codeName:t,theme:e,input:o}),n=new this.cm.EditorView({model:s,config:this.cm.getConfig()}).render().$el;return s.init(o),{el:s,$el:n}}}});
//# sourceMappingURL=../../sourcemaps/commands/view/ExportTemplate.js.map
