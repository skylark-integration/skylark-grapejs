/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","skylark-backbone"],function(e,t){"use strict";const i=t.Model,s=t.View;return{types:[],initialize(e,t){var i=this;this.model=function(e={},t={}){let s,n,o;if(e&&e.type){const t=i.getBaseType();s=(o=i.getType(e.type))?o.model:t.model,n=o?o.view:t.view}else{const t=i.recognizeType(e);s=(o=t.type).model,n=o.view,e=t.attributes}const y=new s(e,t);return y.typeView=n,y};const s=i.init&&i.init.bind(i);s&&s()},recognizeType(e){const t=this.getTypes();for(let i=0;i<t.length;i++){const s=t[i];let n=s.isType(e);if(n="boolean"==typeof n&&n?{type:s.id}:n)return{type:s,attributes:n}}return{type:this.getBaseType(),attributes:e}},getBaseType(){const e=this.getTypes();return e[e.length-1]},getTypes(){return this.types},getType(e){const t=this.getTypes();for(let i=0;i<t.length;i++){const s=t[i];if(s.id===e)return s}},addType(t,n){const o=this.getType(t),y=this.getBaseType(),p=o?o.model:y.model,r=o?o.view:y.view;let{model:c,view:l,isType:d}=n;c=c instanceof i||e.isFunction(c)?c:p.extend(c||{}),l=l instanceof s||e.isFunction(l)?l:r.extend(l||{}),o?(o.model=c,o.view=l,o.isType=d||o.isType):(n.id=t,n.model=c,n.view=l,n.isType=d||function(e){if(e&&e.type==t)return!0},this.getTypes().unshift(n))}}});
//# sourceMappingURL=../../sourcemaps/domain_abstract/model/TypeableCollection.js.map
