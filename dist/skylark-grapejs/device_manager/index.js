/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-langx/langx","./config/config","./model/Devices","./view/DevicesView"],function(e,n,i,r){"use strict";return()=>{var t,a,d={};return{name:"DeviceManager",init(e){for(var c in d=e||{},n)c in d||(d[c]=n[c]);return t=new i,(d.devices||[]).forEach(e=>this.add(e.id||e.name,e.width,e)),a=new r({collection:t,config:d}),this},add(n,i,r={}){const a=e.mixin({},r,{id:n,name:r.name||n,width:i});return t.add(a)},get:e=>t.get(e),getAll:()=>t,render:()=>a.render().el}}});
//# sourceMappingURL=../sourcemaps/device_manager/index.js.map
