/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(function(){"use strict";return{run(e,s,t){var i=t||{},n=i.el||"",r=e.Canvas,o=this.canvasResizer,a=i.options||{},c=r.getCanvasView();return a.appendTo=r.getResizerEl(),a.prefix=e.getConfig().stylePrefix,a.posFetcher=c.getElementPos.bind(c),a.mousePosFetcher=r.getMouseRelativePos,o&&!i.forceNew||(this.canvasResizer=e.Utils.Resizer.init(a),o=this.canvasResizer),o.setOptions(a),o.blur(),o.focus(n),o},stop(){const e=this.canvasResizer;e&&e.blur()}}});
//# sourceMappingURL=../../sourcemaps/commands/view/Resize.js.map
