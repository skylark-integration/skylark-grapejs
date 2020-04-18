/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone"],function(e){"use strict";return e.View.extend({tagName:"style",initialize(e={}){this.config=e.config||{};const t=this.model;this.listenTo(t,"change:style change:state change:mediaText",this.render),this.listenTo(t,"destroy remove",this.remove),this.listenTo(t.get("selectors"),"change",this.render)},render(){const e=this.model.get("important");return this.el.innerHTML=this.model.toCSS({important:e}),this}})});
//# sourceMappingURL=../../sourcemaps/css_composer/view/CssRuleView.js.map
