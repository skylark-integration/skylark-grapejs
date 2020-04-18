/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","skylark-underscore","./TraitView"],function(t,e,i){"use strict";const n=t.$;return i.extend({init(){this.listenTo(this.model,"change:options",this.rerender)},templateInput(){const{ppfx:t,clsField:e}=this;return`<div class="${e}">\n      <div data-input></div>\n      <div class="${t}sel-arrow">\n        <div class="${t}d-s-arrow"></div>\n      </div>\n    </div>`},getInputEl(){if(!this.$input){const{model:t,em:i}=this,s=t.get("name");let a="<select>";(t.get("options")||[]).forEach(t=>{let n,l,r,o="";e.isString(t)?(n=t,l=t):(n=t.name||t.label||t.value,l=`${e.isUndefined(t.value)?t.id:t.value}`.replace(/"/g,"&quot;"),o+=(r=t.style?t.style.replace(/"/g,"&quot;"):"")?` style="${r}"`:"");const d=i.t(`traitManager.traits.options.${s}.${l}`)||n;a+=`<option value="${l}"${o}>${d}</option>`}),a+="</select>",this.$input=n(a);const l=t.getTargetValue();!e.isUndefined(l)&&this.$input.val(l)}return this.$input.get(0)}})});
//# sourceMappingURL=../../sourcemaps/trait_manager/view/TraitSelectView.js.map
