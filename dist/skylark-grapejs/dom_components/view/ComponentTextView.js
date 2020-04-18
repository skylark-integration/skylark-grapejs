/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["../../utils/mixins","./ComponentView"],function(t,e){"use strict";const i=e.prototype;return e.extend({events:{dblclick:"onActive",input:"onInput"},initialize(t){i.initialize.apply(this,arguments),this.disableEditing=this.disableEditing.bind(this);const e=this.model,n=this.em;this.listenTo(e,"focus",this.onActive),this.listenTo(e,"change:content",this.updateContentText),this.listenTo(e,"sync:content",this.syncContent),this.rte=n&&n.get("RichTextEditor")},updateContentText(t,e,i={}){!i.fromDisable&&this.disableEditing()},onActive(t){if(this.rteEnabled||!this.model.get("editable"))return;t&&t.stopPropagation&&t.stopPropagation();const{rte:e,em:i}=this;if(e)try{this.activeRte=e.enable(this,this.activeRte)}catch(t){i.logError(t)}this.toggleEvents(1)},onDisable(){this.disableEditing()},disableEditing(){const{model:t,rte:e,activeRte:i,em:n}=this,o=t.get("editable");if(e&&o){try{e.disable(this,i)}catch(t){n.logError(t)}this.syncContent()}this.toggleEvents()},getContent(){const{rte:t}=this,{activeRte:e}=t||{};let i="";return i=e&&"function"==typeof e.getContent?e.getContent():this.getChildrenContainer().innerHTML},syncContent(t={}){const{model:e,rte:i,rteEnabled:n}=this;if(!n&&!t.force)return;const o=this.getContent(),s=e.components(),a={fromDisable:1,...t};if(s.length&&s.reset(null,t),e.set("content","",a),i.customRte)e.set("content",o,a);else{const i=e=>{const n=!!e.get("textable"),o=!["text","default",""].some(t=>e.is(t))||n;e.set({_innertext:!o,editable:o&&e.get("editable"),selectable:o,hoverable:o,removable:n,draggable:n,highlightable:0,copyable:n,...!n&&{toolbar:""}},t),e.get("components").each(t=>i(t))};!t.silent&&e.trigger("change:content",e,"",a),s.add(o,t),s.each(t=>i(t)),s.trigger("resetNavigator")}},onInput(){const{em:t}=this;t&&t.trigger("component:update",this.model)},disablePropagation(t){t.stopPropagation()},toggleEvents(e){const{em:i}=this,n=e?"on":"off";i.setEditing(e),this.rteEnabled=!!e;var o=[this.el.ownerDocument,document];if(t.off(o,"mousedown",this.disableEditing),t[n](o,"mousedown",this.disableEditing),i[n]("toolbar:run:before",this.disableEditing),this.$el.off("mousedown",this.disablePropagation),this.$el[n]("mousedown",this.disablePropagation),this.config.draggableComponents){let{el:t}=this;for(;t;)t.draggable=!e,(t=t.parentNode)&&"BODY"==t.tagName&&(t=0)}}})});
//# sourceMappingURL=../../sourcemaps/dom_components/view/ComponentTextView.js.map