/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(function(){"use strict";return()=>{if((()=>{let e;const t=window.navigator.userAgent,n=[["edge",/Edge\/([0-9\._]+)/],["ie",/MSIE\s(7\.0)/],["ie",/MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],["ie",/Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/]];for(let o=0;o<n.length&&!(e=n[o][1].exec(t));o++);return!!e})()){const e=DOMImplementation.prototype.createHTMLDocument;DOMImplementation.prototype.createHTMLDocument=(t=>(t||(t=""),e.apply(document.implementation,[t])))}}});
//# sourceMappingURL=../sourcemaps/utils/polyfills.js.map
