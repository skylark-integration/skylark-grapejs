/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","./TraitView"],function(t,e){"use strict";return e.extend({events:{"click button":"handleClick"},templateInput:"",handleClick(){const{model:e,em:n}=this,l=e.get("command");l&&(t.isString(l)?n.get("Commands").run(l):l(n.get("Editor"),e))},renderLabel(){this.model.get("label")&&e.prototype.renderLabel.apply(this,arguments)},getInputEl(){const{model:t,ppfx:e}=this,{labelButton:n,text:l,full:r}=t.props(),o=`${e}btn`;return`<button type="button" class="${o}-prim${r?` ${o}--full`:""}">${n||l}</button>`}})});
//# sourceMappingURL=../../sourcemaps/trait_manager/view/TraitButtonView.js.map
