/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","skylark-backbone","skylark-codemirror/CodeMirror","skylark-codemirror/mode/htmlmixed/htmlmixed","skylark-codemirror/mode/css/css","./formating"],function(e,t,r){"use strict";return t.Model.extend({defaults:{input:"",label:"",codeName:"",theme:"hopscotch",readOnly:!0,lineNumbers:!0},init(t){return e.bindAll(this,"onChange"),this.editor=r.fromTextArea(t,{dragDrop:!1,lineWrapping:!0,mode:this.get("codeName"),...this.attributes}),this.element=t,this.editor.on("change",this.onChange),this},onChange(){this.trigger("update",this)},getEditor(){return this.editor},getElement(){return this.element},setElement(e){return this.element=e,this},refresh(){return this.getEditor().refresh(),this},focus(){return this.getEditor().focus(),this},getContent(){const e=this.getEditor();return e&&e.getValue()},setContent(e,t={}){const{editor:s}=this;s&&(s.setValue(e),s.autoFormatRange&&(r.commands.selectAll(s),s.autoFormatRange(s.getCursor(!0),s.getCursor(!1)),r.commands.goDocStart(s)),!t.noRefresh&&setTimeout(()=>this.refresh()))}})});
//# sourceMappingURL=../../sourcemaps/code_manager/model/CodeMirrorEditor.js.map
