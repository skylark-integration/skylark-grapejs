/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","./config/config","./model/Blocks","./model/Categories","./view/BlocksView"],function(e,t,n,r,o){"use strict";return()=>{var i,l,s,d={},g=[];return{name:"BlockManager",init(e){const c=(d=e||{}).em;for(let e in t)e in d||(d[e]=t[e]);return i=new n([]),l=new n([]),g=new r,s=new o({collection:l,categories:g},d),i.listenTo(i,"add",e=>{l.add(e),c&&c.trigger("block:add",e)}),i.listenTo(i,"remove",e=>{l.remove(e),c&&c.trigger("block:remove",e)}),i.listenTo(i,"reset",e=>{l.reset(e.models)}),this},getConfig:()=>d,onLoad(){const e=this.getAll();!e.length&&e.reset(d.blocks)},postRender(){const t=this.getConfig().appendTo;if(t){(e.isElement(t)?t:document.querySelector(t)).appendChild(this.render())}},add(e,t){var n=t||{};return n.id=e,i.add(n)},get:e=>i.get(e),getAll:()=>i,getAllVisible:()=>l,remove:e=>i.remove(e),getCategories:()=>g,getContainer:()=>s.el,render(e,t={}){const r=e||this.getAll().models;return t.external?new o({collection:new n(r),categories:g},{...d,...t}).render().el:(s.rendered||(s.render(),s.rendered=1),s.updateConfig(t),s.collection.reset(r),this.getContainer())}}}});
//# sourceMappingURL=../sourcemaps/block_manager/index.js.map
