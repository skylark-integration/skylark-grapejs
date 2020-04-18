/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","../../utils/dom"],function(t,e){"use strict";return t.View.extend({initialize(t){this.config=t.config||{},this.pfx=this.config.stylePrefix||"",this.target=t.target||{},this.propTarget=t.propTarget||{},this.onChange=t.onChange,this.onInputRender=t.onInputRender||{},this.customValue=t.customValue||{},this.properties=[];const e=this.collection;this.listenTo(e,"add",this.addTo),this.listenTo(e,"reset",this.render)},addTo(t,e,i){this.add(t,null,i)},add(t,i,s={}){const n=i||this.el,o=new t.typeView({model:t,name:t.get("name"),id:this.pfx+t.get("property"),target:this.target,propTarget:this.propTarget,onChange:this.onChange,onInputRender:this.onInputRender,config:this.config});"composite"!=t.get("type")&&(o.customValue=this.customValue),o.render();const r=o.el;this.properties.push(o),o.updateVisibility(),e.appendAtIndex(n,r,s.at)},render(){const{$el:t}=this;this.properties=[];const e=document.createDocumentFragment();return this.collection.each(t=>this.add(t,e)),t.empty(),t.append(e),t.attr("class",`${this.pfx}properties`),this}})});
//# sourceMappingURL=../../sourcemaps/style_manager/view/PropertiesView.js.map
