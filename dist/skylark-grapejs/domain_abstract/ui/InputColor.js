/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","skylark-underscore","../../utils/ColorPicker","./Input"],function(e,t,o,s){"use strict";const l=e.$;return o(l),s.extend({template(){const e=this.ppfx;return`\n      <div class="${this.holderClass()}"></div>\n      <div class="${e}field-colorp">\n        <div class="${e}field-colorp-c" data-colorp-c>\n          <div class="${e}checker-bg"></div>\n        </div>\n      </div>\n    `},inputClass(){const e=this.ppfx;return`${e}field ${e}field-color`},holderClass(){return`${this.ppfx}input-holder`},setValue(e,o={}){const s=this.model.get("defaults"),l=t.isUndefined(e)?t.isUndefined(s)?"":s:e,n=this.getInputEl(),r=this.getColorEl(),i="none"!=l?l:"";n.value=l,r.get(0).style.backgroundColor=i,o.fromTarget&&(r.spectrum("set",i),this.noneColor="none"==l)},getColorEl(){if(!this.colorEl){const r=this,i=this.ppfx;var e=this.model,t=l(`<div class="${this.ppfx}field-color-picker"></div>`),o=t.get(0).style,s=this.em&&this.em.config?this.em.config.el:"",n=this.em&&this.em.getConfig&&this.em.getConfig("colorPicker")||{};const c=e=>{return(1==e.getAlpha()?e.toHexString():e.toRgbString()).replace(/ /g,"")};let a,d=0;this.$el.find("[data-colorp-c]").append(t),t.spectrum({containerClassName:`${i}one-bg ${i}two-color`,appendTo:s||"body",maxSelectionSize:8,showPalette:!0,showAlpha:!0,chooseText:"Ok",cancelText:"⨯",palette:[],...n,move(t){const s=c(t);o.backgroundColor=s,e.setValueFromInput(s,0)},change(t){d=1;const s=c(t);o.backgroundColor=s,e.setValueFromInput(0,0),e.setValueFromInput(s),r.noneColor=0},show(e){d=0,a=c(e)},hide(s){!d&&a&&(r.noneColor&&(a=""),o.backgroundColor=a,t.spectrum("set",a),e.setValueFromInput(a,0))}}),this.colorEl=t}return this.colorEl},render(){return s.prototype.render.call(this),this.getColorEl(),this}})});
//# sourceMappingURL=../../sourcemaps/domain_abstract/ui/InputColor.js.map