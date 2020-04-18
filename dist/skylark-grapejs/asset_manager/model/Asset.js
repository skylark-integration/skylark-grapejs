/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone/Model"],function(e){"use strict";return e.extend({idAttribute:"src",defaults:{type:"",src:""},getFilename(){return this.get("src").split("/").pop()},getExtension(){return this.getFilename().split(".").pop()}})});
//# sourceMappingURL=../../sourcemaps/asset_manager/model/Asset.js.map
