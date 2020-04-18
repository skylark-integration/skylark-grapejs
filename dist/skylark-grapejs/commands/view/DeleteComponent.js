/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-underscore","skylark-backbone","./SelectComponent"],function(e,t,s){"use strict";const a=t.$;return e.extend({},s,{init(t){e.bindAll(this,"startDelete","stopDelete","onDelete"),this.hoverClass=this.pfx+"hover-delete",this.badgeClass=this.pfx+"badge-red"},enable(){this.$el.find("*").mouseover(this.startDelete).mouseout(this.stopDelete).click(this.onDelete)},startDelete(e){e.stopPropagation();var t=a(e.target);t.data("model").get("removable")&&(t.addClass(this.hoverClass),this.attachBadge(t.get(0)))},stopDelete(e){e.stopPropagation(),a(e.target).removeClass(this.hoverClass),this.badge&&this.badge.css({left:-1e3,top:-1e3})},onDelete(e){e.stopPropagation();var t=a(e.target);t.data("model").get("removable")&&(t.data("model").destroy(),this.removeBadge(),this.clean())},updateBadgeLabel(e){this.badge.html("Remove "+e.getName())}})});
//# sourceMappingURL=../../sourcemaps/commands/view/DeleteComponent.js.map
