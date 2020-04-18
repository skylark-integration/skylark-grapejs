/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone"],function(e){"use strict";const t=e.$;return{run(e,i){this.sender=i;const n=e.getModel();var s=e.Config.stylePrefix,a=e.TraitManager;if(!this.$cn){var h=a.getTraitsViewer(),d=a.getConfig();this.$cn=t("<div></div>"),this.$cn2=t("<div></div>"),this.$cn.append(this.$cn2),this.$header=t("<div>").append(`<div class="${d.stylePrefix}header">${n.t("traitManager.empty")}</div>`),this.$cn.append(this.$header),this.$cn2.append(`<div class="${s}traits-label">${n.t("traitManager.label")}</div>`),this.$cn2.append(h.render().el);var r=e.Panels;(r.getPanel("views-container")?r.getPanel("views-container"):r.addPanel({id:"views-container"})).set("appendContent",this.$cn.get(0)).trigger("change:appendContent"),this.target=e.getModel(),this.listenTo(this.target,"component:toggled",this.toggleTm)}this.toggleTm()},toggleTm(){const e=this.sender;e&&e.get&&!e.get("active")||(1===this.target.getSelectedAll().length?(this.$cn2.show(),this.$header.hide()):(this.$cn2.hide(),this.$header.show()))},stop(){this.$cn2&&this.$cn2.hide(),this.$header&&this.$header.hide()}}});
//# sourceMappingURL=../../sourcemaps/commands/view/OpenTraitManager.js.map
