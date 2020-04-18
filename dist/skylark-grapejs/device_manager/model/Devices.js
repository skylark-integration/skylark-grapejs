/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","./Device"],function(e,t){"use strict";return e.Collection.extend({model:t,comparator:(e,t)=>{const r=Number.MAX_VALUE;return(t.get("priority")||r)-(e.get("priority")||r)},getSorted(){return this.sort()}})});
//# sourceMappingURL=../../sourcemaps/device_manager/model/Devices.js.map
