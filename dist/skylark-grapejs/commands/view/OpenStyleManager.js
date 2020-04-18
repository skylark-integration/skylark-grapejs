/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","../../style_manager/index"],function(e,t){"use strict";const n=e.$;return{run(e,t){if(this.sender=t,!this.$cn){var i=e.getConfig(),s=e.Panels;this.$cn=n("<div></div>"),this.$cn2=n("<div></div>"),this.$cn.append(this.$cn2);var a=e.DeviceManager;if(a&&i.showDevices)s.addPanel({id:"devices-c"}).set("appendContent",a.render()).trigger("change:appendContent");var r=e.SelectorManager;r&&this.$cn2.append(r.render([])),this.$cn2.append(e.StyleManager.render());const t=e.StyleManager.getConfig().stylePrefix;this.$header=n(`<div class="${t}header">${e.t("styleManager.empty")}</div>`),this.$cn.append(this.$header),s.getPanel("views-container")?this.panel=s.getPanel("views-container"):this.panel=s.addPanel({id:"views-container"}),this.panel.set("appendContent",this.$cn).trigger("change:appendContent"),this.target=e.editor,this.listenTo(this.target,"component:toggled",this.toggleSm)}this.toggleSm()},toggleSm(){const{target:e,sender:t}=this;if(t&&t.get&&!t.get("active"))return;const{componentFirst:n}=e.get("SelectorManager").getConfig(),i=e.getSelectedAll().length;1===i||i>1&&n?(this.$cn2.show(),this.$header.hide()):(this.$cn2.hide(),this.$header.show())},stop(){this.$cn2&&this.$cn2.hide(),this.$header&&this.$header.hide()}}});
//# sourceMappingURL=../../sourcemaps/commands/view/OpenStyleManager.js.map
