/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore"],function(e){"use strict";return{run(t){const c=t.getModel().get("clipboard"),n=t.getSelected();c&&n&&(t.getSelectedAll().forEach(n=>{if(!n)return;const o=n.collection,r=o.indexOf(n)+1,a=c.filter(e=>e.get("copyable"));let l;l=e.contains(c,n)&&n.get("copyable")?o.add(n.clone(),{at:r}):o.add(a.map(e=>e.clone()),{at:r}),(l=e.isArray(l)?l:[l]).forEach(e=>t.trigger("component:paste",e))}),n.emitUpdate())}}});
//# sourceMappingURL=../../sourcemaps/commands/view/PasteComponent.js.map
