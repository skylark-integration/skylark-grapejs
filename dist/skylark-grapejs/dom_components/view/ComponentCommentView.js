/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./ComponentTextNodeView"],function(e){"use strict";return e.extend({_createElement(){return document.createComment(this.model.get("content"))}})});
//# sourceMappingURL=../../sourcemaps/dom_components/view/ComponentCommentView.js.map
