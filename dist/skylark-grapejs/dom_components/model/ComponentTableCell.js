/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./Component"],function(e){"use strict";return e.extend({defaults:{...e.prototype.defaults,type:"cell",tagName:"td",draggable:["tr"]}},{isComponent(e){let t="";const a=e.tagName;return"TD"!=a&&"TH"!=a||(t={type:"cell",tagName:a.toLowerCase()}),t}})});
//# sourceMappingURL=../../sourcemaps/dom_components/model/ComponentTableCell.js.map
