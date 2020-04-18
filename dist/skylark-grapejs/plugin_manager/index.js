/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./config/config"],function(n){"use strict";return r=>{var e=r||{};for(var i in n)i in e||(e[i]=n[i]);var t={};return{add:(n,r)=>t[n]?t[n]:(t[n]=r,r),get:n=>t[n],getAll:()=>t}}});
//# sourceMappingURL=../sourcemaps/plugin_manager/index.js.map
