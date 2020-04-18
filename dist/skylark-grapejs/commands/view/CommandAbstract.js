/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone"],function(t){"use strict";t.$;return t.View.extend({initialize(t){this.config=t||{},this.editorModel=this.em=this.config.em||{},this.pfx=this.config.stylePrefix,this.ppfx=this.config.pStylePrefix,this.hoverClass=this.pfx+"hover",this.badgeClass=this.pfx+"badge",this.plhClass=this.pfx+"placeholder",this.freezClass=this.ppfx+"freezed",this.canvas=this.em.get&&this.em.get("Canvas"),this.em.get&&this.setElement(this.getCanvas()),this.canvas&&(this.$canvas=this.$el,this.canvasTool=this.getCanvasTools()),this.init(this.config)},onFrameScroll(t){},getCanvas(){return this.canvas.getElement()},getCanvasBody(){return this.canvas.getBody()},getCanvasWrapper(){return this.canvas.getWrapperEl()},getCanvasTools(){return this.canvas.getToolsEl()},offset(t){var e=t.getBoundingClientRect();return{top:e.top+t.ownerDocument.body.scrollTop,left:e.left+t.ownerDocument.body.scrollLeft}},init(t){},callRun(t,e={}){const s=this.id;if(t.trigger(`run:${s}:before`,e),e&&e.abort)return void t.trigger(`abort:${s}`,e);const i=e.sender||t,r=this.run(t,i,e);return t.trigger(`run:${s}`,r,e),t.trigger("run",s,r,e),r},callStop(t,e={}){const s=this.id,i=e.sender||t;t.trigger(`stop:${s}:before`,e);const r=this.stop(t,i,e);return t.trigger(`stop:${s}`,r,e),t.trigger("stop",s,r,e),r},stopCommand(){this.em.get("Commands").stop(this.id)},run(t,e){},stop(t,e){}})});
//# sourceMappingURL=../../sourcemaps/commands/view/CommandAbstract.js.map
