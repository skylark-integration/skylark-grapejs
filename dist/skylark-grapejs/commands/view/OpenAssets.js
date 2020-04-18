/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(function(){"use strict";return{run(e,t,n={}){const i=e.Modal,l=e.AssetManager,o=l.getConfig(),r=l.getContainer(),s=n.modalTitle||e.t("assetManager.modalTitle")||"",c=n.types,a=n.accept;if(l.setTarget(n.target),l.onClick(n.onClick),l.onDblClick(n.onDblClick),l.onSelect(n.onSelect),!this.rendered||c){let e=l.getAll().filter(e=>1);c&&c.length&&(e=e.filter(e=>-1!==c.indexOf(e.get("type")))),l.render(e),this.rendered=1}if(a){const e=r.querySelector(`input#${o.stylePrefix}uploadFile`);e&&e.setAttribute("accept",a)}return i.open({title:s,content:r}).getModel().once("change:open",()=>e.stopCommand(this.id)),this},stop(e){return e.Modal.close(),this}}});
//# sourceMappingURL=../../sourcemaps/commands/view/OpenAssets.js.map
