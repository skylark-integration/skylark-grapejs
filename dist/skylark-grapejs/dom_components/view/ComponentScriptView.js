/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","./ComponentImageView"],function(t,e){"use strict";return e.extend({tagName:"script",events:{},render(){var t=this.model,e=t.get("src"),n=this.em,r=n&&n.get("scriptCount")?n.get("scriptCount"):0,i="";if(e){var o=t.get("onload"),c="script"+r,s="script"+(r+1);i="var "+c+" = document.createElement('script');\n"+c+".onload = function(){\n"+(o?o+"();\n":"")+"typeof "+s+"Start == 'function' && "+s+"Start();\n};\n"+c+".src = '"+e+"';\nfunction "+c+"Start() { document.body.appendChild("+c+"); };\n"+(r?"":c+"Start();"),n&&n.set("scriptCount",r+1)}else i=t.get("content");return this.el.innerHTML=i,this}})});
//# sourceMappingURL=../../sourcemaps/dom_components/view/ComponentScriptView.js.map
