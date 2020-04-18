/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./PropertyView"],function(e){"use strict";return e.extend({templateInput(){this.pfx;const e=this.ppfx;return`\n      <div class="${e}field ${e}field-radio">\n      </div>\n    `},onRender(){const e=this.pfx,t=this.ppfx,i=`${t}radio-item-label`,l=this.model,s=l.get("property"),n=l.get("list")||l.get("options")||[],{cid:a}=l,c=`${e}radio ${e}radio-${s}`;if(!this.input&&n&&n.length){let l="";n.forEach(n=>{let r=n.className?`${n.className} ${e}icon ${i}`:"",d=`${s}-${n.value}-${a}`,o=n.name||n.value,u=n.title?`title="${n.title}"`:"";l+=`\n            <div class="${t}radio-item">\n              <input type="radio" class="${c}" id="${d}" name="${s}-${a}" value="${n.value}"/>\n              <label class="${r||i}" ${u} for="${d}">${r?"":o}</label>\n            </div>\n          `});const r=this.el.querySelector(`.${t}field`);r.innerHTML=`<div class="${t}radio-items">${l}</div>`,this.input=r.firstChild}},getInputValue(){const e=this.getCheckedEl();return e?e.value:""},getCheckedEl(){const e=this.getInputEl();return e?e.querySelector("input:checked"):""},setValue(e){const t=this.model;let i=e||t.get("value")||t.getDefaultValue();const l=this.getInputEl(),s=l?l.querySelector(`[value="${i}"]`):"";if(s)s.checked=!0;else{const e=this.getCheckedEl();e&&(e.checked=!1)}}})});
//# sourceMappingURL=../../sourcemaps/style_manager/view/PropertyRadioView.js.map
