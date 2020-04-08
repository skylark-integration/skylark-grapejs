define([
    "skylark-langx/langx",
    'skylark-underscore',
    './mixins'
], function (langx,_, mixins) {
    'use strict';
    var defaultOpts = {
        mousePosFetcher: null,
        updateTarget: null,
        ratioDefault: 0,
        posFetcher: null,
        onStart: null,
        onMove: null,
        onEnd: null,
        onUpdateContainer: () => {
        },
        step: 1,
        minDim: 32,
        maxDim: '',
        unitHeight: 'px',
        unitWidth: 'px',
        keyHeight: 'height',
        keyWidth: 'width',
        currentUnit: 1,
        silentFrames: 0,
        avoidContainerUpdate: 0,
        keepAutoHeight: false,
        keepAutoWidth: false,
        autoHeight: false,
        autoWidth: false,
        tl: 1,
        tc: 1,
        tr: 1,
        cl: 1,
        cr: 1,
        bl: 1,
        bc: 1,
        br: 1
    };
    var createHandler = (name, opts) => {
        var pfx = opts.prefix || '';
        var el = document.createElement('i');
        el.className = pfx + 'resizer-h ' + pfx + 'resizer-h-' + name;
        el.setAttribute('data-' + pfx + 'handler', name);
        return el;
    };
    var getBoundingRect = (el, win) => {
        var w = win || window;
        var rect = el.getBoundingClientRect();
        return {
            left: rect.left + w.pageXOffset,
            top: rect.top + w.pageYOffset,
            width: rect.width,
            height: rect.height
        };
    };
    class Resizer {
        constructor(opts = {}) {
            this.setOptions(opts);
            _.bindAll(this, 'handleKeyDown', 'handleMouseDown', 'move', 'stop');
            return this;
        }
        getConfig() {
            return this.opts;
        }
        setOptions(options = {}) {
            this.opts = _.defaults(options, defaultOpts);
            this.setup();
        }
        setup() {
            const opts = this.opts;
            const pfx = opts.prefix || '';
            const appendTo = opts.appendTo || document.body;
            let container = this.container;
            if (!container) {
                container = document.createElement('div');
                container.className = `${ pfx }resizer-c`;
                appendTo.appendChild(container);
                this.container = container;
            }
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            const handlers = {};
            [
                'tl',
                'tc',
                'tr',
                'cl',
                'cr',
                'bl',
                'bc',
                'br'
            ].forEach(hdl => handlers[hdl] = opts[hdl] ? createHandler(hdl, opts) : '');
            for (let n in handlers) {
                const handler = handlers[n];
                handler && container.appendChild(handler);
            }
            this.handlers = handlers;
            this.mousePosFetcher = opts.mousePosFetcher;
            this.updateTarget = opts.updateTarget;
            this.posFetcher = opts.posFetcher;
            this.onStart = opts.onStart;
            this.onMove = opts.onMove;
            this.onEnd = opts.onEnd;
            this.onUpdateContainer = opts.onUpdateContainer;
        }
        toggleFrames(silent) {
            if (this.opts.silentFrames) {
                const frames = document.querySelectorAll('iframe');
                _.each(frames, frame => frame.style.pointerEvents = silent ? 'none' : '');
            }
        }
        isHandler(el) {
            var handlers = this.handlers;
            for (var n in handlers) {
                if (handlers[n] === el)
                    return true;
            }
            return false;
        }
        getFocusedEl() {
            return this.el;
        }
        getDocumentEl() {
            return [
                this.el.ownerDocument,
                document
            ];
        }
        getElementPos(el, opts = {}) {
            var posFetcher = this.posFetcher || '';
            return posFetcher ? posFetcher(el, opts) : getBoundingRect(el);
        }
        focus(el) {
            if (el && el === this.el) {
                return;
            }
            this.el = el;
            this.updateContainer({ forceShow: 1 });
            mixins.on(this.getDocumentEl(), 'mousedown', this.handleMouseDown);
        }
        blur() {
            this.container.style.display = 'none';
            if (this.el) {
                mixins.off(this.getDocumentEl(), 'mousedown', this.handleMouseDown);
                this.el = null;
            }
        }
        start(e) {
            if (e.button !== 0)
                return;
            e.preventDefault();
            e.stopPropagation();
            const el = this.el;
            const resizer = this;
            const config = this.opts || {};
            var attrName = 'data-' + config.prefix + 'handler';
            var rect = this.getElementPos(el, { target: 'el' });
            this.handlerAttr = e.target.getAttribute(attrName);
            this.clickedHandler = e.target;
            this.startDim = {
                t: rect.top,
                l: rect.left,
                w: rect.width,
                h: rect.height
            };
            this.rectDim = {
                t: rect.top,
                l: rect.left,
                w: rect.width,
                h: rect.height
            };
            this.startPos = {
                x: e.clientX,
                y: e.clientY
            };
            var doc = this.getDocumentEl();
            mixins.on(doc, 'mousemove', this.move);
            mixins.on(doc, 'keydown', this.handleKeyDown);
            mixins.on(doc, 'mouseup', this.stop);
            _.isFunction(this.onStart) && this.onStart(e, {
                docs: doc,
                config,
                el,
                resizer
            });
            this.toggleFrames(1);
            this.move(e);
        }
        move(e) {
            const onMove = this.onMove;
            var mouseFetch = this.mousePosFetcher;
            var currentPos = mouseFetch ? mouseFetch(e) : {
                x: e.clientX,
                y: e.clientY
            };
            this.currentPos = currentPos;
            this.delta = {
                x: currentPos.x - this.startPos.x,
                y: currentPos.y - this.startPos.y
            };
            this.keys = {
                shift: e.shiftKey,
                ctrl: e.ctrlKey,
                alt: e.altKey
            };
            this.rectDim = this.calc(this);
            this.updateRect(0);
            onMove && onMove(e);
            if (e.which === 0) {
                this.stop(e);
            }
        }
        stop(e) {
            const config = this.opts;
            var doc = this.getDocumentEl();
            mixins.off(doc, 'mousemove', this.move);
            mixins.off(doc, 'keydown', this.handleKeyDown);
            mixins.off(doc, 'mouseup', this.stop);
            this.updateRect(1);
            this.toggleFrames();
            _.isFunction(this.onEnd) && this.onEnd(e, {
                docs: doc,
                config
            });
        }
        updateRect(store) {
            const el = this.el;
            const resizer = this;
            const config = this.opts;
            const rect = this.rectDim;
            const updateTarget = this.updateTarget;
            const selectedHandler = this.getSelectedHandler();
            const {unitHeight, unitWidth, keyWidth, keyHeight} = config;
            if (_.isFunction(updateTarget)) {
                updateTarget(el, rect, {
                    store,
                    selectedHandler,
                    resizer,
                    config
                });
            } else {
                const elStyle = el.style;
                elStyle[keyWidth] = rect.w + unitWidth;
                elStyle[keyHeight] = rect.h + unitHeight;
            }
            this.updateContainer();
        }
        updateContainer(opt = {}) {
            const {opts, container, el} = this;
            const {style} = container;
            if (!opts.avoidContainerUpdate && el) {
                if (opt.forceShow)
                    style.display = 'block';
            }
            this.onUpdateContainer({
                el: container,
                resizer: this,
                opts: langx.mixin({},opts,opt)
            });
        }
        getSelectedHandler() {
            var handlers = this.handlers;
            if (!this.selectedHandler) {
                return;
            }
            for (let n in handlers) {
                if (handlers[n] === this.selectedHandler)
                    return n;
            }
        }
        handleKeyDown(e) {
            if (e.keyCode === 27) {
                this.rectDim = this.startDim;
                this.stop(e);
            }
        }
        handleMouseDown(e) {
            var el = e.target;
            if (this.isHandler(el)) {
                this.selectedHandler = el;
                this.start(e);
            } else if (el !== this.el) {
                this.selectedHandler = '';
                this.blur();
            }
        }
        calc(data) {
            let value;
            const opts = this.opts || {};
            const step = opts.step;
            const startDim = this.startDim;
            const minDim = opts.minDim;
            const maxDim = opts.maxDim;
            const deltaX = data.delta.x;
            const deltaY = data.delta.y;
            const startW = startDim.w;
            const startH = startDim.h;
            var box = {
                t: 0,
                l: 0,
                w: startW,
                h: startH
            };
            if (!data)
                return;
            var attr = data.handlerAttr;
            if (~attr.indexOf('r')) {
                value = mixins.normalizeFloat(startW + deltaX * step, step);
                value = Math.max(minDim, value);
                maxDim && (value = Math.min(maxDim, value));
                box.w = value;
            }
            if (~attr.indexOf('b')) {
                value = mixins.normalizeFloat(startH + deltaY * step, step);
                value = Math.max(minDim, value);
                maxDim && (value = Math.min(maxDim, value));
                box.h = value;
            }
            if (~attr.indexOf('l')) {
                value = mixins.normalizeFloat(startW - deltaX * step, step);
                value = Math.max(minDim, value);
                maxDim && (value = Math.min(maxDim, value));
                box.w = value;
            }
            if (~attr.indexOf('t')) {
                value = mixins.normalizeFloat(startH - deltaY * step, step);
                value = Math.max(minDim, value);
                maxDim && (value = Math.min(maxDim, value));
                box.h = value;
            }
            var ratioActive = opts.ratioDefault ? !data.keys.shift : data.keys.shift;
            if (attr.indexOf('c') < 0 && ratioActive) {
                var ratio = startDim.w / startDim.h;
                if (box.w / box.h > ratio) {
                    box.h = Math.round(box.w / ratio);
                } else {
                    box.w = Math.round(box.h * ratio);
                }
            }
            if (~attr.indexOf('l')) {
                box.l = startDim.w - box.w;
            }
            if (~attr.indexOf('t')) {
                box.t = startDim.h - box.h;
            }
            return box;
        }
    }
    return {
        init(opts) {
            return new Resizer(opts);
        }
    };
});