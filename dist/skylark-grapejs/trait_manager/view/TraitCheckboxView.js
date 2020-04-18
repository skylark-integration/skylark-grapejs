/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","./TraitView"],function(e,t){"use strict";return t.extend({appendInput:0,templateInput(){const{ppfx:e,clsField:t}=this;return`<label class="${t}" data-input>\n    <i class="${e}chk-icon"></i>\n  </label>`},onChange(){const e=this.getInputElem().checked;this.model.set("value",this.getCheckedValue(e))},getCheckedValue(t){let n=t;const{valueTrue:s,valueFalse:i}=this.model.attributes;return n&&!e.isUndefined(s)&&(n=s),n||e.isUndefined(i)||(n=i),n},getInputEl(...n){const s=!this.$input,i=t.prototype.getInputEl.apply(this,n);if(s){let t,n;const{model:s,target:l}=this,{valueTrue:a,valueFalse:u}=s.attributes,r=s.get("name");s.get("changeProp")?n=t=l.get(r):t=!(!(n=l.get("attributes")[r])&&""!==n),e.isUndefined(u)||n!==u||(t=!1),i.checked=t}return i}})});
//# sourceMappingURL=../../sourcemaps/trait_manager/view/TraitCheckboxView.js.map
