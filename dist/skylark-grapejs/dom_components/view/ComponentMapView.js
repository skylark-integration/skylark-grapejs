/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","./ComponentImageView"],function(e,t){"use strict";return t.extend({tagName:"div",events:{},initialize(e){t.prototype.initialize.apply(this,arguments),this.classEmpty=this.ppfx+"plh-map"},updateSrc(){this.getIframe().src=this.model.get("src")},getIframe(){if(!this.iframe){var e=document.createElement("iframe");e.src=this.model.get("src"),e.frameBorder=0,e.style.height="100%",e.style.width="100%",e.className=this.ppfx+"no-pointer",this.iframe=e}return this.iframe},render(...e){return t.prototype.render.apply(this,e),this.updateClasses(),this.el.appendChild(this.getIframe()),this}})});
//# sourceMappingURL=../../sourcemaps/dom_components/view/ComponentMapView.js.map
