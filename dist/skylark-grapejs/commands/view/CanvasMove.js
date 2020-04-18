/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","../../utils/mixins","../../utils/Dragger"],function(e,t,s){"use strict";return{run(t){e.bindAll(this,"onKeyUp","enableDragger","disableDragger"),this.editor=t,this.canvasModel=this.canvas.getCanvasView().model,this.toggleMove(1)},stop(e){this.toggleMove(),this.disableDragger()},onKeyUp(e){" "===t.getKeyChar(e)&&this.editor.stopCommand(this.id)},enableDragger(e){this.toggleDragger(1,e)},disableDragger(e){this.toggleDragger(0,e)},toggleDragger(e,t){const{canvasModel:g,em:a}=this;let{dragger:r}=this;const i=e?"add":"remove";this.getCanvas().classList[i](`${this.ppfx}is__grabbing`),r||(r=new s({getPosition:()=>({x:g.get("x"),y:g.get("y")}),setPosition({x:e,y:t}){g.set({x:e,y:t})},onStart(e,t){a.trigger("canvas:move:start",t)},onDrag(e,t){a.trigger("canvas:move",t)},onEnd(e,t){a.trigger("canvas:move:end",t)}}),this.dragger=r),e?r.start(t):r.stop()},toggleMove(e){const{ppfx:s}=this,g=e?"add":"remove",a=e?"on":"off",r=this.getCanvas(),i=[`${s}is__grab`];!e&&i.push(`${s}is__grabbing`),i.forEach(e=>r.classList[g](e)),t[a](document,"keyup",this.onKeyUp),t[a](r,"mousedown",this.enableDragger),t[a](document,"mouseup",this.disableDragger)}}});
//# sourceMappingURL=../../sourcemaps/commands/view/CanvasMove.js.map
