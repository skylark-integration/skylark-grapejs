/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone"],function(e){"use strict";return e.Model.extend({build(e,t={}){const o=e.get("components");return t.exportWrapper?e.toHTML({...t.wrapperIsBody&&{tag:"body"}}):this.buildModels(o)},buildModels(e){let t="";return e.each(e=>{t+=e.toHTML()}),t}})});
//# sourceMappingURL=../../sourcemaps/code_manager/model/HtmlGenerator.js.map
