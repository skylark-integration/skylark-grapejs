/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","skylark-underscore"],function(t,e){"use strict";return t.Model.extend({defaults:{type:"text",label:"",name:"",min:"",max:"",unit:"",step:1,value:"",target:"",default:"",placeholder:"",changeProp:0,options:[]},initialize(){const t=this.get("target"),e=this.get("name"),s=this.get("changeProp");if(t){this.target=t,this.unset("target");const a=s?`change:${e}`:`change:attributes:${e}`;this.listenTo(t,a,this.targetUpdated)}},props(){return this.attributes},targetUpdated(){const t=this.getTargetValue();this.set({value:t},{fromTarget:1})},getTargetValue(){const t=this.get("name"),s=this.target;let a;return a=this.get("changeProp")?s.get(t):s.getAttributes()[t],e.isUndefined(a)?"":a},setTargetValue(t,s={}){const a=this.target,i=this.get("name");if(e.isUndefined(t))return;let r=t;if("false"===t?r=!1:"true"===t&&(r=!0),this.get("changeProp"))a.set(i,r,s);else{const t={...a.get("attributes")};t[i]=r,a.set("attributes",t,s)}},setValueFromInput(t,e=1,s={}){const a={value:t};this.set(a,{...s,avoidStore:1}),e&&(this.set("value","",s),this.set(a,s))},getInitValue(){const t=this.target,e=this.get("name");let s;if(t){const a=t.get("attributes");s=this.get("changeProp")?t.get(e):a[e]}return s||this.get("value")||this.get("default")}})});
//# sourceMappingURL=../../sourcemaps/trait_manager/model/Trait.js.map
