/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone"],function(e){"use strict";return e.View.extend({initialize(){const{$el:e,model:t}=this;e.data("model",t),t.view=this},_createElement(){return document.createTextNode(this.model.get("content"))}})});
//# sourceMappingURL=../../sourcemaps/dom_components/view/ComponentTextNodeView.js.map
