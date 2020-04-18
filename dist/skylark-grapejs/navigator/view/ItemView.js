/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","../../utils/mixins","skylark-backbone","../../dom_components/view/ComponentView","../../dom_components/model/Component","./ItemsView"],function(t,e,s,i,l,n){"use strict";const a=s.$;var o=s.View.extend({events:{"mousedown [data-toggle-move]":"startSort","touchstart [data-toggle-move]":"startSort","click [data-toggle-visible]":"toggleVisibility","click [data-toggle-select]":"handleSelect","mouseover [data-toggle-select]":"handleHover","click [data-toggle-open]":"toggleOpening","dblclick [data-name]":"handleEdit","focusout [data-name]":"handleEditEnd"},template(t){const{pfx:e,ppfx:s,config:i,clsNoEdit:l}=this,{hidable:n}=i,a=this.countChildren(t),o=a?"":this.clsNoChild,h=`${this.clsTitle} ${o}`,d=`${this.clsTitleC} ${s}one-bg`,r=`${this.clsCaret} fa fa-chevron-right`,c=`${this.inputNameCls} ${l} ${s}no-app`,p=`${30+10*(this.level+1)}px`,g=t.getName(),m=t.getIcon(),$=`${e}layer`;return`\n      ${n?`<i class="${e}layer-vis fa fa-eye ${this.isVisible()?"":"fa-eye-slash"}" data-toggle-visible></i>`:""}\n      <div class="${d}">\n        <div class="${h}" style="padding-left: ${p}" data-toggle-select>\n          <div class="${e}layer-title-inn">\n            <i class="${r}" data-toggle-open></i>\n            ${m?`<span class="${$}__icon">${m}</span>`:""}\n            <span class="${c}" data-name>${g}</span>\n          </div>\n        </div>\n      </div>\n      <div class="${this.clsCount}" data-count>${a||""}</div>\n      <div class="${this.clsMove}" data-toggle-move>\n        <i class="fa fa-arrows"></i>\n      </div>\n      <div class="${this.clsChildren}"></div>`},initialize(t={}){this.opt=t,this.level=t.level,this.config=t.config,this.em=t.config.em,this.ppfx=this.em.get("Config").stylePrefix,this.sorter=t.sorter||"",this.pfx=this.config.stylePrefix,this.parentView=t.parentView;const e=this.pfx,s=this.ppfx,i=this.model,l=i.get("components"),n=i.get("type")||"default";i.set("open",!1),this.listenTo(l,"remove add reset",this.checkChildren),this.listenTo(i,"change:status",this.updateStatus),this.listenTo(i,"change:open",this.updateOpening),this.listenTo(i,"change:layerable",this.updateLayerable),this.listenTo(i,"change:style:display",this.updateVisibility),this.className=`${e}layer ${e}layer__t-${n} no-select ${s}two-color`,this.inputNameCls=`${s}layer-name`,this.clsTitleC=`${e}layer-title-c`,this.clsTitle=`${e}layer-title`,this.clsCaret=`${e}layer-caret`,this.clsCount=`${e}layer-count`,this.clsMove=`${e}layer-move`,this.clsChildren=`${e}layer-children`,this.clsNoChild=`${e}layer-no-chld`,this.clsEdit=`${this.inputNameCls}--edit`,this.clsNoEdit=`${this.inputNameCls}--no-edit`,this.$el.data("model",i),this.$el.data("collection",l),i.viewLayer=this},getVisibilityEl(){return this.eyeEl||(this.eyeEl=this.$el.children(`.${this.pfx}layer-vis`)),this.eyeEl},updateVisibility(){const t=`${this.pfx}layer-hidden`,e="none"==this.model.getStyle().display?"addClass":"removeClass";this.$el[e](t),this.getVisibilityEl()[e]("fa-eye-slash")},toggleVisibility(t){t&&t.stopPropagation();const{model:e}=this,s=e.get("__prev-display"),i=e.getStyle(),{display:l}=i;"none"==l?(delete i.display,s&&(i.display=s,e.unset("__prev-display"))):(l&&e.set("__prev-display",l),i.display="none"),e.setStyle(i)},handleEdit(t){t&&t.stopPropagation();const{em:e,$el:s,clsNoEdit:i,clsEdit:l}=this,n=this.getInputName();n.contentEditable=!0,n.focus(),e&&e.setEditing(1),s.find(`.${this.inputNameCls}`).removeClass(i).addClass(l)},handleEditEnd(t){t&&t.stopPropagation();const{em:e,$el:s,clsNoEdit:i,clsEdit:l}=this,n=this.getInputName(),a=n.textContent;n.scrollLeft=0,n.contentEditable=!1,this.model.set({"custom-name":a}),e&&e.setEditing(0),s.find(`.${this.inputNameCls}`).addClass(i).removeClass(l)},getInputName(){return this.inputName||(this.inputName=this.el.querySelector(`.${this.inputNameCls}`)),this.inputName},updateOpening(){var t=this.opt.opened||{},e=this.model;e.get("open")?(this.$el.addClass("open"),this.getCaret().addClass("fa-chevron-down"),t[e.cid]=e):(this.$el.removeClass("open"),this.getCaret().removeClass("fa-chevron-down"),delete t[e.cid])},toggleOpening(t){t.stopPropagation(),this.model.get("components").length&&this.model.set("open",!this.model.get("open"))},handleSelect(t){t.stopPropagation();const{em:e,config:s}=this;if(e){const t=this.model;e.setSelected(t,{fromLayers:1});const i=s.scrollCanvas;i&&t.views.forEach(t=>t.scrollIntoView(i))}},handleHover(t){t.stopPropagation();const{em:e,config:s,model:i}=this;e&&s.showHover&&e.setHovered(i,{fromLayers:1})},startSort(t){t.stopPropagation();const{em:e,sorter:s}=this;t.button&&0!==t.button||s&&(s.onStart=(t=>e.trigger(`${l.eventDrag}:start`,t)),s.onMoveClb=(t=>e.trigger(l.eventDrag,t)),s.startSort(t.target))},freeze(){this.$el.addClass(this.pfx+"opac50"),this.model.set("open",0)},unfreeze(){this.$el.removeClass(this.pfx+"opac50")},updateStatus(t){i.prototype.updateStatus.apply(this,[{avoidHover:!this.config.highlightHover}])},isVisible(){var t=this.model.get("style").display;if(!t||"none"!=t)return 1},checkChildren(){const{model:t,clsNoChild:e}=this,s=this.countChildren(t),i=this.$el.children(`.${this.clsTitleC}`).children(`.${this.clsTitle}`);let{cnt:l}=this;l||(l=this.$el.children("[data-count]").get(0),this.cnt=l),i[s?"removeClass":"addClass"](e),l&&(l.innerHTML=s||""),!s&&t.set("open",0)},countChildren(t){var e=0;return t.get("components").each(function(t){var s=this.opt.isCountable,i=this.config.hideTextnode;s&&!s(t,i)||e++},this),e},getCaret(){if(!this.caret||!this.caret.length){this.pfx;this.caret=this.$el.children(`.${this.clsTitleC}`).find(`.${this.clsCaret}`)}return this.caret},setRoot(s){s=t.isString(s)?this.em.getWrapper().find(s)[0]:s;const i=e.getModel(s,a);i&&(this.stopListening(),this.model=i,this.initialize(this.opt),this.render())},updateLayerable(){const{parentView:t}=this;(t||this).render()},render(){const{model:t,config:e,pfx:s,ppfx:i,opt:l}=this,{isCountable:a}=l,o=a&&!a(t,e.hideTextnode),h=this.isVisible(),d=this.$el.empty(),r=this.level+1,c=new n({collection:t.get("components"),config:this.config,sorter:this.sorter,opened:this.opt.opened,parentView:this,parent:t,level:r}).render().$el;return this.config.showWrapper||1!==r?(d.html(this.template(t)),d.find(`.${this.clsChildren}`).append(c)):d.append(c),t.get("draggable")&&this.config.sortable||d.children(`.${this.clsMove}`).remove(),!h&&(this.className+=` ${s}hide`),o&&(this.className+=` ${i}hidden`),d.attr("class",this.className),this.updateOpening(),this.updateStatus(),this.updateVisibility(),this}});return n.ItemView=o,o});
//# sourceMappingURL=../../sourcemaps/navigator/view/ItemView.js.map