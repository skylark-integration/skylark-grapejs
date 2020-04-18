/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","skylark-backbone"],function(e,t){"use strict";return t.Model.extend({build(i){var n=i.toJSON();return this.beforeEach(n),e.each(n,function(e,i){var s=n[i];if(s instanceof t.Model)n[i]=this.build(s);else if(s instanceof t.Collection){var o=s;n[i]=[],o.length&&o.each(function(e,t){n[i][t]=this.build(e)},this)}},this),n},beforeEach(e){delete e.status}})});
//# sourceMappingURL=../../sourcemaps/code_manager/model/JsonGenerator.js.map
