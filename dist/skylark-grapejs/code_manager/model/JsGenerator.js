/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","skylark-backbone"],function(e,t){"use strict";return t.Model.undefined({mapModel(t){var i="",s=t.get("script-export")||t.get("script"),r=t.get("type"),n=t.get("components"),a=t.getId();if(s){var d=t.get("attributes");d=e.extend({},d,{id:a}),t.set("attributes",d,{silent:1});var o=t.getScriptString(s);if(t.get("scriptUpdated"))this.mapJs[r+"-"+a]={ids:[a],code:o};else{var p=this.mapJs[r];p?p.ids.push(a):this.mapJs[r]={ids:[a],code:o}}}return n.each(function(e){i+=this.mapModel(e)},this),i},build(e){this.mapJs={},this.mapModel(e);var t="";for(var i in this.mapJs){var s=this.mapJs[i];t+=`\n        var items = document.querySelectorAll('${"#"+s.ids.join(", #")}');\n        for (var i = 0, len = items.length; i < len; i++) {\n          (function(){${s.code}}.bind(items[i]))();\n        }`}return t}})});
//# sourceMappingURL=../../sourcemaps/code_manager/model/JsGenerator.js.map
