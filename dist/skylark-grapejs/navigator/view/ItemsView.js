/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","../../dom_components/model/Component"],function(e,t){"use strict";var i=e.View.extend({initialize(e={}){this.opt=e;const i=e.config||{};this.level=e.level,this.config=i,this.preview=e.preview,this.ppfx=i.pStylePrefix||"",this.pfx=i.stylePrefix||"",this.parent=e.parent,this.parentView=e.parentView;const n=this.pfx,s=this.ppfx,o=this.parent,r=this.collection;this.listenTo(r,"add",this.addTo),this.listenTo(r,"reset resetNavigator",this.render),this.listenTo(r,"remove",this.removeChildren),this.className=`${n}layers`;const l=i.em;if(i.sortable&&!this.opt.sorter){const e=l.get("Utils");this.opt.sorter=new e.Sorter({container:i.sortContainer||this.el,containerSel:`.${this.className}`,itemSel:`.${n}layer`,ignoreViewChildren:1,onEndMove(e,i,n){const s=i.getSourceModel();l.setSelected(s,{forceChange:1}),l.trigger(`${t.eventDrag}:end`,n)},avoidSelectOnEnd:1,nested:1,ppfx:s,pfx:n})}this.sorter=this.opt.sorter||"",this.$el.data("collection",r),o&&this.$el.data("model",o)},removeChildren(e){const t=e.viewLayer;t&&t.remove.apply(t)},addTo(e){var t=this.collection.indexOf(e);this.addToCollection(e,null,t)},addToCollection(e,t,n){const{level:s,parentView:o}=this;var r=t||null,l=new(0,i.ItemView)({level:s,model:e,parentView:o,config:this.config,sorter:this.sorter,isCountable:this.isCountable,opened:this.opt.opened}).render().el;if(r)r.appendChild(l);else if(void 0!==n){var a="before";this.$el.children().length==n&&(n--,a="after"),n<0?this.$el.append(l):this.$el.children().eq(n)[a](l)}else this.$el.append(l);return l},isCountable(e,t){var i=e.get("type"),n=e.get("tagName");return!(("textnode"==i||"br"==n)&&t||!e.get("layerable"))},render(){const e=document.createDocumentFragment(),t=this.el;return t.innerHTML="",this.collection.each(t=>this.addToCollection(t,e)),t.appendChild(e),t.className=this.className,this}});return i});
//# sourceMappingURL=../../sourcemaps/navigator/view/ItemsView.js.map