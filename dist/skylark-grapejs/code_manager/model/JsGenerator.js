/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","skylark-backbone"],function(t,e){"use strict";return e.Model.extend({mapModel(e){var i="",s=e.get("script-export")||e.get("script"),r=e.get("type"),n=e.get("components"),a=e.getId();if(s){var d=e.get("attributes");d=t.extend({},d,{id:a}),e.set("attributes",d,{silent:1});var o=e.getScriptString(s);if(e.get("scriptUpdated"))this.mapJs[r+"-"+a]={ids:[a],code:o};else{var p=this.mapJs[r];p?p.ids.push(a):this.mapJs[r]={ids:[a],code:o}}}return n.each(function(t){i+=this.mapModel(t)},this),i},build(t){this.mapJs={},this.mapModel(t);var e="";for(var i in this.mapJs){var s=this.mapJs[i];e+=`\n        var items = document.querySelectorAll('${"#"+s.ids.join(", #")}');\n        for (var i = 0, len = items.length; i < len; i++) {\n          (function(){${s.code}}.bind(items[i]))();\n        }`}return e}})});
//# sourceMappingURL=../../sourcemaps/code_manager/model/JsGenerator.js.map
