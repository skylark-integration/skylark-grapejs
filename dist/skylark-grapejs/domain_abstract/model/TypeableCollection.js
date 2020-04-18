/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","skylark-backbone"],function(e,t){"use strict";const i=t.Model,s=t.View;return{types:[],initialize(e,t){this.model=((e={},t={})=>{let i,s,n;if(e&&e.type){const t=this.getBaseType();i=(n=this.getType(e.type))?n.model:t.model,s=n?n.view:t.view}else{const t=this.recognizeType(e);i=(n=t.type).model,s=n.view,e=t.attributes}const o=new i(e,t);return o.typeView=s,o});const i=this.init&&this.init.bind(this);i&&i()},recognizeType(e){const t=this.getTypes();for(let i=0;i<t.length;i++){const s=t[i];let n=s.isType(e);if(n="boolean"==typeof n&&n?{type:s.id}:n)return{type:s,attributes:n}}return{type:this.getBaseType(),attributes:e}},getBaseType(){const e=this.getTypes();return e[e.length-1]},getTypes(){return this.types},getType(e){const t=this.getTypes();for(let i=0;i<t.length;i++){const s=t[i];if(s.id===e)return s}},addType(t,n){const o=this.getType(t),y=this.getBaseType(),p=o?o.model:y.model,r=o?o.view:y.view;let{model:l,view:c,isType:d}=n;l=l instanceof i||e.isFunction(l)?l:p.extend(l||{}),c=c instanceof s||e.isFunction(c)?c:r.extend(c||{}),o?(o.model=l,o.view=c,o.isType=d||o.isType):(n.id=t,n.model=l,n.view=c,n.isType=d||function(e){if(e&&e.type==t)return!0},this.getTypes().unshift(n))}}});
//# sourceMappingURL=../../sourcemaps/domain_abstract/model/TypeableCollection.js.map
