/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","./ComponentView"],function(t,e){"use strict";return e.extend({tagName:"img",events:{dblclick:"onActive",click:"initResize",error:"onError",dragstart:"noDrag"},initialize(t){const s=this.model;e.prototype.initialize.apply(this,arguments),this.listenTo(s,"change:src",this.updateSrc),this.classEmpty=`${this.ppfx}plh-image`;const i=this.config;i.modal&&(this.modal=i.modal),i.am&&(this.am=i.am),this.fetchFile()},fetchFile(){if(this.modelOpt.temporary)return;const e=this.model,s=e.get("file");if(s){this.em.get("AssetManager").FileUploader().uploadFile({dataTransfer:{files:[s]}},s=>{const i=s&&s.data&&s.data[0],a=i&&(t.isString(i)?i:i.src);a&&e.set({src:a})}),e.set("file","")}},updateSrc(){const{model:t,classEmpty:e,$el:s}=this,i=t.getSrcResult(),a=i&&!t.isDefaultSrc();t.addAttributes({src:i}),s[a?"removeClass":"addClass"](e)},onActive(t){t&&t.stopPropagation();var e=this.opts.config.em,s=e?e.get("Editor"):"";s&&this.model.get("editable")&&s.runCommand("open-assets",{target:this.model,types:["image"],accept:"image/*",onSelect(){s.Modal.close(),s.AssetManager.setTarget(null)}})},onError(){const t=this.model.getSrcResult({fallback:1});t&&(this.el.src=t)},noDrag:t=>(t.preventDefault(),!1),render(){this.renderAttributes(),this.updateSrc();const{$el:t,model:e}=this,s=t.attr("class")||"";return!e.get("src")&&t.attr("class",`${s} ${this.classEmpty}`.trim()),this.postRender(),this}})});
//# sourceMappingURL=../../sourcemaps/dom_components/view/ComponentImageView.js.map
