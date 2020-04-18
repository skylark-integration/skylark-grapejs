/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./CssRuleView"],function(e){"use strict";return e.extend({_createElement:function(e){return document.createTextNode("")},render(){const e=this.model,t=e.get("important");return this.el.textContent=e.getDeclaration({important:t}),this}})});
//# sourceMappingURL=../../sourcemaps/css_composer/view/CssGroupRuleView.js.map
