/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","./PanelView"],function(e,t){"use strict";return e.View.extend({initialize(e){this.opt=e||{},this.config=this.opt.config||{},this.pfx=this.config.stylePrefix||"";const t=this.collection;this.listenTo(t,"add",this.addTo),this.listenTo(t,"reset",this.render),this.listenTo(t,"remove",this.onRemove),this.className=this.pfx+"panels"},onRemove(e){const t=e.view;t&&t.remove()},addTo(e){this.addToCollection(e)},addToCollection(e,i){const n=i||null,s=this.config,o=e.get("el"),l=new t({el:o,model:e,config:s}),c=l.render().el,d=e.get("appendTo");if(o);else if(d){document.querySelector(d).appendChild(c)}else n?n.appendChild(c):this.$el.append(c);return l.initResize(),c},render(){const e=this.$el,t=document.createDocumentFragment();return e.empty(),this.collection.each(e=>this.addToCollection(e,t)),e.append(t),e.attr("class",this.className),this}})});
//# sourceMappingURL=../../sourcemaps/panels/view/PanelsView.js.map
