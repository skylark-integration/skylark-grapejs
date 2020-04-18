/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone"],function(e){"use strict";return e.Model.extend({defaults:{checkLocal:!0},store(e,o){for(var t in this.checkStorageEnvironment(),e)localStorage.setItem(t,e[t]);"function"==typeof o&&o()},load(e,o){this.checkStorageEnvironment();for(var t={},r=0,n=e.length;r<n;r++){var a=localStorage.getItem(e[r]);a&&(t[e[r]]=a)}return"function"==typeof o&&o(t),t},remove(e){this.checkStorageEnvironment();for(var o=0,t=e.length;o<t;o++)localStorage.removeItem(e[o])},checkStorageEnvironment(){this.get("checkLocal")&&!localStorage&&console.warn("Your browser doesn't support localStorage")}})});
//# sourceMappingURL=../../sourcemaps/storage_manager/model/LocalStorage.js.map
