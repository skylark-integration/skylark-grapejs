/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(function(){"use strict";return(t={})=>({build(e){var r=[];"string"==typeof e&&(e=[e]);for(var s=0;s<e.length;s++){var n={},a=e[s];switch(n.name=a,a){case"target":n.type="select"}switch(a){case"target":n.options=t.optionsTarget}r.push(n)}return r}})});
//# sourceMappingURL=../../sourcemaps/trait_manager/model/TraitFactory.js.map
