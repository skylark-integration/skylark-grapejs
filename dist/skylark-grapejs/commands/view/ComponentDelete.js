/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore"],function(e){"use strict";return{run(r,n,t={}){let l=t.component||r.getSelectedAll();return l=e.isArray(l)?[...l]:[l],r.select(null),l.forEach(e=>{if(!e||!e.get("removable"))return this.em.logWarning("The element is not removable",{component:e});e.remove()}),l}}});
//# sourceMappingURL=../../sourcemaps/commands/view/ComponentDelete.js.map
