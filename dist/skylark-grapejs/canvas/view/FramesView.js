/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["../../domain_abstract/view/DomainViews","./FrameWrapView"],function(e,t){"use strict";return e.extend({itemView:t,autoAdd:1,init(){this.listenTo(this.collection,"reset",this.render)},onRender(){const{config:e,$el:t}=this,{em:i}=e;i&&t.attr({class:`${i.getConfig("stylePrefix")}frames`})}})});
//# sourceMappingURL=../../sourcemaps/canvas/view/FramesView.js.map
