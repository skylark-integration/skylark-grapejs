/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone"],function(t){"use strict";return t.Model.extend({idAttribute:"name",defaults:{name:"",width:null,height:"",widthMedia:null,priority:null},initialize(){null===this.get("widthMedia")&&this.set("widthMedia",this.get("width")),null===this.get("width")&&this.set("width",this.get("widthMedia")),!this.get("priority")&&this.set("priority",parseFloat(this.get("widthMedia"))||0);["width","height","widthMedia"].forEach(t=>this.checkUnit(t))},checkUnit(t){const i=this.get(t)||"";(parseFloat(i)||0).toString()===i.toString()&&this.set(t,`${i}px`)}})});
//# sourceMappingURL=../../sourcemaps/device_manager/model/Device.js.map
