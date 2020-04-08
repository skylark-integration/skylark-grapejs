define([
    'skylark-underscore',
    'skylark-backbone',
    './SelectComponent'
], function (a, Backbone, SelectComponent) {
    'use strict';
    const $ = Backbone.$;
    return a.extend({}, SelectComponent, {
        init(o) {
            a.bindAll(this, 'startDelete', 'stopDelete', 'onDelete');
            this.hoverClass = this.pfx + 'hover-delete';
            this.badgeClass = this.pfx + 'badge-red';
        },
        enable() {
            var that = this;
            this.$el.find('*').mouseover(this.startDelete).mouseout(this.stopDelete).click(this.onDelete);
        },
        startDelete(e) {
            e.stopPropagation();
            var $this = $(e.target);
            if ($this.data('model').get('removable')) {
                $this.addClass(this.hoverClass);
                this.attachBadge($this.get(0));
            }
        },
        stopDelete(e) {
            e.stopPropagation();
            var $this = $(e.target);
            $this.removeClass(this.hoverClass);
            if (this.badge)
                this.badge.css({
                    left: -1000,
                    top: -1000
                });
        },
        onDelete(e) {
            e.stopPropagation();
            var $this = $(e.target);
            if (!$this.data('model').get('removable'))
                return;
            $this.data('model').destroy();
            this.removeBadge();
            this.clean();
        },
        updateBadgeLabel(model) {
            this.badge.html('Remove ' + model.getName());
        }
    });
});