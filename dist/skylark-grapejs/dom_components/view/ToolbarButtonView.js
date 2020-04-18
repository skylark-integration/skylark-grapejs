/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone"],function(e){"use strict";return e.View.extend({events(){return this.model.get("events")||{mousedown:"handleClick"}},attributes(){return this.model.get("attributes")},initialize(e={}){const{config:t={}}=e;this.em=t.em,this.editor=t.editor},handleClick(e){e.preventDefault(),e.stopPropagation();const{editor:t,em:n}=this,{left:i,top:o}=t.Canvas.getFrameEl().getBoundingClientRect(),r={...e,clientX:e.clientX-i,clientY:e.clientY-o};n.trigger("toolbar:run:before"),this.execCommand(r)},execCommand(e){const t={event:e},n=this.model.get("command"),i=this.editor;"function"==typeof n&&n(i,null,t),"string"==typeof n&&i.runCommand(n,t)},render(){const{editor:e,$el:t,model:n}=this,i=n.get("id"),o=n.get("label"),r=e.getConfig("stylePrefix");return t.addClass(`${r}toolbar-item`),i&&t.addClass(`${r}toolbar-item__${i}`),o&&t.append(o),this}})});
//# sourceMappingURL=../../sourcemaps/dom_components/view/ToolbarButtonView.js.map
