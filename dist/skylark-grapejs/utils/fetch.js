/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define([],function(){"use strict";return"function"==typeof fetch?fetch.bind():(e,t)=>new Promise((s,o)=>{const n=new XMLHttpRequest;n.open(t.method||"get",e),n.withCredentials="include"==t.credentials;for(let e in t.headers||{})n.setRequestHeader(e,t.headers[e]);n.onload=(e=>s({status:n.status,statusText:n.statusText,text:()=>Promise.resolve(n.responseText)})),n.onerror=o,n.upload&&t.onProgress&&(n.upload.onprogress=t.onProgress),t.body?n.send(t.body):n.send()})});
//# sourceMappingURL=../sourcemaps/utils/fetch.js.map
