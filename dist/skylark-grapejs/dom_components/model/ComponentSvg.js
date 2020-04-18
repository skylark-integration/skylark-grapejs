/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./Component"],function(e){"use strict";return e.extend({defaults:{...e.prototype.defaults,resizable:{ratioDefault:1},highlightable:0},getName(){let e=this.get("tagName"),t=this.get("custom-name");return e=e.charAt(0).toUpperCase()+e.slice(1),t||e}},{isComponent(e){if(SVGElement&&e instanceof SVGElement)return{tagName:e.tagName,type:"svg"}}})});
//# sourceMappingURL=../../sourcemaps/dom_components/model/ComponentSvg.js.map
