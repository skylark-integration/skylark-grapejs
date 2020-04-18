/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","./Category"],function(e,t){"use strict";return e.Model.extend({defaults:{activate:0,select:0,resetId:0,label:"",media:"",content:"",category:"",attributes:{}},initialize(e={}){let i=this.get("category");if(i&&"string"==typeof i)new t({id:i,label:i})}})});
//# sourceMappingURL=../../sourcemaps/block_manager/model/Block.js.map
