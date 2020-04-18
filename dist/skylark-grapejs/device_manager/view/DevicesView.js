/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","skylark-backbone"],function(e,t){"use strict";return t.View.extend({template:e.template('\n    <div class="<%= ppfx %>device-label"><%= deviceLabel %></div>\n    <div class="<%= ppfx %>field <%= ppfx %>select">\n      <span id="<%= ppfx %>input-holder">\n        <select class="<%= ppfx %>devices"></select>\n      </span>\n      <div class="<%= ppfx %>sel-arrow">\n        <div class="<%= ppfx %>d-s-arrow"></div>\n      </div>\n    </div>\n    <button style="display:none" class="<%= ppfx %>add-trasp">+</button>'),events:{change:"updateDevice"},initialize(e){this.config=e.config||{},this.em=this.config.em,this.ppfx=this.config.pStylePrefix||"",this.events["click ."+this.ppfx+"add-trasp"]=this.startAdd,this.listenTo(this.em,"change:device",this.updateSelect),this.delegateEvents()},startAdd(){},updateDevice(){var e=this.em;if(e){var t=this.devicesEl,i=t?t.val():"";e.set("device",i)}},updateSelect(){var e=this.em,t=this.devicesEl;if(e&&e.getDeviceModel&&t){var i=e.getDeviceModel(),s=i?i.get("name"):"";t.val(s)}},getOptions(){const{collection:e,em:t}=this;let i="";return e.each(e=>{const{name:s,id:n}=e.attributes,d=t&&t.t&&t.t(`deviceManager.devices.${n}`)||s;i+=`<option value="${s}">${d}</option>`}),i},render(){const{em:e,ppfx:t,$el:i,el:s}=this;return i.html(this.undefined({ppfx:t,deviceLabel:e&&e.t&&e.t("deviceManager.device")})),this.devicesEl=i.find(`.${t}devices`),this.devicesEl.append(this.getOptions()),s.className=`${t}devices-c`,this}})});
//# sourceMappingURL=../../sourcemaps/device_manager/view/DevicesView.js.map
