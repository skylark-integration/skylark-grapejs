/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","./Frame","./Frames"],function(e,t,i){"use strict";return e.Model.extend({defaults:{frame:"",frames:"",wrapper:"",rulers:!1,zoom:100,x:0,y:0},initialize(e={}){const{em:s}=e,{styles:o=[],scripts:a=[]}=e,h=new t({},e);o.forEach(e=>h.addLink(e)),a.forEach(e=>h.addScript(e)),this.em=s,this.set("frame",h),this.set("frames",new i([h],e)),this.listenTo(this,"change:zoom",this.onZoomChange),this.listenTo(s,"change:device",this.updateDevice)},updateDevice(){const{em:e}=this,t=e.getDeviceModel(),i=e.getCurrentFrameModel();if(i&&t){const{width:e,height:s}=t.attributes;i.set({width:e,height:s})}},onZoomChange(){this.get("zoom")<1&&this.set("zoom",1)}})});
//# sourceMappingURL=../../sourcemaps/canvas/model/Canvas.js.map
