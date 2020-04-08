define([
    "skylark-langx/langx",
    '../utils/mixins',
    'skylark-underscore',
    '../utils/Droppable',
    './config/config',
    './model/Canvas',
    './view/CanvasView'
], function (langx,mixins, _, Droppable, defaults, Canvas, canvasView) {
    'use strict';
    const {requestAnimationFrame} = window;
    return () => {
        let c = {};
        let canvas;
        let frameRect;
        let CanvasView;
        return {
            getCanvasView() {
                return CanvasView;
            },
            name: 'Canvas',
            init(config = {}) {
                c = langx.mixin({},defaults,config, { module: this});
                this.em = c.em;
                const ppfx = c.pStylePrefix;
                if (ppfx)
                    c.stylePrefix = ppfx + c.stylePrefix;
                canvas = new Canvas(config);
                CanvasView = new canvasView({
                    model: canvas,
                    config: c
                });
                var cm = c.em.get('DomComponents');
                if (cm)
                    this.setWrapper(cm);
                this.model = canvas;
                this.startAutoscroll = this.startAutoscroll.bind(this);
                this.stopAutoscroll = this.stopAutoscroll.bind(this);
                return this;
            },
            getConfig() {
                return c;
            },
            setWrapper(wrp) {
                canvas.set('wrapper', wrp);
            },
            getElement() {
                return CanvasView.el;
            },
            getFrame() {
                return canvas.get('frame');
            },
            getFrameEl() {
                const {frame} = CanvasView;
                return frame && frame.el;
            },
            getFramesEl() {
                return CanvasView.framesArea;
            },
            getWindow() {
                return this.getFrameEl().contentWindow;
            },
            getDocument() {
                const frame = this.getFrameEl();
                return frame && frame.contentDocument;
            },
            getBody() {
                const doc = this.getDocument();
                return doc && doc.body;
            },
            getWrapperEl() {
                const body = this.getBody();
                return body && body.querySelector('#wrapper');
            },
            _getCompFrame(compView) {
                return compView && compView._getFrame();
            },
            _getLocalEl(globalEl, compView, method) {
                let result = globalEl;
                const frameView = this._getCompFrame(compView);
                result = frameView ? frameView[method]() : result;
                return result;
            },
            getGlobalToolsEl() {
                return CanvasView.toolsGlobEl;
            },
            getToolsEl(compView) {
                return this._getLocalEl(CanvasView.toolsEl, compView, 'getToolsEl');
            },
            getHighlighter(compView) {
                return this._getLocalEl(CanvasView.hlEl, compView, 'getHighlighter');
            },
            getBadgeEl(compView) {
                return this._getLocalEl(CanvasView.badgeEl, compView, 'getBadgeEl');
            },
            getPlacerEl() {
                return CanvasView.placerEl;
            },
            getGhostEl() {
                return CanvasView.ghostEl;
            },
            getToolbarEl() {
                return CanvasView.toolbarEl;
            },
            getResizerEl() {
                return CanvasView.resizerEl;
            },
            getOffsetViewerEl(compView) {
                return this._getLocalEl(CanvasView.offsetEl, compView, 'getOffsetViewerEl');
            },
            getFixedOffsetViewerEl() {
                return CanvasView.fixedOffsetEl;
            },
            render() {
                return CanvasView.render().el;
            },
            getOffset() {
                var frameOff = this.offset(this.getFrameEl());
                var canvasOff = this.offset(this.undefined());
                return {
                    top: frameOff.top - canvasOff.top,
                    left: frameOff.left - canvasOff.left
                };
            },
            offset(el) {
                return CanvasView.offset(el);
            },
            setCustomBadgeLabel(f) {
                c.customBadgeLabel = f;
            },
            getElementPos(el, opts) {
                return CanvasView.getElementPos(el, opts);
            },
            getElementOffsets(el) {
                return CanvasView.getElementOffsets(el);
            },
            getRect() {
                const {top, left} = CanvasView.getPosition();
                return {
                    ...CanvasView.getCanvasOffset(),
                    topScroll: top,
                    leftScroll: left
                };
            },
            getTargetToElementDim(target, element, options = {}) {
                var opts = options || {};
                var canvasPos = CanvasView.getPosition();
                if (!canvasPos)
                    return;
                var pos = opts.elPos || CanvasView.getElementPos(element);
                var toRight = options.toRight || 0;
                var targetHeight = opts.targetHeight || target.offsetHeight;
                var targetWidth = opts.targetWidth || target.offsetWidth;
                var eventToTrigger = opts.event || null;
                var elTop = pos.top - targetHeight;
                var elLeft = pos.left;
                elLeft += toRight ? pos.width : 0;
                elLeft = toRight ? elLeft - targetWidth : elLeft;
                var leftPos = elLeft < canvasPos.left ? canvasPos.left : elLeft;
                var topPos = elTop < canvasPos.top ? canvasPos.top : elTop;
                topPos = topPos > pos.top + pos.height ? pos.top + pos.height : topPos;
                var result = {
                    top: topPos,
                    left: leftPos,
                    elementTop: pos.top,
                    elementLeft: pos.left,
                    elementWidth: pos.width,
                    elementHeight: pos.height,
                    targetWidth: target.offsetWidth,
                    targetHeight: target.offsetHeight,
                    canvasTop: canvasPos.top,
                    canvasLeft: canvasPos.left,
                    canvasWidth: canvasPos.width,
                    canvasHeight: canvasPos.height
                };
                if (eventToTrigger && c.em) {
                    c.em.trigger(eventToTrigger, result);
                }
                return result;
            },
            canvasRectOffset(el, pos, opts = {}) {
                const getFrameElFromDoc = doc => {
                    const {defaultView} = doc;
                    return defaultView && defaultView.frameElement;
                };
                const rectOff = (el, top = 1, pos) => {
                    const zoom = this.em.getZoomDecimal();
                    const side = top ? 'top' : 'left';
                    const doc = el.ownerDocument;
                    const {offsetTop = 0, offsetLeft = 0} = opts.offset ? getFrameElFromDoc(doc) : {};
                    const {scrollTop = 0, scrollLeft = 0} = doc.body || {};
                    const scroll = top ? scrollTop : scrollLeft;
                    const offset = top ? offsetTop : offsetLeft;
                    return pos[side] - (scroll - offset) * zoom;
                };
                return {
                    top: rectOff(el, 1, pos),
                    left: rectOff(el, 0, pos)
                };
            },
            getTargetToElementFixed(el, elToMove, opts = {}) {
                const pos = opts.pos || this.getElementPos(el);
                const cvOff = opts.canvasOff || this.canvasRectOffset(el, pos);
                const toolbarH = elToMove.offsetHeight || 0;
                const toolbarW = elToMove.offsetWidth || 0;
                const elRight = pos.left + pos.width;
                const cv = this.getCanvasView();
                const frCvOff = cv.getPosition();
                const frameOffset = cv.getFrameOffset(el);
                const {event} = opts;
                let top = -toolbarH;
                let left = pos.width - toolbarW;
                left = pos.left < -left ? -pos.left : left;
                left = elRight > frCvOff.width ? left - (elRight - frCvOff.width) : left;
                const fullHeight = pos.height + toolbarH;
                const elIsShort = fullHeight < frameOffset.height;
                if (cvOff.top < toolbarH) {
                    if (elIsShort) {
                        top = top + fullHeight;
                    } else {
                        top = -cvOff.top < pos.height ? -cvOff.top : pos.height;
                    }
                }
                const result = {
                    top,
                    left,
                    canvasOffsetTop: cvOff.top,
                    canvasOffsetLeft: cvOff.left
                };
                event && this.em.trigger(event, result);
                return result;
            },
            getMouseRelativePos(e, options) {
                var opts = options || {};
                var addTop = 0;
                var addLeft = 0;
                var subWinOffset = opts.subWinOffset;
                var doc = e.target.ownerDocument;
                var win = doc.defaultView || doc.parentWindow;
                var frame = win.frameElement;
                var yOffset = subWinOffset ? win.pageYOffset : 0;
                var xOffset = subWinOffset ? win.pageXOffset : 0;
                if (frame) {
                    var frameRect = frame.getBoundingClientRect();
                    addTop = frameRect.top || 0;
                    addLeft = frameRect.left || 0;
                }
                return {
                    y: e.clientY + addTop - yOffset,
                    x: e.clientX + addLeft - xOffset
                };
            },
            getMouseRelativeCanvas(ev, opts) {
                const zoom = this.getZoomDecimal();
                const {top, left} = CanvasView.getPosition(opts);
                return {
                    y: ev.clientY * zoom + top,
                    x: ev.clientX * zoom + left
                };
            },
            hasFocus() {
                return this.getDocument().hasFocus();
            },
            isInputFocused() {
                const doc = this.getDocument();
                const toIgnore = [
                    'body',
                    ...this.getConfig().notTextable
                ];
                const focused = doc && doc.activeElement;
                return focused && !toIgnore.some(item => focused.matches(item));
            },
            scrollTo(el, opts = {}) {
                const elem = mixins.getElement(el);
                const view = elem && mixins.getViewEl(elem);
                view && view.scrollIntoView(opts);
            },
            startAutoscroll(frame) {
                const fr = frame && frame.view || this.em.getCurrentFrame();
                fr && fr.startAutoscroll();
            },
            stopAutoscroll(frame) {
                const fr = frame && frame.view || this.em.getCurrentFrame();
                fr && fr.stopAutoscroll();
            },
            postRender() {
                if (mixins.hasDnd(c.em))
                    this.droppable = new Droppable(c.em);
            },
            setZoom(value) {
                canvas.set('zoom', parseFloat(value));
                return this;
            },
            getZoom() {
                return parseFloat(canvas.get('zoom'));
            },
            getZoomDecimal() {
                return this.getZoom() / 100;
            },
            getZoomMultiplier() {
                const zoom = this.getZoomDecimal();
                return zoom ? 1 / zoom : 1;
            },
            toggleFramesEvents(on) {
                const {style} = this.getFramesEl();
                style.pointerEvents = on ? '' : 'none';
            },
            getFrameWrapperEl() {
                return CanvasView.frame.getWrapper();
            },
            getFrames() {
                return canvas.get('frames').map(item => item);
            },
            addFrame(props = {}, opts = {}) {
                return canvas.get('frames').add({ ...props }, {
                    ...opts,
                    em: this.em
                });
            }
        };
    };
});