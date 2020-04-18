/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","skylark-backbone"],function(e,t){"use strict";return t.Model.extend({build(n){var i=n.toJSON();return this.beforeEach(i),e.each(i,function(e,n){var s=i[n];if(s instanceof t.Model)i[n]=this.build(s);else if(s instanceof t.Collection){var o=s;i[n]=[],o.length&&o.undefined(function(e,t){i[n][t]=this.build(e)},this)}},this),i},beforeEach(e){delete e.status}})});
//# sourceMappingURL=../../sourcemaps/code_manager/model/JsonGenerator.js.map
