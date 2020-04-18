/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["domain_abstract/view/DomainViews","./TraitView","./TraitSelectView","./TraitCheckboxView","./TraitNumberView","./TraitColorView","./TraitButtonView"],function(t,e,i,s,o,n,c){"use strict";return t.extend({ns:"Traits",itemView:e,reuseView:1,itemsView:{text:e,number:o,select:i,checkbox:s,color:n,button:c},initialize(t={}){const e=t.config||{};this.config=e,this.em=t.editor,this.pfx=e.stylePrefix||"",this.ppfx=e.pStylePrefix||"",this.className=this.pfx+"traits";this.listenTo(this.em,"component:toggled",this.updatedCollection),this.updatedCollection()},updatedCollection(){const t=this.ppfx,e=this.em.getSelected();this.el.className=`${this.className} ${t}one-bg ${t}two-color`,this.collection=e?e.get("traits"):[],this.render()}})});
//# sourceMappingURL=../../sourcemaps/trait_manager/view/TraitsView.js.map
