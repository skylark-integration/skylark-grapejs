/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","skylark-backbone"],function(s,e){"use strict";return e.View.extend({template:s.template('\n  <div class="<%= pfx %>title">\n    <i class="<%= pfx %>caret-icon"></i>\n    <%= label %>\n  </div>\n  <div class="<%= pfx %>blocks-c"></div>\n  '),events:{},initialize(s={},e={}){this.config=e;const t=e.pStylePrefix||"";this.em=e.em,this.pfx=t,this.caretR="fa fa-caret-right",this.caretD="fa fa-caret-down",this.iconClass=`${t}caret-icon`,this.activeClass=`${t}open`,this.className=`${t}block-category`,this.events[`click .${t}title`]="toggle",this.listenTo(this.model,"change:open",this.updateVisibility),this.delegateEvents()},updateVisibility(){this.model.get("open")?this.open():this.close()},open(){this.el.className=`${this.className} ${this.activeClass}`,this.getIconEl().className=`${this.iconClass} ${this.caretD}`,this.getBlocksEl().style.display=""},close(){this.el.className=this.className,this.getIconEl().className=`${this.iconClass} ${this.caretR}`,this.getBlocksEl().style.display="none"},toggle(){var s=this.model;s.set("open",!s.get("open"))},getIconEl(){return this.iconEl||(this.iconEl=this.el.querySelector("."+this.iconClass)),this.iconEl},getBlocksEl(){return this.blocksEl||(this.blocksEl=this.el.querySelector("."+this.pfx+"blocks-c")),this.blocksEl},append(s){this.getBlocksEl().appendChild(s)},render(){const{em:s,el:e,$el:t,model:i}=this,l=s.t(`blockManager.categories.${i.id}`)||i.get("label");return e.innerHTML=this.template({pfx:this.pfx,label:l}),e.className=this.className,t.css({order:i.get("order")}),this.updateVisibility(),this}})});
//# sourceMappingURL=../../sourcemaps/block_manager/view/CategoryView.js.map