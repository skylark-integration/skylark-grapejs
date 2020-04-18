/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","./CssRule"],function(e,t){"use strict";return e.Collection.extend({initialize(e,i){i&&i.em&&(this.editor=i.em),this.model=((e,r)=>{return!r.em&&i&&i.em&&(r.em=i.em),new t(e,r)})},add(t,i={}){return"string"==typeof t&&(t=this.editor.get("Parser").parseCss(t)),i.em=this.editor,e.Collection.prototype.add.apply(this,[t,i])}})});
//# sourceMappingURL=../../sourcemaps/css_composer/model/CssRules.js.map
