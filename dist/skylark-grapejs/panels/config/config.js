/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(function(){"use strict";const t="sw-visibility",e="export-template",a="open-layers",s="open-blocks",i="fullscreen",l="preview";return{stylePrefix:"pn-",defaults:[{id:"commands",buttons:[{}]},{id:"options",buttons:[{active:!0,id:t,className:"fa fa-square-o",command:t,context:t,attributes:{title:"View components"}},{id:l,className:"fa fa-eye",command:l,context:l,attributes:{title:"Preview"}},{id:i,className:"fa fa-arrows-alt",command:i,context:i,attributes:{title:"Fullscreen"}},{id:e,className:"fa fa-code",command:e,attributes:{title:"View code"}}]},{id:"views",buttons:[{id:"open-sm",className:"fa fa-paint-brush",command:"open-sm",active:!0,togglable:0,attributes:{title:"Open Style Manager"}},{id:"open-tm",className:"fa fa-cog",command:"open-tm",togglable:0,attributes:{title:"Settings"}},{id:a,className:"fa fa-bars",command:a,togglable:0,attributes:{title:"Open Layer Manager"}},{id:s,className:"fa fa-th-large",command:s,togglable:0,attributes:{title:"Open Blocks"}}]}],em:null,delayBtnsShow:300}});
//# sourceMappingURL=../../sourcemaps/panels/config/config.js.map
