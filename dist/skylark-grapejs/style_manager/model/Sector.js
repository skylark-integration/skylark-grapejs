/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","skylark-underscore","./Properties","./PropertyFactory"],function(e,t,r,i){"use strict";return e.Model.extend({defaults:{id:"",name:"",open:!0,buildProps:"",extendBuilded:1,properties:[]},initialize(e){const t=e||{},i=this.buildProperties(t.buildProps),s=this.get("name")||"";let p=[];!this.get("id")&&this.set("id",s.replace(/ /g,"_").toLowerCase()),p=i?this.extendProperties(i):this.get("properties");const o=new r(p);o.sector=this,this.set("properties",o)},extendProperties(e,r,i){for(var s=e.length,p=r||this.get("properties"),o=this.get("extendBuilded"),n=[],d=0,h=p.length;d<h;d++){for(var l=p[d],a=0,u=0;u<s;u++){var c=e[u];if(l.property!=c.property&&l.id!=c.property);else{var g=l.properties;g&&g.length&&(l.properties=this.extendProperties(c.properties||[],g,1)),e[u]=o?t.extend(c,l):l,n[u]=e[u],a=1}}a||(e.push(l),n.push(l))}return i?n.filter(e=>e):e},buildProperties(e){var t=e||[];if(t.length)return this.propFactory||(this.propFactory=i()),this.propFactory.build(t)}})});
//# sourceMappingURL=../../sourcemaps/style_manager/model/Sector.js.map
