/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./config/config","./view/ItemView","skylark-underscore"],function(e,t,n){"use strict";return()=>{let o,r,l={};return{name:"LayerManager",init(t={}){return(l={...e,...t}).stylePrefix=t.pStylePrefix,o=l.em,this},getConfig:()=>l,onLoad(){r=new t({level:0,config:l,opened:l.opened||{},model:o.get("DomComponents").getWrapper()}),o&&o.on("component:selected",this.componentChanged),this.componentChanged()},postRender(){const e=l.appendTo,t=l.root;if(t&&this.setRoot(t),e){(n.isElement(e)?e:document.querySelector(e)).appendChild(this.render())}},setRoot(e){return r.setRoot(e),this},getRoot:()=>r.model,getAll:()=>r,componentChanged(e,t={}){if(t.fromLayers)return;const n=o.get("opened"),r=o.getSelected(),i=l.scrollLayers;let c=r&&r.collection?r.collection.parent:null;for(let e in n)n[e].set("open",0);for(;c;)c.set("open",1),n[c.cid]=c,c=c.collection?c.collection.parent:null;if(r&&i){const e=r.viewLayer&&r.viewLayer.el;e&&e.scrollIntoView(i)}},render:()=>r.render().el}}});
//# sourceMappingURL=../sourcemaps/navigator/index.js.map
