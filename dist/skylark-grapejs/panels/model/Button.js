/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone"],function(t){"use strict";return t.Model.extend({defaults:{id:"",label:"",tagName:"span",className:"",command:"",context:"",buttons:[],attributes:{},options:{},active:!1,dragDrop:!1,togglable:!0,runDefaultCommand:!0,stopDefaultCommand:!1,disable:!1},initialize(t){if(this.get("buttons").length){var e=require("./Buttons").default;this.set("buttons",new e(this.get("buttons")))}}})});
//# sourceMappingURL=../../sourcemaps/panels/model/Button.js.map
