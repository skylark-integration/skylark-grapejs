/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","./PropertyView"],function(t,e){"use strict";t.$;return e.extend({templateInput(){const t=this.pfx,e=this.ppfx;return`\n      <div class="${e}field ${e}select">\n        <span id="${t}input-holder"></span>\n        <div class="${e}sel-arrow">\n          <div class="${e}d-s-arrow"></div>\n        </div>\n      </div>\n    `},initialize(...t){e.prototype.initialize.apply(this,t),this.listenTo(this.model,"change:options",this.updateOptions)},updateOptions(){this.input=null,this.onRender()},onRender(){var t=this.pfx;const e=this.model.getOptions();if(!this.input){let i="";e.forEach(t=>{let e=t.name||t.value,n=t.style?t.style.replace(/"/g,"&quot;"):"",s=n?`style="${n}"`:"",l=t.value.replace(/"/g,"&quot;");i+=`<option value="${l}" ${s}>${e}</option>`});const n=this.el.querySelector(`#${t}input-holder`);n.innerHTML=`<select>${i}</select>`,this.input=n.firstChild}}})});
//# sourceMappingURL=../../sourcemaps/style_manager/view/PropertySelectView.js.map
