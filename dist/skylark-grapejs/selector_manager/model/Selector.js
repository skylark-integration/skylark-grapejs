/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone"],function(e){"use strict";const t=e.Model.extend({idAttribute:"name",defaults:{name:"",label:"",type:1,active:!0,private:!1,protected:!1},initialize(e,a={}){const{config:s={}}=a,i=this.get("name"),n=this.get("label");i?n||this.set("label",i):this.set("name",n);const c=this.get("name"),{escapeName:l}=s,m=l?l(c):t.escapeName(c);this.set("name",m)},getFullName(e={}){const{escape:t}=e,a=this.get("name");let s="";switch(this.get("type")){case 1:s=".";break;case 2:s="#"}return s+(t?t(a):a)}},{TYPE_CLASS:1,TYPE_ID:2,escapeName:e=>`${e}`.trim().replace(/([^a-z0-9\w-\:]+)/gi,"-")});return t});
//# sourceMappingURL=../../sourcemaps/selector_manager/model/Selector.js.map
