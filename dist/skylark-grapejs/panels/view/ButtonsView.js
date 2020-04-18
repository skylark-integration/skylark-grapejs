/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","./ButtonView","skylark-underscore"],function(t,e,i){"use strict";return t.View.extend({initialize(t){this.opt=t||{},this.config=this.opt.config||{},this.pfx=this.config.stylePrefix||"",this.parentM=this.opt.parentM||null,this.listenTo(this.collection,"add",this.addTo),this.listenTo(this.collection,"reset remove",this.render),this.className=this.pfx+"buttons"},addTo(t){this.addToCollection(t)},addToCollection(t,i){var s=i||null,n=new e({model:t,config:this.config,parentM:this.parentM}).render().el;return s?s.appendChild(n):this.$el.append(n),n},render(){var t=document.createDocumentFragment();return this.$el.empty(),this.collection.each(function(e){this.addToCollection(e,t)},this),this.$el.append(t),this.$el.attr("class",i.result(this,"className")),this}})});
//# sourceMappingURL=../../sourcemaps/panels/view/ButtonsView.js.map
