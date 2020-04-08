define(['skylark-underscore'], function (_) {
    'use strict';
    return ({$}) => {
        return;//modified by lwf
        if ($ && $.prototype.constructor.name !== 'jQuery') {
            const fn = $.fn;
            fn.hide = function () {
                return this.css('display', 'none');
            };
            fn.show = function () {
                return this.css('display', 'block');
            };
            fn.focus = function () {
                const el = this.get(0);
                el && el.focus();
                return this;
            };
            fn.bind = function (ev, h) {
                return this.on(ev, h);
            };
            fn.unbind = function (ev, h) {
                if (_.isObject(ev)) {
                    for (let name in ev) {
                        ev.hasOwnProperty(name) && this.off(name, ev[name]);
                    }
                    return this;
                } else {
                    return this.off(ev, h);
                }
            };
            fn.click = function (h) {
                return h ? this.on('click', h) : this.trigger('click');
            };
            fn.change = function (h) {
                return h ? this.on('change', h) : this.trigger('change');
            };
            fn.keydown = function (h) {
                return h ? this.on('keydown', h) : this.trigger('keydown');
            };
            fn.delegate = function (selector, events, data, handler) {
                if (!handler) {
                    handler = data;
                }
                return this.on(events, selector, function (e) {
                    e.data = data;
                    handler(e);
                });
            };
            fn.scrollLeft = function () {
                let el = this.get(0);
                el = el.nodeType == 9 ? el.defaultView : el;
                let win = el instanceof Window ? el : null;
                return win ? win.pageXOffset : el.scrollLeft || 0;
            };
            fn.scrollTop = function () {
                let el = this.get(0);
                el = el.nodeType == 9 ? el.defaultView : el;
                let win = el instanceof Window ? el : null;
                return win ? win.pageYOffset : el.scrollTop || 0;
            };
            const offset = $.prototype.offset;
            fn.offset = function (coords) {
                let top, left;
                if (coords) {
                    top = coords.top;
                    left = coords.left;
                }
                if (typeof top != 'undefined') {
                    this.css('top', `${ top }px`);
                }
                if (typeof left != 'undefined') {
                    this.css('left', `${ left }px`);
                }
                return offset.call(this);
            };
            $.map = function (items, clb) {
                const ar = [];
                for (var i = 0; i < items.length; i++) {
                    ar.push(clb(items[i], i));
                }
                return ar;
            };
            const indexOf = Array.prototype.indexOf;
            $.inArray = function (val, arr, i) {
                return arr == null ? -1 : indexOf.call(arr, val, i);
            };
            $.Event = function (src, props) {
                if (!(this instanceof $.Event)) {
                    return new $.Event(src, props);
                }
                this.type = src;
                this.isDefaultPrevented = () => false;
            };
        }
    };
});