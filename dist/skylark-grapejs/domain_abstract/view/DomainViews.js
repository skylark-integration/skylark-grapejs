/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","skylark-backbone"],function(e,t){"use strict";return t.View.extend({itemView:"",itemsView:"",itemType:"type",autoAdd:0,initialize(e={},t){this.config=t||e.config||{},this.autoAdd&&this.listenTo(this.collection,"add",this.addTo),this.init()},init(){},addTo(e){this.add(e)},itemViewNotFound(e){const{config:t,ns:i}=this,{em:n}=t,o=`${i?`[${i}]: `:""}'${e}' type not found`;n&&n.logWarning(o)},add(t,i){const{config:n,reuseView:o,itemsView:d={}}=this;var s=i||null,a=this.itemView,r=t.get(this.itemType);let l;d[r]?a=d[r]:!r||d[r]||e.includes(["button","checkbox","color","date","datetime-local","email","file","hidden","image","month","number","password","radio","range","reset","search","submit","tel","text","time","url","week"],r)||this.itemViewNotFound(r);var c=(l=t.view&&o?t.view:new a({model:t,config:n},n)).render().el;s?s.appendChild(c):this.$el.append(c)},render(){var e=document.createDocumentFragment();return this.$el.empty(),this.collection.length&&this.collection.each(function(t){this.add(t,e)},this),this.$el.append(e),this.onRender(),this},onRender(){}})});
//# sourceMappingURL=../../sourcemaps/domain_abstract/view/DomainViews.js.map
