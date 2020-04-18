/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","skylark-backbone","./PropertiesView"],function(e,t,i){"use strict";return t.View.extend({events:{click:"active","click [data-close-layer]":"remove","mousedown [data-move-layer]":"initSorter","touchstart [data-move-layer]":"initSorter"},template(e){const{pfx:t,ppfx:i,em:s}=this;return`\n      <div id="${t}move" class="${i}no-touch-actions" data-move-layer>\n        <i class="fa fa-arrows"></i>\n      </div>\n      <div id="${t}label">${`${s&&s.t("styleManager.layer")} ${e.get("index")}`}</div>\n      <div id="${t}preview-box">\n      \t<div id="${t}preview" data-preview></div>\n      </div>\n      <div id="${t}close-layer" class="${t}btn-close" data-close-layer>\n        &Cross;\n      </div>\n      <div id="${t}inputs" data-properties></div>\n      <div style="clear:both"></div>\n    `},initialize(e={}){let t=this.model;this.stackModel=e.stackModel,this.config=e.config||{},this.em=this.config.em,this.pfx=this.config.stylePrefix||"",this.ppfx=this.config.pStylePrefix||"",this.sorter=e.sorter||null,this.propsConfig=e.propsConfig||{},this.customPreview=e.onPreview,this.listenTo(t,"destroy remove",this.remove),this.listenTo(t,"change:active",this.updateVisibility),this.listenTo(t.get("properties"),"change",this.updatePreview),t.view=this,t.set({droppable:0,draggable:1}),this.$el.data("model",t)},initSorter(e){this.sorter&&this.sorter.startSort(this.el)},remove(e){e&&e.stopPropagation&&e.stopPropagation();const i=this.model,s=i.collection,r=this.stackModel;t.View.prototype.remove.apply(this,arguments),s.contains(i)&&s.remove(i),r&&r.set&&(r.set({stackIndex:null},{silent:!0}),r.trigger("updateValue"))},onPreview(e){const{stackModel:t}=this,i=t&&t.get("detached"),s=e.split(" "),r=[],o={};return this.model.get("properties").undefined((e,t)=>{const a=e.get("property");let l=i?e.getFullValue():s[t]||"";if(l&&"integer"==e.get("type")){let e=parseInt(l,10),t=l.replace(e,"");l=(e=(e=(e=isNaN(e)?0:e)>3?3:e)<-3?-3:e)+t}r.push(l),o[a]=l}),i?o:r.join(" ")},updatePreview(){const t=this.stackModel,i=this.customPreview,s=this.getPreviewEl(),r=this.model.getFullValue(),o=i?i(r):this.onPreview(r);if(o&&t&&s){const{style:i}=s;if(e.isString(o))i[t.get("property")]=o;else{let t=[];e.each(o,(e,i)=>t.push(`${i}:${e}`)),s.setAttribute("style",t.join(";"))}}},getPropertiesWrapper(){return this.propsWrapEl||(this.propsWrapEl=this.el.querySelector("[data-properties]")),this.propsWrapEl},getPreviewEl(){return this.previewEl||(this.previewEl=this.el.querySelector("[data-preview]")),this.previewEl},active(){const e=this.model,t=e.collection;t.active(t.indexOf(e))},updateVisibility(){const e=this.pfx,t=this.getPropertiesWrapper(),i=this.model.get("active");t.style.display=i?"":"none",this.$el[i?"addClass":"removeClass"](`${e}active`)},render(){const e=this.propsConfig,{model:t,el:s,pfx:r}=this,o=t.get("preview"),a=new i({collection:t.get("properties"),config:this.config,target:e.target,customValue:e.customValue,propTarget:e.propTarget,onChange:e.onChange}).render().el;return s.innerHTML=this.template(t),s.className=`${r}layer${o?"":` ${r}no-preview`}`,this.getPropertiesWrapper().appendChild(a),this.updateVisibility(),this.updatePreview(),this}})});
//# sourceMappingURL=../../sourcemaps/style_manager/view/LayerView.js.map
