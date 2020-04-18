/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone/Collection","./AssetImage","./../view/AssetImageView","../../domain_abstract/model/TypeableCollection"],function(e,t,i,s){"use strict";return e.extend(s).extend({types:[{id:"image",model:t,view:i,isType:e=>"string"==typeof e?{type:"image",src:e}:e}]})});
//# sourceMappingURL=../../sourcemaps/asset_manager/model/Assets.js.map
