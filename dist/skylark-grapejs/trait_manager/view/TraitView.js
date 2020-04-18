/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","skylark-underscore","utils/mixins"],function(t,e,i){"use strict";const s=t.$;return t.View.extend({events:{},eventCapture:["change"],appendInput:1,attributes(){return this.model.get("attributes")},templateLabel(){const{ppfx:t}=this,e=this.getLabel();return`<div class="${t}label" title="${e}">${e}</div>`},templateInput(){const{clsField:t}=this;return`<div class="${t}" data-input></div>`},initialize(t={}){const{config:e={}}=t,{model:i,eventCapture:s}=this,{target:n}=i,{type:l}=i.attributes;this.config=e,this.em=e.em,this.pfx=e.stylePrefix||"",this.ppfx=e.pStylePrefix||"",this.target=n;const{ppfx:a}=this;this.clsField=`${a}field ${a}field-${l}`,[["change:value",this.onValueChange],["remove",this.removeView]].forEach(([t,e])=>{i.off(t,e),this.listenTo(i,t,e)}),i.view=this,this.listenTo(i,"change:label",this.render),this.listenTo(i,"change:placeholder",this.rerender),s.forEach(t=>this.events[t]="onChange"),this.delegateEvents(),this.init()},getClbOpts(){return{component:this.target,trait:this.model,elInput:this.getInputElem()}},removeView(){this.remove(),this.removed()},init(){},removed(){},onRender(){},onUpdate(){},onEvent(){},onChange(t){const i=this.getInputElem();i&&!e.isUndefined(i.value)&&this.model.set("value",i.value),this.onEvent({...this.getClbOpts(),event:t})},getValueForTarget(){return this.model.get("value")},setInputValue(t){const e=this.getInputElem();e&&(e.value=t)},onValueChange(t,e,i={}){if(i.fromTarget)this.setInputValue(t.get("value")),this.postUpdate();else{const e=this.getValueForTarget();t.setTargetValue(e,i)}},renderLabel(){const{$el:t,target:e}=this,i=this.getLabel();let s=this.templateLabel(e);this.createLabel&&(s=this.createLabel({label:i,component:e,trait:this})||""),t.find("[data-label]").append(s)},getLabel(){const{em:t}=this,{label:e,name:s}=this.model.attributes;return t.t(`traitManager.traits.labels.${s}`)||i.capitalize(e||s).replace(/-/g," ")},getComponent(){return this.target},getInputEl(){if(!this.$input){const{em:t,model:i}=this,n=i,{name:l}=i.attributes,a=n.get("placeholder")||n.get("default")||"",r=n.get("type")||"text",h=n.get("min"),p=n.get("max"),u=this.getModelValue(),o=s(`<input type="${r}" placeholder="${a}">`),d=t.t(`traitManager.traits.attributes.${l}`)||{};o.attr(d),e.isUndefined(u)||(n.set({value:u},{silent:!0}),o.prop("value",u)),h&&o.prop("min",h),p&&o.prop("max",p),this.$input=o}return this.$input.get(0)},getInputElem(){const{input:t,$input:e}=this;return t||e&&e.get&&e.get(0)||this.getElInput()},getModelValue(){let t;const i=this.model,s=this.target,n=i.get("name");if(i.get("changeProp"))t=s.get(n);else{const e=s.get("attributes");t=i.get("value")||e[n]}return e.isUndefined(t)?"":t},getElInput(){return this.elInput},renderField(){const{$el:t,appendInput:i,model:s}=this,n=t.find("[data-input]"),l=n[n.length-1];let a=s.el;a||(a=this.createInput?this.createInput(this.getClbOpts()):this.getInputEl()),e.isString(a)?(l.innerHTML=a,this.elInput=l.firstChild):(i?l.appendChild(a):l.insertBefore(a,l.firstChild),this.elInput=a),s.el=this.elInput},hasLabel(){const{label:t}=this.model.attributes;return!this.noLabel&&!1!==t},rerender(){this.model.el=null,this.render()},postUpdate(){this.onUpdate(this.getClbOpts())},render(){const{$el:t,pfx:i,ppfx:s,model:n}=this,{type:l}=n.attributes,a=this.hasLabel&&this.hasLabel(),r=`${i}trait`;this.$input=null;let h=`<div class="${r}">\n      ${a?`<div class="${s}label-wrp" data-label></div>`:""}\n      <div class="${s}field-wrp ${s}field-wrp--${l}" data-input>\n        ${this.templateInput?e.isFunction(this.templateInput)?this.templateInput(this.getClbOpts()):this.templateInput:""}\n      </div>\n    </div>`;return t.empty().append(h),a&&this.renderLabel(),this.renderField(),this.el.className=`${r}__wrp`,this.postUpdate(),this.onRender(this.getClbOpts()),this}})});
//# sourceMappingURL=../../sourcemaps/trait_manager/view/TraitView.js.map
