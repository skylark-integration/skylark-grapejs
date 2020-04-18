/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","skylark-backbone","./Frame"],function(e,t,i){"use strict";return t.Collection.extend({model:i,initialize(){e.bindAll(this,"itemLoaded")},itemLoaded(){this.loadedItems++,this.loadedItems>=this.itemsToLoad&&(this.trigger("loaded:all"),this.listenToLoadItems(0))},listenToLoad(){this.loadedItems=0,this.itemsToLoad=this.length,this.listenToLoadItems(1)},listenToLoadItems(e){this.forEach(t=>t[e?"on":"off"]("loaded",this.itemLoaded))}})});
//# sourceMappingURL=../../sourcemaps/canvas/model/Frames.js.map
