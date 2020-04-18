/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","./Buttons"],function(t,s){"use strict";return t.Model.extend({defaults:{id:"",content:"",visible:!0,buttons:[],attributes:{}},initialize(t){this.btn=this.get("buttons")||[],this.buttons=new s(this.btn),this.set("buttons",this.buttons)}})});
//# sourceMappingURL=../../sourcemaps/panels/model/Panel.js.map
