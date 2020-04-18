/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["../../domain_abstract/view/DomainViews","./ToolbarButtonView"],function(i,e){"use strict";return i.extend({itemView:e,initialize(i={}){this.config={editor:i.editor||"",em:i.em},this.listenTo(this.collection,"reset",this.render)}})});
//# sourceMappingURL=../../sourcemaps/dom_components/view/ToolbarView.js.map
