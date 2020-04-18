/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","./AssetView"],function(e,t){"use strict";return t.extend({events:{"click [data-toggle=asset-remove]":"onRemove",click:"onClick",dblclick:"onDblClick"},getPreview(){const e=this.pfx;return`\n      <div class="${e}preview" style="background-image: url('${this.model.get("src")}');"></div>\n      <div class="${e}preview-bg ${this.ppfx}checker-bg"></div>\n    `},getInfo(){const e=this.pfx,t=this.model;let i=t.get("name"),s=t.get("width"),n=t.get("height"),l=t.get("unitDim"),o=s&&n?`${s}x${n}${l}`:"";return`\n      <div class="${e}name">${i=i||t.getFilename()}</div>\n      <div class="${e}dimensions">${o}</div>\n    `},init(e){const t=this.pfx;this.className+=` ${t}asset-image`},onClick(){var t=this.config.onClick,i=this.model;this.collection.trigger("deselectAll"),this.$el.addClass(this.pfx+"highlight"),e.isFunction(t)?t(i):this.updateTarget(this.collection.target)},onDblClick(){const{em:t,model:i}=this,s=this.config.onDblClick;e.isFunction(s)?s(i):(this.updateTarget(this.collection.target),t&&t.get("Modal").close());var n=this.collection.onSelect;e.isFunction(n)&&n(i)},onRemove(e){e.stopImmediatePropagation(),this.model.collection.remove(this.model)}})});
//# sourceMappingURL=../../sourcemaps/asset_manager/view/AssetImageView.js.map
