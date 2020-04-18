/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-underscore","./config"],function(e,s,t){"use strict";const n=e=>!Array.isArray(e)&&null!==e&&"object"==typeof e,i=(...e)=>{const s=lang.mixin({},e[0]);for(let t=1;t<e.length;t++){const g=lang.mixin({},e[t]);for(let e in g){const t=s[e],a=g[e];n(t)&&n(a)?s[e]=i(t,a):s[e]=a}}return s};return()=>({name:"I18n",config:t,init(s={}){return this.config=e.mixin({},t,s,{messages:e.mixin({},t.messages,s.messages)}),this.config.detectLocale&&(this.config.locale=this._localLang()),this.em=s.em,this},getConfig(){return this.config},setLocale(e){const{em:s,config:t}=this,n={value:e,valuePrev:t.locale};return s&&s.trigger("i18n:locale",n),t.locale=e,this},getLocale(){return this.config.locale},getMessages(e,s={}){const{messages:t}=this.config;return e&&!t[e]&&this._debug(`'${e}' i18n lang not found`,s),e?t[e]:t},setMessages(e){const{em:s,config:t}=this;return t.messages=e,s&&s.trigger("i18n:update",e),this},addMessages(e){const{em:s}=this,{messages:t}=this.config;return s&&s.trigger("i18n:add",e),this.setMessages(i(t,e)),this},t(e,t={}){const{config:n}=this,i=t.params||{},g=t.l||this.getLocale(),a=t.lFlb||n.localeFallback;let r=this._getMsg(e,g,t);return r||(r=this._getMsg(e,a,t)),!r&&this._debug(`'${e}' i18n key not found in '${g}' lang`,t),r=r&&s.isString(r)?this._addParams(r,i):r},_localLang(){const e=window.navigator||{},s=e.language||e.userLanguage;return s?s.split("-")[0]:"en"},_addParams(e,s){const t=new RegExp("{([\\w\\d-]*)}","g");return e.replace(t,(e,t)=>s[t]||"").trim()},_getMsg(e,t,n={}){const i=this.getMessages(t,n);if(!i)return;let g=i[e];return!g&&e.indexOf(".")>0&&(g=e.split(".").reduce((e,t)=>{if(!s.isUndefined(e))return e[t]},i)),g},_debug(e,s={}){const{em:t,config:n}=this;(s.debug||n.debug)&&t&&t.logWarning(e)}})});
//# sourceMappingURL=../sourcemaps/i18n/index.js.map
