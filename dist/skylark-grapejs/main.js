/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-jquery","./editor/index","skylark-underscore","./utils/polyfills","./plugin_manager/index"],function(n,e,r,t,i,o){"use strict";i();const s=new o,l=[],u={autorender:1,plugins:[],pluginsOpts:{}};return{$:e,editors:l,plugins:s,version:"<# VERSION #>",init(e={}){const i=e.container;if(!i)throw new Error("'container' is required");(e=n.mixin({},u,e)).el=t.isElement(i)?i:document.querySelector(i);const o=new r(e).init();return e.plugins.forEach(n=>{let r=s.get(n);const i=e.pluginsOpts[n]||{};if(!r){const e=window[n];r=e&&e.default?e.default:e}r?r(o,i):t.isFunction(n)?n(o,i):console.warn(`Plugin ${n} not found`)}),o.getModel().loadOnStart(),e.autorender&&o.render(),l.push(o),o}}});
//# sourceMappingURL=sourcemaps/main.js.map
