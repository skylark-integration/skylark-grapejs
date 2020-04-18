/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","./config/config","./view/TraitsView"],function(e,i,t){"use strict";return()=>{let r,n={};return{TraitsView:t,name:"TraitManager",getConfig:()=>n,init(s={}){n=s,e.defaults(n,i);const o=n.pStylePrefix;return o&&(n.stylePrefix=`${o}${n.stylePrefix}`),r=new t({collection:[],editor:n.em,config:n}),this},postRender(){const i=this.getConfig().appendTo;if(i){(e.isElement(i)?i:document.querySelector(i)).appendChild(this.render())}},getTraitsViewer:()=>r,addType(e,i){var t=r.itemView;r.itemsView[e]=t.extend(i)},getType:e=>r.itemsView[e],render:()=>r.render().el}}});
//# sourceMappingURL=../sourcemaps/trait_manager/index.js.map
