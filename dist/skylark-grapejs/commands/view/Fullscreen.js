/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore"],function(e){"use strict";return{isEnabled(){var e=document;return e.fullscreenElement||e.webkitFullscreenElement||e.mozFullScreenElement?1:0},enable(e){var n="";return e.requestFullscreen?e.requestFullscreen():e.webkitRequestFullscreen?(n="webkit",e.webkitRequestFullscreen()):e.mozRequestFullScreen?(n="moz",e.mozRequestFullScreen()):e.msRequestFullscreen?e.msRequestFullscreen():console.warn("Fullscreen not supported"),n},disable(){const e=document;this.isEnabled()&&(e.exitFullscreen?e.exitFullscreen():e.webkitExitFullscreen?e.webkitExitFullscreen():e.mozCancelFullScreen?e.mozCancelFullScreen():e.msExitFullscreen&&e.msExitFullscreen())},fsChanged(e,n){document;var s=(e||"")+"fullscreenchange";this.isEnabled()||(this.stop(null,this.sender),document.removeEventListener(s,this.fsChanged))},run(n,s,t={}){this.sender=s;const{target:l}=t,r=e.isElement(l)?l:document.querySelector(l),u=this.enable(r||n.getContainer());this.fsChanged=this.fsChanged.bind(this,u),document.addEventListener(u+"fullscreenchange",this.fsChanged),n.trigger("change:canvasOffset")},stop(e,n){n&&n.set&&n.set("active",!1),this.disable(),e&&e.trigger("change:canvasOffset")}}});
//# sourceMappingURL=../../sourcemaps/commands/view/Fullscreen.js.map
