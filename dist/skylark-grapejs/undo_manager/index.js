/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-backbone/UndoManager"],function(e,t){"use strict";return()=>{let r,n,o,i;const a={};return{name:"UndoManager",init(s={}){o=e.mixin({},s,a),r=o.em,this.em=r,(n=new t(e.mixin({track:!0,register:[]},o))).changeUndoType("change",{condition:!1}),n.changeUndoType("add",{on(t,r,n={}){if(!n.avoidStore)return{object:r,before:void 0,after:t,options:e.clone(n)}}}),n.changeUndoType("remove",{on(t,r,n={}){if(!n.avoidStore)return{object:r,before:t,after:void 0,options:e.clone(n)}}});const d={on(e,t,r={}){if(!i&&(i=e.previousAttributes()),!r.avoidStore){const t={object:e,before:i,after:e.toJSON()};return i=null,t}},undo(e,t,r,n){e.set(t)},redo(e,t,r,n){e.set(r)}};return["style","attributes","content","src"].forEach(e=>n.addUndoType(`change:${e}`,d)),n.on("undo redo",()=>r.trigger("component:toggled change:canvasOffset")),["undo","redo"].forEach(e=>n.on(e,()=>r.trigger(e))),this},getConfig:()=>o,add(e){return n.register(e),this},remove(e){return n.unregister(e),this},removeAll(){return n.unregisterAll(),this},start(){return n.startTracking(),this},stop(){return n.stopTracking(),this},undo(){return!r.isEditing()&&n.undo(1),this},undoAll(){return n.undoAll(),this},redo(){return!r.isEditing()&&n.redo(1),this},redoAll(){return n.redoAll(),this},hasUndo:()=>n.isAvailable("undo"),hasRedo:()=>n.isAvailable("redo"),getStack:()=>n.stack,clear(){return n.clear(),this},getInstance:()=>n}}});
//# sourceMappingURL=../sourcemaps/undo_manager/index.js.map
