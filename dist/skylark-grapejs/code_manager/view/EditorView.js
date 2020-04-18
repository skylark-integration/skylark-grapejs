/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","skylark-backbone"],function(i,t){"use strict";return t.View.extend({template:i.template('\n  <div class="<%= pfx %>editor" id="<%= pfx %><%= codeName %>">\n  \t<div id="<%= pfx %>title"><%= label %></div>\n  \t<div id="<%= pfx %>code"></div>\n  </div>'),initialize(i){this.config=i.config||{},this.pfx=this.config.stylePrefix},render(){var i=this.model.toJSON();return i.pfx=this.pfx,this.$el.html(this.template(i)),this.$el.attr("class",this.pfx+"editor-c"),this.$el.find("#"+this.pfx+"code").append(this.model.get("input")),this}})});
//# sourceMappingURL=../../sourcemaps/code_manager/view/EditorView.js.map
