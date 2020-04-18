/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","skylark-underscore"],function(t,e){"use strict";return t.View.extend({initialize(t={}){this.options=t,this.collection=t.collection;const e=t.config||{};this.config=e,this.pfx=e.stylePrefix||"",this.ppfx=e.pStylePrefix||"",this.em=e.em,this.className=this.pfx+"asset",this.listenTo(this.model,"destroy remove",this.remove),this.model.view=this;const s=this.init&&this.init.bind(this);s&&s(t)},template(){const t=this.pfx;return`\n      <div class="${t}preview-cont">\n        ${this.getPreview()}\n      </div>\n      <div class="${t}meta">\n        ${this.getInfo()}\n      </div>\n      <div class="${t}close" data-toggle="asset-remove">\n        &Cross;\n      </div>\n    `},updateTarget(t){t&&t.set&&(t.set("attributes",e.clone(t.get("attributes"))),t.set("src",this.model.get("src")))},getPreview:()=>"",getInfo:()=>"",render(){const t=this.el;return t.innerHTML=this.template(this,this.model),t.className=this.className,this}})});
//# sourceMappingURL=../../sourcemaps/asset_manager/view/AssetView.js.map
