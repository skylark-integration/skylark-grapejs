/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./ComponentImage","./Component"],function(e,t){"use strict";return e.extend({defaults:{...e.prototype.defaults,type:"map",src:"",void:0,mapUrl:"https://maps.google.com/maps",tagName:"iframe",mapType:"q",address:"",zoom:"1",attributes:{frameborder:0},toolbar:t.prototype.defaults.toolbar,traits:[{label:"Address",name:"address",placeholder:"eg. London, UK",changeProp:1},{type:"select",label:"Map type",name:"mapType",changeProp:1,options:[{value:"q",name:"Roadmap"},{value:"w",name:"Satellite"}]},{label:"Zoom",name:"zoom",type:"range",min:"1",max:"20",changeProp:1}]},initialize(t,a){this.get("src")?this.parseFromSrc():this.updateSrc(),e.prototype.initialize.apply(this,arguments),this.listenTo(this,"change:address change:zoom change:mapType",this.updateSrc)},updateSrc(){this.set("src",this.getMapUrl())},getMapUrl(){var e=this.get("address"),t=this.get("zoom"),a=this.get("mapType");e=e?"&q="+e:"",t=t?"&z="+t:"",a=a?"&t="+a:"";var s=this.get("mapUrl")+"?"+e+t+a;return s+="&output=embed"},parseFromSrc(){var e=this.parseUri(this.get("src")).query;e.q&&this.set("address",e.q),e.z&&this.set("zoom",e.z),e.t&&this.set("mapType",e.t)}},{isComponent(e){var t="";return"IFRAME"==e.tagName&&/maps\.google\.com/.test(e.src)&&(t={type:"map",src:e.src}),t}})});
//# sourceMappingURL=../../sourcemaps/dom_components/model/ComponentMap.js.map
