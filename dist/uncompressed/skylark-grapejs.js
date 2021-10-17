/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-grapejs/editor/config/config',[],function () {
    'use strict';
    return {
        stylePrefix: 'gjs-',
        components: '',
        style: '',
        fromElement: 0,
        noticeOnUnload: true,
        showOffsets: false,
        showOffsetsSelected: false,
        forceClass: true,
        height: '900px',
        width: '100%',
        log: [
            'warning',
            'error'
        ],
        baseCss: `
    * {
      box-sizing: border-box;
    }
    html, body, [data-gjs-type=wrapper] {
      min-height: 100%;
    }
    body {
      margin: 0;
      height: 100%;
      background-color: #fff
    }
    [data-gjs-type=wrapper] {
      overflow: auto;
      overflow-x: hidden;
    }

    * ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1)
    }

    * ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2)
    }

    * ::-webkit-scrollbar {
      width: 10px
    }
  `,
        protectedCss: '* { box-sizing: border-box; } body {margin: 0;}',
        canvasCss: '',
        defaultCommand: 'select-comp',
        showToolbar: 1,
        allowScripts: 0,
        showDevices: 1,
        devicePreviewMode: 0,
        mediaCondition: 'max-width',
        tagVarStart: '{[ ',
        tagVarEnd: ' ]}',
        keepEmptyTextNodes: 0,
        jsInHtml: true,
        nativeDnD: 1,
        multipleSelection: 1,
        exportWrapper: 0,
        wrapperIsBody: 1,
        avoidInlineStyle: 1,
        avoidDefaults: 1,
        clearStyles: 0,
        dragMode: 0,
        cssIcons: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
        el: '',
        i18n: {},
        undoManager: {},
        assetManager: {},
        canvas: {},
        layers: {},
        storageManager: {},
        richTextEditor: {},
        domComponents: {},
        modal: {},
        codeManager: {},
        panels: {},
        commands: {},
        cssComposer: {},
        selectorManager: {},
        deviceManager: {
            devices: [
                {
                    id: 'desktop',
                    name: 'Desktop',
                    width: ''
                },
                {
                    id: 'tablet',
                    name: 'Tablet',
                    width: '768px',
                    widthMedia: '992px'
                },
                {
                    id: 'mobileLandscape',
                    name: 'Mobile landscape',
                    width: '568px',
                    widthMedia: '768px'
                },
                {
                    id: 'mobilePortrait',
                    name: 'Mobile portrait',
                    width: '320px',
                    widthMedia: '480px'
                }
            ]
        },
        styleManager: {
            sectors: [
                {
                    name: 'General',
                    open: false,
                    buildProps: [
                        'float',
                        'display',
                        'position',
                        'top',
                        'right',
                        'left',
                        'bottom'
                    ]
                },
                {
                    name: 'Flex',
                    open: false,
                    buildProps: [
                        'flex-direction',
                        'flex-wrap',
                        'justify-content',
                        'align-items',
                        'align-content',
                        'order',
                        'flex-basis',
                        'flex-grow',
                        'flex-shrink',
                        'align-self'
                    ]
                },
                {
                    name: 'Dimension',
                    open: false,
                    buildProps: [
                        'width',
                        'height',
                        'max-width',
                        'min-height',
                        'margin',
                        'padding'
                    ]
                },
                {
                    name: 'Typography',
                    open: false,
                    buildProps: [
                        'font-family',
                        'font-size',
                        'font-weight',
                        'letter-spacing',
                        'color',
                        'line-height',
                        'text-align',
                        'text-shadow'
                    ],
                    properties: [{
                            property: 'text-align',
                            list: [
                                {
                                    value: 'left',
                                    className: 'fa fa-align-left'
                                },
                                {
                                    value: 'center',
                                    className: 'fa fa-align-center'
                                },
                                {
                                    value: 'right',
                                    className: 'fa fa-align-right'
                                },
                                {
                                    value: 'justify',
                                    className: 'fa fa-align-justify'
                                }
                            ]
                        }]
                },
                {
                    name: 'Decorations',
                    open: false,
                    buildProps: [
                        'border-radius-c',
                        'background-color',
                        'border-radius',
                        'border',
                        'box-shadow',
                        'background'
                    ]
                },
                {
                    name: 'Extra',
                    open: false,
                    buildProps: [
                        'transition',
                        'perspective',
                        'transform'
                    ]
                }
            ]
        },
        blockManager: {},
        traitManager: {},
        textViewCode: 'Code',
        keepUnusedStyles: 0,
        multiFrames: 0
    };
});
define('skylark-grapejs/utils/extender',['skylark-underscore'], function (_) {
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
define('skylark-grapejs/utils/mixins',['skylark-underscore'], function (_) {
    'use strict';
    const elProt = window.Element.prototype;
    const matches = elProt.matches || elProt.webkitMatchesSelector || elProt.mozMatchesSelector || elProt.msMatchesSelector;
    const appendStyles = (styles, opts = {}) => {
        const stls = _.isArray(styles) ? [...styles] : [styles];
        if (stls.length) {
            const href = stls.shift();
            if (href && (!opts.unique || !document.querySelector(`link[href="${ href }"]`))) {
                const {head} = document;
                const link = document.createElement('link');
                link.href = href;
                link.rel = 'stylesheet';
                if (opts.prepand) {
                    head.insertBefore(link, head.firstChild);
                } else {
                    head.appendChild(link);
                }
            }
            appendStyles(stls);
        }
    };
    const shallowDiff = (objOrig, objNew) => {
        const result = {};
        const keysNew = _.keys(objNew);
        for (let prop in objOrig) {
            if (objOrig.hasOwnProperty(prop)) {
                const origValue = objOrig[prop];
                const newValue = objNew[prop];
                if (keysNew.indexOf(prop) >= 0) {
                    if (origValue !== newValue) {
                        result[prop] = newValue;
                    }
                } else {
                    result[prop] = null;
                }
            }
        }
        for (let prop in objNew) {
            if (objNew.hasOwnProperty(prop)) {
                if (_.isUndefined(objOrig[prop])) {
                    result[prop] = objNew[prop];
                }
            }
        }
        return result;
    };
    const on = (el, ev, fn) => {
        ev = ev.split(/\s+/);
        el = el instanceof Array ? el : [el];
        for (let i = 0; i < ev.length; ++i) {
            el.forEach(elem => elem.addEventListener(ev[i], fn));
        }
    };
    const off = (el, ev, fn) => {
        ev = ev.split(/\s+/);
        el = el instanceof Array ? el : [el];
        for (let i = 0; i < ev.length; ++i) {
            el.forEach(elem => elem.removeEventListener(ev[i], fn));
        }
    };
    const getUnitFromValue = value => {
        return value.replace(parseFloat(value), '');
    };
    const upFirst = value => value[0].toUpperCase() + value.toLowerCase().slice(1);
    const camelCase = value => {
        const values = value.split('-').filter(String);
        return values[0].toLowerCase() + values.slice(1).map(upFirst);
    };
    const normalizeFloat = (value, step = 1, valueDef = 0) => {
        let stepDecimals = 0;
        if (isNaN(value))
            return valueDef;
        value = parseFloat(value);
        if (Math.floor(value) !== value) {
            const side = step.toString().split('.')[1];
            stepDecimals = side ? side.length : 0;
        }
        return stepDecimals ? parseFloat(value.toFixed(stepDecimals)) : value;
    };
    const hasDnd = em => {
        return 'draggable' in document.createElement('i') && (em ? em.get('Config').nativeDnD : 1);
    };
    const getElement = el => {
        if (_.isElement(el) || isTextNode(el)) {
            return el;
        } else if (el && el.getEl) {
            return el.getEl();
        }
    };
    const isTextNode = el => el && el.nodeType === 3;
    const isCommentNode = el => el && el.nodeType === 8;
    const isTaggableNode = el => el && !isTextNode(el) && !isCommentNode(el);
    const getModel = (el, $) => {
        let model = el;
        _.isElement(el) && (model = $(el).data('model'));
        return model;
    };
    const getElRect = el => {
        const def = {
            top: 0,
            left: 0,
            width: 0,
            height: 0
        };
        if (!el)
            return def;
        let rectText;
        if (isTextNode(el)) {
            const range = document.createRange();
            range.selectNode(el);
            rectText = range.getBoundingClientRect();
            range.detach();
        }
        return rectText || (el.getBoundingClientRect ? el.getBoundingClientRect() : def);
    };
    const getPointerEvent = ev => ev.touches && ev.touches[0] ? ev.touches[0] : ev;
    const getKeyCode = ev => ev.which || ev.keyCode;
    const getKeyChar = ev => String.fromCharCode(getKeyCode(ev));
    const isEscKey = ev => getKeyCode(ev) === 27;
    const capitalize = str => str && str.charAt(0).toUpperCase() + str.substring(1);
    const isComponent = obj => obj && obj.toHTML;
    const isRule = obj => obj && obj.toCSS;
    const getViewEl = el => el.__gjsv;
    const setViewEl = (el, view) => {
        el.__gjsv = view;
    };
    return {
        isCommentNode: isCommentNode,
        isTaggableNode: isTaggableNode,
        on,
        off,
        hasDnd,
        upFirst,
        matches,
        getModel,
        getElRect,
        camelCase,
        isTextNode,
        getKeyCode,
        getKeyChar,
        isEscKey,
        getElement,
        shallowDiff,
        normalizeFloat,
        getPointerEvent,
        getUnitFromValue,
        capitalize,
        getViewEl,
        setViewEl,
        appendStyles,
        isComponent,
        isRule
    };
});
define('skylark-grapejs/utils/Dragger',[
    "skylark-langx/langx",
    'skylark-underscore',
    './mixins'
], function (langx,_, mixins) {
    'use strict';
    const resetPos = () => ({
        x: 0,
        y: 0
    });
    return class Dragger {
        constructor(opts = {}) {
            this.opts = {
                container: null,
                onStart: null,
                onDrag: null,
                onEnd: null,
                setPosition: null,
                getPosition: null,
                guidesStatic: null,
                guidesTarget: null,
                snapOffset: 5,
                doc: 0,
                scale: 1
            };
            _.bindAll(this, 'drag', 'stop', 'keyHandle', 'handleScroll');
            this.setOptions(opts);
            this.delta = resetPos();
            return this;
        }
        setOptions(opts = {}) {
            this.opts = langx.mixin({},this.opts,opts);
        }
        toggleDrag(enable) {
            const docs = this.getDocumentEl();
            const container = this.getContainerEl();
            const win = this.getWindowEl();
            const method = enable ? 'on' : 'off';

            mixins[method](container, 'mousemove dragover', this.drag);
            mixins[method](docs, 'mouseup dragend touchend', this.stop);
            mixins[method](docs, 'keydown', this.keyHandle);
            mixins[method](win, 'scroll', this.handleScroll);
        }
        handleScroll() {
            const {lastScroll, delta} = this;
            const actualScroll = this.getScrollInfo();
            const scrollDiff = {
                x: actualScroll.x - lastScroll.x,
                y: actualScroll.y - lastScroll.y
            };
            this.move(delta.x + scrollDiff.x, delta.y + scrollDiff.y);
            this.lastScrollDiff = scrollDiff;
        }
        start(ev) {
            const {opts} = this;
            const {onStart} = opts;
            this.toggleDrag(1);
            this.startPointer = this.getPointerPos(ev);
            this.guidesStatic = _.result(opts, 'guidesStatic') || [];
            this.guidesTarget = _.result(opts, 'guidesTarget') || [];
            _.isFunction(onStart) && onStart(ev, this);
            this.startPosition = this.getStartPosition();
            this.lastScrollDiff = resetPos();
            this.globScrollDiff = resetPos();
            this.drag(ev);
        }
        drag(ev) {
            const {opts, lastScrollDiff, globScrollDiff} = this;
            const {onDrag} = opts;
            const {startPointer} = this;
            const currentPos = this.getPointerPos(ev);
            const glDiff = {
                x: globScrollDiff.x + lastScrollDiff.x,
                y: globScrollDiff.y + lastScrollDiff.y
            };
            this.globScrollDiff = glDiff;
            const delta = {
                x: currentPos.x - startPointer.x + glDiff.x,
                y: currentPos.y - startPointer.y + glDiff.y
            };
            this.lastScrollDiff = resetPos();
            let {lockedAxis} = this;
            if (ev.shiftKey) {
                lockedAxis = !lockedAxis && this.detectAxisLock(delta.x, delta.y);
            } else {
                lockedAxis = null;
            }
            if (lockedAxis === 'x') {
                delta.x = startPointer.x;
            } else if (lockedAxis === 'y') {
                delta.y = startPointer.y;
            }
            const moveDelta = delta => {
                [
                    'x',
                    'y'
                ].forEach(co => delta[co] = delta[co] * _.result(opts, 'scale'));
                this.delta = delta;
                this.move(delta.x, delta.y);
                _.isFunction(onDrag) && onDrag(ev, this);
            };
            const deltaPre = langx.clone(delta);
            this.currentPointer = currentPos;
            this.lockedAxis = lockedAxis;
            this.lastScroll = this.getScrollInfo();
            moveDelta(delta);
            if (this.guidesTarget.length) {
                const {newDelta, trgX, trgY} = this.snapGuides(deltaPre);
                (trgX || trgY) && moveDelta(newDelta);
            }
            ev.which === 0 && this.stop(ev);
        }
        snapGuides(delta) {
            const newDelta = delta;
            let {trgX, trgY} = this;
            this.guidesTarget.forEach(trg => {
                if (trg.x && this.trgX || trg.y && this.trgY)
                    return;
                trg.active = 0;
                this.guidesStatic.forEach(stat => {
                    if (trg.y && stat.x || trg.x && stat.y)
                        return;
                    const isY = trg.y && stat.y;
                    const axs = isY ? 'y' : 'x';
                    const trgPoint = trg[axs];
                    const statPoint = stat[axs];
                    const deltaPoint = delta[axs];
                    const trgGuide = isY ? trgY : trgX;
                    if (this.isPointIn(trgPoint, statPoint)) {
                        if (_.isUndefined(trgGuide)) {
                            const trgValue = deltaPoint - (trgPoint - statPoint);
                            this.setGuideLock(trg, trgValue);
                        }
                    }
                });
            });
            trgX = this.trgX;
            trgY = this.trgY;
            [
                'x',
                'y'
            ].forEach(co => {
                const axis = co.toUpperCase();
                let trg = this[`trg${ axis }`];
                if (trg && !this.isPointIn(delta[co], trg.lock)) {
                    this.setGuideLock(trg, null);
                    trg = null;
                }
                if (trg && !_.isUndefined(trg.lock)) {
                    newDelta[co] = trg.lock;
                }
            });
            return {
                newDelta,
                trgX: this.trgX,
                trgY: this.trgY
            };
        }
        isPointIn(src, trg, {offset} = {}) {
            const ofst = offset || this.opts.snapOffset;
            return src >= trg && src <= trg + ofst || src <= trg && src >= trg - ofst;
        }
        setGuideLock(guide, value) {
            const axis = !_.isUndefined(guide.x) ? 'X' : 'Y';
            const trgName = `trg${ axis }`;
            if (value !== null) {
                guide.active = 1;
                guide.lock = value;
                this[trgName] = guide;
            } else {
                delete guide.active;
                delete guide.lock;
                delete this[trgName];
            }
            return guide;
        }
        stop(ev, opts = {}) {
            const {delta} = this;
            const cancelled = opts.cancel;
            const x = cancelled ? 0 : delta.x;
            const y = cancelled ? 0 : delta.y;
            this.toggleDrag();
            this.lockedAxis = null;
            this.move(x, y, 1);
            const {onEnd} = this.opts;
            _.isFunction(onEnd) && onEnd(ev, this, { cancelled });
        }
        keyHandle(ev) {
            if (mixins.isEscKey(ev)) {
                this.stop(ev, { cancel: 1 });
            }
        }
        move(x, y, end) {
            const {el, opts} = this;
            const pos = this.startPosition;
            if (!pos)
                return;
            const {setPosition} = opts;
            const xPos = pos.x + x;
            const yPos = pos.y + y;
            this.position = {
                x: xPos,
                y: yPos,
                end
            };
            _.isFunction(setPosition) && setPosition(this.position);
            if (el) {
                el.style.left = `${ xPos }px`;
                el.style.top = `${ yPos }px`;
            }
        }
        getContainerEl() {
            const {container} = this.opts;
            return container ? [container] : this.getDocumentEl();
        }
        getWindowEl() {
            const cont = this.getContainerEl();
            return cont.map(item => {
                const doc = item.ownerDocument || item;
                return doc.defaultView || doc.parentWindow;
            });
        }
        getDocumentEl(el) {
            const {doc} = this.opts;
            el = el || this.el;
            if (!this.docs) {
                const docs = [document];
                el && docs.push(el.ownerDocument);
                doc && docs.push(doc);
                this.docs = docs;
            }
            return this.docs;
        }
        getPointerPos(ev) {
            const getPos = this.opts.getPointerPosition;
            const pEv = mixins.getPointerEvent(ev);
            return getPos ? getPos(ev) : {
                x: pEv.clientX,
                y: pEv.clientY
            };
        }
        getStartPosition() {
            const {el, opts} = this;
            const getPos = opts.getPosition;
            let result = resetPos();
            if (_.isFunction(getPos)) {
                result = getPos();
            } else if (el) {
                result = {
                    x: parseFloat(el.style.left),
                    y: parseFloat(el.style.top)
                };
            }
            return result;
        }
        getScrollInfo() {
            const {doc} = this.opts;
            const body = doc && doc.body;
            return {
                y: body ? body.scrollTop : 0,
                x: body ? body.scrollLeft : 0
            };
        }
        detectAxisLock(x, y) {
            const relX = x;
            const relY = y;
            const absX = Math.abs(relX);
            const absY = Math.abs(relY);
            if (relY >= absX || relY <= -absX) {
                return 'x';
            } else if (relX > absY || relX < -absY) {
                return 'y';
            }
        }
    };
});
define('skylark-grapejs/utils/Sorter',[
    'skylark-backbone',
    'skylark-underscore',
    './mixins'
], function (Backbone, _, mixins) {
    'use strict';
    const $ = Backbone.$;
    return Backbone.View.extend({
        initialize(opt) {
            this.opt = opt || {};
            _.bindAll(this, 'startSort', 'onMove', 'endMove', 'rollback', 'updateOffset', 'moveDragHelper');
            var o = opt || {};
            this.elT = 0;
            this.elL = 0;
            this.borderOffset = o.borderOffset || 10;
            var el = o.container;
            this.el = typeof el === 'string' ? document.querySelector(el) : el;
            this.$el = $(this.el);
            this.containerSel = o.containerSel || 'div';
            this.itemSel = o.itemSel || 'div';
            this.draggable = o.draggable || true;
            this.nested = o.nested || 0;
            this.pfx = o.pfx || '';
            this.ppfx = o.ppfx || '';
            this.freezeClass = o.freezeClass || this.pfx + 'freezed';
            this.onStart = o.onStart || '';
            this.onEndMove = o.onEndMove || '';
            this.direction = o.direction || 'v';
            this.onMoveClb = o.onMove || '';
            this.relative = o.relative || 0;
            this.ignoreViewChildren = o.ignoreViewChildren || 0;
            this.ignoreModels = o.ignoreModels || 0;
            this.plh = o.placer || '';
            this.wmargin = o.wmargin || 0;
            this.offTop = o.offsetTop || 0;
            this.offLeft = o.offsetLeft || 0;
            this.document = o.document || document;
            this.$document = $(this.document);
            this.dropContent = null;
            this.em = o.em || '';
            this.dragHelper = null;
            this.canvasRelative = o.canvasRelative || 0;
            this.selectOnEnd = !o.avoidSelectOnEnd;
            this.scale = o.scale;
            this.activeTextModel = null;
            if (this.em && this.em.on) {
                this.em.on('change:canvasOffset', this.updateOffset);
                this.updateOffset();
            }
        },
        getScale() {
            return _.result(this, scale) || 1;
        },
        getContainerEl(elem) {
            if (elem)
                this.el = elem;
            if (!this.el) {
                var el = this.opt.container;
                this.el = typeof el === 'string' ? document.querySelector(el) : el;
                this.$el = $(this.el);
            }
            return this.el;
        },
        getDocuments(el) {
            const em = this.em;
            const elDoc = el ? el.ownerDocument : em && em.get('Canvas').getBody().ownerDocument;
            const docs = [document];
            elDoc && docs.push(elDoc);
            return docs;
        },
        updateOffset() {
            const offset = this.em.get('canvasOffset') || {};
            this.offTop = offset.top;
            this.offLeft = offset.left;
        },
        setDropContent(content) {
            this.dropModel = null;
            this.dropContent = content;
        },
        updateTextViewCursorPosition(e) {
            const Canvas = this.em.get('Canvas');
            const targetDoc = Canvas.getDocument();
            let range = null;
            if (targetDoc.caretRangeFromPoint) {
                const poiner = mixins.getPointerEvent(e);
                range = targetDoc.caretRangeFromPoint(poiner.clientX, poiner.clientY);
            } else if (e.rangeParent) {
                range = targetDoc.createRange();
                range.setStart(e.rangeParent, e.rangeOffset);
            }
            const sel = Canvas.getWindow().getSelection();
            Canvas.getFrameEl().focus();
            sel.removeAllRanges();
            range && sel.addRange(range);
        },
        setContentEditable(model, mode) {
            if (model) {
                const el = model.getEl();
                if (el.contentEditable != mode)
                    el.contentEditable = mode;
            }
        },
        toggleSortCursor(active) {
            const {em} = this;
            const cv = em && em.get('Canvas');
            cv && (active ? cv.startAutoscroll() : cv.stopAutoscroll());
        },
        setDragHelper(el, event) {
            const ev = event || '';
            const clonedEl = el.cloneNode(1);
            const rect = el.getBoundingClientRect();
            const computed = getComputedStyle(el);
            let style = '';
            for (var i = 0; i < computed.length; i++) {
                const prop = computed[i];
                style += `${ prop }:${ computed.getPropertyValue(prop) };`;
            }
            document.body.appendChild(clonedEl);
            clonedEl.className += ` ${ this.pfx }bdrag`;
            clonedEl.setAttribute('style', style);
            this.dragHelper = clonedEl;
            clonedEl.style.width = `${ rect.width }px`;
            clonedEl.style.height = `${ rect.height }px`;
            ev && this.moveDragHelper(ev);
            if (this.em) {
                $(this.em.get('Canvas').getBody().ownerDocument).on('mousemove', this.moveDragHelper).on('mousemove', this.moveDragHelper);
            }
            $(document).on('mousemove', this.moveDragHelper).on('mousemove', this.moveDragHelper);
        },
        moveDragHelper(e) {
            const doc = e.target.ownerDocument;
            if (!this.dragHelper || !doc) {
                return;
            }
            let posY = e.pageY;
            let posX = e.pageX;
            let addTop = 0;
            let addLeft = 0;
            const window = doc.defaultView || doc.parentWindow;
            const frame = window.frameElement;
            const dragHelperStyle = this.dragHelper.style;
            if (frame) {
                const frameRect = frame.getBoundingClientRect();
                addTop = frameRect.top + document.documentElement.scrollTop;
                addLeft = frameRect.left + document.documentElement.scrollLeft;
                posY = e.clientY;
                posX = e.clientX;
            }
            dragHelperStyle.top = posY + addTop + 'px';
            dragHelperStyle.left = posX + addLeft + 'px';
        },
        matches(el, selector, useBody) {
            return mixins.matches.call(el, selector);
        },
        closest(el, selector) {
            if (!el)
                return;
            var elem = el.parentNode;
            while (elem && elem.nodeType === 1) {
                if (this.matches(elem, selector))
                    return elem;
                elem = elem.parentNode;
            }
            return null;
        },
        offset(el) {
            var rect = el.getBoundingClientRect();
            return {
                top: rect.top + document.body.scrollTop,
                left: rect.left + document.body.scrollLeft
            };
        },
        createPlaceholder() {
            var pfx = this.pfx;
            var el = document.createElement('div');
            var ins = document.createElement('div');
            el.className = pfx + 'placeholder';
            el.style.display = 'none';
            el.style['pointer-events'] = 'none';
            ins.className = pfx + 'placeholder-int';
            el.appendChild(ins);
            return el;
        },
        startSort(src, opts = {}) {
            const em = this.em;
            const itemSel = this.itemSel;
            const contSel = this.containerSel;
            const container = this.getContainerEl(opts.container);
            const docs = this.getDocuments(src);
            const onStart = this.onStart;
            let srcModel;
            let plh = this.plh;
            this.dropModel = null;
            this.target = null;
            this.prevTarget = null;
            this.moved = 0;
            if (src && !this.matches(src, `${ itemSel }, ${ contSel }`)) {
                src = this.closest(src, itemSel);
            }
            this.eV = src;
            if (!plh) {
                plh = this.createPlaceholder();
                container.appendChild(plh);
                this.plh = plh;
            }
            if (src) {
                srcModel = this.getSourceModel(src);
                srcModel && srcModel.set && srcModel.set('status', 'freezed');
                this.srcModel = srcModel;
            }
            mixins.on(container, 'mousemove dragover', this.onMove);
            mixins.on(docs, 'mouseup dragend touchend', this.endMove);
            mixins.on(docs, 'keydown', this.rollback);
            onStart && onStart({
                target: srcModel,
                parent: srcModel && srcModel.parent(),
                index: srcModel && srcModel.index()
            });
            em && em.clearSelection();
            this.toggleSortCursor(1);
            em && em.trigger('sorter:drag:start', src, srcModel);
        },
        getTargetModel(el) {
            let elem = el || this.target;
            return $(elem).data('model');
        },
        getSourceModel(source, {target, avoidChildren = 1} = {}) {
            const {em, eV} = this;
            const src = source || eV;
            let {dropModel, dropContent} = this;
            const isTextable = src => src && target && src.opt && src.opt.avoidChildren && this.isTextableActive(src, target);
            if (dropContent && em) {
                if (isTextable(dropModel)) {
                    dropModel = null;
                }
                if (!dropModel) {
                    const comps = em.get('DomComponents').getComponents();
                    const opts = {
                        avoidChildren,
                        avoidStore: 1,
                        avoidUpdateStyle: 1
                    };
                    const tempModel = comps.add(dropContent, {...opts,
                        temporary: 1
                    });
                    dropModel = comps.remove(tempModel, opts);
                    dropModel = dropModel instanceof Array ? dropModel[0] : dropModel;
                    this.dropModel = dropModel;
                    if (isTextable(dropModel)) {
                        return this.getSourceModel(src, {
                            target,
                            avoidChildren: 0
                        });
                    }
                }
                return dropModel;
            }
            return src && $(src).data('model');
        },
        selectTargetModel(model) {
            if (model instanceof Backbone.Collection) {
                return;
            }
            const {targetModel} = this;
            if (targetModel && targetModel !== this.srcModel) {
                targetModel.set('status', '');
            }
            if (model && model.set) {
                model.set('status', 'selected-parent');
                this.targetModel = model;
            }
        },
        onMove(e) {
            const ev = e;
            const {em, onMoveClb, plh} = this;
            this.moved = 1;
            var dsp = plh.style.display;
            if (!dsp || dsp === 'none')
                plh.style.display = 'block';
            var eO = this.offset(this.el);
            this.elT = this.wmargin ? Math.abs(eO.top) : eO.top;
            this.elL = this.wmargin ? Math.abs(eO.left) : eO.left;
            var rY = e.pageY - this.elT + this.el.scrollTop;
            var rX = e.pageX - this.elL + this.el.scrollLeft;
            if (this.canvasRelative && em) {
                const mousePos = em.get('Canvas').getMouseRelativeCanvas(e, { noScroll: 1 });
                rX = mousePos.x;
                rY = mousePos.y;
            }
            this.rX = rX;
            this.rY = rY;
            this.eventMove = e;
            const sourceModel = this.getSourceModel();
            const dims = this.dimsFromTarget(e.target, rX, rY);
            const target = this.target;
            const targetModel = target && this.getTargetModel(target);
            this.selectTargetModel(targetModel);
            if (!targetModel)
                plh.style.display = 'none';
            if (!target)
                return;
            this.lastDims = dims;
            const pos = this.findPosition(dims, rX, rY);
            if (this.isTextableActive(sourceModel, targetModel)) {
                this.activeTextModel = targetModel;
                this.setContentEditable(targetModel, true);
                plh.style.display = 'none';
                this.lastPos = pos;
                this.updateTextViewCursorPosition(ev);
            } else {
                this.disableTextable();
                this.activeTextModel = null;
                if (!this.lastPos || (this.lastPos.index != pos.index || this.lastPos.method != pos.method)) {
                    this.movePlaceholder(this.plh, dims, pos, this.prevTargetDim);
                    if (!this.$plh)
                        this.$plh = $(this.plh);
                    if (!this.canvasRelative) {
                        if (this.offTop)
                            this.$plh.css('top', '+=' + this.offTop + 'px');
                        if (this.offLeft)
                            this.$plh.css('left', '+=' + this.offLeft + 'px');
                    }
                    this.lastPos = pos;
                }
            }
            _.isFunction(onMoveClb) && onMoveClb({
                event: e,
                target: sourceModel,
                parent: targetModel,
                index: pos.index + (pos.method == 'after' ? 1 : 0)
            });
            em && em.trigger('sorter:drag', {
                target,
                targetModel,
                sourceModel,
                dims,
                pos,
                x: rX,
                y: rY
            });
        },
        isTextableActive(src, trg) {
            return src && src.get && src.get('textable') && trg && trg.is('text');
        },
        disableTextable() {
            const {activeTextModel} = this;
            activeTextModel && activeTextModel.getView().disableEditing();
        },
        isInFlow(el, parent) {
            if (!el)
                return false;
            parent = parent || document.body;
            var ch = -1, h;
            var elem = el;
            h = elem.offsetHeight;
            if (!this.styleInFlow(elem, parent))
                return false;
            else
                return true;
        },
        styleInFlow(el, parent) {
            if (mixins.isTextNode(el))
                return;
            const style = el.style || {};
            const $el = $(el);
            const $parent = parent && $(parent);
            if (style.overflow && style.overflow !== 'visible')
                return;
            if ($el.css('float') !== 'none')
                return;
            if ($parent && $parent.css('display') == 'flex' && $parent.css('flex-direction') !== 'column')
                return;
            switch (style.position) {
            case 'static':
            case 'relative':
            case '':
                break;
            default:
                return;
            }
            switch (el.tagName) {
            case 'TR':
            case 'TBODY':
            case 'THEAD':
            case 'TFOOT':
                return true;
            }
            switch ($el.css('display')) {
            case 'block':
            case 'list-item':
            case 'table':
            case 'flex':
                return true;
            }
            return;
        },
        validTarget(trg, src) {
            const trgModel = this.getTargetModel(trg);
            const srcModel = this.getSourceModel(src, { target: trgModel });
            src = srcModel && srcModel.view && srcModel.view.el;
            trg = trgModel && trgModel.view && trgModel.view.el;
            let result = {
                valid: true,
                src,
                srcModel,
                trg,
                trgModel
            };
            if (!src || !trg) {
                result.valid = false;
                return result;
            }
            let draggable = srcModel.get('draggable');
            draggable = draggable instanceof Array ? draggable.join(', ') : draggable;
            result.dragInfo = draggable;
            draggable = _.isString(draggable) ? this.matches(trg, draggable) : draggable;
            result.draggable = draggable;
            let droppable = trgModel.get('droppable');
            droppable = droppable instanceof Backbone.Collection ? 1 : droppable;
            droppable = droppable instanceof Array ? droppable.join(', ') : droppable;
            result.dropInfo = droppable;
            droppable = _.isString(droppable) ? this.matches(src, droppable) : droppable;
            droppable = draggable && this.isTextableActive(srcModel, trgModel) ? 1 : droppable;
            result.droppable = droppable;
            if (!droppable || !draggable) {
                result.valid = false;
            }
            return result;
        },
        dimsFromTarget(target, rX, rY) {
            const em = this.em;
            var dims = [];
            if (!target) {
                return dims;
            }
            if (!this.matches(target, `${ this.itemSel }, ${ this.containerSel }`)) {
                target = this.closest(target, this.itemSel);
            }
            if (this.draggable instanceof Array) {
                target = this.closest(target, this.draggable.join(','));
            }
            if (!target) {
                return dims;
            }
            if (this.prevTarget && this.prevTarget != target) {
                this.prevTarget = null;
            }
            if (!this.prevTarget) {
                this.targetP = this.closest(target, this.containerSel);
                let validResult = this.validTarget(target);
                em && em.trigger('sorter:drag:validation', validResult);
                if (!validResult.valid && this.targetP) {
                    return this.dimsFromTarget(this.targetP, rX, rY);
                }
                this.prevTarget = target;
                this.prevTargetDim = this.getDim(target);
                this.cacheDimsP = this.getChildrenDim(this.targetP);
                this.cacheDims = this.getChildrenDim(target);
            }
            if (this.prevTarget == target)
                dims = this.cacheDims;
            this.target = this.prevTarget;
            if (this.nearBorders(this.prevTargetDim, rX, rY) || !this.nested && !this.cacheDims.length) {
                const targetParent = this.targetP;
                if (targetParent && this.validTarget(targetParent).valid) {
                    dims = this.cacheDimsP;
                    this.target = targetParent;
                }
            }
            this.lastPos = null;
            return dims;
        },
        getTargetFromEl(el) {
            let target = el;
            let targetParent;
            let targetPrev = this.targetPrev;
            const em = this.em;
            const containerSel = this.containerSel;
            const itemSel = this.itemSel;
            if (!this.matches(target, `${ itemSel }, ${ containerSel }`)) {
                target = this.closest(target, itemSel);
            }
            if (this.draggable instanceof Array) {
                target = this.closest(target, this.draggable.join(','));
            }
            if (targetPrev && targetPrev != target) {
                this.targetPrev = '';
            }
            if (!this.targetPrev) {
                targetParent = this.closest(target, containerSel);
                const validResult = this.validTarget(target);
                em && em.trigger('sorter:drag:validation', validResult);
                if (!validResult.valid && targetParent) {
                    return this.getTargetFromEl(targetParent);
                }
                this.targetPrev = target;
            }
            if (this.nearElBorders(target)) {
                targetParent = this.closest(target, containerSel);
                if (targetParent && this.validTarget(targetParent).valid) {
                    target = targetParent;
                }
            }
            return target;
        },
        nearElBorders(el) {
            const off = 10;
            const rect = el.getBoundingClientRect();
            const body = el.ownerDocument.body;
            const {x, y} = this.getCurrentPos();
            const top = rect.top + body.scrollTop;
            const left = rect.left + body.scrollLeft;
            const width = rect.width;
            const height = rect.height;
            if (y < top + off || y > top + height - off || x < left + off || x > left + width - off) {
                return 1;
            }
        },
        getCurrentPos() {
            const ev = this.eventMove;
            const x = ev.pageX || 0;
            const y = ev.pageY || 0;
            return {
                x,
                y
            };
        },
        getDim(el) {
            const {em, canvasRelative} = this;
            var top, left, height, width;
            if (canvasRelative && em) {
                const canvas = em.get('Canvas');
                const pos = canvas.getElementPos(el, { noScroll: 1 });
                const elOffsets = canvas.getElementOffsets(el);
                top = pos.top - elOffsets.marginTop;
                left = pos.left - elOffsets.marginLeft;
                height = pos.height + elOffsets.marginTop + elOffsets.marginBottom;
                width = pos.width + elOffsets.marginLeft + elOffsets.marginRight;
            } else {
                var o = this.offset(el);
                top = this.relative ? el.offsetTop : o.top - (this.wmargin ? -1 : 1) * this.elT;
                left = this.relative ? el.offsetLeft : o.left - (this.wmargin ? -1 : 1) * this.elL;
                height = el.offsetHeight;
                width = el.offsetWidth;
            }
            return [
                top,
                left,
                height,
                width
            ];
        },
        getChildrenDim(trg) {
            const dims = [];
            if (!trg)
                return dims;
            const trgModel = this.getTargetModel(trg);
            if (trgModel && trgModel.view && !this.ignoreViewChildren) {
                const view = trgModel.getCurrentView ? trgModel.getCurrentView() : trgModel.view;
                trg = view.getChildrenContainer();
            }
            _.each(trg.children, (el, i) => {
                const model = mixins.getModel(el, $);
                const elIndex = model && model.index ? model.index() : i;
                if (!mixins.isTextNode(el) && !this.matches(el, this.itemSel)) {
                    return;
                }
                const dim = this.getDim(el);
                let dir = this.direction;
                if (dir == 'v')
                    dir = true;
                else if (dir == 'h')
                    dir = false;
                else
                    dir = this.isInFlow(el, trg);
                dim.push(dir, el, elIndex);
                dims.push(dim);
            });
            return dims;
        },
        nearBorders(dim, rX, rY) {
            var result = 0;
            var off = this.borderOffset;
            var x = rX || 0;
            var y = rY || 0;
            var t = dim[0];
            var l = dim[1];
            var h = dim[2];
            var w = dim[3];
            if (t + off > y || y > t + h - off || l + off > x || x > l + w - off)
                result = 1;
            return !!result;
        },
        findPosition(dims, posX, posY) {
            var result = {
                index: 0,
                indexEl: 0,
                method: 'before'
            };
            var leftLimit = 0, xLimit = 0, dimRight = 0, yLimit = 0, xCenter = 0, yCenter = 0, dimDown = 0, dim = 0;
            for (var i = 0, len = dims.length; i < len; i++) {
                dim = dims[i];
                dimRight = dim[1] + dim[3];
                dimDown = dim[0] + dim[2];
                xCenter = dim[1] + dim[3] / 2;
                yCenter = dim[0] + dim[2] / 2;
                if (xLimit && dim[1] > xLimit || yLimit && yCenter >= yLimit || leftLimit && dimRight < leftLimit)
                    continue;
                result.index = i;
                result.indexEl = dim[6];
                if (!dim[4]) {
                    if (posY < dimDown)
                        yLimit = dimDown;
                    if (posX < xCenter) {
                        xLimit = xCenter;
                        result.method = 'before';
                    } else {
                        leftLimit = xCenter;
                        result.method = 'after';
                    }
                } else {
                    if (posY < yCenter) {
                        result.method = 'before';
                        break;
                    } else
                        result.method = 'after';
                }
            }
            return result;
        },
        movePlaceholder(plh, dims, pos, trgDim) {
            var marg = 0, t = 0, l = 0, w = 0, h = 0, un = 'px', margI = 5, brdCol = '#62c462', brd = 3, method = pos.method;
            var elDim = dims[pos.index];
            plh.style.borderColor = 'transparent ' + brdCol;
            plh.style.borderWidth = brd + un + ' ' + (brd + 2) + un;
            plh.style.margin = '-' + brd + 'px 0 0';
            if (elDim) {
                if (!elDim[4]) {
                    w = 'auto';
                    h = elDim[2] - marg * 2 + un;
                    t = elDim[0] + marg;
                    l = method == 'before' ? elDim[1] - marg : elDim[1] + elDim[3] - marg;
                    plh.style.borderColor = brdCol + ' transparent';
                    plh.style.borderWidth = brd + 2 + un + ' ' + brd + un;
                    plh.style.margin = '0 0 0 -' + brd + 'px';
                } else {
                    w = elDim[3] + un;
                    h = 'auto';
                    t = method == 'before' ? elDim[0] - marg : elDim[0] + elDim[2] - marg;
                    l = elDim[1];
                }
            } else {
                if (!this.nested) {
                    plh.style.display = 'none';
                    return;
                }
                if (trgDim) {
                    t = trgDim[0] + margI;
                    l = trgDim[1] + margI;
                    w = parseInt(trgDim[3]) - margI * 2 + un;
                    h = 'auto';
                }
            }
            plh.style.top = t + un;
            plh.style.left = l + un;
            if (w)
                plh.style.width = w;
            if (h)
                plh.style.height = h;
        },
        endMove(e) {
            const src = this.eV;
            const moved = [];
            const docs = this.getDocuments();
            const container = this.getContainerEl();
            const onEndMove = this.onEndMove;
            const {target, lastPos} = this;
            let srcModel;
            mixins.off(container, 'mousemove dragover', this.onMove);
            mixins.off(docs, 'mouseup dragend touchend', this.endMove);
            mixins.off(docs, 'keydown', this.rollback);
            this.plh.style.display = 'none';
            if (src) {
                srcModel = this.getSourceModel();
                if (this.selectOnEnd && srcModel && srcModel.set) {
                    srcModel.set('status', '');
                    srcModel.set('status', 'selected');
                }
            }
            if (this.moved) {
                const toMove = this.toMove;
                const toMoveArr = _.isArray(toMove) ? toMove : toMove ? [toMove] : [src];
                toMoveArr.forEach(model => {
                    moved.push(this.move(target, model, lastPos));
                });
            }
            if (this.plh)
                this.plh.style.display = 'none';
            var dragHelper = this.dragHelper;
            if (dragHelper) {
                dragHelper.parentNode.removeChild(dragHelper);
                this.dragHelper = null;
            }
            this.disableTextable();
            this.selectTargetModel();
            this.toggleSortCursor();
            this.toMove = null;
            if (_.isFunction(onEndMove)) {
                const data = {
                    target: srcModel,
                    parent: srcModel && srcModel.parent(),
                    index: srcModel && srcModel.index()
                };
                moved.length ? moved.forEach(m => onEndMove(m, this, data)) : onEndMove(null, this, {
                    ...data, 
                    cancelled: 1
                });
            }
        },
        move(dst, src, pos) {
            const {em, activeTextModel, dropContent} = this;
            const srcEl = mixins.getElement(src);
            em && em.trigger('component:dragEnd:before', dst, srcEl, pos);
            var warns = [];
            var index = pos.indexEl;
            var modelToDrop, modelTemp, created;
            var validResult = this.validTarget(dst, srcEl);
            var targetCollection = $(dst).data('collection');
            var model = validResult.srcModel;
            var droppable = validResult.droppable;
            var draggable = validResult.draggable;
            var dropInfo = validResult.dropInfo;
            var dragInfo = validResult.dragInfo;
            const {trgModel} = validResult;
            droppable = trgModel instanceof Backbone.Collection ? 1 : droppable;
            const isTextableActive = this.isTextableActive(model, trgModel);
            if (targetCollection && droppable && draggable) {
                index = pos.method === 'after' ? index + 1 : index;
                var opts = {
                    at: index,
                    noIncrement: 1
                };
                if (!dropContent) {
                    opts.temporary = 1;
                    modelTemp = targetCollection.add({}, {...opts });
                    if (model.collection) {
                        modelToDrop = model.collection.remove(model, { temporary: 1 });
                    }
                } else {
                    modelToDrop = dropContent;
                    opts.silent = false;
                    opts.avoidUpdateStyle = 1;
                }
                if (isTextableActive) {
                    const viewActive = activeTextModel.getView();
                    activeTextModel.trigger('active');
                    const {activeRte} = viewActive;
                    const modelEl = model.getEl();
                    delete model.opt.temporary;
                    model.getView().render();
                    modelEl.setAttribute('data-gjs-textable', 'true');
                    const {outerHTML} = modelEl;
                    activeRte.insertHTML && activeRte.insertHTML(outerHTML);
                } else {
                    created = targetCollection.add(modelToDrop, opts);
                }
                if (!dropContent) {
                    targetCollection.remove(modelTemp);
                } else {
                    this.dropContent = null;
                }
                this.prevTarget = null;
            } else {
                if (!targetCollection) {
                    warns.push('Target collection not found');
                }
                if (!droppable) {
                    warns.push(`Target is not droppable, accepts [${ dropInfo }]`);
                }
                if (!draggable) {
                    warns.push(`Component not draggable, acceptable by [${ dragInfo }]`);
                }
                console.warn('Invalid target position: ' + warns.join(', '));
            }
            em && em.trigger('component:dragEnd', targetCollection, modelToDrop, warns);
            em && em.trigger('sorter:drag:end', {
                targetCollection,
                modelToDrop,
                warns,
                validResult,
                dst,
                srcEl
            });
            return created;
        },
        rollback(e) {
            mixins.off(this.getDocuments(), 'keydown', this.rollback);
            const key = e.which || e.keyCode;
            if (key == 27) {
                this.moved = 0;
                this.endMove();
            }
        }
    });
});
define('skylark-grapejs/utils/Resizer',[
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
define('skylark-grapejs/utils/index',[
    './Dragger',
    './Sorter',
    './Resizer'
], function (Dragger, Sorter, Resizer) {
    'use strict';
    return () => {
        return {
            name: 'Utils',
            init() {
                return this;
            },
            Sorter,
            Resizer,
            Dragger
        };
    };
});
define('skylark-grapejs/i18n/locale/en',[],function () {
    'use strict';
    const traitInputAttr = { placeholder: 'eg. Text here' };
    return {
        assetManager: {
            addButton: 'Add image',
            inputPlh: 'http://path/to/the/image.jpg',
            modalTitle: 'Select Image',
            uploadTitle: 'Drop files here or click to upload'
        },
        blockManager: {
            labels: {},
            categories: {}
        },
        domComponents: {
            names: {
                '': 'Box',
                wrapper: 'Body',
                text: 'Text',
                comment: 'Comment',
                image: 'Image',
                video: 'Video',
                label: 'Label',
                link: 'Link',
                map: 'Map',
                tfoot: 'Table foot',
                tbody: 'Table body',
                thead: 'Table head',
                table: 'Table',
                row: 'Table row',
                cell: 'Table cell'
            }
        },
        deviceManager: {
            device: 'Device',
            devices: {
                desktop: 'Desktop',
                tablet: 'Tablet',
                mobileLandscape: 'Mobile Landscape',
                mobilePortrait: 'Mobile Portrait'
            }
        },
        panels: {
            buttons: {
                titles: {
                    preview: 'Preview',
                    fullscreen: 'Fullscreen',
                    'sw-visibility': 'View components',
                    'export-template': 'View code',
                    'open-sm': 'Open Style Manager',
                    'open-tm': 'Settings',
                    'open-layers': 'Open Layer Manager',
                    'open-blocks': 'Open Blocks'
                }
            }
        },
        selectorManager: {
            label: 'Classes',
            selected: 'Selected',
            emptyState: '- State -',
            states: {
                hover: 'Hover',
                active: 'Click',
                'nth-of-type(2n)': 'Even/Odd'
            }
        },
        styleManager: {
            empty: 'Select an element before using Style Manager',
            layer: 'Layer',
            fileButton: 'Images',
            sectors: {
                general: 'General',
                layout: 'Layout',
                typography: 'Typography',
                decorations: 'Decorations',
                extra: 'Extra',
                flex: 'Flex',
                dimension: 'Dimension'
            },
            properties: {}
        },
        traitManager: {
            empty: 'Select an element before using Trait Manager',
            label: 'Component settings',
            traits: {
                labels: {},
                attributes: {
                    id: traitInputAttr,
                    alt: traitInputAttr,
                    title: traitInputAttr,
                    href: { placeholder: 'eg. https://google.com' }
                },
                options: {
                    target: {
                        false: 'This window',
                        _blank: 'New window'
                    }
                }
            }
        }
    };
});
define('skylark-grapejs/i18n/config',['./locale/en'], function (en) {
    'use strict';
    return {
        locale: 'en',
        localeFallback: 'en',
        detectLocale: 1,
        debug: 0,
        messages: { en }
    };
});
define('skylark-grapejs/i18n/index',[
    "skylark-langx/langx",
    'skylark-underscore',
    './config'
], function (langx,_, config) {
    'use strict';
    const isObj = el => !Array.isArray(el) && el !== null && typeof el === 'object';
    const deepAssign = (...args) => {
        const target = lang.mixin({},args[0] );
        for (let i = 1; i < args.length; i++) {
            const source = lang.mixin({},args[i] );
            for (let key in source) {
                const targValue = target[key];
                const srcValue = source[key];
                if (isObj(targValue) && isObj(srcValue)) {
                    target[key] = deepAssign(targValue, srcValue);
                } else {
                    target[key] = srcValue;
                }
            }
        }
        return target;
    };
    return () => {
        return {
            name: 'I18n',
            config,
            init(opts = {}) {
                this.config = langx.mixin({},config,opts,{
                    messages: langx.mixin({},
                        config.messages,
                        opts.messages
                    )
                });
                if (this.config.detectLocale) {
                    this.config.locale = this._localLang();
                }
                this.em = opts.em;
                return this;
            },
            getConfig() {
                return this.config;
            },
            setLocale(locale) {
                const {em, config} = this;
                const evObj = {
                    value: locale,
                    valuePrev: config.locale
                };
                em && em.trigger('i18n:locale', evObj);
                config.locale = locale;
                return this;
            },
            getLocale() {
                return this.config.locale;
            },
            getMessages(lang, opts = {}) {
                const {messages} = this.config;
                lang && !messages[lang] && this._debug(`'${ lang }' i18n lang not found`, opts);
                return lang ? messages[lang] : messages;
            },
            setMessages(msg) {
                const {em, config} = this;
                config.messages = msg;
                em && em.trigger('i18n:update', msg);
                return this;
            },
            addMessages(msg) {
                const {em} = this;
                const {messages} = this.config;
                em && em.trigger('i18n:add', msg);
                this.setMessages(deepAssign(messages, msg));
                return this;
            },
            t(key, opts = {}) {
                const {config} = this;
                const param = opts.params || {};
                const locale = opts.l || this.getLocale();
                const localeFlb = opts.lFlb || config.localeFallback;
                let result = this._getMsg(key, locale, opts);
                if (!result)
                    result = this._getMsg(key, localeFlb, opts);
                !result && this._debug(`'${ key }' i18n key not found in '${ locale }' lang`, opts);
                result = result && _.isString(result) ? this._addParams(result, param) : result;
                return result;
            },
            _localLang() {
                const nav = window.navigator || {};
                const lang = nav.language || nav.userLanguage;
                return lang ? lang.split('-')[0] : 'en';
            },
            _addParams(str, params) {
                const reg = new RegExp(`\{([\\w\\d-]*)\}`, 'g');
                return str.replace(reg, (m, val) => params[val] || '').trim();
            },
            _getMsg(key, locale, opts = {}) {
                const msgSet = this.getMessages(locale, opts);
                if (!msgSet)
                    return;
                let result = msgSet[key];
                if (!result && key.indexOf('.') > 0) {
                    result = key.split('.').reduce((lang, key) => {
                        if (_.isUndefined(lang))
                            return;
                        return lang[key];
                    }, msgSet);
                }
                return result;
            },
            _debug(str, opts = {}) {
                const {em, config} = this;
                (opts.debug || config.debug) && em && em.logWarning(str);
            }
        };
    };
});
define('skylark-grapejs/keymaps/keymaster',[],function(){
  var k,
    _handlers = {},
    _mods = { 16: false, 18: false, 17: false, 91: false },
    _scope = 'all',
    // modifier keys
    _MODIFIERS = {
      '⇧': 16, shift: 16,
      '⌥': 18, alt: 18, option: 18,
      '⌃': 17, ctrl: 17, control: 17,
      '⌘': 91, command: 91
    },
    // special keys
    _MAP = {
      backspace: 8, tab: 9, clear: 12,
      enter: 13, 'return': 13,
      esc: 27, escape: 27, space: 32,
      left: 37, up: 38,
      right: 39, down: 40,
      del: 46, 'delete': 46,
      home: 36, end: 35,
      pageup: 33, pagedown: 34,
      ',': 188, '.': 190, '/': 191,
      '`': 192, '-': 189, '=': 187,
      ';': 186, '\'': 222,
      '[': 219, ']': 221, '\\': 220
    },
    code = function(x){
      return _MAP[x] || x.toUpperCase().charCodeAt(0);
    },
    _downKeys = [];

  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;

  // IE doesn't support Array#indexOf, so have a simple replacement
  function index(array, item){
    var i = array.length;
    while(i--) if(array[i]===item) return i;
    return -1;
  }

  // for comparing mods before unassignment
  function compareArray(a1, a2) {
    if (a1.length != a2.length) return false;
    for (var i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) return false;
    }
    return true;
  }

  var modifierMap = {
      16:'shiftKey',
      18:'altKey',
      17:'ctrlKey',
      91:'metaKey'
  };
  function updateModifierKey(event) {
      for(k in _mods) _mods[k] = event[modifierMap[k]];
  };

  // handle keydown event
  function dispatch(event) {
    var key, handler, k, i, modifiersMatch, scope;
    key = event.keyCode;

    if (index(_downKeys, key) == -1) {
        _downKeys.push(key);
    }

    // if a modifier key, set the key.<modifierkeyname> property to true and return
    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
    if(key in _mods) {
      _mods[key] = true;
      // 'assignKey' from inside this closure is exported to window.key
      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
      return;
    }
    updateModifierKey(event);

    // see if we need to ignore the keypress (filter() can can be overridden)
    // by default ignore key presses if a select, textarea, or input is focused
    if(!assignKey.filter.call(this, event)) return;

    // abort if no potentially matching shortcuts found
    if (!(key in _handlers)) return;

    scope = getScope();

    // for each potential shortcut
    for (i = 0; i < _handlers[key].length; i++) {
      handler = _handlers[key][i];

      // see if it's in the current scope
      if(handler.scope == scope || handler.scope == 'all'){
        // check if modifiers match if any
        modifiersMatch = handler.mods.length > 0;
        for(k in _mods)
          if((!_mods[k] && index(handler.mods, +k) > -1) ||
            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
        // call the handler and stop the event if neccessary
        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
          if(handler.method(event, handler)===false){
            if(event.preventDefault) event.preventDefault();
              else event.returnValue = false;
            if(event.stopPropagation) event.stopPropagation();
            if(event.cancelBubble) event.cancelBubble = true;
          }
        }
      }
    }
  };

  // unset modifier keys on keyup
  function clearModifier(event){
    var key = event.keyCode, k,
        i = index(_downKeys, key);

    // remove key from _downKeys
    if (i >= 0) {
        _downKeys.splice(i, 1);
    }

    if(key == 93 || key == 224) key = 91;
    if(key in _mods) {
      _mods[key] = false;
      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
    }
  };

  function resetModifiers() {
    for(k in _mods) _mods[k] = false;
    for(k in _MODIFIERS) assignKey[k] = false;
  };

  // parse and assign shortcut
  function assignKey(key, scope, method){
    var keys, mods;
    keys = getKeys(key);
    if (method === undefined) {
      method = scope;
      scope = 'all';
    }

    // for each shortcut
    for (var i = 0; i < keys.length; i++) {
      // set modifier keys if any
      mods = [];
      key = keys[i].split('+');
      if (key.length > 1){
        mods = getMods(key);
        key = [key[key.length-1]];
      }
      // convert to keycode and...
      key = key[0]
      key = code(key);
      // ...store handler
      if (!(key in _handlers)) _handlers[key] = [];
      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
    }
  };

  // unbind all handlers for given key in current scope
  function unbindKey(key, scope) {
    var multipleKeys, keys,
      mods = [],
      i, j, obj;

    multipleKeys = getKeys(key);

    for (j = 0; j < multipleKeys.length; j++) {
      keys = multipleKeys[j].split('+');

      if (keys.length > 1) {
        mods = getMods(keys);
        key = keys[keys.length - 1];
      }

      key = code(key);

      if (scope === undefined) {
        scope = getScope();
      }
      if (!_handlers[key]) {
        return;
      }
      for (i = 0; i < _handlers[key].length; i++) {
        obj = _handlers[key][i];
        // only clear handlers if correct scope and mods match
        if (obj.scope === scope && compareArray(obj.mods, mods)) {
          _handlers[key][i] = {};
        }
      }
    }
  };

  // Returns true if the key with code 'keyCode' is currently down
  // Converts strings into key codes.
  function isPressed(keyCode) {
      if (typeof(keyCode)=='string') {
        keyCode = code(keyCode);
      }
      return index(_downKeys, keyCode) != -1;
  }

  function getPressedKeyCodes() {
      return _downKeys.slice(0);
  }

  function filter(event){
    var tagName = (event.target || event.srcElement).tagName;
    // ignore keypressed in any elements that support keyboard data input
    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
  }

  // initialize key.<modifier> to false
  for(k in _MODIFIERS) assignKey[k] = false;

  // set current scope (default 'all')
  function setScope(scope){ _scope = scope || 'all' };
  function getScope(){ return _scope || 'all' };

  // delete all handlers for a given scope
  function deleteScope(scope){
    var key, handlers, i;

    for (key in _handlers) {
      handlers = _handlers[key];
      for (i = 0; i < handlers.length; ) {
        if (handlers[i].scope === scope) handlers.splice(i, 1);
        else i++;
      }
    }
  };

  // abstract key logic for assign and unassign
  function getKeys(key) {
    var keys;
    key = key.replace(/\s/g, '');
    keys = key.split(',');
    if ((keys[keys.length - 1]) == '') {
      keys[keys.length - 2] += ',';
    }
    return keys;
  }

  // abstract mods logic for assign and unassign
  function getMods(key) {
    var mods = key.slice(0, key.length - 1);
    for (var mi = 0; mi < mods.length; mi++)
    mods[mi] = _MODIFIERS[mods[mi]];
    return mods;
  }

  // cross-browser events
  function addEvent(object, event, method) {
    if (object.addEventListener)
      object.addEventListener(event, method, false);
    else if(object.attachEvent)
      object.attachEvent('on'+event, function(){ method(window.event) });
  };

  // set the handlers globally on document
  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
  addEvent(document, 'keyup', clearModifier);

  // reset modifiers to false whenever the window is (re)focused.
  addEvent(window, 'focus', resetModifiers);

  /*

  // store previously defined key
  var previousKey = global.key;

  // restore previously defined key and return reference to our key object
  function noConflict() {
    var k = global.key;
    global.key = previousKey;
    return k;
  }

  // set window.key and window.key.set/get/deleteScope, and the default filter
  global.key = assignKey;
  global.key.setScope = setScope;
  global.key.getScope = getScope;
  global.key.deleteScope = deleteScope;
  global.key.filter = filter;
  global.key.isPressed = isPressed;
  global.key.getPressedKeyCodes = getPressedKeyCodes;
  global.key.noConflict = noConflict;
  global.key.unbind = unbindKey;
*/
  assignKey.setScope = setScope;
  assignKey.getScope = getScope;
  assignKey.deleteScope = deleteScope;
  assignKey.filter = filter;
  assignKey.isPressed = isPressed;
  assignKey.getPressedKeyCodes = getPressedKeyCodes;
  assignKey.unbind = unbindKey;

  return assignKey;

});

define('skylark-grapejs/keymaps/index',[
    "skylark-langx/langx",
    'skylark-underscore',
    './keymaster'
], function (langx,_, keymaster) {
    'use strict';
    return () => {
        let em;
        let config;
        const keymaps = {};
        const configDef = {
            defaults: {
                'core:undo': {
                    keys: '\u2318+z, ctrl+z',
                    handler: 'core:undo'
                },
                'core:redo': {
                    keys: '\u2318+shift+z, ctrl+shift+z',
                    handler: 'core:redo'
                },
                'core:copy': {
                    keys: '\u2318+c, ctrl+c',
                    handler: 'core:copy'
                },
                'core:paste': {
                    keys: '\u2318+v, ctrl+v',
                    handler: 'core:paste'
                },
                'core:component-next': {
                    keys: 's',
                    handler: 'core:component-next'
                },
                'core:component-prev': {
                    keys: 'w',
                    handler: 'core:component-prev'
                },
                'core:component-enter': {
                    keys: 'd',
                    handler: 'core:component-enter'
                },
                'core:component-exit': {
                    keys: 'a',
                    handler: 'core:component-exit'
                },
                'core:component-delete': {
                    keys: 'backspace, delete',
                    handler: 'core:component-delete'
                }
            }
        };
        return {
            keymaster,
            name: 'Keymaps',
            getConfig() {
                return config;
            },
            init(opts = {}) {
                config = langx.mixin({},
                    configDef,
                    opts
                );
                em = config.em;
                this.em = em;
                return this;
            },
            onLoad() {
                const defKeys = config.defaults;
                for (let id in defKeys) {
                    const value = defKeys[id];
                    this.add(id, value.keys, value.handler);
                }
            },
            add(id, keys, handler, opts = {}) {
                const {em} = this;
                const cmd = em.get('Commands');
                const editor = em.getEditor();
                const canvas = em.get('Canvas');
                const keymap = {
                    id,
                    keys,
                    handler
                };
                const pk = keymaps[id];
                pk && this.remove(id);
                keymaps[id] = keymap;
                keymaster(keys, (e, h) => {
                    const opt = {
                        event: e,
                        h
                    };
                    handler = _.isString(handler) ? cmd.get(handler) : handler;
                    opts.prevent && canvas.getCanvasView().preventDefault(e);
                    const ableTorun = !em.isEditing() && !editor.Canvas.isInputFocused();
                    if (ableTorun || opts.force) {
                        typeof handler == 'object' ? handler.run(editor, 0, opt) : handler(editor, 0, opt);
                        const args = [
                            id,
                            h.shortcut,
                            e
                        ];
                        em.trigger('keymap:emit', ...args);
                        em.trigger(`keymap:emit:${ id }`, ...args);
                    }
                });
                em.trigger('keymap:add', keymap);
                return keymap;
            },
            get(id) {
                return keymaps[id];
            },
            getAll() {
                return keymaps;
            },
            remove(id) {
                const em = this.em;
                const keymap = this.get(id);
                if (keymap) {
                    delete keymaps[id];
                    keymaster.unbind(keymap.keys);
                    em && em.trigger('keymap:remove', keymap);
                    return keymap;
                }
            },
            removeAll() {
                Object.keys(keymaps).forEach(keymap => this.remove(keymap));
                return this;
            }
        };
    };
});
define('skylark-grapejs/undo_manager/index',[
    "skylark-langx/langx",
    'skylark-backbone/UndoManager'
], function (langx,UndoManager) {
    'use strict';
    return () => {
        let em;
        let um;
        let config;
        let beforeCache;
        const configDef = {};
        return {
            name: 'UndoManager',
            init(opts = {}) {
                config = langx.mixin({},opts,configDef);
                em = config.em;
                this.em = em;
                um = new UndoManager(langx.mixin({
                            track: true,
                            register: [],
                        },config
                ));
                um.changeUndoType('change', { condition: false });
                um.changeUndoType('add', {
                    on(model, collection, options = {}) {
                        if (options.avoidStore)
                            return;
                        return {
                            object: collection,
                            before: undefined,
                            after: model,
                            options: langx.clone(options)
                        };
                    }
                });
                um.changeUndoType('remove', {
                    on(model, collection, options = {}) {
                        if (options.avoidStore)
                            return;
                        return {
                            object: collection,
                            before: model,
                            after: undefined,
                            options: langx.clone(options)
                        };
                    }
                });
                const customUndoType = {
                    on(object, value, opt = {}) {
                        !beforeCache && (beforeCache = object.previousAttributes());
                        if (opt.avoidStore) {
                            return;
                        } else {
                            const result = {
                                object,
                                before: beforeCache,
                                after: object.toJSON()
                            };
                            beforeCache = null;
                            return result;
                        }
                    },
                    undo(model, bf, af, opt) {
                        model.set(bf);
                    },
                    redo(model, bf, af, opt) {
                        model.set(af);
                    }
                };
                const events = [
                    'style',
                    'attributes',
                    'content',
                    'src'
                ];
                events.forEach(ev => um.addUndoType(`change:${ ev }`, customUndoType));
                um.on('undo redo', () => em.trigger('component:toggled change:canvasOffset'));
                [
                    'undo',
                    'redo'
                ].forEach(ev => um.on(ev, () => em.trigger(ev)));
                return this;
            },
            getConfig() {
                return config;
            },
            add(entity) {
                um.register(entity);
                return this;
            },
            remove(entity) {
                um.unregister(entity);
                return this;
            },
            removeAll() {
                um.unregisterAll();
                return this;
            },
            start() {
                um.startTracking();
                return this;
            },
            stop() {
                um.stopTracking();
                return this;
            },
            undo() {
                !em.isEditing() && um.undo(1);
                return this;
            },
            undoAll() {
                um.undoAll();
                return this;
            },
            redo() {
                !em.isEditing() && um.redo(1);
                return this;
            },
            redoAll() {
                um.redoAll();
                return this;
            },
            hasUndo() {
                return um.isAvailable('undo');
            },
            hasRedo() {
                return um.isAvailable('redo');
            },
            getStack() {
                return um.stack;
            },
            clear() {
                um.clear();
                return this;
            },
            getInstance() {
                return um;
            }
        };
    };
});
define('skylark-grapejs/storage_manager/config/config',[],function () {
    'use strict';
    return {
        id: 'gjs-',
        autosave: 1,
        autoload: 1,
        type: 'local',
        stepsBeforeSave: 1,
        storeComponents: 1,
        storeStyles: 1,
        storeHtml: 1,
        storeCss: 1,
        checkLocal: 1,
        params: {},
        headers: {},
        urlStore: '',
        urlLoad: '',
        beforeSend(jqXHR, settings) {
        },
        onComplete(jqXHR, status) {
        },
        contentTypeJson: true,
        credentials: 'include',
        fetchOptions: ''
    };
});
define('skylark-grapejs/storage_manager/model/LocalStorage',['skylark-backbone'], function (Backbone) {
    'use strict';
    return Backbone.Model.extend({
        defaults: { checkLocal: true },
        store(data, clb) {
            this.checkStorageEnvironment();
            for (var key in data)
                localStorage.setItem(key, data[key]);
            if (typeof clb == 'function') {
                clb();
            }
        },
        load(keys, clb) {
            this.checkStorageEnvironment();
            var result = {};
            for (var i = 0, len = keys.length; i < len; i++) {
                var value = localStorage.getItem(keys[i]);
                if (value)
                    result[keys[i]] = value;
            }
            if (typeof clb == 'function') {
                clb(result);
            }
            return result;
        },
        remove(keys) {
            this.checkStorageEnvironment();
            for (var i = 0, len = keys.length; i < len; i++)
                localStorage.removeItem(keys[i]);
        },
        checkStorageEnvironment() {
            if (this.get('checkLocal') && !localStorage)
                console.warn("Your browser doesn't support localStorage");
        }
    });
});
define('skylark-grapejs/utils/fetch',[
], function () {
    'use strict';
    return typeof fetch == 'function' ? fetch.bind() : (url, options) => {
        return new Promise((res, rej) => {
            const req = new XMLHttpRequest();
            req.open(options.method || 'get', url);
            req.withCredentials = options.credentials == 'include';
            for (let k in options.headers || {}) {
                req.setRequestHeader(k, options.headers[k]);
            }
            req.onload = e => res({
                status: req.status,
                statusText: req.statusText,
                text: () => Promise.resolve(req.responseText)
            });
            req.onerror = rej;
            if (req.upload && options.onProgress) {
                req.upload.onprogress = options.onProgress;
            }
            options.body ? req.send(options.body) : req.send();
        });
    };
});
define('skylark-grapejs/storage_manager/model/RemoteStorage',[
    "skylark-langx/langx",
    'skylark-backbone',
    '../../utils/fetch',
    'skylark-underscore'
], function (langx,Backbone, fetch, a) {
    'use strict';
    return Backbone.Model.extend({
        fetch,
        defaults: {
            urlStore: '',
            urlLoad: '',
            params: {},
            beforeSend() {
            },
            onComplete() {
            },
            contentTypeJson: false,
            credentials: 'include',
            fetchOptions: ''
        },
        onStart() {
            const em = this.get('em');
            const before = this.get('beforeSend');
            before && before();
        },
        onError(err, clbErr) {
            if (clbErr) {
                clbErr(err);
            } else {
                const em = this.get('em');
                console.error(err);
                em && em.trigger('storage:error', err);
            }
        },
        onResponse(text, clb) {
            const em = this.get('em');
            const complete = this.get('onComplete');
            const typeJson = this.get('contentTypeJson');
            const parsable = text && typeof text === 'string';
            const res = typeJson && parsable ? JSON.parse(text) : text;
            complete && complete(res);
            clb && clb(res);
            em && em.trigger('storage:response', res);
        },
        store(data, clb, clbErr) {
            const body = {};
            for (let key in data) {
                body[key] = data[key];
            }
            this.request(this.get('urlStore'), { body }, clb, clbErr);
        },
        load(keys, clb, clbErr) {
            this.request(this.get('urlLoad'), { method: 'get' }, clb, clbErr);
        },
        request(url, opts = {}, clb = null, clbErr = null) {
            const typeJson = this.get('contentTypeJson');
            const headers = this.get('headers') || {};
            const params = this.get('params');
            const reqHead = 'X-Requested-With';
            const typeHead = 'Content-Type';
            const bodyObj = opts.body || {};
            let fetchOptions;
            let body;
            for (let param in params) {
                bodyObj[param] = params[param];
            }
            if (a.isUndefined(headers[reqHead])) {
                headers[reqHead] = 'XMLHttpRequest';
            }
            if (a.isUndefined(headers[typeHead]) && typeJson) {
                headers[typeHead] = 'application/json; charset=utf-8';
            }
            if (typeJson) {
                body = JSON.stringify(bodyObj);
            } else {
                body = new FormData();
                for (let bodyKey in bodyObj) {
                    body.append(bodyKey, bodyObj[bodyKey]);
                }
            }
            fetchOptions = {
                method: opts.method || 'post',
                credentials: this.get('credentials'),
                headers
            };
            if (fetchOptions.method === 'post') {
                fetchOptions.body = body;
            }
            const fetchOpts = this.get('fetchOptions') || {};
            const addOpts = a.isFunction(fetchOpts) ? fetchOpts(fetchOptions) : fetchOptions;
            this.onStart();
            this.fetch(url, langx.mixin({},fetchOptions,addOpts)).then(
                res => (res.status / 200 | 0) == 1 ? res.text() : res.text().then(text => Promise.reject(text))).then(text => this.onResponse(text, clb)).catch(err => this.onError(err, clbErr));
        }
    });
});
define('skylark-grapejs/storage_manager/index',[
    "skylark-langx/langx",
    './config/config',
    './model/LocalStorage',
    './model/RemoteStorage'
], function (langx,defaults, LocalStorage, RemoteStorage) {
    'use strict';
    return () => {
        var c = {};
        let em;
        var storages = {};
        var defaultStorages = {};
        const eventStart = 'storage:start';
        const eventEnd = 'storage:end';
        const eventError = 'storage:error';
        return {
            name: 'StorageManager',
            init(config = {}) {
                c = langx.mixin({},defaults,config);
                em = c.em;
                if (c._disable)
                    c.type = 0;
                defaultStorages.remote = new RemoteStorage(c);
                defaultStorages.local = new LocalStorage(c);
                c.currentStorage = c.type;
                this.loadDefaultProviders().setCurrent(c.type);
                return this;
            },
            getConfig() {
                return c;
            },
            isAutosave() {
                return !!c.autosave;
            },
            setAutosave(v) {
                c.autosave = !!v;
                return this;
            },
            getStepsBeforeSave() {
                return c.stepsBeforeSave;
            },
            setStepsBeforeSave(v) {
                c.stepsBeforeSave = v;
                return this;
            },
            add(id, storage) {
                storages[id] = storage;
                return this;
            },
            get(id) {
                return storages[id] || null;
            },
            getStorages() {
                return storages;
            },
            getCurrent() {
                return c.currentStorage;
            },
            setCurrent(id) {
                c.currentStorage = id;
                return this;
            },
            store(data, clb) {
                const st = this.get(this.getCurrent());
                const toStore = {};
                this.onStart('store', data);
                for (let key in data) {
                    toStore[c.id + key] = data[key];
                }
                return st ? st.store(toStore, res => {
                    clb && clb(res);
                    this.onEnd('store', res);
                }, err => {
                    this.onError('store', err);
                }) : null;
            },
            load(keys, clb) {
                var st = this.get(this.getCurrent());
                var keysF = [];
                var result = {};
                if (typeof keys === 'string')
                    keys = [keys];
                this.onStart('load', keys);
                for (var i = 0, len = keys.length; i < len; i++) {
                    keysF.push(c.id + keys[i]);
                }
                if (st) {
                    st.load(keysF, res => {
                        var reg = new RegExp('^' + c.id + '');
                        for (var itemKey in res) {
                            var itemKeyR = itemKey.replace(reg, '');
                            result[itemKeyR] = res[itemKey];
                        }
                        clb && clb(result);
                        this.onEnd('load', result);
                    }, err => {
                        clb && clb(result);
                        this.onError('load', err);
                    });
                } else {
                    clb && clb(result);
                }
            },
            loadDefaultProviders() {
                for (var id in defaultStorages)
                    this.add(id, defaultStorages[id]);
                return this;
            },
            getCurrentStorage() {
                return this.get(this.getCurrent());
            },
            onStart(ctx, data) {
                if (em) {
                    em.trigger(eventStart);
                    ctx && em.trigger(`${ eventStart }:${ ctx }`, data);
                }
            },
            onEnd(ctx, data) {
                if (em) {
                    em.trigger(eventEnd);
                    ctx && em.trigger(`${ eventEnd }:${ ctx }`, data);
                }
            },
            onError(ctx, data) {
                if (em) {
                    em.trigger(eventError, data);
                    ctx && em.trigger(`${ eventError }:${ ctx }`, data);
                    this.onEnd(ctx, data);
                }
            },
            canAutoload() {
                const storage = this.getCurrentStorage();
                return storage && this.getConfig().autoload;
            }
        };
    };
});
define('skylark-grapejs/device_manager/config/config',[],function () {
    'use strict';
    return { devices: [] };
});
define('skylark-grapejs/device_manager/model/Device',['skylark-backbone'], function (Backbone) {
    'use strict';
    return Backbone.Model.extend({
        idAttribute: 'name',
        defaults: {
            name: '',
            width: null,
            height: '',
            widthMedia: null,
            priority: null
        },
        initialize() {
            this.get('widthMedia') === null && this.set('widthMedia', this.get('width'));
            this.get('width') === null && this.set('width', this.get('widthMedia'));
            !this.get('priority') && this.set('priority', parseFloat(this.get('widthMedia')) || 0);
            const toCheck = [
                'width',
                'height',
                'widthMedia'
            ];
            toCheck.forEach(prop => this.checkUnit(prop));
        },
        checkUnit(prop) {
            const pr = this.get(prop) || '';
            const noUnit = (parseFloat(pr) || 0).toString() === pr.toString();
            noUnit && this.set(prop, `${ pr }px`);
        }
    });
});
define('skylark-grapejs/device_manager/model/Devices',[
    'skylark-backbone',
    './Device'
], function (Backbone, Device) {
    'use strict';
    return Backbone.Collection.extend({
        model: Device,
        comparator: (left, right) => {
            const max = Number.MAX_VALUE;
            return (right.get('priority') || max) - (left.get('priority') || max);
        },
        getSorted() {
            return this.sort();
        }
    });
});
define('skylark-grapejs/device_manager/view/DevicesView',[
    'skylark-underscore',
    'skylark-backbone'
], function (_, Backbone) {
    'use strict';
    return Backbone.View.extend({
        template: _.template(`
    <div class="<%= ppfx %>device-label"><%= deviceLabel %></div>
    <div class="<%= ppfx %>field <%= ppfx %>select">
      <span id="<%= ppfx %>input-holder">
        <select class="<%= ppfx %>devices"></select>
      </span>
      <div class="<%= ppfx %>sel-arrow">
        <div class="<%= ppfx %>d-s-arrow"></div>
      </div>
    </div>
    <button style="display:none" class="<%= ppfx %>add-trasp">+</button>`),
        events: { change: 'updateDevice' },
        initialize(o) {
            this.config = o.config || {};
            this.em = this.config.em;
            this.ppfx = this.config.pStylePrefix || '';
            this.events['click .' + this.ppfx + 'add-trasp'] = this.startAdd;
            this.listenTo(this.em, 'change:device', this.updateSelect);
            this.delegateEvents();
        },
        startAdd() {
        },
        updateDevice() {
            var em = this.em;
            if (em) {
                var devEl = this.devicesEl;
                var val = devEl ? devEl.val() : '';
                em.set('device', val);
            }
        },
        updateSelect() {
            var em = this.em;
            var devEl = this.devicesEl;
            if (em && em.getDeviceModel && devEl) {
                var device = em.getDeviceModel();
                var name = device ? device.get('name') : '';
                devEl.val(name);
            }
        },
        getOptions() {
            const {collection, em} = this;
            let result = '';
            collection.each(device => {
                const {name, id} = device.attributes;
                const label = em && em.t && em.t(`deviceManager.devices.${ id }`) || name;
                result += `<option value="${ name }">${ label }</option>`;
            });
            return result;
        },
        render() {
            const {em, ppfx, $el, el} = this;
            $el.html(this.template({
                ppfx,
                deviceLabel: em && em.t && em.t('deviceManager.device')
            }));
            this.devicesEl = $el.find(`.${ ppfx }devices`);
            this.devicesEl.append(this.getOptions());
            el.className = `${ ppfx }devices-c`;
            return this;
        }
    });
});
define('skylark-grapejs/device_manager/index',[
    "skylark-langx/langx",
    './config/config',
    './model/Devices',
    './view/DevicesView'
], function (langx,defaults, Devices, DevicesView) {
    'use strict';
    return () => {
        var c = {};
        var devices, view;
        return {
            name: 'DeviceManager',
            init(config) {
                c = config || {};
                for (var name in defaults) {
                    if (!(name in c))
                        c[name] = defaults[name];
                }
                devices = new Devices();
                (c.devices || []).forEach(dv => this.add(dv.id || dv.name, dv.width, dv));
                view = new DevicesView({
                    collection: devices,
                    config: c
                });
                return this;
            },
            add(id, width, opts = {}) {
                const obj = langx.mixin({},opts,{
                    id,
                    name: opts.name || id,
                    width: width
                });
                return devices.add(obj);
            },
            get(name) {
                return devices.get(name);
            },
            getAll() {
                return devices;
            },
            render() {
                return view.render().el;
            }
        };
    };
});
define('skylark-grapejs/parser/config/config',[],function () {
    'use strict';
    return {
        textTags: [
            'br',
            'b',
            'i',
            'u',
            'a',
            'ul',
            'ol'
        ],
        parserCss: null,
        parserHtml: null
    };
});
define('skylark-grapejs/parser/model/BrowserParserCss',['skylark-underscore'], function (_) {
    'use strict';
    const atRules = {
        4: 'media',
        5: 'font-face',
        6: 'page',
        7: 'keyframes',
        11: 'counter-style',
        12: 'supports',
        13: 'document',
        14: 'font-feature-values',
        15: 'viewport'
    };
    const atRuleKeys = _.keys(atRules);
    const singleAtRules = [
        '5',
        '6',
        '11',
        '15'
    ];
    const singleAtRulesNames = [
        'font-face',
        'page',
        'counter-style',
        'viewport'
    ];
    const parseSelector = (str = '') => {
        const add = [];
        const result = [];
        const sels = str.split(',');
        for (var i = 0, len = sels.length; i < len; i++) {
            var sel = sels[i].trim();
            if (/^(\.{1}[\w\-]+)+(:{1,2}[\w\-()]+)?$/gi.test(sel) || /^(#{1}[\w\-]+){1}(:{1,2}[\w\-()]+)?$/gi.test(sel)) {
                var cls = sel.split('.').filter(Boolean);
                result.push(cls);
            } else {
                add.push(sel);
            }
        }
        return {
            result,
            add
        };
    };
    const parseStyle = node => {
        const stl = node.style;
        const style = {};
        for (var i = 0, len = stl.length; i < len; i++) {
            const propName = stl[i];
            const propValue = stl.getPropertyValue(propName);
            const important = stl.getPropertyPriority(propName);
            style[propName] = `${ propValue }${ important ? ` !${ important }` : '' }`;
        }
        return style;
    };
    const parseCondition = node => {
        const condition = node.conditionText || node.media && node.media.mediaText || node.name || node.selectorText || '';
        return condition.trim();
    };
    const createNode = (selectors, style = {}, opts = {}) => {
        const node = {};
        const selLen = selectors.length;
        const lastClass = selectors[selLen - 1];
        const stateArr = lastClass ? lastClass.split(/:(.+)/) : [];
        const state = stateArr[1];
        const {atRule, selectorsAdd, mediaText} = opts;
        const singleAtRule = singleAtRulesNames.indexOf(atRule) >= 0;
        singleAtRule && (node.singleAtRule = 1);
        atRule && (node.atRuleType = atRule);
        selectorsAdd && (node.selectorsAdd = selectorsAdd);
        mediaText && (node.mediaText = mediaText);
        if (state) {
            selectors[selLen - 1] = stateArr[0];
            node.state = state;
            stateArr.splice(stateArr.length - 1, 1);
        }
        node.selectors = selectors;
        node.style = style;
        return node;
    };
    const parseNode = el => {
        var result = [];
        var nodes = el.cssRules || [];
        for (var i = 0, len = nodes.length; i < len; i++) {
            const node = nodes[i];
            const type = node.type.toString();
            let singleAtRule = 0;
            let atRuleType = '';
            let condition = '';
            let sels = node.selectorText || node.keyText;
            const isSingleAtRule = singleAtRules.indexOf(type) >= 0;
            if (isSingleAtRule) {
                singleAtRule = 1;
                atRuleType = atRules[type];
                condition = parseCondition(node);
            } else if (atRuleKeys.indexOf(type) >= 0) {
                var subRules = parseNode(node);
                condition = parseCondition(node);
                for (var s = 0, lens = subRules.length; s < lens; s++) {
                    var subRule = subRules[s];
                    condition && (subRule.mediaText = condition);
                    subRule.atRuleType = atRules[type];
                }
                result = result.concat(subRules);
            }
            if (!sels && !isSingleAtRule)
                continue;
            const style = parseStyle(node);
            const selsParsed = parseSelector(sels);
            const selsAdd = selsParsed.add;
            sels = selsParsed.result;
            let lastRule;
            for (var k = 0, len3 = sels.length; k < len3; k++) {
                const model = createNode(sels[k], style, { atRule: atRules[type] });
                result.push(model);
                lastRule = model;
            }
            if (selsAdd.length) {
                var selsAddStr = selsAdd.join(', ');
                if (lastRule) {
                    lastRule.selectorsAdd = selsAddStr;
                } else {
                    const model = {
                        selectors: [],
                        selectorsAdd: selsAddStr,
                        style
                    };
                    singleAtRule && (model.singleAtRule = singleAtRule);
                    atRuleType && (model.atRuleType = atRuleType);
                    condition && (model.mediaText = condition);
                    result.push(model);
                }
            }
        }
        return result;
    };
    var parser =  str => {
        const el = document.createElement('style');
        el.innerHTML = str;
        document.head.appendChild(el);
        const sheet = el.sheet;
        document.head.removeChild(el);
        return parseNode(sheet);
    };


    parser.parseSelector = parseSelector;
    parser.parseStyle = parseStyle;
    parser.parseCondition = parseCondition;
    parser.createNode = createNode;
    parser.parseNode = parseNode;

    return parser;
});
define('skylark-grapejs/parser/model/ParserCss',[
    'skylark-underscore',
    './BrowserParserCss',
    './BrowserParserCss'
], function (a, BrowserCssParser, b) {
    'use strict';
    return (config = {}) => ({
        parse(str) {
            let result = [];
            const {parserCss, em = {}} = config;
            const editor = em && em.get && em.get('Editor');
            const nodes = parserCss ? parserCss(str, editor) : BrowserCssParser(str);
            nodes.forEach(node => result = result.concat(this.checkNode(node)));
            return result;
        },
        checkNode(node) {
            const {selectors, style} = node;
            if (a.isString(selectors)) {
                const nodes = [];
                const selsParsed = b.parseSelector(selectors);
                const classSets = selsParsed.result;
                const selectorsAdd = selsParsed.add.join(', ');
                const opts = {
                    atRule: node.atRule,
                    mediaText: node.params
                };
                if (classSets.length) {
                    classSets.forEach(classSet => {
                        nodes.push(b.createNode(classSet, style, opts));
                    });
                } else {
                    nodes.push(b.createNode([], style, opts));
                }
                if (selectorsAdd) {
                    const lastNode = nodes[nodes.length - 1];
                    lastNode.selectorsAdd = selectorsAdd;
                }
                node = nodes;
            }
            return node;
        }
    });
});
define('skylark-grapejs/parser/model/ParserHtml',['skylark-underscore'], function (a) {
    'use strict';
    return config => {
        var TEXT_NODE = 'span';
        var c = config;
        var modelAttrStart = 'data-gjs-';
        return {
            compTypes: '',
            modelAttrStart,
            splitPropsFromAttr(attr = {}) {
                const props = {};
                const attrs = {};
                a.each(attr, (value, key) => {
                    if (key.indexOf(this.modelAttrStart) === 0) {
                        const modelAttr = key.replace(modelAttrStart, '');
                        const valueLen = value.length;
                        const valStr = value && a.isString(value);
                        const firstChar = valStr && value.substr(0, 1);
                        const lastChar = valStr && value.substr(valueLen - 1);
                        value = value === 'true' ? true : value;
                        value = value === 'false' ? false : value;
                        try {
                            value = firstChar == '{' && lastChar == '}' || firstChar == '[' && lastChar == ']' ? JSON.parse(value) : value;
                        } catch (e) {
                        }
                        props[modelAttr] = value;
                    } else {
                        attrs[key] = value;
                    }
                });
                return {
                    props,
                    attrs
                };
            },
            parseStyle(str) {
                var result = {};
                var decls = str.split(';');
                for (var i = 0, len = decls.length; i < len; i++) {
                    var decl = decls[i].trim();
                    if (!decl)
                        continue;
                    var prop = decl.split(':');
                    result[prop[0].trim()] = prop.slice(1).join(':').trim();
                }
                return result;
            },
            parseClass(str) {
                const result = [];
                const cls = str.split(' ');
                for (let i = 0, len = cls.length; i < len; i++) {
                    const cl = cls[i].trim();
                    if (!cl)
                        continue;
                    result.push(cl);
                }
                return result;
            },
            parseNode(el) {
                const result = [];
                const nodes = el.childNodes;
                for (var i = 0, len = nodes.length; i < len; i++) {
                    const node = nodes[i];
                    const attrs = node.attributes || [];
                    const attrsLen = attrs.length;
                    const nodePrev = result[result.length - 1];
                    const nodeChild = node.childNodes.length;
                    const ct = this.compTypes;
                    let model = {};
                    if (ct) {
                        let obj = '';
                        let type = node.getAttribute && node.getAttribute(`${ modelAttrStart }type`);
                        if (type) {
                            model = { type };
                        } else {
                            for (let it = 0; it < ct.length; it++) {
                                const compType = ct[it];
                                obj = compType.model.isComponent(node);
                                if (obj) {
                                    if (typeof obj !== 'object') {
                                        obj = { type: compType.id };
                                    }
                                    break;
                                }
                            }
                            model = obj;
                        }
                    }
                    if (!model.tagName) {
                        model.tagName = node.tagName ? node.tagName.toLowerCase() : '';
                    }
                    if (attrsLen) {
                        model.attributes = {};
                    }
                    for (let j = 0; j < attrsLen; j++) {
                        const nodeName = attrs[j].nodeName;
                        let nodeValue = attrs[j].nodeValue;
                        if (nodeName == 'style') {
                            model.style = this.parseStyle(nodeValue);
                        } else if (nodeName == 'class') {
                            model.classes = this.parseClass(nodeValue);
                        } else if (nodeName == 'contenteditable') {
                            continue;
                        } else if (nodeName.indexOf(modelAttrStart) === 0) {
                            const modelAttr = nodeName.replace(modelAttrStart, '');
                            const valueLen = nodeValue.length;
                            const firstChar = nodeValue && nodeValue.substr(0, 1);
                            const lastChar = nodeValue && nodeValue.substr(valueLen - 1);
                            nodeValue = nodeValue === 'true' ? true : nodeValue;
                            nodeValue = nodeValue === 'false' ? false : nodeValue;
                            try {
                                nodeValue = firstChar == '{' && lastChar == '}' || firstChar == '[' && lastChar == ']' ? JSON.parse(nodeValue) : nodeValue;
                            } catch (e) {
                            }
                            model[modelAttr] = nodeValue;
                        } else {
                            model.attributes[nodeName] = nodeValue;
                        }
                    }
                    if (nodeChild && !model.components) {
                        const firstChild = node.childNodes[0];
                        if (nodeChild === 1 && firstChild.nodeType === 3) {
                            !model.type && (model.type = 'text');
                            model.content = firstChild.nodeValue;
                        } else {
                            model.components = this.parseNode(node);
                        }
                    }
                    if (model.type == 'textnode') {
                        if (nodePrev && nodePrev.type == 'textnode') {
                            nodePrev.content += model.content;
                            continue;
                        }
                        if (!config.keepEmptyTextNodes) {
                            const content = node.nodeValue;
                            if (content != ' ' && !content.trim()) {
                                continue;
                            }
                        }
                    }
                    const comps = model.components;
                    if (!model.type && comps) {
                        let allTxt = 1;
                        let foundTextNode = 0;
                        for (let ci = 0; ci < comps.length; ci++) {
                            const comp = comps[ci];
                            const cType = comp.type;
                            if ([
                                    'text',
                                    'textnode'
                                ].indexOf(cType) < 0 && c.textTags.indexOf(comp.tagName) < 0) {
                                allTxt = 0;
                                break;
                            }
                            if (cType == 'textnode') {
                                foundTextNode = 1;
                            }
                        }
                        if (allTxt && foundTextNode) {
                            model.type = 'text';
                        }
                    }
                    if (!model.tagName && model.type != 'textnode') {
                        continue;
                    }
                    result.push(model);
                }
                return result;
            },
            parse(str, parserCss) {
                var config = c.em && c.em.get('Config') || {};
                var res = {
                    html: '',
                    css: ''
                };
                var el = document.createElement('div');
                el.innerHTML = str;
                var scripts = el.querySelectorAll('script');
                var i = scripts.length;
                if (!config.allowScripts) {
                    while (i--)
                        scripts[i].parentNode.removeChild(scripts[i]);
                }
                if (parserCss) {
                    var styleStr = '';
                    var styles = el.querySelectorAll('style');
                    var j = styles.length;
                    while (j--) {
                        styleStr = styles[j].innerHTML + styleStr;
                        styles[j].parentNode.removeChild(styles[j]);
                    }
                    if (styleStr)
                        res.css = parserCss.parse(styleStr);
                }
                var result = this.parseNode(el);
                if (result.length == 1)
                    result = result[0];
                res.html = result;
                return res;
            }
        };
    };
});
define('skylark-grapejs/parser/index',[
    "skylark-langx/langx",
    './config/config',
    './model/ParserCss',
    './model/ParserHtml'
], function (langx,defaults, parserCss, parserHtml) {
    'use strict';
    return () => {
        let conf = {};
        let pHtml, pCss;
        return {
            compTypes: '',
            parserCss: null,
            parserHtml: null,
            name: 'Parser',
            getConfig() {
                return conf;
            },
            init(config = {}) {
                conf = {...defaults,...config};
                conf.Parser = this;
                pHtml =  parserHtml(conf);  // modified by lwf // new parserHtml(conf)
                pCss = parserCss(conf); // modified by lwf  // new parserCss
                this.em = conf.em;
                this.parserCss = pCss;
                this.parserHtml = pHtml;
                return this;
            },
            parseHtml(str) {
                const {em, compTypes} = this;
                pHtml.compTypes = em ? em.get('DomComponents').getTypes() : compTypes;
                return pHtml.parse(str, pCss);
            },
            parseCss(str) {
                return pCss.parse(str);
            }
        };
    };
});
define('skylark-grapejs/selector_manager/config/config',[],function () {
    'use strict';
    return {
        stylePrefix: 'clm-',
        appendTo: '',
        selectors: [],
        states: [
            { name: 'hover' },
            { name: 'active' },
            { name: 'nth-of-type(2n)' }
        ],
        escapeName: 0,
        selectedName: 0,
        iconAdd: '<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>',
        iconSync: '<svg viewBox="0 0 24 24"><path d="M12 18c-3.31 0-6-2.69-6-6 0-1 .25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4m0-11V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8z"></path></svg>',
        iconTagOn: '<svg viewBox="0 0 24 24"><path d="M19 19H5V5h10V3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8h-2m-11.09-.92L6.5 11.5 11 16 21 6l-1.41-1.42L11 13.17l-3.09-3.09z"></path></svg>',
        iconTagOff: '<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14z"></path></svg>',
        iconTagRemove: '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>',
        render: 0,
        componentFirst: 0
    };
});
define('skylark-grapejs/selector_manager/model/Selector',['skylark-backbone'], function (Backbone) {
    'use strict';
    const TYPE_CLASS = 1;
    const TYPE_ID = 2;
    const Selector = Backbone.Model.extend({
        idAttribute: 'name',
        defaults: {
            name: '',
            label: '',
            type: TYPE_CLASS,
            active: true,
            private: false,
            protected: false
        },
        initialize(props, opts = {}) {
            const {
                config = {}
            } = opts;
            const name = this.get('name');
            const label = this.get('label');
            if (!name) {
                this.set('name', label);
            } else if (!label) {
                this.set('label', name);
            }
            const namePreEsc = this.get('name');
            const {escapeName} = config;
            const nameEsc = escapeName ? escapeName(namePreEsc) : Selector.escapeName(namePreEsc);
            this.set('name', nameEsc);
        },
        getFullName(opts = {}) {
            const {escape} = opts;
            const name = this.get('name');
            let init = '';
            switch (this.get('type')) {
            case TYPE_CLASS:
                init = '.';
                break;
            case TYPE_ID:
                init = '#';
                break;
            }
            return init + (escape ? escape(name) : name);
        }
    }, {
        TYPE_CLASS,
        TYPE_ID,
        escapeName(name) {
            return `${ name }`.trim().replace(/([^a-z0-9\w-\:]+)/gi, '-');
        }
    });
    return Selector;
});
define('skylark-grapejs/selector_manager/model/Selectors',[
    'skylark-underscore',
    'skylark-backbone',
    './Selector'
], function (a, Backbone, Selector) {
    'use strict';
    return Backbone.Collection.extend({
        model: Selector,
        modelId: attr => `${ attr.name }_${ attr.type || Selector.TYPE_CLASS }`,
        getStyleable() {
            return a.filter(this.models, item => item.get('active') && !item.get('private'));
        },
        getValid({noDisabled} = {}) {
            return a.filter(this.models, item => !item.get('private')).filter(item => noDisabled ? item.get('active') : 1);
        },
        getFullString(collection, opts = {}) {
            const result = [];
            const coll = collection || this;
            coll.forEach(selector => result.push(selector.getFullName(opts)));
            return result.join('').trim();
        }
    });
});
define('skylark-grapejs/selector_manager/view/ClassTagView',['skylark-backbone'], function (Backbone) {
    'use strict';
    const inputProp = 'contentEditable';
    return Backbone.View.extend({
        template() {
            const {pfx, model, config} = this;
            const label = model.get('label') || '';
            return `
      <span id="${ pfx }checkbox" class="${ pfx }tag-status" data-tag-status></span>
      <span id="${ pfx }tag-label" data-tag-name>${ label }</span>
      <span id="${ pfx }close" class="${ pfx }tag-close" data-tag-remove>
        ${ config.iconTagRemove }
      </span>
    `;
        },
        events: {
            'click [data-tag-remove]': 'removeTag',
            'click [data-tag-status]': 'changeStatus',
            'dblclick [data-tag-name]': 'startEditTag',
            'focusout [data-tag-name]': 'endEditTag'
        },
        initialize(o) {
            const config = o.config || {};
            this.config = config;
            this.coll = o.coll || null;
            this.pfx = config.stylePrefix || '';
            this.ppfx = config.pStylePrefix || '';
            this.em = config.em;
            this.listenTo(this.model, 'change:active', this.updateStatus);
        },
        getInputEl() {
            if (!this.inputEl) {
                this.inputEl = this.el.querySelector('[data-tag-name]');
            }
            return this.inputEl;
        },
        startEditTag() {
            const {em} = this;
            const inputEl = this.getInputEl();
            inputEl[inputProp] = true;
            inputEl.focus();
            em && em.setEditing(1);
        },
        endEditTag() {
            const model = this.model;
            const inputEl = this.getInputEl();
            const label = inputEl.textContent;
            const em = this.em;
            const sm = em && em.get('SelectorManager');
            inputEl[inputProp] = false;
            em && em.setEditing(0);
            if (sm) {
                const name = sm.escapeName(label);
                if (sm.get(name)) {
                    inputEl.innerText = model.get('label');
                } else {
                    model.set({
                        name,
                        label
                    });
                }
            }
        },
        changeStatus() {
            const {model} = this;
            model.set('active', !model.get('active'));
        },
        removeTag() {
            const {em, model} = this;
            const targets = em && em.getSelectedAll();
            targets.forEach(sel => {
                !model.get('protected') && sel && sel.getSelectors().remove(model);
            });
        },
        updateStatus() {
            const {model, $el, config} = this;
            const {iconTagOn, iconTagOff} = config;
            const $chk = $el.find('[data-tag-status]');
            if (model.get('active')) {
                $chk.html(iconTagOn);
                $el.removeClass('opac50');
            } else {
                $chk.html(iconTagOff);
                $el.addClass('opac50');
            }
        },
        render() {
            const pfx = this.pfx;
            const ppfx = this.ppfx;
            this.$el.html(this.template());
            this.$el.attr('class', `${ pfx }tag ${ ppfx }three-bg`);
            this.updateStatus();
            return this;
        }
    });
});
define('skylark-grapejs/selector_manager/view/ClassTagsView',[
    'skylark-underscore',
    'skylark-backbone',
    './ClassTagView'
], function (a, Backbone, ClassTagView) {
    'use strict';
    return Backbone.View.extend({
        template({labelInfo, labelStates, labelHead, iconSync, iconAdd, pfx, ppfx}) {
            return `
    <div id="${ pfx }up" class="${ pfx }header">
      <div id="${ pfx }label" class="${ pfx }header-label">${ labelHead }</div>
      <div id="${ pfx }status-c" class="${ pfx }header-status">
        <span id="${ pfx }input-c" data-states-c>
          <div class="${ ppfx }field ${ ppfx }select">
            <span id="${ ppfx }input-holder">
              <select id="${ pfx }states" data-states>
                <option value="">${ labelStates }</option>
              </select>
            </span>
            <div class="${ ppfx }sel-arrow">
              <div class="${ ppfx }d-s-arrow"></div>
            </div>
          </div>
        </span>
      </div>
    </div>
    <div id="${ pfx }tags-field" class="${ ppfx }field">
      <div id="${ pfx }tags-c" data-selectors></div>
      <input id="${ pfx }new" data-input/>
      <span id="${ pfx }add-tag" class="${ pfx }tags-btn ${ pfx }tags-btn__add" data-add>
        ${ iconAdd }
      </span>
      <span class="${ pfx }tags-btn ${ pfx }tags-btn__sync" style="display: none" data-sync-style>
        ${ iconSync }
      </span>
    </div>
    <div class="${ pfx }sels-info">
      <div class="${ pfx }label-sel">${ labelInfo }:</div>
      <div class="${ pfx }sels" data-selected></div>
      <div style="clear:both"></div>
    </div>`;
        },
        events: {
            'change [data-states]': 'stateChanged',
            'click [data-add]': 'startNewTag',
            'focusout [data-input]': 'endNewTag',
            'keyup [data-input]': 'onInputKeyUp',
            'click [data-sync-style]': 'syncStyle'
        },
        initialize(o = {}) {
            this.config = o.config || {};
            this.pfx = this.config.stylePrefix || '';
            this.ppfx = this.config.pStylePrefix || '';
            this.className = this.pfx + 'tags';
            this.stateInputId = this.pfx + 'states';
            this.stateInputC = this.pfx + 'input-c';
            this.states = this.config.states || [];
            const {em} = this.config;
            this.em = em; // modified by lwf
            const emitter = this.getStyleEmitter();
            const coll = this.collection;
            this.target = this.config.em;
            const toList = 'component:toggled component:update:classes';
            const toListCls = 'component:update:classes change:state';
            this.listenTo(em, toList, this.componentChanged);
            //this.listenTo(emitter, 'styleManager:update', this.componentChanged); // modified by lwf
            this.listenTo(em, toListCls, this.__handleStateChange);
            this.listenTo(em, 'styleable:change change:device', this.checkSync);
            this.listenTo(coll, 'add', this.addNew);
            this.listenTo(coll, 'reset', this.renderClasses);
            this.listenTo(coll, 'remove', this.tagRemoved);
            this.delegateEvents();
        },
        syncStyle() {
            const {em} = this;
            const target = this.getTarget();
            const cssC = em.get('CssComposer');
            const opts = { noDisabled: 1 };
            const selectors = this.getCommonSelectors({ opts });
            const state = em.get('state');
            const mediaText = em.getCurrentMedia();
            const ruleComponents = [];
            const rule = cssC.get(selectors, state, mediaText) || cssC.add(selectors, state, mediaText);
            let style;
            this.getTargets().forEach(target => {
                const ruleComponent = cssC.getIdRule(target.getId(), {
                    state,
                    mediaText
                });
                style = ruleComponent.getStyle();
                ruleComponent.setStyle({});
                ruleComponents.push(ruleComponent);
            });
            style && rule.addStyle(style);
            em.trigger('component:toggled');
            em.trigger('component:sync-style', {
                component: target,
                selectors,
                mediaText,
                rule,
                ruleComponents,
                state
            });
        },
        getStyleEmitter() {
            const {em} = this;
            const sm = em && em.get('StyleManager');
            const emitter = sm && sm.getEmitter();
            return emitter || {};
        },
        tagRemoved(model) {
            this.updateStateVis();
        },
        getStateOptions() {
            const {states, em} = this;
            let result = [];
            states.forEach(state => result.push(`<option value="${ state.name }">${ em.t(`selectorManager.states.${ state.name }`) || state.label || state.name }</option>`));
            return result.join('');
        },
        addNew(model) {
            this.addToClasses(model);
        },
        startNewTag() {
            this.$addBtn.css({ display: 'none' });
            this.$input.show().focus();
        },
        endNewTag() {
            this.$addBtn.css({ display: '' });
            this.$input.hide().val('');
        },
        onInputKeyUp(e) {
            if (e.keyCode === 13)
                this.addNewTag(this.$input.val());
            else if (e.keyCode === 27)
                this.endNewTag();
        },
        checkStates() {
            const state = this.em.getState();
            const statesEl = this.getStates();
            statesEl && statesEl.val(state);
        },
        componentChanged: a.debounce(function ({targets} = {}) {
            this.updateSelection(targets);
        }),
        updateSelection(targets) {
            let trgs = targets || this.getTargets();
            trgs = a.isArray(trgs) ? trgs : [trgs];
            let selectors = [];
            if (trgs && trgs.length) {
                selectors = this.getCommonSelectors({ targets: trgs });
                this.checkSync({ validSelectors: selectors });
            }
            this.collection.reset(selectors);
            this.updateStateVis(trgs);
            return selectors;
        },
        getCommonSelectors({targets, opts = {}} = {}) {
            const trgs = targets || this.getTargets();
            const selectors = trgs.map(tr => tr.getSelectors && tr.getSelectors().getValid(opts)).filter(i => i);
            return this._commonSelectors(...selectors);
        },
        _commonSelectors(...args) {
            if (!args.length)
                return [];
            if (args.length === 1)
                return args[0];
            if (args.length === 2)
                return args[0].filter(item => args[1].indexOf(item) >= 0);
            return args.slice(1).reduce((acc, item) => this._commonSelectors(acc, item), args[0]);
        },
        checkSync: a.debounce(function () {
            const {$btnSyncEl, config, collection} = this;
            const target = this.getTarget();
            let hasStyle;
            if (target && config.componentFirst && collection.length) {
                const style = target.getStyle();
                hasStyle = !a.isEmpty(style);
            }
            $btnSyncEl && $btnSyncEl[hasStyle ? 'show' : 'hide']();
        }),
        getTarget() {
            return this.target.getSelected();
        },
        getTargets() {
            return this.target.getSelectedAll();
        },
        updateStateVis(target) {
            const em = this.em;
            const avoidInline = em && em.getConfig('avoidInlineStyle');
            const display = this.collection.length || avoidInline ? '' : 'none';
            this.getStatesC().css('display', display);
            this.updateSelector(target);
        },
        __handleStateChange() {
            this.updateSelector(this.getTargets());
        },
        updateSelector(targets) {
            const elSel = this.el.querySelector('[data-selected]');
            const result = [];
            let trgs = targets || this.getTargets();
            trgs = a.isArray(trgs) ? trgs : [trgs];
            trgs.forEach(target => result.push(this.__getName(target)));
            elSel && (elSel.innerHTML = result.join(', '));
            this.checkStates();
        },
        __getName(target) {
            const {pfx, config, em} = this;
            const {selectedName, componentFirst} = config;
            let result;
            if (a.isString(target)) {
                result = `<span class="${ pfx }sel-gen">${ target }</span>`;
            } else {
                if (!target || !target.get)
                    return;
                const selectors = target.getSelectors().getStyleable();
                const state = em.get('state');
                const idRes = target.getId ? `<span class="${ pfx }sel-cmp">${ target.getName() }</span><span class="${ pfx }sel-id">#${ target.getId() }</span>` : '';
                result = this.collection.getFullString(selectors);
                result = result ? `<span class="${ pfx }sel-rule">${ result }</span>` : target.get('selectorsAdd') || idRes;
                result = componentFirst && idRes ? idRes : result;
                result += state ? `<span class="${ pfx }sel-state">:${ state }</span>` : '';
                result = selectedName ? selectedName({
                    result,
                    state,
                    target
                }) : result;
            }
            return result && `<span class="${ pfx }sel">${ result }</span>`;
        },
        stateChanged(ev) {
            const {em} = this;
            const {value} = ev.target;
            em.set('state', value);
        },
        addNewTag(label) {
            const {em} = this;
            if (!label.trim())
                return;
            if (em) {
                const sm = em.get('SelectorManager');
                const model = sm.add({ label });
                this.getTargets().forEach(target => {
                    target.getSelectors().add(model);
                    this.collection.add(model);
                    this.updateStateVis();
                });
            }
            this.endNewTag();
        },
        addToClasses(model, fragmentEl = null) {
            const fragment = fragmentEl;
            const classes = this.getClasses();
            const rendered = new ClassTagView({
                model,
                config: this.config,
                coll: this.collection
            }).render().el;
            fragment ? fragment.appendChild(rendered) : classes.append(rendered);
            return rendered;
        },
        renderClasses() {
            const frag = document.createDocumentFragment();
            const classes = this.getClasses();
            classes.empty();
            this.collection.each(model => this.addToClasses(model, frag));
            classes.append(frag);
        },
        getClasses() {
            return this.$el.find('[data-selectors]');
        },
        getStates() {
            if (!this.$states) {
                const el = this.$el.find('[data-states]');
                this.$states = el[0] && el;
            }
            return this.$states;
        },
        getStatesC() {
            if (!this.$statesC)
                this.$statesC = this.$el.find('#' + this.stateInputC);
            return this.$statesC;
        },
        render() {
            const {em, pfx, ppfx, config, $el, el} = this;
            const {render, iconSync, iconAdd} = config;
            const tmpOpts = {
                iconSync,
                iconAdd,
                labelHead: em.t('selectorManager.label'),
                labelStates: em.t('selectorManager.emptyState'),
                labelInfo: em.t('selectorManager.selected'),
                ppfx,
                pfx,
                el
            };
            $el.html(this.template(tmpOpts));
            const renderRes = render && render(tmpOpts);
            renderRes && renderRes !== el && $el.empty().append(renderRes);
            this.$input = $el.find('[data-input]');
            this.$addBtn = $el.find('[data-add]');
            this.$classes = $el.find('#' + pfx + 'tags-c');
            this.$btnSyncEl = $el.find('[data-sync-style]');
            this.$input.hide();
            const statesEl = this.getStates();
            statesEl && statesEl.append(this.getStateOptions());
            this.renderClasses();
            $el.attr('class', `${ this.className } ${ ppfx }one-bg ${ ppfx }two-color`);
            return this;
        }
    });
});
define('skylark-grapejs/selector_manager/index',[
    "skylark-langx/langx",
    'skylark-underscore',
    '../utils/mixins',
    './config/config',
    './model/Selector',
    './model/Selectors',
    './view/ClassTagsView'
], function (langx,_, b, defaults, Selector, Selectors, ClassTagsView) {
    'use strict';
    const isId = str => _.isString(str) && str[0] == '#';
    const isClass = str => _.isString(str) && str[0] == '.';
    return config => {
        var c = config || {};
        var selectors;
        return {
            Selector,
            Selectors,
            name: 'SelectorManager',
            getConfig() {
                return c;
            },
            init(conf = {}) {
                c = {...defaults,...conf};
                const em = c.em;
                const ppfx = c.pStylePrefix;
                this.em = em;
                if (ppfx) {
                    c.stylePrefix = ppfx + c.stylePrefix;
                }
                this.selectorTags = new ClassTagsView({
                    collection: new Selectors([], {
                        em,
                        config: c
                    }),
                    config: c
                });
                selectors = new Selectors(c.selectors);
                selectors.on('add', model => em.trigger('selector:add', model));
                selectors.on('remove', model => em.trigger('selector:remove', model));
                selectors.on('change', model => em.trigger('selector:update', model, model.previousAttributes(), model.changedAttributes()));
                em.on('change:state', (m, value) => em.trigger('selector:state', value));
                return this;
            },
            postRender() {
                const elTo = this.getConfig().appendTo;
                if (elTo) {
                    const el = _.isElement(elTo) ? elTo : document.querySelector(elTo);
                    el.appendChild(this.render([]));
                }
            },
            select(value, opts = {}) {
                const targets = Array.isArray(value) ? value : [value];
                const toSelect = this.em.get('StyleManager').setTarget(targets, opts);
                const res = toSelect.filter(i => i).map(sel => b.isComponent(sel) ? sel : b.isRule(sel) && !sel.get('selectorsAdd') ? sel : sel.getSelectorsString());
                this.selectorTags.componentChanged({ targets: res });
                return this;
            },
            setState(value) {
                this.em.setState(value);
                return this;
            },
            getState() {
                return this.em.setState();
            },
            addSelector(name, opt = {}) {
                let opts = langx.clone(opt);
                if (_.isObject(name)) {
                    opts = name;
                } else {
                    opts.name = name;
                }
                if (isId(opts.name)) {
                    opts.name = opts.name.substr(1);
                    opts.type = Selector.TYPE_ID;
                } else if (isClass(opts.name)) {
                    opts.name = opts.name.substr(1);
                }
                if (opts.label && !opts.name) {
                    opts.name = this.escapeName(opts.label);
                }
                const cname = opts.name;
                const selector = cname ? this.get(cname, opts.type) : selectors.where(opts)[0];
                if (!selector) {
                    return selectors.add(opts, { config: c });
                }
                return selector;
            },
            getSelector(name, type = Selector.TYPE_CLASS) {
                if (isId(name)) {
                    name = name.substr(1);
                    type = Selector.TYPE_ID;
                } else if (isClass(name)) {
                    name = name.substr(1);
                }
                return selectors.where({
                    name,
                    type
                })[0];
            },
            add(name, opts = {}) {
                if (_.isArray(name)) {
                    return name.map(item => this.addSelector(item, opts));
                } else {
                    return this.addSelector(name, opts);
                }
            },
            addClass(classes) {
                const added = [];
                if (_.isString(classes)) {
                    classes = classes.trim().split(' ');
                }
                classes.forEach(name => added.push(this.addSelector(name)));
                return added;
            },
            get(name, type) {
                if (_.isArray(name)) {
                    const result = [];
                    const selectors = name.map(item => this.getSelector(item)).filter(item => item);
                    selectors.forEach(item => result.indexOf(item) < 0 && result.push(item));
                    return result;
                } else {
                    return this.getSelector(name, type);
                }
            },
            getAll() {
                return selectors;
            },
            escapeName(name) {
                const {escapeName} = c;
                return escapeName ? escapeName(name) : Selector.escapeName(name);
            },
            render(selectors) {
                if (selectors) {
                    this.selectorTags = new ClassTagsView({
                        collection: new Selectors(selectors),
                        config: c
                    });
                    return this.selectorTags.render().el;
                } else
                    return this.selectorTags.render().el;
            }
        };
    };
});
define('skylark-grapejs/style_manager/config/config',[],function () {
    'use strict';
    return {
        stylePrefix: 'sm-',
        sectors: [],
        appendTo: '',
        hideNotStylable: true,
        highlightChanged: true,
        highlightComputed: true,
        showComputed: true,
        clearProperties: 0,
        avoidComputed: [
            'width',
            'height'
        ]
    };
});
define('skylark-grapejs/domain_abstract/model/TypeableCollection',[
    'skylark-underscore',
    'skylark-backbone'
], function (a, Backbone) {
    'use strict';
    const Model = Backbone.Model;
    const View = Backbone.View;
    return {
        types: [],
        initialize(models, opts) {
            var _this = this;
            this.model = function(attrs = {}, options = {}) { // modified by lwf
                let Model, View, type;
                if (attrs && attrs.type) {
                    const baseType = _this.getBaseType();
                    type = _this.getType(attrs.type);
                    Model = type ? type.model : baseType.model;
                    View = type ? type.view : baseType.view;
                } else {
                    const typeFound = _this.recognizeType(attrs);
                    type = typeFound.type;
                    Model = type.model;
                    View = type.view;
                    attrs = typeFound.attributes;
                }
                const model = new Model(attrs, options);
                model.typeView = View;
                return model;
            };
            const init = _this.init && _this.init.bind(_this);
            init && init();
        },
        recognizeType(value) {
            const types = this.getTypes();
            for (let i = 0; i < types.length; i++) {
                const type = types[i];
                let typeFound = type.isType(value);
                typeFound = typeof typeFound == 'boolean' && typeFound ? { type: type.id } : typeFound;
                if (typeFound) {
                    return {
                        type,
                        attributes: typeFound
                    };
                }
            }
            return {
                type: this.getBaseType(),
                attributes: value
            };
        },
        getBaseType() {
            const types = this.getTypes();
            return types[types.length - 1];
        },
        getTypes() {
            return this.types;
        },
        getType(id) {
            const types = this.getTypes();
            for (let i = 0; i < types.length; i++) {
                const type = types[i];
                if (type.id === id) {
                    return type;
                }
            }
        },
        addType(id, definition) {
            const type = this.getType(id);
            const baseType = this.getBaseType();
            const ModelInst = type ? type.model : baseType.model;
            const ViewInst = type ? type.view : baseType.view;
            let {model, view, isType} = definition;
            model = model instanceof Model || a.isFunction(model) ? model : ModelInst.extend(model || {});
            view = view instanceof View || a.isFunction(view) ? view : ViewInst.extend(view || {});
            if (type) {
                type.model = model;
                type.view = view;
                type.isType = isType || type.isType;
            } else {
                definition.id = id;
                definition.model = model;
                definition.view = view;
                definition.isType = isType || function (value) {
                    if (value && value.type == id) {
                        return true;
                    }
                };
                this.getTypes().unshift(definition);
            }
        }
    };
});
define('skylark-grapejs/style_manager/model/Property',[
    "skylark-langx/langx",
    'skylark-backbone',
    'skylark-underscore',
    '../../utils/mixins'
], function (
    langx,
    Backbone, 
    a, 
    b
) {
    'use strict';
    const Property = Backbone.Model.extend({
        defaults: {
            name: '',
            property: '',
            type: '',
            defaults: '',
            info: '',
            value: '',
            icon: '',
            functionName: '',
            status: '',
            visible: true,
            fixedValues: [
                'initial',
                'inherit'
            ],
            full: 0,
            important: 0,
            toRequire: 0,
            requires: null,
            requiresParent: null
        },
        initialize(props = {}, opts = {}) {
            const id = this.get('id') || '';
            const name = this.get('name') || '';
            !this.get('property') && this.set('property', (name || id).replace(/ /g, '-'));
            const prop = this.get('property');
            !this.get('id') && this.set('id', prop);
            !name && this.set('name', b.capitalize(prop).replace(/-/g, ' '));
            Property.callInit(this, props, opts);
        },
        init() {
        },
        clearValue(opts = {}) {
            this.set({
                value: undefined,
                status: ''
            }, opts);
            return this;
        },
        setValue(value, complete = 1, opts = {}) {
            const parsed = this.parseValue(value);
            this.set(parsed, langx.mixin({},opts,{
                avoidStore: !complete
            }));
        },
        setValueFromInput(value, complete, opts = {}) {
            this.setValue(value, complete, langx.mixin({},opts,{
                fromInput: 1
            }));
        },
        parseValue(value, opts = {}) {
            const result = { value };
            const imp = '!important';
            if (a.isString(value) && value.indexOf(imp) !== -1) {
                result.value = value.replace(imp, '').trim();
                result.important = 1;
            }
            if (!this.get('functionName') && !opts.complete) {
                return result;
            }
            const args = [];
            let valueStr = `${ result.value }`;
            let start = valueStr.indexOf('(') + 1;
            let end = valueStr.lastIndexOf(')');
            const functionName = valueStr.substring(0, start - 1);
            if (functionName)
                result.functionName = functionName;
            args.push(start);
            if (end >= 0) {
                args.push(end);
            }
            result.value = String.prototype.substring.apply(valueStr, args);
            if (opts.numeric) {
                const num = parseFloat(result.value);
                result.unit = result.value.replace(num, '');
                result.value = num;
            }
            return result;
        },
        splitValues(values, separator = ',') {
            const res = [];
            const op = '(';
            const cl = ')';
            let curr = '';
            let acc = 0;
            (values || '').split('').forEach(str => {
                if (str == op) {
                    acc++;
                    curr = curr + op;
                } else if (str == cl && acc > 0) {
                    acc--;
                    curr = curr + cl;
                } else if (str === separator && acc == 0) {
                    res.push(curr);
                    curr = '';
                } else {
                    curr = curr + str;
                }
            });
            curr !== '' && res.push(curr);
            return res.map(i => i.trim());
        },
        getDefaultValue() {
            return this.get('defaults');
        },
        getFullValue(val) {
            const fn = this.get('functionName');
            const def = this.getDefaultValue();
            let value = a.isUndefined(val) ? this.get('value') : val;
            const hasValue = !a.isUndefined(value) && value !== '';
            if (value && def && value === def) {
                return def;
            }
            if (fn && hasValue) {
                value = `${ fn }(${ value })`;
            }
            if (hasValue && this.get('important')) {
                value = `${ value } !important`;
            }
            return value || '';
        }
    }, {
        callParentInit(property, ctx, props, opts = {}) {
            property.prototype.initialize.apply(ctx, [
                props,
                langx.mixin({},opts,{
                    skipInit: 1
                })
            ]);
        },
        callInit(context, props, opts = {}) {
            !opts.skipInit && context.init(props, opts);
        }
    });
    return Property;
});
define('skylark-grapejs/style_manager/model/PropertyComposite',[
    "skylark-langx/langx",
    './Property'
], function (
    langx,
    Property
) {
    'use strict';
    var PropertyComposite = Property.extend({
        defaults: {
            ...Property.prototype.defaults,
            detached: 0,
            properties: [],
            separator: ' '
        },
        initialize(props = {}, opts = {}) {
            Property.callParentInit(Property, this, props, opts);
            const properties = this.get('properties') || [];
            //const Properties = require('./Properties').default; // modified by lwf
            this.set('properties', new PropertyComposite.Properties(properties));
            this.listenTo(this, 'change:value', this.updateValues);
            Property.callInit(this, props, opts);
        },
        clearValue(opts = {}) {
            this.get('properties').each(property => property.clearValue());
            return Property.prototype.clearValue.apply(this, arguments);
        },
        updateValues() {
            const values = this.getFullValue().split(this.getSplitSeparator());
            this.get('properties').each((property, i) => {
                const len = values.length;
                const value = values[i] || values[i % len + (len != 1 && len % 2 ? 1 : 0)];
            });
        },
        getSplitSeparator() {
            return new RegExp(`${ this.get('separator') }(?![^\\(]*\\))`);
        },
        getDefaultValue(defaultProps) {
            let value = this.get('defaults');
            if (value && !defaultProps) {
                return value;
            }
            value = '';
            const properties = this.get('properties');
            properties.each((prop, index) => value += `${ prop.getDefaultValue() } `);
            return value.trim();
        },
        getFullValue() {
            if (this.get('detached')) {
                return '';
            }
            return this.get('properties').getFullValue();
        },
        getPropertyAt(index) {
            return this.get('properties').at(index);
        }
    });

    return PropertyComposite;
});
define('skylark-grapejs/style_manager/model/Layer',[
    'skylark-backbone'
], function (Backbone) {
    'use strict';
    var Layer = Backbone.Model.extend({
        defaults: {
            index: '',
            value: '',
            values: {},
            active: false,
            preview: false,
            properties: []
        },
        initialize() {
            const prp = this.get('properties');
            var value = this.get('value');
            this.set('properties', prp instanceof Layer.Properties ? prp : new Layer.Properties(prp));
            const props = this.get('properties');
            props.forEach(this.onPropAdd, this);
            this.listenTo(props, 'add', this.onPropAdd);
            if (!value) {
                var val = '';
                var values = this.get('values');
                for (var prop in values) {
                    val += ' ' + values[prop];
                }
                this.set('value', val.trim());
            }
        },
        onPropAdd(prop) {
            const coll = this.collection;
            prop.parent = coll && coll.property;
        },
        getPropertyAt(index) {
            return this.get('properties').at(index);
        },
        getPropertyValue(property) {
            let result = '';
            this.get('properties').each(prop => {
                if (prop.get('property') == property) {
                    result = prop.getFullValue();
                }
            });
            return result;
        },
        getFullValue() {
            let result = [];
            this.get('properties').each(prop => result.push(prop.getFullValue()));
            return result.join(' ').trim();
        }
    });

    return Layer;
});
define('skylark-grapejs/style_manager/model/Layers',[
    'skylark-underscore',
    'skylark-backbone',
    './Layer'
], function (a, Backbone, Layer) {
    'use strict';
    return Backbone.Collection.extend({
        model: Layer,
        initialize() {
            this.idx = 1;
            this.on('add', this.onAdd);
            this.on('reset', this.onReset);
        },
        onAdd(model, c, opts) {
            if (!opts.noIncrement)
                model.set('index', this.idx++);
            opts.active && this.active(this.indexOf(model));
        },
        onReset() {
            this.idx = 1;
        },
        getSeparator() {
            const {property} = this;
            return property ? property.get('layerSeparator') : ', ';
        },
        getLayersFromValue(value) {
            const layers = [];
            value.replace(/\(([\w\s,.]*)\)/g, match => {
                var cleaned = match.replace(/,\s*/g, ',');
                value = value.replace(match, cleaned);
            });
            const layerValues = value ? value.split(this.getSeparator()) : [];
            layerValues.forEach(layerValue => {
                layers.push({ properties: this.properties.parseValue(layerValue) });
            });
            return layers;
        },
        getLayersFromStyle(styleObj) {
            const layers = [];
            const properties = this.properties;
            const propNames = properties.pluck('property');
            properties.each(propModel => {
                const style = styleObj[propModel.get('property')];
                const values = style ? style.split(', ') : [];
                values.forEach((value, i) => {
                    value = propModel.parseValue(value.trim()).value;
                    const layer = layers[i];
                    const propertyObj = {
                        ...propModel.attributes,
                        ...{ value }
                    };
                    if (layer) {
                        layer.properties.push(propertyObj);
                    } else {
                        layers[i] = { properties: [propertyObj] };
                    }
                });
            });
            layers.forEach(layer => {
                const layerProprs = layer.properties.map(prop => prop.property);
                properties.each(propModel => {
                    const propertyName = propModel.get('property');
                    if (layerProprs.indexOf(propertyName) < 0) {
                        layer.properties.push({ ...propModel.attributes });
                    }
                });
            });
            return layers;
        },
        active(index) {
            this.each(layer => layer.set('active', 0));
            const layer = this.at(index);
            layer && layer.set('active', 1);
        },
        getFullValue() {
            let result = [];
            this.each(layer => result.push(layer.getFullValue()));
            return result.join(this.getSeparator());
        },
        getPropertyValues(property, defValue) {
            const result = [];
            this.each(layer => {
                const value = layer.getPropertyValue(property);
                value ? result.push(value) : !a.isUndefined(defValue) && result.push(defValue);
            });
            return result.join(', ');
        }
    });
});
define('skylark-grapejs/style_manager/model/PropertyStack',[
    "skylark-langx/langx",
    './PropertyComposite',
    './Layers'
], function (
    langx,
    Property, 
    Layers
) {
    'use strict';
    return Property.extend({
        defaults: {
            ...Property.prototype.defaults,
            layers: [],
            layerSeparator: ', ',
            prepend: 0,
            preview: 0
        },
        initialize(props = {}, opts = {}) {
            Property.callParentInit(Property, this, props, opts);
            const layers = this.get('layers');
            const layersColl = new Layers(layers);
            layersColl.property = this;
            layersColl.properties = this.get('properties');
            this.set('layers', layersColl);
            Property.callInit(this, props, opts);
        },
        getLayers() {
            return this.get('layers');
        },
        getCurrentLayer() {
            return this.getLayers().filter(layer => layer.get('active'))[0];
        },
        getFullValue() {
            return this.get('detached') ? '' : this.get('layers').getFullValue();
        },
        getValueFromStyle(styles = {}) {
            const layers = this.getLayers().getLayersFromStyle(styles);
            return new Layers(layers).getFullValue();
        },
        clearValue() {
            this.getLayers().reset();
            return Property.prototype.clearValue.apply(this, arguments);
        },
        getLayersFromTarget(target) {
            return;
        }
    });
});
define('skylark-grapejs/utils/dom',['skylark-underscore'], function (_) {
    'use strict';
    const KEY_TAG = 'tag';
    const KEY_ATTR = 'attributes';
    const KEY_CHILD = 'children';
    const motionsEv = 'transitionend oTransitionEnd transitionend webkitTransitionEnd';
    const empty = node => {
        while (node.firstChild)
            node.removeChild(node.firstChild);
    };
    const replaceWith = (oldEl, newEl) => {
        oldEl.parentNode.replaceChild(newEl, oldEl);
    };
    const appendAtIndex = (parent, child, index) => {
        const {childNodes} = parent;
        const total = childNodes.length;
        const at = _.isUndefined(index) ? total : index;
        if (_.isString(child)) {
            parent.insertAdjacentHTML('beforeEnd', child);
            child = parent.lastChild;
            parent.removeChild(child);
        }
        if (at >= total) {
            parent.appendChild(child);
        } else {
            parent.insertBefore(child, childNodes[at]);
        }
    };
    const append = (parent, child) => appendAtIndex(parent, child);
    const createEl = (tag, attrs = '', child) => {
        const el = document.createElement(tag);
        attrs && _.each(attrs, (value, key) => el.setAttribute(key, value));
        if (child) {
            if (_.isString(child))
                el.innerHTML = child;
            else
                el.appendChild(child);
        }
        return el;
    };
    const createCustomEvent = (e, cls) => {
        let oEvent;
        try {
            oEvent = new window[cls](e.type, e);
        } catch (e) {
            oEvent = document.createEvent(cls);
            oEvent.initEvent(e.type, true, true);
        }
        oEvent.keyCodeVal = e.keyCode;
        oEvent._parentEvent = e;
        [
            'keyCode',
            'which'
        ].forEach(prop => {
            Object.defineProperty(oEvent, prop, {
                get() {
                    return this.keyCodeVal;
                }
            });
        });
        return oEvent;
    };
    const appendVNodes = (node, vNodes = []) => {
        const vNodesArr = Array.isArray(vNodes) ? vNodes : [vNodes];
        vNodesArr.forEach(vnode => {
            const tag = vnode[KEY_TAG] || 'div';
            const attr = vnode[KEY_ATTR] || {};
            const el = document.createElement(tag);
            _.each(attr, (value, key) => {
                el.setAttribute(key, value);
            });
            node.appendChild(el);
        });
    };
    return {
        motionsEv: motionsEv,
        empty: empty,
        replaceWith: replaceWith,
        appendAtIndex: appendAtIndex,
        append: append,
        createEl: createEl,
        createCustomEvent: createCustomEvent,
        appendVNodes: appendVNodes
    };
});
define('skylark-grapejs/style_manager/view/PropertiesView',[
    'skylark-backbone',
    '../../utils/dom'
], function (Backbone, a) {
    'use strict';
    return Backbone.View.extend({
        initialize(o) {
            this.config = o.config || {};
            this.pfx = this.config.stylePrefix || '';
            this.target = o.target || {};
            this.propTarget = o.propTarget || {};
            this.onChange = o.onChange;
            this.onInputRender = o.onInputRender || {};
            this.customValue = o.customValue || {};
            this.properties = [];
            const coll = this.collection;
            this.listenTo(coll, 'add', this.addTo);
            this.listenTo(coll, 'reset', this.render);
        },
        addTo(model, coll, opts) {
            this.add(model, null, opts);
        },
        add(model, frag, opts = {}) {
            const appendTo = frag || this.el;
            const view = new model.typeView({
                model,
                name: model.get('name'),
                id: this.pfx + model.get('property'),
                target: this.target,
                propTarget: this.propTarget,
                onChange: this.onChange,
                onInputRender: this.onInputRender,
                config: this.config
            });
            if (model.get('type') != 'composite') {
                view.customValue = this.customValue;
            }
            view.render();
            const rendered = view.el;
            this.properties.push(view);
            view.updateVisibility();
            a.appendAtIndex(appendTo, rendered, opts.at);
        },
        render() {
            const {$el} = this;
            this.properties = [];
            const fragment = document.createDocumentFragment();
            this.collection.each(model => this.add(model, fragment));
            $el.empty();
            $el.append(fragment);
            $el.attr('class', `${ this.pfx }properties`);
            return this;
        }
    });
});
define('skylark-grapejs/style_manager/view/PropertyView',[
    'skylark-backbone',
    'skylark-underscore',
    '../../utils/mixins'
], function (Backbone, a, b) {
    'use strict';
    const clearProp = 'data-clear-style';
    return Backbone.View.extend({
        template(model) {
            const pfx = this.pfx;
            return `
      <div class="${ pfx }label">
        ${ this.templateLabel(model) }
      </div>
      <div class="${ this.ppfx }fields">
        ${ this.templateInput(model) }
      </div>
    `;
        },
        templateLabel(model) {
            const {pfx, em} = this;
            const {parent} = model;
            const {icon = '', info = '', id, name} = model.attributes;
            const label = em && em.t(`styleManager.properties.${ id }`) || name;
            return `
      <span class="${ pfx }icon ${ icon }" title="${ info }">
        ${ label }
      </span>
      ${ !parent ? `<b class="${ pfx }clear" ${ clearProp }>&Cross;</b>` : '' }
    `;
        },
        templateInput(model) {
            return `
      <div class="${ this.ppfx }field">
        <input placeholder="${ model.getDefaultValue() }"/>
      </div>
    `;
        },
        events: {
            change: 'inputValueChanged',
            [`click [${ clearProp }]`]: 'clear'
        },
        initialize(o = {}) {
            a.bindAll(this, 'targetUpdated');
            this.config = o.config || {};
            const em = this.config.em;
            this.em = em;
            this.pfx = this.config.stylePrefix || '';
            this.ppfx = this.config.pStylePrefix || '';
            this.target = o.target || {};
            this.propTarget = o.propTarget || {};
            this.onChange = o.onChange;
            this.onInputRender = o.onInputRender || {};
            this.customValue = o.customValue || {};
            const model = this.model;
            this.property = model.get('property');
            this.input = null;
            const pfx = this.pfx;
            this.inputHolderId = '#' + pfx + 'input-holder';
            this.sector = model.collection && model.collection.sector;
            model.view = this;
            if (!model.get('value')) {
                model.set('value', model.getDefaultValue());
            }
            em && em.on(`update:component:style:${ this.property }`, this.targetUpdated);
            const requires = model.get('requires');
            requires && Object.keys(requires).forEach(property => {
                em && em.on(`component:styleUpdate:${ property }`, this.targetUpdated);
            });
            this.listenTo(this.propTarget, 'update styleManager:update', this.targetUpdated);
            this.listenTo(model, 'destroy remove', this.remove);
            this.listenTo(model, 'change:value', this.modelValueChanged);
            this.listenTo(model, 'targetUpdated', this.targetUpdated);
            this.listenTo(model, 'change:visible', this.updateVisibility);
            this.listenTo(model, 'change:status', this.updateStatus);
            this.listenTo(model, 'change:name change:className change:full', this.render);
            const init = this.init && this.init.bind(this);
            init && init();
        },
        updateStatus() {
            const {model} = this;
            const status = model.get('status');
            const parent = model.parent;
            const pfx = this.pfx;
            const ppfx = this.ppfx;
            const config = this.config;
            const updatedCls = `${ ppfx }four-color`;
            const computedCls = `${ ppfx }color-warn`;
            const labelEl = this.$el.children(`.${ pfx }label`);
            const clearStyleEl = this.getClearEl();
            const clearStyle = clearStyleEl ? clearStyleEl.style : {};
            labelEl.removeClass(`${ updatedCls } ${ computedCls }`);
            clearStyle.display = 'none';
            switch (status) {
            case 'updated':
                !parent && labelEl.addClass(updatedCls);
                if (config.clearProperties) {
                    clearStyle.display = 'inline';
                }
                break;
            case 'computed':
                labelEl.addClass(computedCls);
                break;
            }
        },
        clear(ev) {
            ev && ev.stopPropagation();
            this.model.clearValue();
            setTimeout(() => this.targetUpdated());
        },
        getClearEl() {
            if (!this.clearEl) {
                this.clearEl = this.el.querySelector(`[${ clearProp }]`);
            }
            return this.clearEl;
        },
        getTarget() {
            return this.getTargetModel();
        },
        getTargets() {
            const {targets} = this.propTarget;
            return targets || [this.getTarget()];
        },
        getTargetModel() {
            return this.propTarget && this.propTarget.model;
        },
        getHelperModel() {
            return this.propTarget && this.propTarget.helper;
        },
        inputValueChanged(e) {
            e && e.stopPropagation();
            this.model.setValue(this.getInputValue(), 1, { fromInput: 1 });
            this.elementUpdated();
        },
        elementUpdated() {
            this.setStatus('updated');
        },
        setStatus(value) {
            this.model.set('status', value);
            const parent = this.model.parent;
            parent && value == 'updated' && parent.set('status', value);
        },
        emitUpdateTarget: a.debounce(function () {
            const em = this.config.em;
            em && em.trigger('styleManager:update:target', this.getTarget());
        }),
        _getTargetData() {
            const {model, config} = this;
            const targetValue = this.getTargetValue({ ignoreDefault: 1 });
            const defaultValue = model.getDefaultValue();
            const computedValue = this.getComputedValue();
            let value = '';
            let status = '';
            if (targetValue) {
                value = targetValue;
                if (config.highlightChanged) {
                    status = 'updated';
                }
            } else if (computedValue && config.showComputed && computedValue != defaultValue) {
                value = computedValue;
                if (config.highlightComputed) {
                    status = 'computed';
                }
            } else {
                value = defaultValue;
                status = '';
            }
            return {
                value,
                status,
                targetValue,
                defaultValue,
                computedValue
            };
        },
        targetUpdated(mod, val, opts = {}) {
            this.emitUpdateTarget();
            if (!this.checkVisibility()) {
                return;
            }
            const config = this.config;
            const em = config.em;
            const {model} = this;
            const property = model.get('property');
            
            //const {
            //    status,
            //    value,
            //    ...targetData
            //} = this._getTargetData();

            const targetData = this._getTargetData()
            this.setStatus(targetData.status);
            model.setValue(targetData.value, 0, {
                fromTarget: 1,
                ...opts
            });
            if (em) {
                const data = {
                //    status,
                //    value,
                    ...targetData
                };
                em.trigger('styleManager:change', this, property, targetData.value, data);
                em.trigger(`styleManager:change:${ property }`, this, targetData.value, data);
                this._emitUpdate(data);
            }
        },
        _emitUpdate(addData = {}) {
            const {em, model} = this;
            if (!em)
                return;
            const property = model.get('property');
            const data = {
                ...this._getEventData(),
                ...addData
            };
            const {id} = data;
            em.trigger('style:update', data);
            em.trigger(`style:update:${ property }`, data);
            property !== id && em.trigger(`style:update:${ id }`, data);
        },
        _getEventData() {
            const {model} = this;
            return {
                propertyView: this,
                targets: this.getTargets(),
                value: model.getFullValue(),
                property: model,
                id: model.get('id'),
                name: model.get('property')
            };
        },
        checkVisibility() {
            var result = 1;
            if (this.config.hideNotStylable) {
                if (!this.isTargetStylable() || !this.isComponentStylable()) {
                    this.hide();
                    result = 0;
                } else {
                    this.show();
                }
                if (this.sector) {
                    this.sector.trigger('updateVisibility');
                }
            }
            return result;
        },
        getTargetValue(opts = {}) {
            let result;
            const {model} = this;
            const target = this.getTargetModel();
            const customFetchValue = this.customValue;
            if (!target) {
                return result;
            }
            result = target.getStyle()[model.get('property')];
            if (!result && !opts.ignoreDefault) {
                result = model.getDefaultValue();
            }
            if (typeof customFetchValue == 'function' && !opts.ignoreCustomValue) {
                let index = model.collection.indexOf(model);
                let customValue = customFetchValue(this, index, result);
                if (customValue) {
                    result = customValue;
                }
            }
            return result;
        },
        getComputedValue() {
            const target = this.propTarget;
            const computed = target.computed || {};
            const computedDef = target.computedDefault || {};
            const avoid = this.config.avoidComputed || [];
            const property = this.model.get('property');
            const notToSkip = avoid.indexOf(property) < 0;
            const value = computed[property];
            const valueDef = computedDef[b.camelCase(property)];
            return computed && notToSkip && valueDef !== value && value || '';
        },
        getInputValue() {
            const input = this.getInputEl();
            return input ? input.value : '';
        },
        modelValueChanged(e, val, opt = {}) {
            const model = this.model;
            const value = model.getFullValue();
            if (!opt.fromInput) {
                this.setValue(value);
            }
            this.getTargets().forEach(target => this.__updateTarget(target, opt));
        },
        __updateTarget(target, opt = {}) {
            const {model} = this;
            const {em} = this.config;
            const prop = model.get('property');
            const value = model.getFullValue();
            const onChange = this.onChange;
            if (!target || !this.isTargetStylable(target) || !this.isComponentStylable()) {
                return;
            }
            if (!opt.fromTarget) {
                if (onChange && !opt.fromParent) {
                    onChange(target, this, opt);
                } else {
                    this.updateTargetStyle(value, null, {
                        ...opt,
                        target
                    });
                }
            }
            const component = em && em.getSelected();
            if (em && component) {
                !opt.noEmit && em.trigger('component:update', component);
                em.trigger('component:styleUpdate', component, prop);
                em.trigger(`component:styleUpdate:${ prop }`, component);
            }
            this._emitUpdate();
        },
        updateTargetStyle(value, name = '', opts = {}) {
            const property = name || this.model.get('property');
            const target = opts.target || this.getTarget();
            const style = target.getStyle();
            if (value) {
                style[property] = value;
            } else {
                delete style[property];
            }
            target.setStyle(style, opts);
            const helper = this.getHelperModel();
            helper && helper.setStyle(style, opts);
        },
        isTargetStylable(target) {
            const trg = target || this.getTarget();
            const model = this.model;
            const id = model.get('id');
            const property = model.get('property');
            const toRequire = model.get('toRequire');
            const unstylable = trg.get('unstylable');
            const stylableReq = trg.get('stylable-require');
            const requires = model.get('requires');
            const requiresParent = model.get('requiresParent');
            const sectors = this.sector ? this.sector.collection : null;
            const selected = this.em ? this.em.getSelected() : null;
            let stylable = trg.get('stylable');
            if (a.isArray(stylable)) {
                stylable = stylable.indexOf(property) >= 0;
            }
            if (a.isArray(unstylable)) {
                stylable = unstylable.indexOf(property) < 0;
            }
            if (toRequire) {
                stylable = !target || stylableReq && (stylableReq.indexOf(id) >= 0 || stylableReq.indexOf(property) >= 0);
            }
            if (sectors && requires) {
                const properties = Object.keys(requires);
                sectors.each(sector => {
                    sector.get('properties').each(model => {
                        if (a.includes(properties, model.id)) {
                            const values = requires[model.id];
                            stylable = stylable && a.includes(values, model.get('value'));
                        }
                    });
                });
            }
            if (requiresParent) {
                const parent = selected && selected.parent();
                const parentEl = parent && parent.getEl();
                if (parentEl) {
                    const styles = window.getComputedStyle(parentEl);
                    a.each(requiresParent, (values, property) => {
                        stylable = stylable && styles[property] && a.includes(values, styles[property]);
                    });
                } else {
                    stylable = false;
                }
            }
            return stylable;
        },
        isComponentStylable() {
            const em = this.em;
            const component = em && em.getSelected();
            if (!component) {
                return true;
            }
            return this.isTargetStylable(component);
        },
        setRawValue(value) {
            this.setValue(this.model.parseValue(value));
        },
        setValue(value) {
            const model = this.model;
            let val = a.isUndefined(value) ? model.getDefaultValue() : value;
            const input = this.getInputEl();
            input && (input.value = val);
        },
        getInputEl() {
            if (!this.input) {
                this.input = this.el.querySelector('input');
            }
            return this.input;
        },
        updateVisibility() {
            this.el.style.display = this.model.get('visible') ? 'block' : 'none';
        },
        show() {
            this.model.set('visible', 1);
        },
        hide() {
            this.model.set('visible', 0);
        },
        cleanValue() {
            this.setValue('');
        },
        clearCached() {
            this.clearEl = null;
            this.input = null;
            this.$input = null;
        },
        render() {
            this.clearCached();
            const pfx = this.pfx;
            const model = this.model;
            const el = this.el;
            const property = model.get('property');
            const full = model.get('full');
            const cls = model.get('className') || '';
            const className = `${ pfx }property`;
            el.innerHTML = this.template(model);
            el.className = `${ className } ${ pfx }${ model.get('type') } ${ className }__${ property } ${ cls }`.trim();
            el.className += full ? ` ${ className }--full` : '';
            this.updateStatus();
            const onRender = this.onRender && this.onRender.bind(this);
            onRender && onRender();
            this.setValue(model.get('value'), { targetUpdate: 1 });
        }
    });
});
define('skylark-grapejs/style_manager/view/PropertyCompositeView',[
    'skylark-backbone',
    './PropertyView',
    "./PropertiesView"
], function (
    Backbone, 
    PropertyView,
    PropertiesView
) {
    'use strict';
    const $ = Backbone.$;
    return PropertyView.extend({
        templateInput() {
            const pfx = this.pfx;
            return `
      <div class="${ pfx }field ${ pfx }composite">
        <span id="${ pfx }input-holder"></span>
      </div>
    `;
        },
        inputValueChanged(...args) {
            if (!this.model.get('detached')) {
                PropertyView.prototype.inputValueChanged.apply(this, args);
            }
        },
        clear(e) {
            const props = this.properties;
            props && props.forEach(propView => propView.clear());
            PropertyView.prototype.clear.apply(this, arguments);
        },
        onRender() {
            var model = this.model;
            var props = model.get('properties') || [];
            var self = this;
            this.properties = [];
            if (props.length) {
                if (!this.$input) {
                    this.$input = $('<input type="hidden" value="0">');
                    this.input = this.$input.get(0);
                }
                if (!this.props) {
                    this.props = model.get('properties');
                }
                if (!this.$props) {
                    this.props.each(function (prop, index) {
                        if (prop && prop.get('type') == 'composite') {
                            this.props.remove(prop);
                            console.warn('Nested composite types not yet allowed.');
                        }
                        prop.parent = model;
                    }, this);
                    //var PropertiesView = require('./PropertiesView').default;
                    var propsView = new PropertiesView(this.getPropsConfig());
                    this.$props = propsView.render().$el;
                    this.properties = propsView.properties;
                    this.$el.find(`#${ this.pfx }input-holder`).append(this.$props);
                }
            }
        },
        getPropsConfig(opts) {
            var that = this;
            const model = this.model;
            var result = {
                config: {
                    ...this.config,
                    highlightComputed: 0
                },
                collection: this.props,
                target: this.target,
                propTarget: this.propTarget,
                onChange(el, view, opts) {
                    model.set('value', model.getFullValue(), opts);
                },
                customValue(property, mIndex) {
                    return that.valueOnIndex(mIndex, property);
                }
            };
            if (model.get('detached')) {
                delete result.onChange;
            }
            return result;
        },
        valueOnIndex(index, view) {
            let value;
            const targetValue = this.getTargetValue({ ignoreDefault: 1 });
            if (targetValue) {
                const values = targetValue.split(this.model.getSplitSeparator());
                value = values[index];
            } else {
                value = view && view.getTargetValue({
                    ignoreCustomValue: 1,
                    ignoreDefault: 1
                });
            }
            return value;
        },
        clearCached() {
            PropertyView.prototype.clearCached.apply(this, arguments);
            this.$input = null;
            this.props = null;
            this.$props = null;
        }
    });
});
define('skylark-grapejs/style_manager/view/LayerView',[
    'skylark-underscore',
    'skylark-backbone',
    './PropertiesView'
], function (a, Backbone, PropertiesView) {
    'use strict';
    return Backbone.View.extend({
        events: {
            click: 'active',
            'click [data-close-layer]': 'remove',
            'mousedown [data-move-layer]': 'initSorter',
            'touchstart [data-move-layer]': 'initSorter'
        },
        template(model) {
            const {pfx, ppfx, em} = this;
            const label = `${ em && em.t('styleManager.layer') } ${ model.get('index') }`;
            return `
      <div id="${ pfx }move" class="${ ppfx }no-touch-actions" data-move-layer>
        <i class="fa fa-arrows"></i>
      </div>
      <div id="${ pfx }label">${ label }</div>
      <div id="${ pfx }preview-box">
      	<div id="${ pfx }preview" data-preview></div>
      </div>
      <div id="${ pfx }close-layer" class="${ pfx }btn-close" data-close-layer>
        &Cross;
      </div>
      <div id="${ pfx }inputs" data-properties></div>
      <div style="clear:both"></div>
    `;
        },
        initialize(o = {}) {
            let model = this.model;
            this.stackModel = o.stackModel;
            this.config = o.config || {};
            this.em = this.config.em;
            this.pfx = this.config.stylePrefix || '';
            this.ppfx = this.config.pStylePrefix || '';
            this.sorter = o.sorter || null;
            this.propsConfig = o.propsConfig || {};
            this.customPreview = o.onPreview;
            this.listenTo(model, 'destroy remove', this.remove);
            this.listenTo(model, 'change:active', this.updateVisibility);
            this.listenTo(model.get('properties'), 'change', this.updatePreview);
            model.view = this;
            model.set({
                droppable: 0,
                draggable: 1
            });
            this.$el.data('model', model);
        },
        initSorter(e) {
            if (this.sorter)
                this.sorter.startSort(this.el);
        },
        remove(e) {
            if (e && e.stopPropagation)
                e.stopPropagation();
            const model = this.model;
            const collection = model.collection;
            const stackModel = this.stackModel;
            Backbone.View.prototype.remove.apply(this, arguments);
            if (collection.contains(model)) {
                collection.remove(model);
            }
            if (stackModel && stackModel.set) {
                stackModel.set({ stackIndex: null }, { silent: true });
                stackModel.trigger('updateValue');
            }
        },
        onPreview(value) {
            const {stackModel} = this;
            const detach = stackModel && stackModel.get('detached');
            const values = value.split(' ');
            const lim = 3;
            const result = [];
            const resultObj = {};
            this.model.get('properties').each((prop, index) => {
                const property = prop.get('property');
                let value = detach ? prop.getFullValue() : values[index] || '';
                if (value) {
                    if (prop.get('type') == 'integer') {
                        let valueInt = parseInt(value, 10);
                        let unit = value.replace(valueInt, '');
                        valueInt = !isNaN(valueInt) ? valueInt : 0;
                        valueInt = valueInt > lim ? lim : valueInt;
                        valueInt = valueInt < -lim ? -lim : valueInt;
                        value = valueInt + unit;
                    }
                }
                result.push(value);
                resultObj[property] = value;
            });
            return detach ? resultObj : result.join(' ');
        },
        updatePreview() {
            const stackModel = this.stackModel;
            const customPreview = this.customPreview;
            const previewEl = this.getPreviewEl();
            const value = this.model.getFullValue();
            const preview = customPreview ? customPreview(value) : this.onPreview(value);
            if (preview && stackModel && previewEl) {
                const {style} = previewEl;
                if (a.isString(preview)) {
                    style[stackModel.get('property')] = preview;
                } else {
                    let prvStr = [];
                    a.each(preview, (val, prop) => prvStr.push(`${ prop }:${ val }`));
                    previewEl.setAttribute('style', prvStr.join(';'));
                }
            }
        },
        getPropertiesWrapper() {
            if (!this.propsWrapEl) {
                this.propsWrapEl = this.el.querySelector('[data-properties]');
            }
            return this.propsWrapEl;
        },
        getPreviewEl() {
            if (!this.previewEl) {
                this.previewEl = this.el.querySelector('[data-preview]');
            }
            return this.previewEl;
        },
        active() {
            const model = this.model;
            const collection = model.collection;
            collection.active(collection.indexOf(model));
        },
        updateVisibility() {
            const pfx = this.pfx;
            const wrapEl = this.getPropertiesWrapper();
            const active = this.model.get('active');
            wrapEl.style.display = active ? '' : 'none';
            this.$el[active ? 'addClass' : 'removeClass'](`${ pfx }active`);
        },
        render() {
            const propsConfig = this.propsConfig;
            const {model, el, pfx} = this;
            const preview = model.get('preview');
            const properties = new PropertiesView({
                collection: model.get('properties'),
                config: this.config,
                target: propsConfig.target,
                customValue: propsConfig.customValue,
                propTarget: propsConfig.propTarget,
                onChange: propsConfig.onChange
            }).render().el;
            el.innerHTML = this.template(model);
            el.className = `${ pfx }layer${ !preview ? ` ${ pfx }no-preview` : '' }`;
            this.getPropertiesWrapper().appendChild(properties);
            this.updateVisibility();
            this.updatePreview();
            return this;
        }
    });
});
define('skylark-grapejs/style_manager/view/LayersView',[
    'skylark-backbone',
    './LayerView'
], function (Backbone, LayerView) {
    'use strict';
    return Backbone.View.extend({
        initialize(o) {
            this.config = o.config || {};
            this.stackModel = o.stackModel;
            this.preview = o.preview;
            this.pfx = this.config.stylePrefix || '';
            this.ppfx = this.config.pStylePrefix || '';
            this.propsConfig = o.propsConfig;
            let pfx = this.pfx;
            let ppfx = this.ppfx;
            let collection = this.collection;
            this.className = `${ pfx }layers ${ ppfx }field`;
            this.listenTo(collection, 'add', this.addTo);
            this.listenTo(collection, 'deselectAll', this.deselectAll);
            this.listenTo(collection, 'reset', this.render);
            var em = this.config.em || '';
            var utils = em ? em.get('Utils') : '';
            this.sorter = utils ? new utils.Sorter({
                container: this.el,
                ignoreViewChildren: 1,
                containerSel: `.${ pfx }layers`,
                itemSel: `.${ pfx }layer`,
                pfx: this.config.pStylePrefix
            }) : '';
            collection.view = this;
            this.$el.data('model', collection);
            this.$el.data('collection', collection);
        },
        addTo(model) {
            var i = this.collection.indexOf(model);
            this.addToCollection(model, null, i);
        },
        addToCollection(model, fragmentEl, index) {
            var fragment = fragmentEl || null;
            const stackModel = this.stackModel;
            const config = this.config;
            const sorter = this.sorter;
            const propsConfig = this.propsConfig;
            if (typeof this.preview !== 'undefined') {
                model.set('preview', this.preview);
            }
            var view = new LayerView({
                model,
                config,
                sorter,
                stackModel,
                propsConfig
            });
            var rendered = view.render().el;
            if (fragment) {
                fragment.appendChild(rendered);
            } else {
                if (typeof index != 'undefined') {
                    var method = 'before';
                    if (this.$el.children().length == index) {
                        index--;
                        method = 'after';
                    }
                    if (index < 0) {
                        this.$el.append(rendered);
                    } else
                        this.$el.children().eq(index)[method](rendered);
                } else
                    this.$el.append(rendered);
            }
            return rendered;
        },
        deselectAll() {
            this.$el.find('.' + this.pfx + 'layer').removeClass(this.pfx + 'active');
        },
        render() {
            var fragment = document.createDocumentFragment();
            this.$el.empty();
            this.collection.each(function (model) {
                this.addToCollection(model, fragment);
            }, this);
            this.$el.append(fragment);
            this.$el.attr('class', this.className);
            if (this.sorter)
                this.sorter.plh = null;
            return this;
        }
    });
});
define('skylark-grapejs/code_manager/model/CssGenerator',[
    'skylark-backbone',
    'skylark-underscore'
], function (Backbone, a) {
    'use strict';
    const maxValue = Number.MAX_VALUE;
    return Backbone.Model.extend({
        initialize() {
            this.compCls = [];
            this.ids = [];
        },
        buildFromModel(model, opts = {}) {
            let code = '';
            const em = this.em;
            const avoidInline = em && em.getConfig('avoidInlineStyle');
            const style = model.styleToString();
            const classes = model.get('classes');
            const wrapperIsBody = opts.wrapperIsBody;
            const isWrapper = model.get('wrapper');
            this.ids.push(`#${ model.getId() }`);
            classes.each(model => this.compCls.push(model.getFullName()));
            if (!avoidInline && style) {
                let selector = `#${ model.getId() }`;
                selector = wrapperIsBody && isWrapper ? 'body' : selector;
                code = `${ selector }{${ style }}`;
            }
            const components = model.components();
            components.each(model => code += this.buildFromModel(model, opts));
            return code;
        },
        build(model, opts = {}) {
            const cssc = opts.cssc;
            const em = opts.em || '';
            this.em = em;
            this.compCls = [];
            this.ids = [];
            var code = this.buildFromModel(model, opts);
            const clearStyles = a.isUndefined(opts.clearStyles) && em ? em.getConfig('clearStyles') : opts.clearStyles;
            if (cssc) {
                const rules = cssc.getAll();
                const atRules = {};
                const dump = [];
                rules.each(rule => {
                    const atRule = rule.getAtRule();
                    if (atRule) {
                        const mRules = atRules[atRule];
                        if (mRules) {
                            mRules.push(rule);
                        } else {
                            atRules[atRule] = [rule];
                        }
                        return;
                    }
                    code += this.buildFromRule(rule, dump, opts);
                });
                this.sortMediaObject(atRules).forEach(item => {
                    let rulesStr = '';
                    const atRule = item.key;
                    const mRules = item.value;
                    mRules.forEach(rule => {
                        const ruleStr = this.buildFromRule(rule, dump, opts);
                        if (rule.get('singleAtRule')) {
                            code += `${ atRule }{${ ruleStr }}`;
                        } else {
                            rulesStr += ruleStr;
                        }
                    });
                    if (rulesStr) {
                        code += `${ atRule }{${ rulesStr }}`;
                    }
                });
                em && clearStyles && rules.remove(dump);
            }
            return code;
        },
        buildFromRule(rule, dump, opts = {}) {
            let result = '';
            const selectorStrNoAdd = rule.selectorsToString({ skipAdd: 1 });
            const selectorsAdd = rule.get('selectorsAdd');
            const singleAtRule = rule.get('singleAtRule');
            let found;
            rule.get('selectors').each(selector => {
                const name = selector.getFullName();
                if (this.compCls.indexOf(name) >= 0 || this.ids.indexOf(name) >= 0 || opts.keepUnusedStyles) {
                    found = 1;
                }
            });
            if (selectorStrNoAdd && found || selectorsAdd || singleAtRule) {
                const block = rule.getDeclaration();
                block && (result += block);
            } else {
                dump.push(rule);
            }
            return result;
        },
        getQueryLength(mediaQuery) {
            const length = /(-?\d*\.?\d+)\w{0,}/.exec(mediaQuery);
            if (!length)
                return maxValue;
            return parseFloat(length[1]);
        },
        sortMediaObject(items = {}) {
            const itemsArr = [];
            a.each(items, (value, key) => itemsArr.push({
                key,
                value
            }));
            return itemsArr.sort((a, b) => {
                const isMobFirst = [
                    a.key,
                    b.key
                ].every(mquery => mquery.indexOf('min-width') !== -1);
                const left = isMobFirst ? a.key : b.key;
                const right = isMobFirst ? b.key : a.key;
                return this.getQueryLength(left) - this.getQueryLength(right);
            });
        }
    });
});
define('skylark-grapejs/style_manager/view/PropertyStackView',[
    'skylark-underscore',
    "./PropertiesView",
    './PropertyCompositeView',
    './LayersView',
    '../../code_manager/model/CssGenerator'
], function (
    a, 
    PropertiesView,
    PropertyCompositeView, 
    LayersView, 
    CssGenerator
) {
    'use strict';
    const cssGen = new CssGenerator();
    return PropertyCompositeView.extend({
        templateInput() {
            const pfx = this.pfx;
            const ppfx = this.ppfx;
            return `
      <div class="${ pfx }field ${ pfx }stack">
        <button type="button" id="${ pfx }add" data-add-layer>+</button>
        <div data-layers-wrapper></div>
      </div>
    `;
        },
        init() {
            const model = this.model;
            const pfx = this.pfx;
            model.set('stackIndex', null);
            this.events[`click [data-add-layer]`] = 'addLayer';
            this.listenTo(model, 'change:stackIndex', this.indexChanged);
            this.listenTo(model, 'updateValue', this.inputValueChanged);
            this.delegateEvents();
        },
        targetUpdated(...args) {
            if (!this.model.get('detached')) {
                PropertyCompositeView.prototype.targetUpdated.apply(this, args);
            } else {
                const {status} = this._getTargetData();
                this.setStatus(status);
                this.checkVisibility();
            }
            this.refreshLayers();
        },
        getLayers() {
            return this.model.get('layers');
        },
        indexChanged(e) {
            const model = this.model;
            this.getLayers().active(model.get('stackIndex'));
        },
        addLayer() {
            const model = this.model;
            const layers = this.getLayers();
            const prepend = model.get('prepend');
            const properties = model.get('properties').deepClone();
            properties.each(property => property.set('value', ''));
            const layer = layers.add({ properties }, {
                active: 1,
                ...prepend && { at: 0 }
            });
            this.inputValueChanged();
            model.set('stackIndex', layers.indexOf(layer));
        },
        inputValueChanged() {
            const model = this.model;
            this.elementUpdated();
            if (!model.get('detached')) {
                model.set('value', this.getLayerValues());
            } else {
                model.get('properties').each(prop => prop.trigger('change:value'));
            }
        },
        setValue() {
        },
        getLayerValues() {
            return this.getLayers().getFullValue();
        },
        _getClassRule(opts = {}) {
            const {em} = this;
            const {
                skipAdd = 1
            } = opts;
            const selected = em.getSelected();
            const targetAlt = em.get('StyleManager').getModelToStyle(selected, {
                skipAdd,
                useClasses: 1
            });
            return targetAlt !== selected && targetAlt;
        },
        _getParentTarget(target, opts = {}) {
            const {em, model} = this;
            const property = model.get('property');
            const isValid = opts.isValid || (rule => rule.getStyle()[property]);
            const targetsDevice = em.get('CssComposer').getAll().filter(rule => rule.selectorsToString() === target.getSelectorsString());
            const map = targetsDevice.reduce((acc, rule) => {
                acc[rule.getAtRule()] = rule;
                return acc;
            }, {});
            const mapSorted = cssGen.sortMediaObject(map);
            const sortedRules = mapSorted.map(item => item.value);
            const currIndex = sortedRules.indexOf(target);
            const rulesToCheck = sortedRules.splice(0, currIndex);
            let result;
            for (let i = rulesToCheck.length - 1; i > -1; i--) {
                const rule = rulesToCheck[i];
                if (isValid(rule)) {
                    result = rule;
                    break;
                }
            }
            return result;
        },
        refreshLayers() {
            let layersObj = [];
            const {model, em} = this;
            const layers = this.getLayers();
            const detached = model.get('detached');
            const property = model.get('property');
            const target = this.getTarget();
            const valueComput = this.getComputedValue();
            const selected = em.getSelected();
            let resultValue, style, targetAlt, targetAltDevice, valueTargetAlt, valueTrgAltDvc;
            if (detached) {
                style = target ? target.getStyle() : {};
                const hasDetachedStyle = rule => {
                    const name = model.get('properties').at(0).get('property');
                    return rule && !a.isUndefined(rule.getStyle()[name]);
                };
                if (!a.keys(style).length && valueComput && selected) {
                    const parentOpts = { isValid: rule => hasDetachedStyle(rule) };
                    targetAltDevice = this._getParentTarget(target, parentOpts);
                    if (targetAltDevice) {
                        style = targetAltDevice.getStyle();
                    } else {
                        targetAlt = this._getClassRule();
                        valueTargetAlt = hasDetachedStyle(targetAlt) && targetAlt.getStyle();
                        targetAltDevice = !valueTargetAlt && this._getParentTarget(this._getClassRule({ skipAdd: 0 }), parentOpts);
                        valueTrgAltDvc = hasDetachedStyle(targetAltDevice) && targetAltDevice.getStyle();
                        style = valueTargetAlt || valueTrgAltDvc || {};
                    }
                }
                resultValue = style;
                layersObj = layers.getLayersFromStyle(style);
            } else {
                const valueTrg = this.getTargetValue({ ignoreDefault: 1 });
                let value = valueTrg;
                if (!value && valueComput) {
                    targetAltDevice = this._getParentTarget(target);
                    if (targetAltDevice) {
                        value = targetAltDevice.getStyle()[property];
                    } else {
                        targetAlt = this._getClassRule();
                        valueTargetAlt = targetAlt && targetAlt.getStyle()[property];
                        targetAltDevice = !valueTargetAlt && this._getParentTarget(this._getClassRule({ skipAdd: 0 }));
                        valueTrgAltDvc = targetAltDevice && targetAltDevice.getStyle()[property];
                        value = valueTargetAlt || valueTrgAltDvc || valueComput;
                    }
                }
                value = value == model.getDefaultValue() ? '' : value;
                resultValue = value;
                layersObj = layers.getLayersFromValue(value);
            }
            const toAdd = model.getLayersFromTarget(target, {
                resultValue,
                layersObj
            }) || layersObj;
            layers.reset();
            layers.add(toAdd);
            model.set({ stackIndex: null }, { silent: true });
        },
        getTargetValue(opts = {}) {
            let result = PropertyCompositeView.prototype.getTargetValue.call(this, opts);
            const {detached} = this.model.attributes;
            if (a.isUndefined(result) && !detached) {
                result = this.model.getValueFromStyle(this.getTarget().getStyle());
            }
            return result;
        },
        onRender() {
            const self = this;
            const model = this.model;
            const fieldEl = this.el.querySelector('[data-layers-wrapper]');
            //const PropertiesView = require('./PropertiesView').default;
            const propsConfig = {
                target: this.target,
                propTarget: this.propTarget,
                onChange(el, view, opt) {
                    const subModel = view.model;
                    if (model.get('detached')) {
                        const subProp = subModel.get('property');
                        const defVal = subModel.getDefaultValue();
                        const values = self.getLayers().getPropertyValues(subProp, defVal);
                        view.updateTargetStyle(values, null, opt);
                    } else {
                        if (model.get('status') == 'updated') {
                            const value = model.getFullValue();
                            model.set('value', value, opt);
                            !value && view.updateTargetStyle(value, null, opt);
                        }
                    }
                }
            };
            const layers = new LayersView({
                collection: this.getLayers(),
                stackModel: model,
                preview: model.get('preview'),
                config: this.config,
                propsConfig
            }).render().el;
            new PropertiesView({
                target: this.target,
                collection: this.model.get('properties'),
                stackModel: model,
                config: this.config,
                onChange: propsConfig.onChange,
                propTarget: propsConfig.propTarget
            }).render();
            fieldEl.appendChild(layers);
        }
    });
});
define('skylark-grapejs/style_manager/view/PropertyFileView',[
    'skylark-underscore',
    'skylark-backbone',
    './PropertyView'
], function (a, Backbone, PropertyView) {
    'use strict';
    const $ = Backbone.$;
    return PropertyView.extend({
        templateInput() {
            const {pfx, em} = this;
            return `
    <div class="${ pfx }field ${ pfx }file">
      <div id='${ pfx }input-holder'>
        <div class="${ pfx }btn-c">
          <button class="${ pfx }btn" id="${ pfx }images" type="button">
            ${ em.t('styleManager.fileButton') }
          </button>
        </div>
        <div style="clear:both;"></div>
      </div>
      <div id="${ pfx }preview-box">
        <div id="${ pfx }preview-file"></div>
        <div id="${ pfx }close">&Cross;</div>
      </div>
    </div>
    `;
        },
        init() {
            const em = this.em;
            this.modal = em.get('Modal');
            this.am = em.get('AssetManager');
            this.events['click #' + this.pfx + 'close'] = 'removeFile';
            this.events['click #' + this.pfx + 'images'] = 'openAssetManager';
            this.delegateEvents();
        },
        onRender() {
            if (!this.$input) {
                const plh = this.model.getDefaultValue();
                this.$input = $(`<input placeholder="${ plh }">`);
            }
            if (!this.$preview) {
                this.$preview = this.$el.find('#' + this.pfx + 'preview-file');
            }
            if (!this.$previewBox) {
                this.$previewBox = this.$el.find('#' + this.pfx + 'preview-box');
            }
            this.setValue(this.componentValue, 0);
        },
        clearCached() {
            PropertyView.prototype.clearCached.apply(this, arguments);
            this.$preview = null;
            this.$previewBox = null;
        },
        setValue(value, f) {
            PropertyView.prototype.setValue.apply(this, arguments);
            this.setPreviewView(value && value != this.model.getDefaultValue());
            this.setPreview(value);
        },
        setPreviewView(v) {
            const pv = this.$previewBox;
            pv && pv[v ? 'addClass' : 'removeClass'](`${ this.pfx }show`);
            pv && pv.css({ display: v ? 'block' : 'none' });
        },
        spreadUrl(url) {
            this.model.set('value', url);
            this.setPreviewView(1);
        },
        setPreview(value) {
            const preview = this.$preview;
            value = value && value.indexOf('url(') < 0 ? `url(${ value })` : value;
            preview && preview.css('background-image', value);
        },
        cleanValue() {
            this.setPreviewView(0);
            this.model.set({ value: '' }, { silent: true });
        },
        removeFile(...args) {
            this.model.set('value', this.model.getDefaultValue());
            PropertyView.prototype.cleanValue.apply(this, args);
            this.setPreviewView(0);
        },
        openAssetManager(e) {
            const {em, modal} = this;
            const editor = em ? em.get('Editor') : '';
            if (editor) {
                editor.runCommand('open-assets', {
                    types: ['image'],
                    accept: 'image/*',
                    target: this.getTargetModel(),
                    onClick() {
                    },
                    onDblClick() {
                    },
                    onSelect: asset => {
                        modal.close();
                        const url = a.isString(asset) ? asset : asset.get('src');
                        this.spreadUrl(url);
                    }
                });
            }
        }
    });
});
define('skylark-grapejs/style_manager/view/PropertyIntegerView',[
    'skylark-backbone',
    './PropertyView'
], function (Backbone, PropertyView) {
    'use strict';
    const $ = Backbone.$;
    return PropertyView.extend({
        templateInput() {
            return '';
        },
        init() {
            const model = this.model;
            this.listenTo(model, 'change:unit', this.modelValueChanged);
            this.listenTo(model, 'el:change', this.elementUpdated);
            this.listenTo(model, 'change:units', this.render);
        },
        setValue(value) {
            const parsed = this.model.parseValue(value);
            value = `${ parsed.value }${ parsed.unit }`;
            this.inputInst.setValue(value, { silent: 1 });
        },
        onRender() {
            const ppfx = this.ppfx;
            if (!this.input) {
                const input = this.model.input;
                input.ppfx = ppfx;
                input.render();
                const fields = this.el.querySelector(`.${ ppfx }fields`);
                fields.appendChild(input.el);
                this.$input = input.inputEl;
                this.unit = input.unitEl;
                this.$unit = $(this.unit);
                this.input = this.$input.get(0);
                this.inputInst = input;
            }
        },
        clearCached() {
            PropertyView.prototype.clearCached.apply(this, arguments);
            this.unit = null;
            this.$unit = null;
        }
    });
});
define('skylark-grapejs/utils/ColorPicker',[],function () {
    'use strict';
    return function ($, undefined) {
        'use strict';
        var defaultOpts = {
                beforeShow: noop,
                move: noop,
                change: noop,
                show: noop,
                hide: noop,
                color: false,
                flat: false,
                showInput: false,
                allowEmpty: false,
                showButtons: true,
                clickoutFiresChange: true,
                showInitial: false,
                showPalette: false,
                showPaletteOnly: false,
                hideAfterPaletteSelect: false,
                togglePaletteOnly: false,
                showSelectionPalette: true,
                localStorageKey: false,
                appendTo: 'body',
                maxSelectionSize: 7,
                cancelText: 'cancel',
                chooseText: 'choose',
                togglePaletteMoreText: 'more',
                togglePaletteLessText: 'less',
                clearText: 'Clear Color Selection',
                noColorSelectedText: 'No Color Selected',
                preferredFormat: false,
                className: '',
                containerClassName: '',
                replacerClassName: '',
                showAlpha: false,
                theme: 'sp-light',
                palette: [[
                        '#ffffff',
                        '#000000',
                        '#ff0000',
                        '#ff8000',
                        '#ffff00',
                        '#008000',
                        '#0000ff',
                        '#4b0082',
                        '#9400d3'
                    ]],
                selectionPalette: [],
                disabled: false,
                offset: null
            }, spectrums = [], IE = !!/msie/i.exec(window.navigator.userAgent), rgbaSupport = function () {
                function contains(str, substr) {
                    return !!~('' + str).indexOf(substr);
                }
                var elem = document.createElement('div');
                var style = elem.style;
                style.cssText = 'background-color:rgba(0,0,0,.5)';
                return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
            }(), replaceInput = [
                "<div class='sp-replacer'>",
                "<div class='sp-preview'><div class='sp-preview-inner'></div></div>",
                "<div class='sp-dd'>&#9660;</div>",
                '</div>'
            ].join(''), markup = function () {
                var gradientFix = '';
                if (IE) {
                    for (var i = 1; i <= 6; i++) {
                        gradientFix += "<div class='sp-" + i + "'></div>";
                    }
                }
                return [
                    "<div class='sp-container sp-hidden'>",
                    "<div class='sp-palette-container'>",
                    "<div class='sp-palette sp-thumb sp-cf'></div>",
                    "<div class='sp-palette-button-container sp-cf'>",
                    "<button type='button' class='sp-palette-toggle'></button>",
                    '</div>',
                    '</div>',
                    "<div class='sp-picker-container'>",
                    "<div class='sp-top sp-cf'>",
                    "<div class='sp-fill'></div>",
                    "<div class='sp-top-inner'>",
                    "<div class='sp-color'>",
                    "<div class='sp-sat'>",
                    "<div class='sp-val'>",
                    "<div class='sp-dragger'></div>",
                    '</div>',
                    '</div>',
                    '</div>',
                    "<div class='sp-clear sp-clear-display'>",
                    '</div>',
                    "<div class='sp-hue'>",
                    "<div class='sp-slider'></div>",
                    gradientFix,
                    '</div>',
                    '</div>',
                    "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>",
                    '</div>',
                    "<div class='sp-input-container sp-cf'>",
                    "<input class='sp-input' type='text' spellcheck='false'  />",
                    '</div>',
                    "<div class='sp-initial sp-thumb sp-cf'></div>",
                    "<div class='sp-button-container sp-cf'>",
                    "<a class='sp-cancel' href='#'></a>",
                    "<button type='button' class='sp-choose'></button>",
                    '</div>',
                    '</div>',
                    '</div>'
                ].join('');
            }();
        function paletteTemplate(p, color, className, opts) {
            var html = [];
            for (var i = 0; i < p.length; i++) {
                var current = p[i];
                if (current) {
                    var tiny = tinycolor(current);
                    var c = tiny.toHsl().l < 0.5 ? 'sp-thumb-el sp-thumb-dark' : 'sp-thumb-el sp-thumb-light';
                    c += tinycolor.equals(color, current) ? ' sp-thumb-active' : '';
                    var formattedString = tiny.toString(opts.preferredFormat || 'rgb');
                    var swatchStyle = rgbaSupport ? 'background-color:' + tiny.toRgbString() : 'filter:' + tiny.toFilter();
                    html.push('<span title="' + formattedString + '" data-color="' + tiny.toRgbString() + '" class="' + c + '"><span class="sp-thumb-inner" style="' + swatchStyle + ';"></span></span>');
                } else {
                    var cls = 'sp-clear-display';
                    html.push($('<div />').append($('<span data-color="" style="background-color:transparent;" class="' + cls + '"></span>').attr('title', opts.noColorSelectedText)).html());
                }
            }
            return "<div class='sp-cf " + className + "'>" + html.join('') + '</div>';
        }
        function hideAll() {
            for (var i = 0; i < spectrums.length; i++) {
                if (spectrums[i]) {
                    spectrums[i].hide();
                }
            }
        }
        function instanceOptions(o, callbackContext) {
            var opts = $.extend({}, defaultOpts, o);
            opts.callbacks = {
                move: bind(opts.move, callbackContext),
                change: bind(opts.change, callbackContext),
                show: bind(opts.show, callbackContext),
                hide: bind(opts.hide, callbackContext),
                beforeShow: bind(opts.beforeShow, callbackContext)
            };
            return opts;
        }
        function spectrum(element, o) {
            var opts = instanceOptions(o, element), flat = opts.flat, showSelectionPalette = opts.showSelectionPalette, localStorageKey = opts.localStorageKey, theme = opts.theme, callbacks = opts.callbacks, resize = throttle(reflow, 10), visible = false, isDragging = false, dragWidth = 0, dragHeight = 0, dragHelperHeight = 0, slideHeight = 0, slideWidth = 0, alphaWidth = 0, alphaSlideHelperWidth = 0, slideHelperHeight = 0, currentHue = 0, currentSaturation = 0, currentValue = 0, currentAlpha = 1, palette = [], paletteArray = [], paletteLookup = {}, selectionPalette = opts.selectionPalette.slice(0), maxSelectionSize = opts.maxSelectionSize, draggingClass = 'sp-dragging', shiftMovementDirection = null;
            var doc = element.ownerDocument, body = doc.body, boundElement = $(element), disabled = false, container = $(markup, doc).addClass(theme), pickerContainer = container.find('.sp-picker-container'), dragger = container.find('.sp-color'), dragHelper = container.find('.sp-dragger'), slider = container.find('.sp-hue'), slideHelper = container.find('.sp-slider'), alphaSliderInner = container.find('.sp-alpha-inner'), alphaSlider = container.find('.sp-alpha'), alphaSlideHelper = container.find('.sp-alpha-handle'), textInput = container.find('.sp-input'), paletteContainer = container.find('.sp-palette'), initialColorContainer = container.find('.sp-initial'), cancelButton = container.find('.sp-cancel'), clearButton = container.find('.sp-clear'), chooseButton = container.find('.sp-choose'), toggleButton = container.find('.sp-palette-toggle'), isInput = boundElement.is('input'), isInputTypeColor = isInput && boundElement.attr('type') === 'color' && inputTypeColorSupport(), shouldReplace = isInput && !flat, replacer = shouldReplace ? $(replaceInput).addClass(theme).addClass(opts.className).addClass(opts.replacerClassName) : $([]), offsetElement = shouldReplace ? replacer : boundElement, previewElement = replacer.find('.sp-preview-inner'), initialColor = opts.color || isInput && boundElement.val(), colorOnShow = false, currentPreferredFormat = opts.preferredFormat, clickoutFiresChange = !opts.showButtons || opts.clickoutFiresChange, isEmpty = !initialColor, allowEmpty = opts.allowEmpty && !isInputTypeColor;
            function applyOptions() {
                if (opts.showPaletteOnly) {
                    opts.showPalette = true;
                }
                toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);
                if (opts.palette) {
                    palette = opts.palette.slice(0);
                    paletteArray = $.isArray(palette[0]) ? palette : [palette];
                    paletteLookup = {};
                    for (var i = 0; i < paletteArray.length; i++) {
                        for (var j = 0; j < paletteArray[i].length; j++) {
                            var rgb = tinycolor(paletteArray[i][j]).toRgbString();
                            paletteLookup[rgb] = true;
                        }
                    }
                }
                container.toggleClass('sp-flat', flat);
                container.toggleClass('sp-input-disabled', !opts.showInput);
                container.toggleClass('sp-alpha-enabled', opts.showAlpha);
                container.toggleClass('sp-clear-enabled', allowEmpty);
                container.toggleClass('sp-buttons-disabled', !opts.showButtons);
                container.toggleClass('sp-palette-buttons-disabled', !opts.togglePaletteOnly);
                container.toggleClass('sp-palette-disabled', !opts.showPalette);
                container.toggleClass('sp-palette-only', opts.showPaletteOnly);
                container.toggleClass('sp-initial-disabled', !opts.showInitial);
                container.addClass(opts.className).addClass(opts.containerClassName);
                reflow();
            }
            function initialize() {
                if (IE) {
                    container.find('*:not(input)').attr('unselectable', 'on');
                }
                applyOptions();
                if (shouldReplace) {
                    boundElement.after(replacer).hide();
                }
                if (!allowEmpty) {
                    clearButton.hide();
                }
                if (flat) {
                    boundElement.after(container).hide();
                } else {
                    var appendTo = opts.appendTo === 'parent' ? boundElement.parent() : $(opts.appendTo);
                    if (appendTo.length !== 1) {
                        appendTo = $('body');
                    }
                    appendTo.append(container);
                }
                updateSelectionPaletteFromStorage();
                offsetElement.bind('click.spectrum touchstart.spectrum', function (e) {
                    if (!disabled) {
                        toggle();
                    }
                    e.stopPropagation();
                    if (!$(e.target).is('input')) {
                        e.preventDefault();
                    }
                });
                if (boundElement.is(':disabled') || opts.disabled === true) {
                    disable();
                }
                container.click(stopPropagation);
                textInput.change(setFromTextInput);
                textInput.bind('paste', function () {
                    setTimeout(setFromTextInput, 1);
                });
                textInput.keydown(function (e) {
                    if (e.keyCode == 13) {
                        setFromTextInput();
                    }
                });
                cancelButton.text(opts.cancelText);
                cancelButton.bind('click.spectrum', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    revert();
                    hide();
                });
                clearButton.attr('title', opts.clearText);
                clearButton.bind('click.spectrum', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    isEmpty = true;
                    move();
                    if (flat) {
                        updateOriginalInput(true);
                    }
                });
                chooseButton.text(opts.chooseText);
                chooseButton.bind('click.spectrum', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (IE && textInput.is(':focus')) {
                        textInput.trigger('change');
                    }
                    if (isValid()) {
                        updateOriginalInput(true);
                        hide();
                    }
                });
                toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);
                toggleButton.bind('click.spectrum', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    opts.showPaletteOnly = !opts.showPaletteOnly;
                    if (!opts.showPaletteOnly && !flat) {
                        container.css('left', '-=' + (pickerContainer.outerWidth(true) + 5));
                    }
                    applyOptions();
                });
                draggable(alphaSlider, function (dragX, dragY, e) {
                    currentAlpha = dragX / alphaWidth;
                    isEmpty = false;
                    if (e.shiftKey) {
                        currentAlpha = Math.round(currentAlpha * 10) / 10;
                    }
                    move();
                }, dragStart, dragStop);
                draggable(slider, function (dragX, dragY) {
                    currentHue = parseFloat(dragY / slideHeight);
                    isEmpty = false;
                    if (!opts.showAlpha) {
                        currentAlpha = 1;
                    }
                    move();
                }, dragStart, dragStop);
                draggable(dragger, function (dragX, dragY, e) {
                    if (!e.shiftKey) {
                        shiftMovementDirection = null;
                    } else if (!shiftMovementDirection) {
                        var oldDragX = currentSaturation * dragWidth;
                        var oldDragY = dragHeight - currentValue * dragHeight;
                        var furtherFromX = Math.abs(dragX - oldDragX) > Math.abs(dragY - oldDragY);
                        shiftMovementDirection = furtherFromX ? 'x' : 'y';
                    }
                    var setSaturation = !shiftMovementDirection || shiftMovementDirection === 'x';
                    var setValue = !shiftMovementDirection || shiftMovementDirection === 'y';
                    if (setSaturation) {
                        currentSaturation = parseFloat(dragX / dragWidth);
                    }
                    if (setValue) {
                        currentValue = parseFloat((dragHeight - dragY) / dragHeight);
                    }
                    isEmpty = false;
                    if (!opts.showAlpha) {
                        currentAlpha = 1;
                    }
                    move();
                }, dragStart, dragStop);
                if (!!initialColor) {
                    set(initialColor);
                    updateUI();
                    currentPreferredFormat = opts.preferredFormat || tinycolor(initialColor).format;
                    addColorToSelectionPalette(initialColor);
                } else {
                    updateUI();
                }
                if (flat) {
                    show();
                }
                function paletteElementClick(e) {
                    if (e.data && e.data.ignore) {
                        set($(e.target).closest('.sp-thumb-el').data('color'));
                        move();
                    } else {
                        set($(e.target).closest('.sp-thumb-el').data('color'));
                        move();
                        updateOriginalInput(true);
                        if (opts.hideAfterPaletteSelect) {
                            hide();
                        }
                    }
                    return false;
                }
                var paletteEvent = IE ? 'mousedown.spectrum' : 'click.spectrum touchstart.spectrum';
                paletteContainer.delegate('.sp-thumb-el', paletteEvent, paletteElementClick);
                initialColorContainer.delegate('.sp-thumb-el:nth-child(1)', paletteEvent, { ignore: true }, paletteElementClick);
            }
            function updateSelectionPaletteFromStorage() {
                if (localStorageKey && window.localStorage) {
                    try {
                        var oldPalette = window.localStorage[localStorageKey].split(',#');
                        if (oldPalette.length > 1) {
                            delete window.localStorage[localStorageKey];
                            $.each(oldPalette, function (i, c) {
                                addColorToSelectionPalette(c);
                            });
                        }
                    } catch (e) {
                    }
                    try {
                        selectionPalette = window.localStorage[localStorageKey].split(';');
                    } catch (e) {
                    }
                }
            }
            function addColorToSelectionPalette(color) {
                if (showSelectionPalette) {
                    var rgb = tinycolor(color).toRgbString();
                    if (!paletteLookup[rgb] && $.inArray(rgb, selectionPalette) === -1) {
                        selectionPalette.push(rgb);
                        while (selectionPalette.length > maxSelectionSize) {
                            selectionPalette.shift();
                        }
                    }
                    if (localStorageKey && window.localStorage) {
                        try {
                            window.localStorage[localStorageKey] = selectionPalette.join(';');
                        } catch (e) {
                        }
                    }
                }
            }
            function getUniqueSelectionPalette() {
                var unique = [];
                if (opts.showPalette) {
                    for (var i = 0; i < selectionPalette.length; i++) {
                        var rgb = tinycolor(selectionPalette[i]).toRgbString();
                        if (!paletteLookup[rgb]) {
                            unique.push(selectionPalette[i]);
                        }
                    }
                }
                return unique.reverse().slice(0, opts.maxSelectionSize);
            }
            function drawPalette() {
                var currentColor = get();
                var html = $.map(paletteArray, function (palette, i) {
                    return paletteTemplate(palette, currentColor, 'sp-palette-row sp-palette-row-' + i, opts);
                });
                updateSelectionPaletteFromStorage();
                if (selectionPalette) {
                    html.push(paletteTemplate(getUniqueSelectionPalette(), currentColor, 'sp-palette-row sp-palette-row-selection', opts));
                }
                paletteContainer.html(html.join(''));
            }
            function drawInitial() {
                if (opts.showInitial) {
                    var initial = colorOnShow;
                    var current = get();
                    initialColorContainer.html(paletteTemplate([
                        initial,
                        current
                    ], current, 'sp-palette-row-initial', opts));
                }
            }
            function dragStart() {
                if (dragHeight <= 0 || dragWidth <= 0 || slideHeight <= 0) {
                    reflow();
                }
                isDragging = true;
                container.addClass(draggingClass);
                shiftMovementDirection = null;
                boundElement.trigger('dragstart.spectrum', [get()]);
            }
            function dragStop() {
                isDragging = false;
                container.removeClass(draggingClass);
                boundElement.trigger('dragstop.spectrum', [get()]);
            }
            function setFromTextInput() {
                var value = textInput.val();
                if ((value === null || value === '') && allowEmpty) {
                    set(null);
                    updateOriginalInput(true);
                } else {
                    var tiny = tinycolor(value);
                    if (tiny.isValid()) {
                        set(tiny);
                        updateOriginalInput(true);
                    } else {
                        textInput.addClass('sp-validation-error');
                    }
                }
            }
            function toggle() {
                if (visible) {
                    hide();
                } else {
                    show();
                }
            }
            function show() {
                var event = $.Event('beforeShow.spectrum');
                if (visible) {
                    reflow();
                    return;
                }
                boundElement.trigger('beforeShow.spectrum', [get()]);
                if (callbacks.beforeShow(get()) === false || event.isDefaultPrevented()) {
                    return;
                }
                hideAll();
                visible = true;
                var $doc = $(doc);
                $doc.bind('keydown.spectrum', onkeydown);
                $doc.bind('click.spectrum', clickout);
                $(window).bind('resize.spectrum', resize);
                replacer.addClass('sp-active');
                container.removeClass('sp-hidden');
                reflow();
                updateUI();
                colorOnShow = get();
                drawInitial();
                callbacks.show(colorOnShow);
                boundElement.trigger('show.spectrum', [colorOnShow]);
            }
            function onkeydown(e) {
                if (e.keyCode === 27) {
                    hide();
                }
            }
            function clickout(e) {
                if (e.button == 2) {
                    return;
                }
                if (isDragging) {
                    return;
                }
                if (clickoutFiresChange) {
                    updateOriginalInput(true);
                } else {
                    revert();
                }
                hide();
            }
            function hide() {
                if (!visible || flat) {
                    return;
                }
                visible = false;
                $(doc).unbind('keydown.spectrum', onkeydown);
                $(doc).unbind('click.spectrum', clickout);
                $(window).unbind('resize.spectrum', resize);
                replacer.removeClass('sp-active');
                container.addClass('sp-hidden');
                callbacks.hide(get());
                boundElement.trigger('hide.spectrum', [get()]);
            }
            function revert() {
                set(colorOnShow, true);
            }
            function set(color, ignoreFormatChange) {
                if (tinycolor.equals(color, get())) {
                    updateUI();
                    return;
                }
                var newColor, newHsv;
                if (!color && allowEmpty) {
                    isEmpty = true;
                } else {
                    isEmpty = false;
                    newColor = tinycolor(color);
                    newHsv = newColor.toHsv();
                    currentHue = newHsv.h % 360 / 360;
                    currentSaturation = newHsv.s;
                    currentValue = newHsv.v;
                    currentAlpha = newHsv.a;
                }
                updateUI();
                if (newColor && newColor.isValid() && !ignoreFormatChange) {
                    currentPreferredFormat = opts.preferredFormat || newColor.getFormat();
                }
            }
            function get(opts) {
                opts = opts || {};
                if (allowEmpty && isEmpty) {
                    return null;
                }
                return tinycolor.fromRatio({
                    h: currentHue,
                    s: currentSaturation,
                    v: currentValue,
                    a: Math.round(currentAlpha * 100) / 100
                }, { format: opts.format || currentPreferredFormat });
            }
            function isValid() {
                return !textInput.hasClass('sp-validation-error');
            }
            function move() {
                updateUI();
                callbacks.move(get());
                boundElement.trigger('move.spectrum', [get()]);
            }
            function updateUI() {
                textInput.removeClass('sp-validation-error');
                updateHelperLocations();
                var flatColor = tinycolor.fromRatio({
                    h: currentHue,
                    s: 1,
                    v: 1
                });
                dragger.css('background-color', flatColor.toHexString());
                var format = currentPreferredFormat;
                if (currentAlpha < 1 && !(currentAlpha === 0 && format === 'name')) {
                    if (format === 'hex' || format === 'hex3' || format === 'hex6' || format === 'name') {
                        format = 'rgb';
                    }
                }
                var realColor = get({ format: format }), displayColor = '';
                previewElement.removeClass('sp-clear-display');
                previewElement.css('background-color', 'transparent');
                if (!realColor && allowEmpty) {
                    previewElement.addClass('sp-clear-display');
                } else {
                    var realHex = realColor.toHexString(), realRgb = realColor.toRgbString();
                    if (rgbaSupport || realColor.alpha === 1) {
                        previewElement.css('background-color', realRgb);
                    } else {
                        previewElement.css('background-color', 'transparent');
                        previewElement.css('filter', realColor.toFilter());
                    }
                    if (opts.showAlpha) {
                        var rgb = realColor.toRgb();
                        rgb.a = 0;
                        var realAlpha = tinycolor(rgb).toRgbString();
                        var gradient = 'linear-gradient(left, ' + realAlpha + ', ' + realHex + ')';
                        if (IE) {
                            alphaSliderInner.css('filter', tinycolor(realAlpha).toFilter({ gradientType: 1 }, realHex));
                        } else {
                            alphaSliderInner.css('background', '-webkit-' + gradient);
                            alphaSliderInner.css('background', '-moz-' + gradient);
                            alphaSliderInner.css('background', '-ms-' + gradient);
                            alphaSliderInner.css('background', 'linear-gradient(to right, ' + realAlpha + ', ' + realHex + ')');
                        }
                    }
                    displayColor = realColor.toString(format);
                }
                if (opts.showInput) {
                    textInput.val(displayColor);
                }
                if (opts.showPalette) {
                    drawPalette();
                }
                drawInitial();
            }
            function updateHelperLocations() {
                var s = currentSaturation;
                var v = currentValue;
                if (allowEmpty && isEmpty) {
                    alphaSlideHelper.hide();
                    slideHelper.hide();
                    dragHelper.hide();
                } else {
                    alphaSlideHelper.show();
                    slideHelper.show();
                    dragHelper.show();
                    var dragX = s * dragWidth;
                    var dragY = dragHeight - v * dragHeight;
                    dragX = Math.max(-dragHelperHeight, Math.min(dragWidth - dragHelperHeight, dragX - dragHelperHeight));
                    dragY = Math.max(-dragHelperHeight, Math.min(dragHeight - dragHelperHeight, dragY - dragHelperHeight));
                    dragHelper.css({
                        top: dragY + 'px',
                        left: dragX + 'px'
                    });
                    var alphaX = currentAlpha * alphaWidth;
                    alphaSlideHelper.css({ left: alphaX - alphaSlideHelperWidth / 2 + 'px' });
                    var slideY = currentHue * slideHeight;
                    slideHelper.css({ top: slideY - slideHelperHeight + 'px' });
                }
            }
            function updateOriginalInput(fireCallback) {
                var color = get(), displayColor = '', hasChanged = !tinycolor.equals(color, colorOnShow);
                if (color) {
                    displayColor = color.toString(currentPreferredFormat);
                    addColorToSelectionPalette(color);
                }
                if (isInput) {
                    boundElement.val(displayColor);
                }
                if (fireCallback && hasChanged) {
                    callbacks.change(color);
                    boundElement.trigger('change', [color]);
                }
            }
            function reflow() {
                if (!visible) {
                    return;
                }
                dragWidth = dragger.width();
                dragHeight = dragger.height();
                dragHelperHeight = dragHelper.height();
                slideWidth = slider.width();
                slideHeight = slider.height();
                slideHelperHeight = slideHelper.height();
                alphaWidth = alphaSlider.width();
                alphaSlideHelperWidth = alphaSlideHelper.width();
                if (!flat) {
                    container.css('position', 'absolute');
                    if (opts.offset) {
                        container.offset(opts.offset);
                    } else {
                        container.offset(getOffset(container, offsetElement));
                    }
                }
                updateHelperLocations();
                if (opts.showPalette) {
                    drawPalette();
                }
                boundElement.trigger('reflow.spectrum');
            }
            function destroy() {
                boundElement.show();
                offsetElement.unbind('click.spectrum touchstart.spectrum');
                container.remove();
                replacer.remove();
                spectrums[spect.id] = null;
            }
            function option(optionName, optionValue) {
                if (optionName === undefined) {
                    return $.extend({}, opts);
                }
                if (optionValue === undefined) {
                    return opts[optionName];
                }
                opts[optionName] = optionValue;
                if (optionName === 'preferredFormat') {
                    currentPreferredFormat = opts.preferredFormat;
                }
                applyOptions();
            }
            function enable() {
                disabled = false;
                boundElement.attr('disabled', false);
                offsetElement.removeClass('sp-disabled');
            }
            function disable() {
                hide();
                disabled = true;
                boundElement.attr('disabled', true);
                offsetElement.addClass('sp-disabled');
            }
            function setOffset(coord) {
                opts.offset = coord;
                reflow();
            }
            initialize();
            var spect = {
                show: show,
                hide: hide,
                toggle: toggle,
                reflow: reflow,
                option: option,
                enable: enable,
                disable: disable,
                offset: setOffset,
                set: function (c) {
                    set(c);
                    updateOriginalInput();
                },
                get: get,
                destroy: destroy,
                container: container
            };
            spect.id = spectrums.push(spect) - 1;
            return spect;
        }
        function getOffset(picker, input) {
            var extraY = 0;
            var dpWidth = picker.outerWidth();
            var dpHeight = picker.outerHeight();
            var inputHeight = input.outerHeight();
            var doc = picker[0].ownerDocument;
            var docElem = doc.documentElement;
            var cW = docElem.clientWidth;
            var cH = docElem.clientHeight;
            var scL = $(doc).scrollLeft();
            var scT = $(doc).scrollTop();
            var viewWidth = cW + scL;
            var viewHeight = cH + scT;
            var offset = input.offset();
            offset.top += inputHeight;
            offset.left -= Math.min(offset.left, offset.left + dpWidth > viewWidth && viewWidth > dpWidth ? Math.abs(offset.left + dpWidth - viewWidth) : 0);
            offset.top -= Math.min(offset.top, offset.top + dpHeight > viewHeight && viewHeight > dpHeight ? Math.abs(dpHeight + inputHeight - extraY) : extraY);
            return offset;
        }
        function noop() {
        }
        function stopPropagation(e) {
            e.stopPropagation();
        }
        function bind(func, obj) {
            var slice = Array.prototype.slice;
            var args = slice.call(arguments, 2);
            return function () {
                return func.apply(obj, args.concat(slice.call(arguments)));
            };
        }
        function draggable(element, onmove, onstart, onstop) {
            onmove = onmove || function () {
            };
            onstart = onstart || function () {
            };
            onstop = onstop || function () {
            };
            var doc = document;
            var dragging = false;
            var offset = {};
            var maxHeight = 0;
            var maxWidth = 0;
            var hasTouch = 'ontouchstart' in window;
            var duringDragEvents = {};
            duringDragEvents['selectstart'] = prevent;
            duringDragEvents['dragstart'] = prevent;
            duringDragEvents['touchmove mousemove'] = move;
            duringDragEvents['touchend mouseup'] = stop;
            function prevent(e) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.returnValue = false;
            }
            function move(e) {
                if (dragging) {
                    if (IE && doc.documentMode < 9 && !e.button) {
                        return stop();
                    }
                    var t0 = e && e.touches && e.touches[0];
                    var pageX = t0 && t0.pageX || e.pageX;
                    var pageY = t0 && t0.pageY || e.pageY;
                    var dragX = Math.max(0, Math.min(pageX - offset.left, maxWidth));
                    var dragY = Math.max(0, Math.min(pageY - offset.top, maxHeight));
                    if (hasTouch) {
                        prevent(e);
                    }
                    onmove.apply(element, [
                        dragX,
                        dragY,
                        e
                    ]);
                }
            }
            function start(e) {
                var rightclick = e.which ? e.which == 3 : e.button == 2;
                if (!rightclick && !dragging) {
                    if (onstart.apply(element, arguments) !== false) {
                        dragging = true;
                        maxHeight = $(element).height();
                        maxWidth = $(element).width();
                        offset = $(element).offset();
                        $(doc).bind(duringDragEvents);
                        $(doc.body).addClass('sp-dragging');
                        move(e);
                        prevent(e);
                    }
                }
            }
            function stop() {
                if (dragging) {
                    $(doc).unbind(duringDragEvents);
                    $(doc.body).removeClass('sp-dragging');
                    setTimeout(function () {
                        onstop.apply(element, arguments);
                    }, 0);
                }
                dragging = false;
            }
            $(element).bind('touchstart mousedown', start);
        }
        function throttle(func, wait, debounce) {
            var timeout;
            return function () {
                var context = this, args = arguments;
                var throttler = function () {
                    timeout = null;
                    func.apply(context, args);
                };
                if (debounce)
                    clearTimeout(timeout);
                if (debounce || !timeout)
                    timeout = setTimeout(throttler, wait);
            };
        }
        function inputTypeColorSupport() {
            return $.fn.spectrum.inputTypeColorSupport();
        }
        var dataID = 'spectrum.id';
        $.fn.spectrum = function (opts, extra) {
            if (typeof opts == 'string') {
                var returnValue = this;
                var args = Array.prototype.slice.call(arguments, 1);
                this.each(function () {
                    var spect = spectrums[$(this).data(dataID)];
                    if (spect) {
                        var method = spect[opts];
                        if (!method) {
                            throw new Error("Spectrum: no such method: '" + opts + "'");
                        }
                        if (opts == 'get') {
                            returnValue = spect.get();
                        } else if (opts == 'container') {
                            returnValue = spect.container;
                        } else if (opts == 'option') {
                            returnValue = spect.option.apply(spect, args);
                        } else if (opts == 'destroy') {
                            spect.destroy();
                            $(this).removeData(dataID);
                        } else {
                            method.apply(spect, args);
                        }
                    }
                });
                return returnValue;
            }
            return this.spectrum('destroy').each(function () {
                var options = $.extend({}, opts, $(this).data());
                var spect = spectrum(this, options);
                $(this).data(dataID, spect.id);
            });
        };
        $.fn.spectrum.load = true;
        $.fn.spectrum.loadOpts = {};
        $.fn.spectrum.draggable = draggable;
        $.fn.spectrum.defaults = defaultOpts;
        $.fn.spectrum.inputTypeColorSupport = function inputTypeColorSupport() {
            if (typeof inputTypeColorSupport._cachedResult === 'undefined') {
                var colorInput = $("<input type='color'/>")[0];
                inputTypeColorSupport._cachedResult = colorInput.type === 'color' && colorInput.value !== '';
            }
            return inputTypeColorSupport._cachedResult;
        };
        $.spectrum = {};
        $.spectrum.localization = {};
        $.spectrum.palettes = {};
        $.fn.spectrum.processNativeColorInputs = function () {
            var colorInputs = $('input[type=color]');
            if (colorInputs.length && !inputTypeColorSupport()) {
                colorInputs.spectrum({ preferredFormat: 'hex6' });
            }
        };
        var trimLeft = /^[\s,#]+/, trimRight = /\s+$/, tinyCounter = 0, math = Math, mathRound = math.round, mathMin = math.min, mathMax = math.max, mathRandom = math.random;
        var tinycolor = function (color, opts) {
            color = color ? color : '';
            opts = opts || {};
            if (color instanceof tinycolor) {
                return color;
            }
            if (!(this instanceof tinycolor)) {
                return new tinycolor(color, opts);
            }
            var rgb = inputToRGB(color);
            this._originalInput = color, this._r = rgb.r, this._g = rgb.g, this._b = rgb.b, this._a = rgb.a, this._roundA = mathRound(100 * this._a) / 100, this._format = opts.format || rgb.format;
            this._gradientType = opts.gradientType;
            if (this._r < 1) {
                this._r = mathRound(this._r);
            }
            if (this._g < 1) {
                this._g = mathRound(this._g);
            }
            if (this._b < 1) {
                this._b = mathRound(this._b);
            }
            this._ok = rgb.ok;
            this._tc_id = tinyCounter++;
        };
        tinycolor.prototype = {
            isDark: function () {
                return this.getBrightness() < 128;
            },
            isLight: function () {
                return !this.isDark();
            },
            isValid: function () {
                return this._ok;
            },
            getOriginalInput: function () {
                return this._originalInput;
            },
            getFormat: function () {
                return this._format;
            },
            getAlpha: function () {
                return this._a;
            },
            getBrightness: function () {
                var rgb = this.toRgb();
                return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
            },
            setAlpha: function (value) {
                this._a = boundAlpha(value);
                this._roundA = mathRound(100 * this._a) / 100;
                return this;
            },
            toHsv: function () {
                var hsv = rgbToHsv(this._r, this._g, this._b);
                return {
                    h: hsv.h * 360,
                    s: hsv.s,
                    v: hsv.v,
                    a: this._a
                };
            },
            toHsvString: function () {
                var hsv = rgbToHsv(this._r, this._g, this._b);
                var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
                return this._a == 1 ? 'hsv(' + h + ', ' + s + '%, ' + v + '%)' : 'hsva(' + h + ', ' + s + '%, ' + v + '%, ' + this._roundA + ')';
            },
            toHsl: function () {
                var hsl = rgbToHsl(this._r, this._g, this._b);
                return {
                    h: hsl.h * 360,
                    s: hsl.s,
                    l: hsl.l,
                    a: this._a
                };
            },
            toHslString: function () {
                var hsl = rgbToHsl(this._r, this._g, this._b);
                var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
                return this._a == 1 ? 'hsl(' + h + ', ' + s + '%, ' + l + '%)' : 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + this._roundA + ')';
            },
            toHex: function (allow3Char) {
                return rgbToHex(this._r, this._g, this._b, allow3Char);
            },
            toHexString: function (allow3Char) {
                return '#' + this.toHex(allow3Char);
            },
            toHex8: function () {
                return rgbaToHex(this._r, this._g, this._b, this._a);
            },
            toHex8String: function () {
                return '#' + this.toHex8();
            },
            toRgb: function () {
                return {
                    r: mathRound(this._r),
                    g: mathRound(this._g),
                    b: mathRound(this._b),
                    a: this._a
                };
            },
            toRgbString: function () {
                return this._a == 1 ? 'rgb(' + mathRound(this._r) + ', ' + mathRound(this._g) + ', ' + mathRound(this._b) + ')' : 'rgba(' + mathRound(this._r) + ', ' + mathRound(this._g) + ', ' + mathRound(this._b) + ', ' + this._roundA + ')';
            },
            toPercentageRgb: function () {
                return {
                    r: mathRound(bound01(this._r, 255) * 100) + '%',
                    g: mathRound(bound01(this._g, 255) * 100) + '%',
                    b: mathRound(bound01(this._b, 255) * 100) + '%',
                    a: this._a
                };
            },
            toPercentageRgbString: function () {
                return this._a == 1 ? 'rgb(' + mathRound(bound01(this._r, 255) * 100) + '%, ' + mathRound(bound01(this._g, 255) * 100) + '%, ' + mathRound(bound01(this._b, 255) * 100) + '%)' : 'rgba(' + mathRound(bound01(this._r, 255) * 100) + '%, ' + mathRound(bound01(this._g, 255) * 100) + '%, ' + mathRound(bound01(this._b, 255) * 100) + '%, ' + this._roundA + ')';
            },
            toName: function () {
                if (this._a === 0) {
                    return 'transparent';
                }
                if (this._a < 1) {
                    return false;
                }
                return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
            },
            toFilter: function (secondColor) {
                var hex8String = '#' + rgbaToHex(this._r, this._g, this._b, this._a);
                var secondHex8String = hex8String;
                var gradientType = this._gradientType ? 'GradientType = 1, ' : '';
                if (secondColor) {
                    var s = tinycolor(secondColor);
                    secondHex8String = s.toHex8String();
                }
                return 'progid:DXImageTransform.Microsoft.gradient(' + gradientType + 'startColorstr=' + hex8String + ',endColorstr=' + secondHex8String + ')';
            },
            toString: function (format) {
                var formatSet = !!format;
                format = format || this._format;
                var formattedString = false;
                var hasAlpha = this._a < 1 && this._a >= 0;
                var needsAlphaFormat = !formatSet && hasAlpha && (format === 'hex' || format === 'hex6' || format === 'hex3' || format === 'name');
                if (needsAlphaFormat) {
                    if (format === 'name' && this._a === 0) {
                        return this.toName();
                    }
                    return this.toRgbString();
                }
                if (format === 'rgb') {
                    formattedString = this.toRgbString();
                }
                if (format === 'prgb') {
                    formattedString = this.toPercentageRgbString();
                }
                if (format === 'hex' || format === 'hex6') {
                    formattedString = this.toHexString();
                }
                if (format === 'hex3') {
                    formattedString = this.toHexString(true);
                }
                if (format === 'hex8') {
                    formattedString = this.toHex8String();
                }
                if (format === 'name') {
                    formattedString = this.toName();
                }
                if (format === 'hsl') {
                    formattedString = this.toHslString();
                }
                if (format === 'hsv') {
                    formattedString = this.toHsvString();
                }
                return formattedString || this.toHexString();
            },
            _applyModification: function (fn, args) {
                var color = fn.apply(null, [this].concat([].slice.call(args)));
                this._r = color._r;
                this._g = color._g;
                this._b = color._b;
                this.setAlpha(color._a);
                return this;
            },
            lighten: function () {
                return this._applyModification(lighten, arguments);
            },
            brighten: function () {
                return this._applyModification(brighten, arguments);
            },
            darken: function () {
                return this._applyModification(darken, arguments);
            },
            desaturate: function () {
                return this._applyModification(desaturate, arguments);
            },
            saturate: function () {
                return this._applyModification(saturate, arguments);
            },
            greyscale: function () {
                return this._applyModification(greyscale, arguments);
            },
            spin: function () {
                return this._applyModification(spin, arguments);
            },
            _applyCombination: function (fn, args) {
                return fn.apply(null, [this].concat([].slice.call(args)));
            },
            analogous: function () {
                return this._applyCombination(analogous, arguments);
            },
            complement: function () {
                return this._applyCombination(complement, arguments);
            },
            monochromatic: function () {
                return this._applyCombination(monochromatic, arguments);
            },
            splitcomplement: function () {
                return this._applyCombination(splitcomplement, arguments);
            },
            triad: function () {
                return this._applyCombination(triad, arguments);
            },
            tetrad: function () {
                return this._applyCombination(tetrad, arguments);
            }
        };
        tinycolor.fromRatio = function (color, opts) {
            if (typeof color == 'object') {
                var newColor = {};
                for (var i in color) {
                    if (color.hasOwnProperty(i)) {
                        if (i === 'a') {
                            newColor[i] = color[i];
                        } else {
                            newColor[i] = convertToPercentage(color[i]);
                        }
                    }
                }
                color = newColor;
            }
            return tinycolor(color, opts);
        };
        function inputToRGB(color) {
            var rgb = {
                r: 0,
                g: 0,
                b: 0
            };
            var a = 1;
            var ok = false;
            var format = false;
            if (typeof color == 'string') {
                color = stringInputToObject(color);
            }
            if (typeof color == 'object') {
                if (color.hasOwnProperty('r') && color.hasOwnProperty('g') && color.hasOwnProperty('b')) {
                    rgb = rgbToRgb(color.r, color.g, color.b);
                    ok = true;
                    format = String(color.r).substr(-1) === '%' ? 'prgb' : 'rgb';
                } else if (color.hasOwnProperty('h') && color.hasOwnProperty('s') && color.hasOwnProperty('v')) {
                    color.s = convertToPercentage(color.s);
                    color.v = convertToPercentage(color.v);
                    rgb = hsvToRgb(color.h, color.s, color.v);
                    ok = true;
                    format = 'hsv';
                } else if (color.hasOwnProperty('h') && color.hasOwnProperty('s') && color.hasOwnProperty('l')) {
                    color.s = convertToPercentage(color.s);
                    color.l = convertToPercentage(color.l);
                    rgb = hslToRgb(color.h, color.s, color.l);
                    ok = true;
                    format = 'hsl';
                }
                if (color.hasOwnProperty('a')) {
                    a = color.a;
                }
            }
            a = boundAlpha(a);
            return {
                ok: ok,
                format: color.format || format,
                r: mathMin(255, mathMax(rgb.r, 0)),
                g: mathMin(255, mathMax(rgb.g, 0)),
                b: mathMin(255, mathMax(rgb.b, 0)),
                a: a
            };
        }
        function rgbToRgb(r, g, b) {
            return {
                r: bound01(r, 255) * 255,
                g: bound01(g, 255) * 255,
                b: bound01(b, 255) * 255
            };
        }
        function rgbToHsl(r, g, b) {
            r = bound01(r, 255);
            g = bound01(g, 255);
            b = bound01(b, 255);
            var max = mathMax(r, g, b), min = mathMin(r, g, b);
            var h, s, l = (max + min) / 2;
            if (max == min) {
                h = s = 0;
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
                }
                h /= 6;
            }
            return {
                h: h,
                s: s,
                l: l
            };
        }
        function hslToRgb(h, s, l) {
            var r, g, b;
            h = bound01(h, 360);
            s = bound01(s, 100);
            l = bound01(l, 100);
            function hue2rgb(p, q, t) {
                if (t < 0)
                    t += 1;
                if (t > 1)
                    t -= 1;
                if (t < 1 / 6)
                    return p + (q - p) * 6 * t;
                if (t < 1 / 2)
                    return q;
                if (t < 2 / 3)
                    return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }
            if (s === 0) {
                r = g = b = l;
            } else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            return {
                r: r * 255,
                g: g * 255,
                b: b * 255
            };
        }
        function rgbToHsv(r, g, b) {
            r = bound01(r, 255);
            g = bound01(g, 255);
            b = bound01(b, 255);
            var max = mathMax(r, g, b), min = mathMin(r, g, b);
            var h, s, v = max;
            var d = max - min;
            s = max === 0 ? 0 : d / max;
            if (max == min) {
                h = 0;
            } else {
                switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
                }
                h /= 6;
            }
            return {
                h: h,
                s: s,
                v: v
            };
        }
        function hsvToRgb(h, s, v) {
            h = bound01(h, 360) * 6;
            s = bound01(s, 100);
            v = bound01(v, 100);
            var i = math.floor(h), f = h - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), mod = i % 6, r = [
                    v,
                    q,
                    p,
                    p,
                    t,
                    v
                ][mod], g = [
                    t,
                    v,
                    v,
                    q,
                    p,
                    p
                ][mod], b = [
                    p,
                    p,
                    t,
                    v,
                    v,
                    q
                ][mod];
            return {
                r: r * 255,
                g: g * 255,
                b: b * 255
            };
        }
        function rgbToHex(r, g, b, allow3Char) {
            var hex = [
                pad2(mathRound(r).toString(16)),
                pad2(mathRound(g).toString(16)),
                pad2(mathRound(b).toString(16))
            ];
            if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
                return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
            }
            return hex.join('');
        }
        function rgbaToHex(r, g, b, a) {
            var hex = [
                pad2(convertDecimalToHex(a)),
                pad2(mathRound(r).toString(16)),
                pad2(mathRound(g).toString(16)),
                pad2(mathRound(b).toString(16))
            ];
            return hex.join('');
        }
        tinycolor.equals = function (color1, color2) {
            if (!color1 || !color2) {
                return false;
            }
            return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
        };
        tinycolor.random = function () {
            return tinycolor.fromRatio({
                r: mathRandom(),
                g: mathRandom(),
                b: mathRandom()
            });
        };
        function desaturate(color, amount) {
            amount = amount === 0 ? 0 : amount || 10;
            var hsl = tinycolor(color).toHsl();
            hsl.s -= amount / 100;
            hsl.s = clamp01(hsl.s);
            return tinycolor(hsl);
        }
        function saturate(color, amount) {
            amount = amount === 0 ? 0 : amount || 10;
            var hsl = tinycolor(color).toHsl();
            hsl.s += amount / 100;
            hsl.s = clamp01(hsl.s);
            return tinycolor(hsl);
        }
        function greyscale(color) {
            return tinycolor(color).desaturate(100);
        }
        function lighten(color, amount) {
            amount = amount === 0 ? 0 : amount || 10;
            var hsl = tinycolor(color).toHsl();
            hsl.l += amount / 100;
            hsl.l = clamp01(hsl.l);
            return tinycolor(hsl);
        }
        function brighten(color, amount) {
            amount = amount === 0 ? 0 : amount || 10;
            var rgb = tinycolor(color).toRgb();
            rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * -(amount / 100))));
            rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * -(amount / 100))));
            rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * -(amount / 100))));
            return tinycolor(rgb);
        }
        function darken(color, amount) {
            amount = amount === 0 ? 0 : amount || 10;
            var hsl = tinycolor(color).toHsl();
            hsl.l -= amount / 100;
            hsl.l = clamp01(hsl.l);
            return tinycolor(hsl);
        }
        function spin(color, amount) {
            var hsl = tinycolor(color).toHsl();
            var hue = (mathRound(hsl.h) + amount) % 360;
            hsl.h = hue < 0 ? 360 + hue : hue;
            return tinycolor(hsl);
        }
        function complement(color) {
            var hsl = tinycolor(color).toHsl();
            hsl.h = (hsl.h + 180) % 360;
            return tinycolor(hsl);
        }
        function triad(color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h;
            return [
                tinycolor(color),
                tinycolor({
                    h: (h + 120) % 360,
                    s: hsl.s,
                    l: hsl.l
                }),
                tinycolor({
                    h: (h + 240) % 360,
                    s: hsl.s,
                    l: hsl.l
                })
            ];
        }
        function tetrad(color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h;
            return [
                tinycolor(color),
                tinycolor({
                    h: (h + 90) % 360,
                    s: hsl.s,
                    l: hsl.l
                }),
                tinycolor({
                    h: (h + 180) % 360,
                    s: hsl.s,
                    l: hsl.l
                }),
                tinycolor({
                    h: (h + 270) % 360,
                    s: hsl.s,
                    l: hsl.l
                })
            ];
        }
        function splitcomplement(color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h;
            return [
                tinycolor(color),
                tinycolor({
                    h: (h + 72) % 360,
                    s: hsl.s,
                    l: hsl.l
                }),
                tinycolor({
                    h: (h + 216) % 360,
                    s: hsl.s,
                    l: hsl.l
                })
            ];
        }
        function analogous(color, results, slices) {
            results = results || 6;
            slices = slices || 30;
            var hsl = tinycolor(color).toHsl();
            var part = 360 / slices;
            var ret = [tinycolor(color)];
            for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results;) {
                hsl.h = (hsl.h + part) % 360;
                ret.push(tinycolor(hsl));
            }
            return ret;
        }
        function monochromatic(color, results) {
            results = results || 6;
            var hsv = tinycolor(color).toHsv();
            var h = hsv.h, s = hsv.s, v = hsv.v;
            var ret = [];
            var modification = 1 / results;
            while (results--) {
                ret.push(tinycolor({
                    h: h,
                    s: s,
                    v: v
                }));
                v = (v + modification) % 1;
            }
            return ret;
        }
        tinycolor.mix = function (color1, color2, amount) {
            amount = amount === 0 ? 0 : amount || 50;
            var rgb1 = tinycolor(color1).toRgb();
            var rgb2 = tinycolor(color2).toRgb();
            var p = amount / 100;
            var w = p * 2 - 1;
            var a = rgb2.a - rgb1.a;
            var w1;
            if (w * a == -1) {
                w1 = w;
            } else {
                w1 = (w + a) / (1 + w * a);
            }
            w1 = (w1 + 1) / 2;
            var w2 = 1 - w1;
            var rgba = {
                r: rgb2.r * w1 + rgb1.r * w2,
                g: rgb2.g * w1 + rgb1.g * w2,
                b: rgb2.b * w1 + rgb1.b * w2,
                a: rgb2.a * p + rgb1.a * (1 - p)
            };
            return tinycolor(rgba);
        };
        tinycolor.readability = function (color1, color2) {
            var c1 = tinycolor(color1);
            var c2 = tinycolor(color2);
            var rgb1 = c1.toRgb();
            var rgb2 = c2.toRgb();
            var brightnessA = c1.getBrightness();
            var brightnessB = c2.getBrightness();
            var colorDiff = Math.max(rgb1.r, rgb2.r) - Math.min(rgb1.r, rgb2.r) + Math.max(rgb1.g, rgb2.g) - Math.min(rgb1.g, rgb2.g) + Math.max(rgb1.b, rgb2.b) - Math.min(rgb1.b, rgb2.b);
            return {
                brightness: Math.abs(brightnessA - brightnessB),
                color: colorDiff
            };
        };
        tinycolor.isReadable = function (color1, color2) {
            var readability = tinycolor.readability(color1, color2);
            return readability.brightness > 125 && readability.color > 500;
        };
        tinycolor.mostReadable = function (baseColor, colorList) {
            var bestColor = null;
            var bestScore = 0;
            var bestIsReadable = false;
            for (var i = 0; i < colorList.length; i++) {
                var readability = tinycolor.readability(baseColor, colorList[i]);
                var readable = readability.brightness > 125 && readability.color > 500;
                var score = 3 * (readability.brightness / 125) + readability.color / 500;
                if (readable && !bestIsReadable || readable && bestIsReadable && score > bestScore || !readable && !bestIsReadable && score > bestScore) {
                    bestIsReadable = readable;
                    bestScore = score;
                    bestColor = tinycolor(colorList[i]);
                }
            }
            return bestColor;
        };
        var names = tinycolor.names = {
            aliceblue: 'f0f8ff',
            antiquewhite: 'faebd7',
            aqua: '0ff',
            aquamarine: '7fffd4',
            azure: 'f0ffff',
            beige: 'f5f5dc',
            bisque: 'ffe4c4',
            black: '000',
            blanchedalmond: 'ffebcd',
            blue: '00f',
            blueviolet: '8a2be2',
            brown: 'a52a2a',
            burlywood: 'deb887',
            burntsienna: 'ea7e5d',
            cadetblue: '5f9ea0',
            chartreuse: '7fff00',
            chocolate: 'd2691e',
            coral: 'ff7f50',
            cornflowerblue: '6495ed',
            cornsilk: 'fff8dc',
            crimson: 'dc143c',
            cyan: '0ff',
            darkblue: '00008b',
            darkcyan: '008b8b',
            darkgoldenrod: 'b8860b',
            darkgray: 'a9a9a9',
            darkgreen: '006400',
            darkgrey: 'a9a9a9',
            darkkhaki: 'bdb76b',
            darkmagenta: '8b008b',
            darkolivegreen: '556b2f',
            darkorange: 'ff8c00',
            darkorchid: '9932cc',
            darkred: '8b0000',
            darksalmon: 'e9967a',
            darkseagreen: '8fbc8f',
            darkslateblue: '483d8b',
            darkslategray: '2f4f4f',
            darkslategrey: '2f4f4f',
            darkturquoise: '00ced1',
            darkviolet: '9400d3',
            deeppink: 'ff1493',
            deepskyblue: '00bfff',
            dimgray: '696969',
            dimgrey: '696969',
            dodgerblue: '1e90ff',
            firebrick: 'b22222',
            floralwhite: 'fffaf0',
            forestgreen: '228b22',
            fuchsia: 'f0f',
            gainsboro: 'dcdcdc',
            ghostwhite: 'f8f8ff',
            gold: 'ffd700',
            goldenrod: 'daa520',
            gray: '808080',
            green: '008000',
            greenyellow: 'adff2f',
            grey: '808080',
            honeydew: 'f0fff0',
            hotpink: 'ff69b4',
            indianred: 'cd5c5c',
            indigo: '4b0082',
            ivory: 'fffff0',
            khaki: 'f0e68c',
            lavender: 'e6e6fa',
            lavenderblush: 'fff0f5',
            lawngreen: '7cfc00',
            lemonchiffon: 'fffacd',
            lightblue: 'add8e6',
            lightcoral: 'f08080',
            lightcyan: 'e0ffff',
            lightgoldenrodyellow: 'fafad2',
            lightgray: 'd3d3d3',
            lightgreen: '90ee90',
            lightgrey: 'd3d3d3',
            lightpink: 'ffb6c1',
            lightsalmon: 'ffa07a',
            lightseagreen: '20b2aa',
            lightskyblue: '87cefa',
            lightslategray: '789',
            lightslategrey: '789',
            lightsteelblue: 'b0c4de',
            lightyellow: 'ffffe0',
            lime: '0f0',
            limegreen: '32cd32',
            linen: 'faf0e6',
            magenta: 'f0f',
            maroon: '800000',
            mediumaquamarine: '66cdaa',
            mediumblue: '0000cd',
            mediumorchid: 'ba55d3',
            mediumpurple: '9370db',
            mediumseagreen: '3cb371',
            mediumslateblue: '7b68ee',
            mediumspringgreen: '00fa9a',
            mediumturquoise: '48d1cc',
            mediumvioletred: 'c71585',
            midnightblue: '191970',
            mintcream: 'f5fffa',
            mistyrose: 'ffe4e1',
            moccasin: 'ffe4b5',
            navajowhite: 'ffdead',
            navy: '000080',
            oldlace: 'fdf5e6',
            olive: '808000',
            olivedrab: '6b8e23',
            orange: 'ffa500',
            orangered: 'ff4500',
            orchid: 'da70d6',
            palegoldenrod: 'eee8aa',
            palegreen: '98fb98',
            paleturquoise: 'afeeee',
            palevioletred: 'db7093',
            papayawhip: 'ffefd5',
            peachpuff: 'ffdab9',
            peru: 'cd853f',
            pink: 'ffc0cb',
            plum: 'dda0dd',
            powderblue: 'b0e0e6',
            purple: '800080',
            rebeccapurple: '663399',
            red: 'f00',
            rosybrown: 'bc8f8f',
            royalblue: '4169e1',
            saddlebrown: '8b4513',
            salmon: 'fa8072',
            sandybrown: 'f4a460',
            seagreen: '2e8b57',
            seashell: 'fff5ee',
            sienna: 'a0522d',
            silver: 'c0c0c0',
            skyblue: '87ceeb',
            slateblue: '6a5acd',
            slategray: '708090',
            slategrey: '708090',
            snow: 'fffafa',
            springgreen: '00ff7f',
            steelblue: '4682b4',
            tan: 'd2b48c',
            teal: '008080',
            thistle: 'd8bfd8',
            tomato: 'ff6347',
            turquoise: '40e0d0',
            violet: 'ee82ee',
            wheat: 'f5deb3',
            white: 'fff',
            whitesmoke: 'f5f5f5',
            yellow: 'ff0',
            yellowgreen: '9acd32'
        };
        var hexNames = tinycolor.hexNames = flip(names);
        function flip(o) {
            var flipped = {};
            for (var i in o) {
                if (o.hasOwnProperty(i)) {
                    flipped[o[i]] = i;
                }
            }
            return flipped;
        }
        function boundAlpha(a) {
            a = parseFloat(a);
            if (isNaN(a) || a < 0 || a > 1) {
                a = 1;
            }
            return a;
        }
        function bound01(n, max) {
            if (isOnePointZero(n)) {
                n = '100%';
            }
            var processPercent = isPercentage(n);
            n = mathMin(max, mathMax(0, parseFloat(n)));
            if (processPercent) {
                n = parseInt(n * max, 10) / 100;
            }
            if (math.abs(n - max) < 0.000001) {
                return 1;
            }
            return n % max / parseFloat(max);
        }
        function clamp01(val) {
            return mathMin(1, mathMax(0, val));
        }
        function parseIntFromHex(val) {
            return parseInt(val, 16);
        }
        function isOnePointZero(n) {
            return typeof n == 'string' && n.indexOf('.') != -1 && parseFloat(n) === 1;
        }
        function isPercentage(n) {
            return typeof n === 'string' && n.indexOf('%') != -1;
        }
        function pad2(c) {
            return c.length == 1 ? '0' + c : '' + c;
        }
        function convertToPercentage(n) {
            if (n <= 1) {
                n = n * 100 + '%';
            }
            return n;
        }
        function convertDecimalToHex(d) {
            return Math.round(parseFloat(d) * 255).toString(16);
        }
        function convertHexToDecimal(h) {
            return parseIntFromHex(h) / 255;
        }
        var matchers = function () {
            var CSS_INTEGER = '[-\\+]?\\d+%?';
            var CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
            var CSS_UNIT = '(?:' + CSS_NUMBER + ')|(?:' + CSS_INTEGER + ')';
            var PERMISSIVE_MATCH3 = '[\\s|\\(]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')\\s*\\)?';
            var PERMISSIVE_MATCH4 = '[\\s|\\(]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')\\s*\\)?';
            return {
                rgb: new RegExp('rgb' + PERMISSIVE_MATCH3),
                rgba: new RegExp('rgba' + PERMISSIVE_MATCH4),
                hsl: new RegExp('hsl' + PERMISSIVE_MATCH3),
                hsla: new RegExp('hsla' + PERMISSIVE_MATCH4),
                hsv: new RegExp('hsv' + PERMISSIVE_MATCH3),
                hsva: new RegExp('hsva' + PERMISSIVE_MATCH4),
                hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
            };
        }();
        function stringInputToObject(color) {
            color = color.replace(trimLeft, '').replace(trimRight, '').toLowerCase();
            var named = false;
            if (names[color]) {
                color = names[color];
                named = true;
            } else if (color == 'transparent') {
                return {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0,
                    format: 'name'
                };
            }
            var match;
            if (match = matchers.rgb.exec(color)) {
                return {
                    r: match[1],
                    g: match[2],
                    b: match[3]
                };
            }
            if (match = matchers.rgba.exec(color)) {
                return {
                    r: match[1],
                    g: match[2],
                    b: match[3],
                    a: match[4]
                };
            }
            if (match = matchers.hsl.exec(color)) {
                return {
                    h: match[1],
                    s: match[2],
                    l: match[3]
                };
            }
            if (match = matchers.hsla.exec(color)) {
                return {
                    h: match[1],
                    s: match[2],
                    l: match[3],
                    a: match[4]
                };
            }
            if (match = matchers.hsv.exec(color)) {
                return {
                    h: match[1],
                    s: match[2],
                    v: match[3]
                };
            }
            if (match = matchers.hsva.exec(color)) {
                return {
                    h: match[1],
                    s: match[2],
                    v: match[3],
                    a: match[4]
                };
            }
            if (match = matchers.hex8.exec(color)) {
                return {
                    a: convertHexToDecimal(match[1]),
                    r: parseIntFromHex(match[2]),
                    g: parseIntFromHex(match[3]),
                    b: parseIntFromHex(match[4]),
                    format: named ? 'name' : 'hex8'
                };
            }
            if (match = matchers.hex6.exec(color)) {
                return {
                    r: parseIntFromHex(match[1]),
                    g: parseIntFromHex(match[2]),
                    b: parseIntFromHex(match[3]),
                    format: named ? 'name' : 'hex'
                };
            }
            if (match = matchers.hex3.exec(color)) {
                return {
                    r: parseIntFromHex(match[1] + '' + match[1]),
                    g: parseIntFromHex(match[2] + '' + match[2]),
                    b: parseIntFromHex(match[3] + '' + match[3]),
                    format: named ? 'name' : 'hex'
                };
            }
            return false;
        }
        window.tinycolor = tinycolor;
        $(function () {
            if ($.fn.spectrum.load) {
                $.fn.spectrum.processNativeColorInputs();
            }
        });
    };
});
define('skylark-grapejs/domain_abstract/ui/Input',['skylark-backbone'], function (Backbone) {
    'use strict';
    const $ = Backbone.$;
    return Backbone.View.extend({
        events: { change: 'handleChange' },
        template() {
            return `<span class="${ this.holderClass() }"></span>`;
        },
        inputClass() {
            return `${ this.ppfx }field`;
        },
        holderClass() {
            return `${ this.ppfx }input-holder`;
        },
        initialize(opts = {}) {
            const ppfx = opts.ppfx || '';
            this.opts = opts;
            this.ppfx = ppfx;
            this.em = opts.target || {};
            this.listenTo(this.model, 'change:value', this.handleModelChange);
        },
        elementUpdated() {
            this.model.trigger('el:change');
        },
        setValue(value) {
            const model = this.model;
            let val = value || model.get('defaults');
            const input = this.getInputEl();
            input && (input.value = val);
        },
        handleModelChange(model, value, opts) {
            this.setValue(value, opts);
        },
        handleChange(e) {
            e.stopPropagation();
            const value = this.getInputEl().value;
            this.model.set({ value }, { fromInput: 1 });
            this.elementUpdated();
        },
        getInputEl() {
            if (!this.inputEl) {
                const {model} = this;
                const plh = model.get('placeholder') || model.get('defaults') || '';
                this.inputEl = $(`<input type="text" placeholder="${ plh }">`);
            }
            return this.inputEl.get(0);
        },
        render() {
            this.inputEl = null;
            const el = this.$el;
            el.addClass(this.inputClass());
            el.html(this.template());
            el.find(`.${ this.holderClass() }`).append(this.getInputEl());
            return this;
        }
    });
});
define('skylark-grapejs/domain_abstract/ui/InputColor',[
    'skylark-backbone',
    'skylark-underscore',
    '../../utils/ColorPicker',
    './Input'
], function (Backbone, a, ColorPicker, Input) {
    'use strict';
    const $ = Backbone.$;
    ColorPicker($);
    return Input.extend({
        template() {
            const ppfx = this.ppfx;
            return `
      <div class="${ this.holderClass() }"></div>
      <div class="${ ppfx }field-colorp">
        <div class="${ ppfx }field-colorp-c" data-colorp-c>
          <div class="${ ppfx }checker-bg"></div>
        </div>
      </div>
    `;
        },
        inputClass() {
            const ppfx = this.ppfx;
            return `${ ppfx }field ${ ppfx }field-color`;
        },
        holderClass() {
            return `${ this.ppfx }input-holder`;
        },
        setValue(val, opts = {}) {
            const model = this.model;
            const def = model.get('defaults');
            const value = !a.isUndefined(val) ? val : !a.isUndefined(def) ? def : '';
            const inputEl = this.getInputEl();
            const colorEl = this.getColorEl();
            const valueClr = value != 'none' ? value : '';
            inputEl.value = value;
            colorEl.get(0).style.backgroundColor = valueClr;
            if (opts.fromTarget) {
                colorEl.spectrum('set', valueClr);
                this.noneColor = value == 'none';
            }
        },
        getColorEl() {
            if (!this.colorEl) {
                const self = this;
                const ppfx = this.ppfx;
                var model = this.model;
                var colorEl = $(`<div class="${ this.ppfx }field-color-picker"></div>`);
                var cpStyle = colorEl.get(0).style;
                var elToAppend = this.em && this.em.config ? this.em.config.el : '';
                var colorPickerConfig = this.em && this.em.getConfig && this.em.getConfig('colorPicker') || {};
                const getColor = color => {
                    let cl = color.getAlpha() == 1 ? color.toHexString() : color.toRgbString();
                    return cl.replace(/ /g, '');
                };
                let changed = 0;
                let previousColor;
                this.$el.find(`[data-colorp-c]`).append(colorEl);
                colorEl.spectrum({
                    containerClassName: `${ ppfx }one-bg ${ ppfx }two-color`,
                    appendTo: elToAppend || 'body',
                    maxSelectionSize: 8,
                    showPalette: true,
                    showAlpha: true,
                    chooseText: 'Ok',
                    cancelText: '\u2A2F',
                    palette: [],
                    ...colorPickerConfig,
                    move(color) {
                        const cl = getColor(color);
                        cpStyle.backgroundColor = cl;
                        model.setValueFromInput(cl, 0);
                    },
                    change(color) {
                        changed = 1;
                        const cl = getColor(color);
                        cpStyle.backgroundColor = cl;
                        model.setValueFromInput(0, 0);
                        model.setValueFromInput(cl);
                        self.noneColor = 0;
                    },
                    show(color) {
                        changed = 0;
                        previousColor = getColor(color);
                    },
                    hide(color) {
                        if (!changed && previousColor) {
                            if (self.noneColor) {
                                previousColor = '';
                            }
                            cpStyle.backgroundColor = previousColor;
                            colorEl.spectrum('set', previousColor);
                            model.setValueFromInput(previousColor, 0);
                        }
                    }
                });
                this.colorEl = colorEl;
            }
            return this.colorEl;
        },
        render() {
            Input.prototype.render.call(this);
            this.getColorEl();
            return this;
        }
    });
});
define('skylark-grapejs/style_manager/view/PropertyColorView',[
    './PropertyIntegerView',
    '../../domain_abstract/ui/InputColor'
], function (PropertyIntegerView, InputColor) {
    'use strict';
    return PropertyIntegerView.extend({
        setValue(value, opts = {}) {
            opts = {
                ...opts,
                silent: 1
            };
            this.inputInst.setValue(value, opts);
        },
        onRender() {
            if (!this.input) {
                const ppfx = this.ppfx;
                const inputColor = new InputColor({
                    target: this.target,
                    model: this.model,
                    ppfx
                });
                const input = inputColor.render();
                this.el.querySelector(`.${ ppfx }fields`).appendChild(input.el);
                this.$input = input.inputEl;
                this.$color = input.colorEl;
                this.input = this.$input.get(0);
                this.inputInst = input;
            }
        }
    });
});
define('skylark-grapejs/style_manager/model/PropertyRadio',[
    "skylark-langx/langx",
    './Property'
], function (
    langx,
    Property
) {
    'use strict';
    return Property.extend({
        defaults: () => ({
            ...Property.prototype.defaults,
            options: [],
            full: 1
        }),
        initialize(...args) {
            Property.prototype.initialize.apply(this, args);
            this.listenTo(this, 'change:options', this.onOptionChange);
        },
        onOptionChange() {
            this.set('list', this.get('options'));
        },
        getOptions() {
            const {options, list} = this.attributes;
            return options && options.length ? options : list;
        },
        setOptions(opts = []) {
            this.set('options', opts);
            return this;
        },
        addOption(opt) {
            if (opt) {
                const opts = this.getOptions();
                this.setOptions([
                    ...opts,
                    opt
                ]);
            }
            return this;
        }
    });
});
define('skylark-grapejs/style_manager/model/PropertySelect',[
    "skylark-langx/langx",
	'./PropertyRadio'
], function (
	langx,
	Property
) {
    'use strict';
    return Property.extend({
        defaults: () => ({
            ...Property.prototype.defaults(),
            full: 0
        })
    });
});
define('skylark-grapejs/style_manager/view/PropertySelectView',[
    'skylark-backbone',
    './PropertyView'
], function (Backbone, PropertyView) {
    'use strict';
    const $ = Backbone.$;
    return PropertyView.extend({
        templateInput() {
            const pfx = this.pfx;
            const ppfx = this.ppfx;
            return `
      <div class="${ ppfx }field ${ ppfx }select">
        <span id="${ pfx }input-holder"></span>
        <div class="${ ppfx }sel-arrow">
          <div class="${ ppfx }d-s-arrow"></div>
        </div>
      </div>
    `;
        },
        initialize(...args) {
            PropertyView.prototype.initialize.apply(this, args);
            this.listenTo(this.model, 'change:options', this.updateOptions);
        },
        updateOptions() {
            this.input = null;
            this.onRender();
        },
        onRender() {
            var pfx = this.pfx;
            const options = this.model.getOptions();
            if (!this.input) {
                let optionsStr = '';
                options.forEach(option => {
                    let name = option.name || option.value;
                    let style = option.style ? option.style.replace(/"/g, '&quot;') : '';
                    let styleAttr = style ? `style="${ style }"` : '';
                    let value = option.value.replace(/"/g, '&quot;');
                    optionsStr += `<option value="${ value }" ${ styleAttr }>${ name }</option>`;
                });
                const inputH = this.el.querySelector(`#${ pfx }input-holder`);
                inputH.innerHTML = `<select>${ optionsStr }</select>`;
                this.input = inputH.firstChild;
            }
        }
    });
});
define('skylark-grapejs/style_manager/view/PropertyRadioView',['./PropertyView'], function (PropertyView) {
    'use strict';
    return PropertyView.extend({
        templateInput() {
            const pfx = this.pfx;
            const ppfx = this.ppfx;
            return `
      <div class="${ ppfx }field ${ ppfx }field-radio">
      </div>
    `;
        },
        onRender() {
            const pfx = this.pfx;
            const ppfx = this.ppfx;
            const itemCls = `${ ppfx }radio-item-label`;
            const model = this.model;
            const prop = model.get('property');
            const options = model.get('list') || model.get('options') || [];
            const {cid} = model;
            const clsInput = `${ pfx }radio ${ pfx }radio-${ prop }`;
            if (!this.input) {
                if (options && options.length) {
                    let inputStr = '';
                    options.forEach(el => {
                        let cl = el.className ? `${ el.className } ${ pfx }icon ${ itemCls }` : '';
                        let id = `${ prop }-${ el.value }-${ cid }`;
                        let labelTxt = el.name || el.value;
                        let titleAttr = el.title ? `title="${ el.title }"` : '';
                        inputStr += `
            <div class="${ ppfx }radio-item">
              <input type="radio" class="${ clsInput }" id="${ id }" name="${ prop }-${ cid }" value="${ el.value }"/>
              <label class="${ cl || itemCls }" ${ titleAttr } for="${ id }">${ cl ? '' : labelTxt }</label>
            </div>
          `;
                    });
                    const inputHld = this.el.querySelector(`.${ ppfx }field`);
                    inputHld.innerHTML = `<div class="${ ppfx }radio-items">${ inputStr }</div>`;
                    this.input = inputHld.firstChild;
                }
            }
        },
        getInputValue() {
            const inputChk = this.getCheckedEl();
            return inputChk ? inputChk.value : '';
        },
        getCheckedEl() {
            const input = this.getInputEl();
            return input ? input.querySelector('input:checked') : '';
        },
        setValue(value) {
            const model = this.model;
            let val = value || model.get('value') || model.getDefaultValue();
            const input = this.getInputEl();
            const inputIn = input ? input.querySelector(`[value="${ val }"]`) : '';
            if (inputIn) {
                inputIn.checked = true;
            } else {
                const inputChk = this.getCheckedEl();
                inputChk && (inputChk.checked = false);
            }
        }
    });
});
define('skylark-grapejs/domain_abstract/ui/InputNumber',[
    'skylark-backbone',
    'skylark-underscore',
    '../../utils/mixins',
    './Input'
], function (Backbone, a, b, Input) {
    'use strict';
    const $ = Backbone.$;
    return Input.extend({
        events: {
            'change input': 'handleChange',
            'change select': 'handleUnitChange',
            'click [data-arrow-up]': 'upArrowClick',
            'click [data-arrow-down]': 'downArrowClick',
            'mousedown [data-arrows]': 'downIncrement'
        },
        template() {
            const ppfx = this.ppfx;
            return `
      <span class="${ ppfx }input-holder"></span>
      <span class="${ ppfx }field-units"></span>
      <div class="${ ppfx }field-arrows" data-arrows>
        <div class="${ ppfx }field-arrow-u" data-arrow-up></div>
        <div class="${ ppfx }field-arrow-d" data-arrow-down></div>
      </div>
    `;
        },
        inputClass() {
            const ppfx = this.ppfx;
            return this.opts.contClass || `${ ppfx }field ${ ppfx }field-integer`;
        },
        initialize(opts = {}) {
            Input.prototype.initialize.apply(this, arguments);
            a.bindAll(this, 'moveIncrement', 'upIncrement');
            this.doc = document;
            this.listenTo(this.model, 'change:unit', this.handleModelChange);
        },
        setValue(value, opts) {
            var opt = opts || {};
            var valid = this.validateInputValue(value, { deepCheck: 1 });
            var validObj = { value: valid.value };
            if (valid.unit || valid.force) {
                validObj.unit = valid.unit;
            }
            this.model.set(validObj, opt);
            if (opt.silent) {
                this.handleModelChange();
            }
        },
        handleChange(e) {
            e.stopPropagation();
            this.setValue(this.getInputEl().value);
            this.elementUpdated();
        },
        handleUnitChange(e) {
            e.stopPropagation();
            var value = this.getUnitEl().value;
            this.model.set('unit', value);
            this.elementUpdated();
        },
        elementUpdated() {
            this.model.trigger('el:change');
        },
        handleModelChange() {
            const model = this.model;
            this.getInputEl().value = model.get('value');
            const unitEl = this.getUnitEl();
            unitEl && (unitEl.value = model.get('unit') || '');
        },
        getUnitEl() {
            if (!this.unitEl) {
                const model = this.model;
                const units = model.get('units') || [];
                if (units.length) {
                    const options = [];
                    units.forEach(unit => {
                        const selected = unit == model.get('unit') ? 'selected' : '';
                        options.push(`<option ${ selected }>${ unit }</option>`);
                    });
                    const temp = document.createElement('div');
                    temp.innerHTML = `<select class="${ this.ppfx }input-unit">${ options.join('') }</select>`;
                    this.unitEl = temp.firstChild;
                }
            }
            return this.unitEl;
        },
        upArrowClick() {
            const model = this.model;
            const step = model.get('step');
            let value = parseInt(model.get('value'), 10);
            value = this.normalizeValue(value + step);
            var valid = this.validateInputValue(value);
            model.set('value', valid.value);
            this.elementUpdated();
        },
        downArrowClick() {
            const model = this.model;
            const step = model.get('step');
            const value = parseInt(model.get('value'), 10);
            const val = this.normalizeValue(value - step);
            var valid = this.validateInputValue(val);
            model.set('value', valid.value);
            this.elementUpdated();
        },
        downIncrement(e) {
            e.preventDefault();
            this.moved = 0;
            var value = this.model.get('value');
            value = this.normalizeValue(value);
            this.current = {
                y: e.pageY,
                val: value
            };
            b.on(this.doc, 'mousemove', this.moveIncrement);
            b.on(this.doc, 'mouseup', this.upIncrement);
        },
        moveIncrement(ev) {
            this.moved = 1;
            const model = this.model;
            const step = model.get('step');
            const data = this.current;
            var pos = this.normalizeValue(data.val + (data.y - ev.pageY) * step);
            this.prValue = this.validateInputValue(pos).value;
            model.set('value', this.prValue, { avoidStore: 1 });
            return false;
        },
        upIncrement() {
            const model = this.model;
            const step = model.get('step');
            b.off(this.doc, 'mouseup', this.upIncrement);
            b.off(this.doc, 'mousemove', this.moveIncrement);
            if (this.prValue && this.moved) {
                var value = this.prValue - step;
                model.set('value', value, { avoidStore: 1 }).set('value', value + step);
                this.elementUpdated();
            }
        },
        normalizeValue(value, defValue = 0) {
            const model = this.model;
            const step = model.get('step');
            let stepDecimals = 0;
            if (isNaN(value)) {
                return defValue;
            }
            value = parseFloat(value);
            if (Math.floor(value) !== value) {
                const side = step.toString().split('.')[1];
                stepDecimals = side ? side.length : 0;
            }
            return stepDecimals ? parseFloat(value.toFixed(stepDecimals)) : value;
        },
        validateInputValue(value, opts) {
            var force = 0;
            var opt = opts || {};
            var model = this.model;
            const defValue = '';
            var val = !a.isUndefined(value) ? value : defValue;
            var units = model.get('units') || [];
            var unit = model.get('unit') || units.length && units[0] || '';
            var max = model.get('max');
            var min = model.get('min');
            if (opt.deepCheck) {
                var fixed = model.get('fixedValues') || [];
                if (val) {
                    var regFixed = new RegExp('^' + fixed.join('|'), 'g');
                    if (fixed.length && regFixed.test(val)) {
                        val = val.match(regFixed)[0];
                        unit = '';
                        force = 1;
                    } else {
                        var valCopy = val + '';
                        val += '';
                        val = parseFloat(val.replace(',', '.'));
                        val = !isNaN(val) ? val : defValue;
                        var uN = valCopy.replace(val, '');
                        if (a.indexOf(units, uN) >= 0)
                            unit = uN;
                    }
                }
            }
            if (!a.isUndefined(max) && max !== '')
                val = val > max ? max : val;
            if (!a.isUndefined(min) && min !== '')
                val = val < min ? min : val;
            return {
                force,
                value: val,
                unit
            };
        },
        render() {
            Input.prototype.render.call(this);
            this.unitEl = null;
            const unit = this.getUnitEl();
            unit && this.$el.find(`.${ this.ppfx }field-units`).get(0).appendChild(unit);
            return this;
        }
    });
});
define('skylark-grapejs/style_manager/model/PropertyInteger',[
    "skylark-langx/langx",
    'skylark-underscore',
    './Property',
    '../../domain_abstract/ui/InputNumber'
], function (
    langx,
    a, 
    Property, 
    InputNumber
) {
    'use strict';
    return Property.extend({
        defaults: {
            ...Property.prototype.defaults,
            units: [],
            unit: '',
            step: 1,
            min: '',
            max: ''
        },
        initialize(props = {}, opts = {}) {
            Property.callParentInit(Property, this, props, opts);
            const unit = this.get('unit');
            const units = this.get('units');
            this.input = new InputNumber({ model: this });
            if (units.length && !unit) {
                this.set('unit', units[0]);
            }
            Property.callInit(this, props, opts);
        },
        clearValue(opts = {}) {
            this.set({
                value: undefined,
                unit: undefined
            }, opts);
            return this;
        },
        parseValue(val) {
            const parsed = Property.prototype.parseValue.apply(this, arguments);
            const {value, unit} = this.input.validateInputValue(parsed.value, { deepCheck: 1 });
            parsed.value = value;
            parsed.unit = unit;
            return parsed;
        },
        getFullValue() {
            let value = this.get('value');
            let unit = this.get('unit');
            value = !a.isUndefined(value) ? value : '';
            unit = !a.isUndefined(unit) && value ? unit : '';
            value = `${ value }${ unit }`;
            return Property.prototype.getFullValue.apply(this, [value]);
        }
    });
});
define('skylark-grapejs/style_manager/model/PropertySlider',[
    "skylark-langx/langx",
	'./PropertyInteger'
], function (
	langx,
	Property
) {
    'use strict';
    return Property.extend({
        defaults: {
            ...Property.prototype.defaults,
            showInput: 1
        }
    });
});
define('skylark-grapejs/style_manager/view/PropertySliderView',['./PropertyIntegerView'], function (Property) {
    'use strict';
    return Property.extend({
        events() {
            return {
                ...Property.prototype.events,
                'change [type=range]': 'inputValueChanged',
                'input [type=range]': 'inputValueChangedSoft',
                change: ''
            };
        },
        templateInput(model) {
            const ppfx = this.ppfx;
            return `
      <div class="${ ppfx }field ${ ppfx }field-range">
        <input type="range"
          min="${ model.get('min') }"
          max="${ model.get('max') }"
          step="${ model.get('step') }"/>
      </div>
    `;
        },
        getSliderEl() {
            if (!this.slider) {
                this.slider = this.el.querySelector('input[type=range]');
            }
            return this.slider;
        },
        inputValueChanged() {
            const model = this.model;
            const step = model.get('step');
            this.getInputEl().value = this.getSliderEl().value;
            const value = this.getInputValue() - step;
            model.set('value', value, { avoidStore: 1 }).set('value', value + step);
            this.elementUpdated();
        },
        inputValueChangedSoft() {
            this.getInputEl().value = this.getSliderEl().value;
            this.model.set('value', this.getInputValue(), { avoidStore: 1 });
            this.elementUpdated();
        },
        setValue(value) {
            const parsed = this.model.parseValue(value);
            this.getSliderEl().value = parseFloat(parsed.value);
            Property.prototype.setValue.apply(this, arguments);
        },
        onRender() {
            Property.prototype.onRender.apply(this, arguments);
            if (!this.model.get('showInput')) {
                this.inputInst.el.style.display = 'none';
            }
        },
        clearCached() {
            Property.prototype.clearCached.apply(this, arguments);
            this.slider = null;
        }
    });
});
define('skylark-grapejs/style_manager/model/Properties',[
    "skylark-langx/langx",
    'skylark-backbone',
    '../../domain_abstract/model/TypeableCollection',
    './Property',
    './PropertyStack',
    './../view/PropertyStackView',
    './PropertyComposite',
    './../view/PropertyCompositeView',
    './../view/PropertyFileView',
    './../view/PropertyColorView',
    './PropertySelect',
    './../view/PropertySelectView',
    './PropertyRadio',
    './../view/PropertyRadioView',
    './PropertySlider',
    './../view/PropertySliderView',
    './PropertyInteger',
    './../view/PropertyIntegerView',
    './../view/PropertyView',
    "./Layer"
], function (
    langx,
    Backbone, 
    TypeableCollection, 
    Property, 
    PropertyStack, 
    PropertyStackView, 
    PropertyComposite, 
    PropertyCompositeView, 
    PropertyFileView, 
    PropertyColorView, 
    PropertySelect, 
    PropertySelectView, 
    PropertyRadio, 
    PropertyRadioView, 
    PropertySlider, 
    PropertySliderView, 
    PropertyInteger, 
    PropertyIntegerView, 
    PropertyView,
    Layer
) {
    'use strict';
    var Properties = Backbone.Collection.extend(TypeableCollection).extend({
        types: [
            {
                id: 'stack',
                model: PropertyStack,
                view: PropertyStackView,
                isType(value) {
                    if (value && value.type == 'stack') {
                        return value;
                    }
                }
            },
            {
                id: 'composite',
                model: PropertyComposite,
                view: PropertyCompositeView,
                isType(value) {
                    if (value && value.type == 'composite') {
                        return value;
                    }
                }
            },
            {
                id: 'file',
                model: Property,
                view: PropertyFileView,
                isType(value) {
                    if (value && value.type == 'file') {
                        return value;
                    }
                }
            },
            {
                id: 'color',
                model: Property,
                view: PropertyColorView,
                isType(value) {
                    if (value && value.type == 'color') {
                        return value;
                    }
                }
            },
            {
                id: 'select',
                model: PropertySelect,
                view: PropertySelectView,
                isType(value) {
                    if (value && value.type == 'select') {
                        return value;
                    }
                }
            },
            {
                id: 'radio',
                model: PropertyRadio,
                view: PropertyRadioView,
                isType(value) {
                    if (value && value.type == 'radio') {
                        return value;
                    }
                }
            },
            {
                id: 'slider',
                model: PropertySlider,
                view: PropertySliderView,
                isType(value) {
                    if (value && value.type == 'slider') {
                        return value;
                    }
                }
            },
            {
                id: 'integer',
                model: PropertyInteger,
                view: PropertyIntegerView,
                isType(value) {
                    if (value && value.type == 'integer') {
                        return value;
                    }
                }
            },
            {
                id: 'base',
                model: Property,
                view: PropertyView,
                isType(value) {
                    value.type = 'base';
                    return value;
                }
            }
        ],
        deepClone() {
            const collection = this.clone();
            collection.reset(collection.map(model => {
                const cloned = model.clone();
                cloned.typeView = model.typeView;
                return cloned;
            }));
            return collection;
        },
        parseValue(value) {
            const properties = [];
            const values = value.split(' ');
            values.forEach((value, i) => {
                const property = this.at(i);
                if (!property)
                    return;
                properties.push(langx.mixin({},property.attributes,{ value }));
            });
            return properties;
        },
        getFullValue() {
            let result = '';
            this.each(model => result += `${ model.getFullValue() } `);
            return result.trim();
        }
    });

    PropertyComposite.Properties = Properties;

    Layer.Properties = Properties;


    return Properties;
});
define('skylark-grapejs/style_manager/model/PropertyFactory',[],function () {
    'use strict';
    return () => ({
        build(props) {
            var objs = [];
            var dftFixedValues = [
                'initial',
                'inherit'
            ];
            if (typeof props === 'string')
                props = [props];
            for (var i = 0, len = props.length; i < len; i++) {
                var obj = {};
                var prop = props[i];
                obj.property = prop;
                switch (prop) {
                case 'border-radius-c':
                    obj.property = 'border-radius';
                    break;
                }
                switch (prop) {
                case 'top':
                case 'right':
                case 'bottom':
                case 'left':
                case 'margin-top':
                case 'margin-right':
                case 'margin-bottom':
                case 'margin-left':
                case 'padding-top':
                case 'padding-right':
                case 'padding-bottom':
                case 'padding-left':
                case 'width':
                case 'max-width':
                case 'min-width':
                case 'height':
                case 'max-height':
                case 'min-height':
                case 'flex-basis':
                    obj.fixedValues = [
                        'initial',
                        'inherit',
                        'auto'
                    ];
                    break;
                case 'font-size':
                    obj.fixedValues = [
                        'medium',
                        'xx-small',
                        'x-small',
                        'small',
                        'large',
                        'x-large',
                        'xx-large',
                        'smaller',
                        'larger',
                        'length',
                        'initial',
                        'inherit'
                    ];
                    break;
                case 'letter-spacing':
                case 'line-height':
                    obj.fixedValues = [
                        'normal',
                        'initial',
                        'inherit'
                    ];
                    break;
                }
                switch (prop) {
                case 'float':
                case 'position':
                case 'text-align':
                    obj.type = 'radio';
                    break;
                case 'display':
                case 'flex-direction':
                case 'flex-wrap':
                case 'justify-content':
                case 'align-items':
                case 'align-content':
                case 'align-self':
                case 'font-family':
                case 'font-weight':
                case 'border-style':
                case 'box-shadow-type':
                case 'background-repeat':
                case 'background-position':
                case 'background-attachment':
                case 'background-size':
                case 'transition-property':
                case 'transition-timing-function':
                case 'cursor':
                case 'overflow':
                case 'overflow-x':
                case 'overflow-y':
                    obj.type = 'select';
                    break;
                case 'top':
                case 'right':
                case 'bottom':
                case 'left':
                case 'margin-top':
                case 'margin-right':
                case 'margin-bottom':
                case 'margin-left':
                case 'padding-top':
                case 'padding-right':
                case 'padding-bottom':
                case 'padding-left':
                case 'min-height':
                case 'min-width':
                case 'max-height':
                case 'max-width':
                case 'width':
                case 'height':
                case 'font-size':
                case 'letter-spacing':
                case 'line-height':
                case 'text-shadow-h':
                case 'text-shadow-v':
                case 'text-shadow-blur':
                case 'border-radius-c':
                case 'border-top-left-radius':
                case 'border-top-right-radius':
                case 'border-bottom-left-radius':
                case 'border-bottom-right-radius':
                case 'border-width':
                case 'box-shadow-h':
                case 'box-shadow-v':
                case 'box-shadow-blur':
                case 'box-shadow-spread':
                case 'transition-duration':
                case 'perspective':
                case 'transform-rotate-x':
                case 'transform-rotate-y':
                case 'transform-rotate-z':
                case 'transform-scale-x':
                case 'transform-scale-y':
                case 'transform-scale-z':
                case 'order':
                case 'flex-grow':
                case 'flex-shrink':
                case 'flex-basis':
                    obj.type = 'integer';
                    break;
                case 'margin':
                case 'padding':
                case 'border-radius':
                case 'border':
                case 'transform':
                    obj.type = 'composite';
                    break;
                case 'color':
                case 'text-shadow-color':
                case 'background-color':
                case 'border-color':
                case 'box-shadow-color':
                    obj.type = 'color';
                    break;
                case 'text-shadow':
                case 'box-shadow':
                case 'background':
                case 'transition':
                    obj.type = 'stack';
                    break;
                case 'background-image':
                    obj.type = 'file';
                    break;
                }
                switch (prop) {
                case 'float':
                case 'background-color':
                case 'text-shadow':
                    obj.defaults = 'none';
                    break;
                case 'display':
                    obj.defaults = 'block';
                    break;
                case 'flex-direction':
                    obj.defaults = 'row';
                    break;
                case 'flex-wrap':
                    obj.defaults = 'nowrap';
                    break;
                case 'justify-content':
                    obj.defaults = 'flex-start';
                    break;
                case 'align-items':
                    obj.defaults = 'stretch';
                    break;
                case 'align-content':
                    obj.defaults = 'stretch';
                    break;
                case 'align-self':
                    obj.defaults = 'auto';
                    break;
                case 'position':
                    obj.defaults = 'static';
                    break;
                case 'margin-top':
                case 'margin-right':
                case 'margin-bottom':
                case 'margin-left':
                case 'padding-top':
                case 'padding-right':
                case 'padding-bottom':
                case 'padding-left':
                case 'text-shadow-h':
                case 'text-shadow-v':
                case 'text-shadow-blur':
                case 'border-radius-c':
                case 'box-shadow-h':
                case 'box-shadow-v':
                case 'box-shadow-spread':
                case 'perspective':
                case 'transform-rotate-x':
                case 'transform-rotate-y':
                case 'transform-rotate-z':
                case 'order':
                case 'flex-grow':
                    obj.defaults = 0;
                    break;
                case 'border-top-left-radius':
                case 'border-top-right-radius':
                case 'border-bottom-left-radius':
                case 'border-bottom-right-radius':
                    obj.defaults = '0px';
                    break;
                case 'transform-scale-x':
                case 'transform-scale-y':
                case 'transform-scale-z':
                case 'flex-shrink':
                    obj.defaults = 1;
                    break;
                case 'box-shadow-blur':
                    obj.defaults = '5px';
                    break;
                case 'top':
                case 'right':
                case 'bottom':
                case 'left':
                case 'min-height':
                case 'min-width':
                case 'max-height':
                case 'max-width':
                case 'width':
                case 'height':
                case 'background-size':
                case 'cursor':
                case 'flex-basis':
                    obj.defaults = 'auto';
                    break;
                case 'font-family':
                    obj.defaults = 'Arial, Helvetica, sans-serif';
                    break;
                case 'font-size':
                case 'border-width':
                    obj.defaults = 'medium';
                    break;
                case 'font-weight':
                    obj.defaults = '400';
                    break;
                case 'letter-spacing':
                case 'line-height':
                    obj.defaults = 'normal';
                    break;
                case 'color':
                case 'text-shadow-color':
                case 'border-color':
                case 'box-shadow-color':
                    obj.defaults = 'black';
                    break;
                case 'text-align':
                    obj.defaults = 'left';
                    break;
                case 'border-style':
                    obj.defaults = 'solid';
                    break;
                case 'box-shadow-type':
                    obj.defaults = '';
                    break;
                case 'background-repeat':
                    obj.defaults = 'repeat';
                    break;
                case 'background-position':
                    obj.defaults = 'left top';
                    break;
                case 'background-attachment':
                    obj.defaults = 'scroll';
                    break;
                case 'transition-property':
                    obj.defaults = 'width';
                    break;
                case 'transition-duration':
                    obj.defaults = '2';
                    break;
                case 'transition-timing-function':
                    obj.defaults = 'ease';
                    break;
                case 'overflow':
                case 'overflow-x':
                case 'overflow-y':
                    obj.defaults = 'visible';
                    break;
                }
                switch (prop) {
                case 'flex-direction':
                case 'flex-wrap':
                case 'justify-content':
                case 'align-items':
                case 'align-content':
                    obj.requires = { display: ['flex'] };
                    break;
                case 'order':
                case 'flex-basis':
                case 'flex-grow':
                case 'flex-shrink':
                case 'align-self':
                    obj.requiresParent = { display: ['flex'] };
                    break;
                }
                switch (prop) {
                case 'top':
                case 'bottom':
                case 'margin-top':
                case 'margin-bottom':
                case 'padding-top':
                case 'padding-bottom':
                case 'min-height':
                case 'max-height':
                case 'height':
                    obj.units = [
                        'px',
                        '%',
                        'vh'
                    ];
                    break;
                case 'right':
                case 'left':
                case 'margin-right':
                case 'margin-left':
                case 'padding-right':
                case 'padding-left':
                case 'min-width':
                case 'max-width':
                case 'width':
                    obj.units = [
                        'px',
                        '%',
                        'vw'
                    ];
                    break;
                case 'flex-basis':
                    obj.units = [
                        'px',
                        '%',
                        'vw',
                        'vh'
                    ];
                    break;
                case 'text-shadow-v':
                case 'text-shadow-h':
                case 'text-shadow-blur':
                case 'border-radius-c':
                case 'border-top-left-radius':
                case 'border-top-right-radius':
                case 'border-bottom-left-radius':
                case 'border-bottom-right-radius':
                case 'box-shadow-h':
                case 'box-shadow-v':
                    obj.units = [
                        'px',
                        '%'
                    ];
                    break;
                case 'font-size':
                case 'letter-spacing':
                case 'line-height':
                    obj.units = [
                        'px',
                        'em',
                        'rem',
                        '%'
                    ];
                    break;
                case 'border-width':
                    obj.units = [
                        'px',
                        'em'
                    ];
                    break;
                case 'box-shadow-blur':
                case 'box-shadow-spread':
                case 'perspective':
                    obj.units = ['px'];
                    break;
                case 'transition-duration':
                    obj.units = ['s'];
                    break;
                case 'transform-rotate-x':
                case 'transform-rotate-y':
                case 'transform-rotate-z':
                    obj.units = ['deg'];
                    break;
                }
                switch (prop) {
                case 'padding-top':
                case 'padding-right':
                case 'padding-bottom':
                case 'padding-left':
                case 'min-height':
                case 'min-width':
                case 'max-height':
                case 'max-width':
                case 'width':
                case 'height':
                case 'font-size':
                case 'text-shadow-blur':
                case 'border-radius-c':
                case 'border-top-left-radius':
                case 'border-top-right-radius':
                case 'border-bottom-left-radius':
                case 'border-bottom-right-radius':
                case 'border-width':
                case 'box-shadow-blur':
                case 'transition-duration':
                case 'perspective':
                case 'flex-basis':
                    obj.min = 0;
                    break;
                }
                switch (prop) {
                case 'text-shadow':
                case 'box-shadow':
                case 'background':
                    obj.preview = true;
                    break;
                }
                switch (prop) {
                case 'background':
                    obj.detached = true;
                    break;
                }
                switch (prop) {
                case 'transform-rotate-x':
                    obj.functionName = 'rotateX';
                    break;
                case 'transform-rotate-y':
                    obj.functionName = 'rotateY';
                    break;
                case 'transform-rotate-z':
                    obj.functionName = 'rotateZ';
                    break;
                case 'transform-scale-x':
                    obj.functionName = 'scaleX';
                    break;
                case 'transform-scale-y':
                    obj.functionName = 'scaleY';
                    break;
                case 'transform-scale-z':
                    obj.functionName = 'scaleZ';
                    break;
                case 'background-image':
                    obj.functionName = 'url';
                    break;
                }
                switch (prop) {
                case 'float':
                    obj.list = [
                        { value: 'none' },
                        { value: 'left' },
                        { value: 'right' }
                    ];
                    break;
                case 'display':
                    obj.list = [
                        { value: 'block' },
                        { value: 'inline' },
                        { value: 'inline-block' },
                        { value: 'flex' },
                        { value: 'none' }
                    ];
                    break;
                case 'flex-direction':
                    obj.list = [
                        { value: 'row' },
                        { value: 'row-reverse' },
                        { value: 'column' },
                        { value: 'column-reverse' }
                    ];
                    break;
                case 'flex-wrap':
                    obj.list = [
                        { value: 'nowrap' },
                        { value: 'wrap' },
                        { value: 'wrap-reverse' }
                    ];
                    break;
                case 'justify-content':
                    obj.list = [
                        { value: 'flex-start' },
                        { value: 'flex-end' },
                        { value: 'center' },
                        { value: 'space-between' },
                        { value: 'space-around' },
                        { value: 'space-evenly' }
                    ];
                    break;
                case 'align-items':
                    obj.list = [
                        { value: 'flex-start' },
                        { value: 'flex-end' },
                        { value: 'center' },
                        { value: 'baseline' },
                        { value: 'stretch' }
                    ];
                    break;
                case 'align-content':
                    obj.list = [
                        { value: 'flex-start' },
                        { value: 'flex-end' },
                        { value: 'center' },
                        { value: 'space-between' },
                        { value: 'space-around' },
                        { value: 'stretch' }
                    ];
                    break;
                case 'align-self':
                    obj.list = [
                        { value: 'auto' },
                        { value: 'flex-start' },
                        { value: 'flex-end' },
                        { value: 'center' },
                        { value: 'baseline' },
                        { value: 'stretch' }
                    ];
                    break;
                case 'position':
                    obj.list = [
                        { value: 'static' },
                        { value: 'relative' },
                        { value: 'absolute' },
                        { value: 'fixed' }
                    ];
                    break;
                case 'font-family':
                    var ss = ', sans-serif';
                    var fonts = [
                        'Arial, Helvetica' + ss,
                        'Arial Black, Gadget' + ss,
                        'Brush Script MT' + ss,
                        'Comic Sans MS, cursive' + ss,
                        'Courier New, Courier, monospace',
                        'Georgia, serif',
                        'Helvetica, serif',
                        'Impact, Charcoal' + ss,
                        'Lucida Sans Unicode, Lucida Grande' + ss,
                        'Tahoma, Geneva' + ss,
                        'Times New Roman, Times, serif',
                        'Trebuchet MS, Helvetica' + ss,
                        'Verdana, Geneva' + ss
                    ];
                    obj.list = [];
                    for (var j = 0, l = fonts.length; j < l; j++) {
                        var font = {};
                        font.value = fonts[j];
                        font.name = fonts[j].split(',')[0];
                        obj.list.push(font);
                    }
                    break;
                case 'font-weight':
                    obj.list = [
                        {
                            value: '100',
                            name: 'Thin'
                        },
                        {
                            value: '200',
                            name: 'Extra-Light'
                        },
                        {
                            value: '300',
                            name: 'Light'
                        },
                        {
                            value: '400',
                            name: 'Normal'
                        },
                        {
                            value: '500',
                            name: 'Medium'
                        },
                        {
                            value: '600',
                            name: 'Semi-Bold'
                        },
                        {
                            value: '700',
                            name: 'Bold'
                        },
                        {
                            value: '800',
                            name: 'Extra-Bold'
                        },
                        {
                            value: '900',
                            name: 'Ultra-Bold'
                        }
                    ];
                    break;
                case 'text-align':
                    obj.list = [
                        { value: 'left' },
                        { value: 'center' },
                        { value: 'right' },
                        { value: 'justify' }
                    ];
                    break;
                case 'border-style':
                    obj.list = [
                        { value: 'none' },
                        { value: 'solid' },
                        { value: 'dotted' },
                        { value: 'dashed' },
                        { value: 'double' },
                        { value: 'groove' },
                        { value: 'ridge' },
                        { value: 'inset' },
                        { value: 'outset' }
                    ];
                    break;
                case 'box-shadow-type':
                    obj.list = [
                        {
                            value: '',
                            name: 'Outside'
                        },
                        {
                            value: 'inset',
                            name: 'Inside'
                        }
                    ];
                    break;
                case 'background-repeat':
                    obj.list = [
                        { value: 'repeat' },
                        { value: 'repeat-x' },
                        { value: 'repeat-y' },
                        { value: 'no-repeat' }
                    ];
                    break;
                case 'background-position':
                    obj.list = [
                        { value: 'left top' },
                        { value: 'left center' },
                        { value: 'left bottom' },
                        { value: 'right top' },
                        { value: 'right center' },
                        { value: 'right bottom' },
                        { value: 'center top' },
                        { value: 'center center' },
                        { value: 'center bottom' }
                    ];
                    break;
                case 'background-attachment':
                    obj.list = [
                        { value: 'scroll' },
                        { value: 'fixed' },
                        { value: 'local' }
                    ];
                    break;
                case 'background-size':
                    obj.list = [
                        { value: 'auto' },
                        { value: 'cover' },
                        { value: 'contain' }
                    ];
                    break;
                case 'transition-property':
                    obj.list = [
                        { value: 'all' },
                        { value: 'width' },
                        { value: 'height' },
                        { value: 'background-color' },
                        { value: 'transform' },
                        { value: 'box-shadow' },
                        { value: 'opacity' }
                    ];
                    break;
                case 'transition-timing-function':
                    obj.list = [
                        { value: 'linear' },
                        { value: 'ease' },
                        { value: 'ease-in' },
                        { value: 'ease-out' },
                        { value: 'ease-in-out' }
                    ];
                    break;
                case 'cursor':
                    obj.list = [
                        { value: 'auto' },
                        { value: 'pointer' },
                        { value: 'copy' },
                        { value: 'crosshair' },
                        { value: 'grab' },
                        { value: 'grabbing' },
                        { value: 'help' },
                        { value: 'move' },
                        { value: 'text' }
                    ];
                    break;
                case 'overflow':
                case 'overflow-x':
                case 'overflow-y':
                    obj.list = [
                        { value: 'visible' },
                        { value: 'hidden' },
                        { value: 'scroll' },
                        { value: 'auto' }
                    ];
                    break;
                }
                switch (prop) {
                case 'margin':
                    obj.properties = this.build([
                        'margin-top',
                        'margin-right',
                        'margin-bottom',
                        'margin-left'
                    ]);
                    break;
                case 'padding':
                    obj.properties = this.build([
                        'padding-top',
                        'padding-right',
                        'padding-bottom',
                        'padding-left'
                    ]);
                    break;
                case 'text-shadow':
                    obj.properties = this.build([
                        'text-shadow-h',
                        'text-shadow-v',
                        'text-shadow-blur',
                        'text-shadow-color'
                    ]);
                    break;
                case 'border':
                    obj.properties = this.build([
                        'border-width',
                        'border-style',
                        'border-color'
                    ]);
                    break;
                case 'border-radius':
                    obj.properties = this.build([
                        'border-top-left-radius',
                        'border-top-right-radius',
                        'border-bottom-right-radius',
                        'border-bottom-left-radius'
                    ]);
                    break;
                case 'box-shadow':
                    obj.properties = this.build([
                        'box-shadow-h',
                        'box-shadow-v',
                        'box-shadow-blur',
                        'box-shadow-spread',
                        'box-shadow-color',
                        'box-shadow-type'
                    ]);
                    break;
                case 'background':
                    obj.properties = this.build([
                        'background-image',
                        'background-repeat',
                        'background-position',
                        'background-attachment',
                        'background-size'
                    ]);
                    break;
                case 'transition':
                    obj.properties = this.build([
                        'transition-property',
                        'transition-duration',
                        'transition-timing-function'
                    ]);
                    break;
                case 'transform':
                    obj.properties = this.build([
                        'transform-rotate-x',
                        'transform-rotate-y',
                        'transform-rotate-z',
                        'transform-scale-x',
                        'transform-scale-y',
                        'transform-scale-z'
                    ]);
                    break;
                }
                objs.push(obj);
            }
            return objs;
        }
    });
});
define('skylark-grapejs/style_manager/model/Sector',[
    'skylark-backbone',
    'skylark-underscore',
    './Properties',
    './PropertyFactory'
], function (
    Backbone, 
    a, 
    Properties, 
    PropertyFactory
) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            id: '',
            name: '',
            open: true,
            buildProps: '',
            extendBuilded: 1,
            properties: []
        },
        initialize(opts) {
            const o = opts || {};
            const builded = this.buildProperties(o.buildProps);
            const name = this.get('name') || '';
            let props = [];
            !this.get('id') && this.set('id', name.replace(/ /g, '_').toLowerCase());
            if (!builded)
                props = this.get('properties');
            else
                props = this.extendProperties(builded);
            const propsModel = new Properties(props);
            propsModel.sector = this;
            this.set('properties', propsModel);
        },
        extendProperties(props, moProps, ex) {
            var pLen = props.length;
            var mProps = moProps || this.get('properties');
            var ext = this.get('extendBuilded');
            var isolated = [];
            for (var i = 0, len = mProps.length; i < len; i++) {
                var mProp = mProps[i];
                var found = 0;
                for (var j = 0; j < pLen; j++) {
                    var prop = props[j];
                    if (mProp.property == prop.property || mProp.id == prop.property) {
                        var mPProps = mProp.properties;
                        if (mPProps && mPProps.length) {
                            mProp.properties = this.extendProperties(prop.properties || [], mPProps, 1);
                        }
                        props[j] = ext ? a.extend(prop, mProp) : mProp;
                        isolated[j] = props[j];
                        found = 1;
                        continue;
                    }
                }
                if (!found) {
                    props.push(mProp);
                    isolated.push(mProp);
                }
            }
            return ex ? isolated.filter(i => i) : props;
        },
        buildProperties(props) {
            var r;
            var buildP = props || [];
            if (!buildP.length)
                return;
            if (!this.propFactory)
                this.propFactory = PropertyFactory(); //new PropertyFactory(); // modified by lwf
            r = this.propFactory.build(buildP);
            return r;
        }
    });
});
define('skylark-grapejs/style_manager/model/Sectors',[
    'skylark-backbone',
    './Sector'
], function (Backbone, Sector) {
    'use strict';
    return Backbone.Collection.extend({ model: Sector });
});
define('skylark-grapejs/style_manager/view/SectorView',[
    'skylark-backbone',
    'skylark-underscore',
    './PropertiesView'
], function (Backbone, _, PropertiesView) {
    'use strict';
    return Backbone.View.extend({
        template: _.template(`
  <div class="<%= pfx %>title" data-sector-title>
    <i id="<%= pfx %>caret" class="fa"></i>
    <%= label %>
  </div>`),
        events: { 'click [data-sector-title]': 'toggle' },
        initialize(o) {
            this.config = o.config || {};
            this.em = this.config.em;
            this.pfx = this.config.stylePrefix || '';
            this.target = o.target || {};
            this.propTarget = o.propTarget || {};
            this.caretR = 'fa-caret-right';
            this.caretD = 'fa-caret-down';
            const model = this.model;
            this.listenTo(model, 'change:open', this.updateOpen);
            this.listenTo(model, 'updateVisibility', this.updateVisibility);
            this.listenTo(model, 'destroy remove', this.remove);
        },
        updateVisibility() {
            var show;
            this.model.get('properties').each(prop => {
                if (prop.get('visible')) {
                    show = 1;
                }
            });
            this.el.style.display = show ? 'block' : 'none';
        },
        updateOpen() {
            if (this.model.get('open'))
                this.show();
            else
                this.hide();
        },
        show() {
            this.$el.addClass(this.pfx + 'open');
            this.getPropertiesEl().style.display = '';
            this.$caret.removeClass(this.caretR).addClass(this.caretD);
        },
        hide() {
            this.$el.removeClass(this.pfx + 'open');
            this.getPropertiesEl().style.display = 'none';
            this.$caret.removeClass(this.caretD).addClass(this.caretR);
        },
        getPropertiesEl() {
            return this.$el.find(`.${ this.pfx }properties`).get(0);
        },
        toggle(e) {
            var v = this.model.get('open') ? 0 : 1;
            this.model.set('open', v);
        },
        render() {
            const {pfx, model, em, $el} = this;
            const {id, name} = model.attributes;
            const label = em && em.t(`styleManager.sectors.${ id }`) || name;
            $el.html(this.template({
                pfx,
                label
            }));
            this.$caret = $el.find(`#${ pfx }caret`);
            this.renderProperties();
            $el.attr('class', `${ pfx }sector ${ pfx }sector__${ id } no-select`);
            this.updateOpen();
            return this;
        },
        renderProperties() {
            var objs = this.model.get('properties');
            if (objs) {
                var view = new PropertiesView({
                    collection: objs,
                    target: this.target,
                    propTarget: this.propTarget,
                    config: this.config
                });
                this.$el.append(view.render().el);
            }
        }
    });
});
define('skylark-grapejs/style_manager/view/SectorsView',[
    'skylark-langx',
    'skylark-backbone',
    '../../utils/mixins',
    '../../utils/dom',
    './SectorView'
], function (langx,Backbone, b, c, SectorView) {
    'use strict';
    const helperCls = 'hc-state';
    return Backbone.View.extend({
        initialize(o = {}) {
            const config = o.config || {};
            this.pfx = config.stylePrefix || '';
            this.ppfx = config.pStylePrefix || '';
            this.target = o.target || {};
            this.config = config;
            const target = {};
            langx.extend(target, Backbone.Events);
            const body = document.body;
            const dummy = document.createElement(`el-${ new Date().getTime() }`);
            body.appendChild(dummy);
            target.computedDefault = { ...window.getComputedStyle(dummy) };
            body.removeChild(dummy);
            this.propTarget = target;
            const coll = this.collection;
            const events = 'component:toggled component:update:classes change:state change:device frame:resized';
            this.listenTo(coll, 'add', this.addTo);
            this.listenTo(coll, 'reset', this.render);
            this.listenTo(this.target, events, this.targetUpdated);
        },
        addTo(model, coll, opts = {}) {
            this.addToCollection(model, null, opts);
        },
        toggleStateCls(targets = [], enable) {
            targets.forEach(trg => {
                const el = trg.getEl();
                el && el.classList[enable ? 'add' : 'remove'](helperCls);
            });
        },
        targetUpdated(trg) {
            const em = this.target;
            const pt = this.propTarget;
            const targets = em.getSelectedAll();
            let model = em.getSelected();
            const mdToClear = trg && !!trg.toHTML ? trg : model;
            mdToClear && this.toggleStateCls([mdToClear]);
            if (!model)
                return;
            const config = em.get('Config');
            const state = !config.devicePreviewMode ? em.get('state') : '';
            const {componentFirst} = em.get('SelectorManager').getConfig();
            const el = model.getEl();
            pt.helper = null;
            pt.targets = null;
            if (el && b.isTaggableNode(el)) {
                const stateStr = state ? `:${ state }` : null;
                pt.computed = window.getComputedStyle(el, stateStr);
            }
            const appendStateRule = (style = {}) => {
                const cc = em.get('CssComposer');
                const rules = cc.getAll();
                let helperRule = cc.getClassRule(helperCls);
                if (!helperRule) {
                    helperRule = cc.setClassRule(helperCls);
                } else {
                    rules.remove(helperRule);
                    rules.add(helperRule);
                }
                helperRule.set('important', 1);
                helperRule.setStyle(style);
                pt.helper = helperRule;
            };
            model = em.get('StyleManager').getModelToStyle(model);
            if (state) {
                appendStateRule(model.getStyle());
                this.toggleStateCls(targets, 1);
            }
            pt.model = model;
            if (componentFirst)
                pt.targets = targets;
            pt.trigger('update');
        },
        setTarget(target, opts = {}) {
            const em = this.target;
            const trgs = langx.isArray(target) ? target : [target];
            const {targetIsClass, stylable} = opts;
            const models = [];
            trgs.forEach(target => {
                let model = target;
                if (langx.isString(target)) {
                    let rule;
                    const rules = em.get('CssComposer').getAll();
                    if (targetIsClass) {
                        rule = rules.filter(rule => rule.get('selectors').getFullString() === target)[0];
                    }
                    if (!rule) {
                        rule = rules.filter(rule => rule.get('selectorsAdd') === target)[0];
                    }
                    if (!rule) {
                        rule = rules.add({
                            selectors: [],
                            selectorsAdd: target
                        });
                    }
                    stylable && rule.set({ stylable });
                    model = rule;
                }
                models.push(model);
            });
            const pt = this.propTarget;
            pt.targets = models;
            pt.trigger('update');
            return models;
        },
        addToCollection(model, fragmentEl, opts = {}) {
            const {pfx, target, propTarget, config, el} = this;
            const appendTo = fragmentEl || el;
            const rendered = new SectorView({
                model,
                id: `${ pfx }${ model.get('id') }`,
                name: model.get('name'),
                properties: model.get('properties'),
                target,
                propTarget,
                config
            }).render().el;
            c.appendAtIndex(appendTo, rendered, opts.at);
            return rendered;
        },
        render() {
            const frag = document.createDocumentFragment();
            const $el = this.$el;
            const pfx = this.pfx;
            const ppfx = this.ppfx;
            $el.empty();
            this.collection.each(model => this.addToCollection(model, frag));
            $el.append(frag);
            $el.addClass(`${ pfx }sectors ${ ppfx }one-bg ${ ppfx }two-color`);
            return this;
        }
    });
});
define('skylark-grapejs/style_manager/index',[
    "skylark-langx/langx",
    'skylark-underscore',
    './config/config',
    './model/Sectors',
    './model/Properties',
    './view/SectorsView'
], function (langx,_, defaults, Sectors, Properties, SectorsView) {
    'use strict';
    return () => {
        var c = {};
        let properties;
        var sectors, SectView;
        return {
            name: 'StyleManager',
            getConfig() {
                return c;
            },
            init(config) {
                c = {...defaults,...config};
                const ppfx = c.pStylePrefix;
                this.em = c.em;
                if (ppfx)
                    c.stylePrefix = ppfx + c.stylePrefix;
                properties = new Properties();
                sectors = new Sectors([], c);
                SectView = new SectorsView({
                    collection: sectors,
                    target: c.em,
                    config: c
                });
                return this;
            },
            onLoad() {
                sectors.add(c.sectors);
            },
            postRender() {
                const elTo = this.getConfig().appendTo;
                if (elTo) {
                    const el = _.isElement(elTo) ? elTo : document.querySelector(elTo);
                    el.appendChild(this.render());
                }
            },
            addSector(id, sector, opts = {}) {
                let result = this.getSector(id);
                if (!result) {
                    sector.id = id;
                    result = sectors.add(sector, opts);
                }
                return result;
            },
            getSector(id, opts = {}) {
                const res = sectors.where({ id })[0];
                !res && opts.warn && this._logNoSector(id);
                return res;
            },
            removeSector(id) {
                return this.getSectors().remove(this.getSector(id, { warn: 1 }));
            },
            getSectors() {
                return sectors;
            },
            addProperty(sectorId, property, opts = {}) {
                const sector = this.getSector(sectorId, { warn: 1 });
                let prop = null;
                if (sector)
                    prop = sector.get('properties').add(property, opts);
                return prop;
            },
            getProperty(sectorId, name) {
                const sector = this.getSector(sectorId, { warn: 1 });
                let prop = null;
                if (sector) {
                    prop = sector.get('properties').where({ property: name });
                    prop = prop.length == 1 ? prop[0] : prop;
                }
                return prop;
            },
            removeProperty(sectorId, name) {
                const props = this.getProperties(sectorId);
                return props && props.remove(this.getProperty(sectorId, name));
            },
            getProperties(sectorId) {
                let props = null;
                const sector = this.getSector(sectorId, { warn: 1 });
                if (sector)
                    props = sector.get('properties');
                return props;
            },
            getModelToStyle(model, options = {}) {
                const em = c.em;
                const {skipAdd} = options;
                const classes = model.get('classes');
                const id = model.getId();
                if (em) {
                    const config = em.getConfig();
                    const um = em.get('UndoManager');
                    const cssC = em.get('CssComposer');
                    const sm = em.get('SelectorManager');
                    const smConf = sm ? sm.getConfig() : {};
                    const state = !config.devicePreviewMode ? em.get('state') : '';
                    const valid = classes.getStyleable();
                    const hasClasses = valid.length;
                    const useClasses = !smConf.componentFirst || options.useClasses;
                    const opts = { state };
                    let rule;
                    um.stop();
                    if (hasClasses && useClasses) {
                        const deviceW = em.getCurrentMedia();
                        rule = cssC.get(valid, state, deviceW);
                        if (!rule && !skipAdd) {
                            rule = cssC.add(valid, state, deviceW);
                        }
                    } else if (config.avoidInlineStyle) {
                        rule = cssC.getIdRule(id, opts);
                        !rule && !skipAdd && (rule = cssC.setIdRule(id, {}, opts));
                        if (model.is('wrapper'))
                            rule.set('wrapper', 1);
                    }
                    rule && (model = rule);
                    um.start();
                }
                return model;
            },
            addType(id, definition) {
                properties.addType(id, definition);
            },
            getType(id) {
                return properties.getType(id);
            },
            getTypes() {
                return properties.getTypes();
            },
            createType(id, {model = {}, view = {}} = {}) {
                const type = this.getType(id);
                if (type) {
                    return new type.view(
                        langx.mixin({
                            model: new type.model(model),
                            config: c,
                        },view)
                    );
                }
            },
            setTarget(target, opts) {
                return SectView.setTarget(target, opts);
            },
            getEmitter() {
                return SectView.propTarget;
            },
            render() {
                return SectView.render().el;
            },
            _logNoSector(sectorId) {
                const {em} = this;
                em && em.logWarning(`'${ sectorId }' sector not found`);
            }
        };
    };
});
define('skylark-grapejs/modal_dialog/config/config',[],function () {
    'use strict';
    return {
        stylePrefix: 'mdl-',
        title: '',
        content: '',
        backdrop: true
    };
});
define('skylark-grapejs/modal_dialog/model/Modal',['skylark-backbone'], function (Backbone) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            title: '',
            content: '',
            open: false
        }
    });
});
define('skylark-grapejs/modal_dialog/view/ModalView',['skylark-backbone'], function (Backbone) {
    'use strict';
    return Backbone.View.extend({
        template({pfx, ppfx, content, title}) {
            return `<div class="${ pfx }dialog ${ ppfx }one-bg ${ ppfx }two-color">
      <div class="${ pfx }header">
        <div class="${ pfx }title">${ title }</div>
        <div class="${ pfx }btn-close" data-close-modal>&Cross;</div>
      </div>
      <div class="${ pfx }content">
        <div id="${ pfx }c">${ content }</div>
        <div style="clear:both"></div>
      </div>
    </div>
    <div class="${ pfx }collector" style="display: none"></div>`;
        },
        events: {
            click: 'onClick',
            'click [data-close-modal]': 'hide'
        },
        initialize(o) {
            const model = this.model;
            const config = o.config || {};
            const pfx = config.stylePrefix || '';
            this.config = config;
            this.pfx = pfx;
            this.ppfx = config.pStylePrefix || '';
            this.listenTo(model, 'change:open', this.updateOpen);
            this.listenTo(model, 'change:title', this.updateTitle);
            this.listenTo(model, 'change:content', this.updateContent);
        },
        onClick(e) {
            const bkd = this.config.backdrop;
            bkd && e.target === this.el && this.hide();
        },
        getCollector() {
            if (!this.$collector)
                this.$collector = this.$el.find('.' + this.pfx + 'collector');
            return this.$collector;
        },
        getContent() {
            const pfx = this.pfx;
            if (!this.$content) {
                this.$content = this.$el.find(`.${ pfx }content #${ pfx }c`);
            }
            return this.$content;
        },
        getTitle() {
            if (!this.$title)
                this.$title = this.$el.find('.' + this.pfx + 'title');
            return this.$title.get(0);
        },
        updateContent() {
            var content = this.getContent();
            const children = content.children();
            const coll = this.getCollector();
            const body = this.model.get('content');
            children.length && coll.append(children);
            content.empty().append(body);
        },
        updateTitle() {
            var title = this.getTitle();
            if (title)
                title.innerHTML = this.model.get('title');
        },
        updateOpen() {
            this.el.style.display = this.model.get('open') ? '' : 'none';
        },
        hide() {
            this.model.set('open', 0);
        },
        show() {
            this.model.set('open', 1);
        },
        render() {
            const el = this.$el;
            const pfx = this.pfx;
            const ppfx = this.ppfx;
            const obj = this.model.toJSON();
            obj.pfx = this.pfx;
            obj.ppfx = this.ppfx;
            el.html(this.template(obj));
            el.attr('class', `${ pfx }container`);
            this.updateOpen();
            return this;
        }
    });
});
define('skylark-grapejs/modal_dialog/index',[
    './config/config',
    './model/Modal',
    './view/ModalView'
], function (defaults, ModalM, ModalView) {
    'use strict';
    return () => {
        var c = {};
        var model, modal;
        const triggerEvent = (enable, em) => {
            em && em.trigger(`modal:${ enable ? 'open' : 'close' }`);
        };
        return {
            name: 'Modal',
            getConfig() {
                return c;
            },
            init(config = {}) {
                c = {
                    ...defaults,
                    ...config
                };
                const em = c.em;
                this.em = em;
                var ppfx = c.pStylePrefix;
                if (ppfx)
                    c.stylePrefix = ppfx + c.stylePrefix;
                model = new ModalM(c);
                model.on('change:open', (m, enb) => triggerEvent(enb, em));
                modal = new ModalView({
                    model,
                    config: c
                });
                return this;
            },
            postRender(view) {
                const el = view.model.getConfig().el || view.el;
                this.render().appendTo(el);
            },
            open(opts = {}) {
                opts.title && this.setTitle(opts.title);
                opts.content && this.setContent(opts.content);
                modal.show();
                return this;
            },
            close() {
                modal.hide();
                return this;
            },
            onceClose(clb) {
                this.em.once('modal:close', clb);
                return this;
            },
            onceOpen(clb) {
                this.em.once('modal:open', clb);
                return this;
            },
            isOpen() {
                return !!model.get('open');
            },
            setTitle(title) {
                model.set('title', title);
                return this;
            },
            getTitle() {
                return model.get('title');
            },
            setContent(content) {
                model.set('content', ' ');
                model.set('content', content);
                return this;
            },
            getContent() {
                return model.get('content');
            },
            getContentEl() {
                return modal.getContent().get(0);
            },
            getModel() {
                return model;
            },
            render() {
                return modal.render().$el;
            }
        };
    };
});
define('skylark-grapejs/code_manager/config/config',[],function () {
    'use strict';
    return {
        stylePrefix: 'cm-',
        inlineCss: false
    };
});
define('skylark-grapejs/code_manager/model/HtmlGenerator',[
    'skylark-backbone'
], function (Backbone) {
    'use strict';
    return Backbone.Model.extend({
        build(model, opts = {}) {
            const models = model.get('components');
            if (opts.exportWrapper) {
                return model.toHTML({ ...opts.wrapperIsBody && { tag: 'body' } });
            }
            return this.buildModels(models);
        },
        buildModels(models) {
            let code = '';
            models.each(model => {
                code += model.toHTML();
            });
            return code;
        }
    });
});
define('skylark-grapejs/code_manager/model/JsonGenerator',[
    'skylark-underscore',
    'skylark-backbone'
], function (a, Backbone) {
    'use strict';
    return Backbone.Model.extend({
        build(model) {
            var json = model.toJSON();
            this.beforeEach(json);
            a.each(json, function (v, attr) {
                var obj = json[attr];
                if (obj instanceof Backbone.Model) {
                    json[attr] = this.build(obj);
                } else if (obj instanceof Backbone.Collection) {
                    var coll = obj;
                    json[attr] = [];
                    if (coll.length) {
                        coll.each(function (el, index) {
                            json[attr][index] = this.build(el);
                        }, this);
                    }
                }
            }, this);
            return json;
        },
        beforeEach(obj) {
            delete obj.status;
        }
    });
});
define('skylark-grapejs/code_manager/model/JsGenerator',[
    'skylark-underscore',
    'skylark-backbone'
], function (a, Backbone) {
    'use strict';
    return Backbone.Model.extend({
        mapModel(model) {
            var code = '';
            var script = model.get('script-export') || model.get('script');
            var type = model.get('type');
            var comps = model.get('components');
            var id = model.getId();
            if (script) {
                var attr = model.get('attributes');
                attr = a.extend({}, attr, { id });
                model.set('attributes', attr, { silent: 1 });
                var scrStr = model.getScriptString(script);
                if (model.get('scriptUpdated')) {
                    this.mapJs[type + '-' + id] = {
                        ids: [id],
                        code: scrStr
                    };
                } else {
                    var mapType = this.mapJs[type];
                    if (mapType) {
                        mapType.ids.push(id);
                    } else {
                        this.mapJs[type] = {
                            ids: [id],
                            code: scrStr
                        };
                    }
                }
            }
            comps.each(function (model) {
                code += this.mapModel(model);
            }, this);
            return code;
        },
        build(model) {
            this.mapJs = {};
            this.mapModel(model);
            var code = '';
            for (var type in this.mapJs) {
                var mapType = this.mapJs[type];
                var ids = '#' + mapType.ids.join(', #');
                code += `
        var items = document.querySelectorAll('${ ids }');
        for (var i = 0, len = items.length; i < len; i++) {
          (function(){${ mapType.code }}.bind(items[i]))();
        }`;
            }
            return code;
        }
    });
});
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

define('skylark-codemirror/mode/xml/xml',["../../CodeMirror"], function(CodeMirror) {
"use strict";

var htmlConfig = {
  autoSelfClosers: {'area': true, 'base': true, 'br': true, 'col': true, 'command': true,
                    'embed': true, 'frame': true, 'hr': true, 'img': true, 'input': true,
                    'keygen': true, 'link': true, 'meta': true, 'param': true, 'source': true,
                    'track': true, 'wbr': true, 'menuitem': true},
  implicitlyClosed: {'dd': true, 'li': true, 'optgroup': true, 'option': true, 'p': true,
                     'rp': true, 'rt': true, 'tbody': true, 'td': true, 'tfoot': true,
                     'th': true, 'tr': true},
  contextGrabbers: {
    'dd': {'dd': true, 'dt': true},
    'dt': {'dd': true, 'dt': true},
    'li': {'li': true},
    'option': {'option': true, 'optgroup': true},
    'optgroup': {'optgroup': true},
    'p': {'address': true, 'article': true, 'aside': true, 'blockquote': true, 'dir': true,
          'div': true, 'dl': true, 'fieldset': true, 'footer': true, 'form': true,
          'h1': true, 'h2': true, 'h3': true, 'h4': true, 'h5': true, 'h6': true,
          'header': true, 'hgroup': true, 'hr': true, 'menu': true, 'nav': true, 'ol': true,
          'p': true, 'pre': true, 'section': true, 'table': true, 'ul': true},
    'rp': {'rp': true, 'rt': true},
    'rt': {'rp': true, 'rt': true},
    'tbody': {'tbody': true, 'tfoot': true},
    'td': {'td': true, 'th': true},
    'tfoot': {'tbody': true},
    'th': {'td': true, 'th': true},
    'thead': {'tbody': true, 'tfoot': true},
    'tr': {'tr': true}
  },
  doNotIndent: {"pre": true},
  allowUnquoted: true,
  allowMissing: true,
  caseFold: true
}

var xmlConfig = {
  autoSelfClosers: {},
  implicitlyClosed: {},
  contextGrabbers: {},
  doNotIndent: {},
  allowUnquoted: false,
  allowMissing: false,
  allowMissingTagName: false,
  caseFold: false
}

CodeMirror.defineMode("xml", function(editorConf, config_) {
  var indentUnit = editorConf.indentUnit
  var config = {}
  var defaults = config_.htmlMode ? htmlConfig : xmlConfig
  for (var prop in defaults) config[prop] = defaults[prop]
  for (var prop in config_) config[prop] = config_[prop]

  // Return variables for tokenizers
  var type, setStyle;

  function inText(stream, state) {
    function chain(parser) {
      state.tokenize = parser;
      return parser(stream, state);
    }

    var ch = stream.next();
    if (ch == "<") {
      if (stream.eat("!")) {
        if (stream.eat("[")) {
          if (stream.match("CDATA[")) return chain(inBlock("atom", "]]>"));
          else return null;
        } else if (stream.match("--")) {
          return chain(inBlock("comment", "-->"));
        } else if (stream.match("DOCTYPE", true, true)) {
          stream.eatWhile(/[\w\._\-]/);
          return chain(doctype(1));
        } else {
          return null;
        }
      } else if (stream.eat("?")) {
        stream.eatWhile(/[\w\._\-]/);
        state.tokenize = inBlock("meta", "?>");
        return "meta";
      } else {
        type = stream.eat("/") ? "closeTag" : "openTag";
        state.tokenize = inTag;
        return "tag bracket";
      }
    } else if (ch == "&") {
      var ok;
      if (stream.eat("#")) {
        if (stream.eat("x")) {
          ok = stream.eatWhile(/[a-fA-F\d]/) && stream.eat(";");
        } else {
          ok = stream.eatWhile(/[\d]/) && stream.eat(";");
        }
      } else {
        ok = stream.eatWhile(/[\w\.\-:]/) && stream.eat(";");
      }
      return ok ? "atom" : "error";
    } else {
      stream.eatWhile(/[^&<]/);
      return null;
    }
  }
  inText.isInText = true;

  function inTag(stream, state) {
    var ch = stream.next();
    if (ch == ">" || (ch == "/" && stream.eat(">"))) {
      state.tokenize = inText;
      type = ch == ">" ? "endTag" : "selfcloseTag";
      return "tag bracket";
    } else if (ch == "=") {
      type = "equals";
      return null;
    } else if (ch == "<") {
      state.tokenize = inText;
      state.state = baseState;
      state.tagName = state.tagStart = null;
      var next = state.tokenize(stream, state);
      return next ? next + " tag error" : "tag error";
    } else if (/[\'\"]/.test(ch)) {
      state.tokenize = inAttribute(ch);
      state.stringStartCol = stream.column();
      return state.tokenize(stream, state);
    } else {
      stream.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/);
      return "word";
    }
  }

  function inAttribute(quote) {
    var closure = function(stream, state) {
      while (!stream.eol()) {
        if (stream.next() == quote) {
          state.tokenize = inTag;
          break;
        }
      }
      return "string";
    };
    closure.isInAttribute = true;
    return closure;
  }

  function inBlock(style, terminator) {
    return function(stream, state) {
      while (!stream.eol()) {
        if (stream.match(terminator)) {
          state.tokenize = inText;
          break;
        }
        stream.next();
      }
      return style;
    }
  }

  function doctype(depth) {
    return function(stream, state) {
      var ch;
      while ((ch = stream.next()) != null) {
        if (ch == "<") {
          state.tokenize = doctype(depth + 1);
          return state.tokenize(stream, state);
        } else if (ch == ">") {
          if (depth == 1) {
            state.tokenize = inText;
            break;
          } else {
            state.tokenize = doctype(depth - 1);
            return state.tokenize(stream, state);
          }
        }
      }
      return "meta";
    };
  }

  function Context(state, tagName, startOfLine) {
    this.prev = state.context;
    this.tagName = tagName;
    this.indent = state.indented;
    this.startOfLine = startOfLine;
    if (config.doNotIndent.hasOwnProperty(tagName) || (state.context && state.context.noIndent))
      this.noIndent = true;
  }
  function popContext(state) {
    if (state.context) state.context = state.context.prev;
  }
  function maybePopContext(state, nextTagName) {
    var parentTagName;
    while (true) {
      if (!state.context) {
        return;
      }
      parentTagName = state.context.tagName;
      if (!config.contextGrabbers.hasOwnProperty(parentTagName) ||
          !config.contextGrabbers[parentTagName].hasOwnProperty(nextTagName)) {
        return;
      }
      popContext(state);
    }
  }

  function baseState(type, stream, state) {
    if (type == "openTag") {
      state.tagStart = stream.column();
      return tagNameState;
    } else if (type == "closeTag") {
      return closeTagNameState;
    } else {
      return baseState;
    }
  }
  function tagNameState(type, stream, state) {
    if (type == "word") {
      state.tagName = stream.current();
      setStyle = "tag";
      return attrState;
    } else if (config.allowMissingTagName && type == "endTag") {
      setStyle = "tag bracket";
      return attrState(type, stream, state);
    } else {
      setStyle = "error";
      return tagNameState;
    }
  }
  function closeTagNameState(type, stream, state) {
    if (type == "word") {
      var tagName = stream.current();
      if (state.context && state.context.tagName != tagName &&
          config.implicitlyClosed.hasOwnProperty(state.context.tagName))
        popContext(state);
      if ((state.context && state.context.tagName == tagName) || config.matchClosing === false) {
        setStyle = "tag";
        return closeState;
      } else {
        setStyle = "tag error";
        return closeStateErr;
      }
    } else if (config.allowMissingTagName && type == "endTag") {
      setStyle = "tag bracket";
      return closeState(type, stream, state);
    } else {
      setStyle = "error";
      return closeStateErr;
    }
  }

  function closeState(type, _stream, state) {
    if (type != "endTag") {
      setStyle = "error";
      return closeState;
    }
    popContext(state);
    return baseState;
  }
  function closeStateErr(type, stream, state) {
    setStyle = "error";
    return closeState(type, stream, state);
  }

  function attrState(type, _stream, state) {
    if (type == "word") {
      setStyle = "attribute";
      return attrEqState;
    } else if (type == "endTag" || type == "selfcloseTag") {
      var tagName = state.tagName, tagStart = state.tagStart;
      state.tagName = state.tagStart = null;
      if (type == "selfcloseTag" ||
          config.autoSelfClosers.hasOwnProperty(tagName)) {
        maybePopContext(state, tagName);
      } else {
        maybePopContext(state, tagName);
        state.context = new Context(state, tagName, tagStart == state.indented);
      }
      return baseState;
    }
    setStyle = "error";
    return attrState;
  }
  function attrEqState(type, stream, state) {
    if (type == "equals") return attrValueState;
    if (!config.allowMissing) setStyle = "error";
    return attrState(type, stream, state);
  }
  function attrValueState(type, stream, state) {
    if (type == "string") return attrContinuedState;
    if (type == "word" && config.allowUnquoted) {setStyle = "string"; return attrState;}
    setStyle = "error";
    return attrState(type, stream, state);
  }
  function attrContinuedState(type, stream, state) {
    if (type == "string") return attrContinuedState;
    return attrState(type, stream, state);
  }

  return {
    startState: function(baseIndent) {
      var state = {tokenize: inText,
                   state: baseState,
                   indented: baseIndent || 0,
                   tagName: null, tagStart: null,
                   context: null}
      if (baseIndent != null) state.baseIndent = baseIndent
      return state
    },

    token: function(stream, state) {
      if (!state.tagName && stream.sol())
        state.indented = stream.indentation();

      if (stream.eatSpace()) return null;
      type = null;
      var style = state.tokenize(stream, state);
      if ((style || type) && style != "comment") {
        setStyle = null;
        state.state = state.state(type || style, stream, state);
        if (setStyle)
          style = setStyle == "error" ? style + " error" : setStyle;
      }
      return style;
    },

    indent: function(state, textAfter, fullLine) {
      var context = state.context;
      // Indent multi-line strings (e.g. css).
      if (state.tokenize.isInAttribute) {
        if (state.tagStart == state.indented)
          return state.stringStartCol + 1;
        else
          return state.indented + indentUnit;
      }
      if (context && context.noIndent) return CodeMirror.Pass;
      if (state.tokenize != inTag && state.tokenize != inText)
        return fullLine ? fullLine.match(/^(\s*)/)[0].length : 0;
      // Indent the starts of attribute names.
      if (state.tagName) {
        if (config.multilineTagIndentPastTag !== false)
          return state.tagStart + state.tagName.length + 2;
        else
          return state.tagStart + indentUnit * (config.multilineTagIndentFactor || 1);
      }
      if (config.alignCDATA && /<!\[CDATA\[/.test(textAfter)) return 0;
      var tagAfter = textAfter && /^<(\/)?([\w_:\.-]*)/.exec(textAfter);
      if (tagAfter && tagAfter[1]) { // Closing tag spotted
        while (context) {
          if (context.tagName == tagAfter[2]) {
            context = context.prev;
            break;
          } else if (config.implicitlyClosed.hasOwnProperty(context.tagName)) {
            context = context.prev;
          } else {
            break;
          }
        }
      } else if (tagAfter) { // Opening tag spotted
        while (context) {
          var grabbers = config.contextGrabbers[context.tagName];
          if (grabbers && grabbers.hasOwnProperty(tagAfter[2]))
            context = context.prev;
          else
            break;
        }
      }
      while (context && context.prev && !context.startOfLine)
        context = context.prev;
      if (context) return context.indent + indentUnit;
      else return state.baseIndent || 0;
    },

    electricInput: /<\/[\s\w:]+>$/,
    blockCommentStart: "<!--",
    blockCommentEnd: "-->",

    configuration: config.htmlMode ? "html" : "xml",
    helperType: config.htmlMode ? "html" : "xml",

    skipAttribute: function(state) {
      if (state.state == attrValueState)
        state.state = attrState
    }
  };
});

CodeMirror.defineMIME("text/xml", "xml");
CodeMirror.defineMIME("application/xml", "xml");
if (!CodeMirror.mimeModes.hasOwnProperty("text/html"))
  CodeMirror.defineMIME("text/html", {name: "xml", htmlMode: true});

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

define('skylark-codemirror/mode/javascript/javascript',["../../CodeMirror"], function(CodeMirror) {
"use strict";

CodeMirror.defineMode("javascript", function(config, parserConfig) {
  var indentUnit = config.indentUnit;
  var statementIndent = parserConfig.statementIndent;
  var jsonldMode = parserConfig.jsonld;
  var jsonMode = parserConfig.json || jsonldMode;
  var isTS = parserConfig.typescript;
  var wordRE = parserConfig.wordCharacters || /[\w$\xa1-\uffff]/;

  // Tokenizer

  var keywords = function(){
    function kw(type) {return {type: type, style: "keyword"};}
    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c"), D = kw("keyword d");
    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

    return {
      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
      "return": D, "break": D, "continue": D, "new": kw("new"), "delete": C, "void": C, "throw": C,
      "debugger": kw("debugger"), "var": kw("var"), "const": kw("var"), "let": kw("var"),
      "function": kw("function"), "catch": kw("catch"),
      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
      "in": operator, "typeof": operator, "instanceof": operator,
      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
      "this": kw("this"), "class": kw("class"), "super": kw("atom"),
      "yield": C, "export": kw("export"), "import": kw("import"), "extends": C,
      "await": C
    };
  }();

  var isOperatorChar = /[+\-*&%=<>!?|~^@]/;
  var isJsonldKeyword = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;

  function readRegexp(stream) {
    var escaped = false, next, inSet = false;
    while ((next = stream.next()) != null) {
      if (!escaped) {
        if (next == "/" && !inSet) return;
        if (next == "[") inSet = true;
        else if (inSet && next == "]") inSet = false;
      }
      escaped = !escaped && next == "\\";
    }
  }

  // Used as scratch variables to communicate multiple values without
  // consing up tons of objects.
  var type, content;
  function ret(tp, style, cont) {
    type = tp; content = cont;
    return style;
  }
  function tokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == "." && stream.match(/^\d+(?:[eE][+\-]?\d+)?/)) {
      return ret("number", "number");
    } else if (ch == "." && stream.match("..")) {
      return ret("spread", "meta");
    } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      return ret(ch);
    } else if (ch == "=" && stream.eat(">")) {
      return ret("=>", "operator");
    } else if (ch == "0" && stream.match(/^(?:x[\da-f]+|o[0-7]+|b[01]+)n?/i)) {
      return ret("number", "number");
    } else if (/\d/.test(ch)) {
      stream.match(/^\d*(?:n|(?:\.\d*)?(?:[eE][+\-]?\d+)?)?/);
      return ret("number", "number");
    } else if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      } else if (stream.eat("/")) {
        stream.skipToEnd();
        return ret("comment", "comment");
      } else if (expressionAllowed(stream, state, 1)) {
        readRegexp(stream);
        stream.match(/^\b(([gimyus])(?![gimyus]*\2))+\b/);
        return ret("regexp", "string-2");
      } else {
        stream.eat("=");
        return ret("operator", "operator", stream.current());
      }
    } else if (ch == "`") {
      state.tokenize = tokenQuasi;
      return tokenQuasi(stream, state);
    } else if (ch == "#") {
      stream.skipToEnd();
      return ret("error", "error");
    } else if (isOperatorChar.test(ch)) {
      if (ch != ">" || !state.lexical || state.lexical.type != ">") {
        if (stream.eat("=")) {
          if (ch == "!" || ch == "=") stream.eat("=")
        } else if (/[<>*+\-]/.test(ch)) {
          stream.eat(ch)
          if (ch == ">") stream.eat(ch)
        }
      }
      return ret("operator", "operator", stream.current());
    } else if (wordRE.test(ch)) {
      stream.eatWhile(wordRE);
      var word = stream.current()
      if (state.lastType != ".") {
        if (keywords.propertyIsEnumerable(word)) {
          var kw = keywords[word]
          return ret(kw.type, kw.style, word)
        }
        if (word == "async" && stream.match(/^(\s|\/\*.*?\*\/)*[\[\(\w]/, false))
          return ret("async", "keyword", word)
      }
      return ret("variable", "variable", word)
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, next;
      if (jsonldMode && stream.peek() == "@" && stream.match(isJsonldKeyword)){
        state.tokenize = tokenBase;
        return ret("jsonld-keyword", "meta");
      }
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) break;
        escaped = !escaped && next == "\\";
      }
      if (!escaped) state.tokenize = tokenBase;
      return ret("string", "string");
    };
  }

  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ret("comment", "comment");
  }

  function tokenQuasi(stream, state) {
    var escaped = false, next;
    while ((next = stream.next()) != null) {
      if (!escaped && (next == "`" || next == "$" && stream.eat("{"))) {
        state.tokenize = tokenBase;
        break;
      }
      escaped = !escaped && next == "\\";
    }
    return ret("quasi", "string-2", stream.current());
  }

  var brackets = "([{}])";
  // This is a crude lookahead trick to try and notice that we're
  // parsing the argument patterns for a fat-arrow function before we
  // actually hit the arrow token. It only works if the arrow is on
  // the same line as the arguments and there's no strange noise
  // (comments) in between. Fallback is to only notice when we hit the
  // arrow, and not declare the arguments as locals for the arrow
  // body.
  function findFatArrow(stream, state) {
    if (state.fatArrowAt) state.fatArrowAt = null;
    var arrow = stream.string.indexOf("=>", stream.start);
    if (arrow < 0) return;

    if (isTS) { // Try to skip TypeScript return type declarations after the arguments
      var m = /:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(stream.string.slice(stream.start, arrow))
      if (m) arrow = m.index
    }

    var depth = 0, sawSomething = false;
    for (var pos = arrow - 1; pos >= 0; --pos) {
      var ch = stream.string.charAt(pos);
      var bracket = brackets.indexOf(ch);
      if (bracket >= 0 && bracket < 3) {
        if (!depth) { ++pos; break; }
        if (--depth == 0) { if (ch == "(") sawSomething = true; break; }
      } else if (bracket >= 3 && bracket < 6) {
        ++depth;
      } else if (wordRE.test(ch)) {
        sawSomething = true;
      } else if (/["'\/]/.test(ch)) {
        return;
      } else if (sawSomething && !depth) {
        ++pos;
        break;
      }
    }
    if (sawSomething && !depth) state.fatArrowAt = pos;
  }

  // Parser

  var atomicTypes = {"atom": true, "number": true, "variable": true, "string": true, "regexp": true, "this": true, "jsonld-keyword": true};

  function JSLexical(indented, column, type, align, prev, info) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.prev = prev;
    this.info = info;
    if (align != null) this.align = align;
  }

  function inScope(state, varname) {
    for (var v = state.localVars; v; v = v.next)
      if (v.name == varname) return true;
    for (var cx = state.context; cx; cx = cx.prev) {
      for (var v = cx.vars; v; v = v.next)
        if (v.name == varname) return true;
    }
  }

  function parseJS(state, style, type, content, stream) {
    var cc = state.cc;
    // Communicate our context to the combinators.
    // (Less wasteful than consing up a hundred closures on every call.)
    cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc; cx.style = style;

    if (!state.lexical.hasOwnProperty("align"))
      state.lexical.align = true;

    while(true) {
      var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
      if (combinator(type, content)) {
        while(cc.length && cc[cc.length - 1].lex)
          cc.pop()();
        if (cx.marked) return cx.marked;
        if (type == "variable" && inScope(state, content)) return "variable-2";
        return style;
      }
    }
  }

  // Combinator utils

  var cx = {state: null, column: null, marked: null, cc: null};
  function pass() {
    for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
  }
  function cont() {
    pass.apply(null, arguments);
    return true;
  }
  function inList(name, list) {
    for (var v = list; v; v = v.next) if (v.name == name) return true
    return false;
  }
  function register(varname) {
    var state = cx.state;
    cx.marked = "def";
    if (state.context) {
      if (state.lexical.info == "var" && state.context && state.context.block) {
        // FIXME function decls are also not block scoped
        var newContext = registerVarScoped(varname, state.context)
        if (newContext != null) {
          state.context = newContext
          return
        }
      } else if (!inList(varname, state.localVars)) {
        state.localVars = new Var(varname, state.localVars)
        return
      }
    }
    // Fall through means this is global
    if (parserConfig.globalVars && !inList(varname, state.globalVars))
      state.globalVars = new Var(varname, state.globalVars)
  }
  function registerVarScoped(varname, context) {
    if (!context) {
      return null
    } else if (context.block) {
      var inner = registerVarScoped(varname, context.prev)
      if (!inner) return null
      if (inner == context.prev) return context
      return new Context(inner, context.vars, true)
    } else if (inList(varname, context.vars)) {
      return context
    } else {
      return new Context(context.prev, new Var(varname, context.vars), false)
    }
  }

  function isModifier(name) {
    return name == "public" || name == "private" || name == "protected" || name == "abstract" || name == "readonly"
  }

  // Combinators

  function Context(prev, vars, block) { this.prev = prev; this.vars = vars; this.block = block }
  function Var(name, next) { this.name = name; this.next = next }

  var defaultVars = new Var("this", new Var("arguments", null))
  function pushcontext() {
    cx.state.context = new Context(cx.state.context, cx.state.localVars, false)
    cx.state.localVars = defaultVars
  }
  function pushblockcontext() {
    cx.state.context = new Context(cx.state.context, cx.state.localVars, true)
    cx.state.localVars = null
  }
  function popcontext() {
    cx.state.localVars = cx.state.context.vars
    cx.state.context = cx.state.context.prev
  }
  popcontext.lex = true
  function pushlex(type, info) {
    var result = function() {
      var state = cx.state, indent = state.indented;
      if (state.lexical.type == "stat") indent = state.lexical.indented;
      else for (var outer = state.lexical; outer && outer.type == ")" && outer.align; outer = outer.prev)
        indent = outer.indented;
      state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
    };
    result.lex = true;
    return result;
  }
  function poplex() {
    var state = cx.state;
    if (state.lexical.prev) {
      if (state.lexical.type == ")")
        state.indented = state.lexical.indented;
      state.lexical = state.lexical.prev;
    }
  }
  poplex.lex = true;

  function expect(wanted) {
    function exp(type) {
      if (type == wanted) return cont();
      else if (wanted == ";" || type == "}" || type == ")" || type == "]") return pass();
      else return cont(exp);
    };
    return exp;
  }

  function statement(type, value) {
    if (type == "var") return cont(pushlex("vardef", value), vardef, expect(";"), poplex);
    if (type == "keyword a") return cont(pushlex("form"), parenExpr, statement, poplex);
    if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
    if (type == "keyword d") return cx.stream.match(/^\s*$/, false) ? cont() : cont(pushlex("stat"), maybeexpression, expect(";"), poplex);
    if (type == "debugger") return cont(expect(";"));
    if (type == "{") return cont(pushlex("}"), pushblockcontext, block, poplex, popcontext);
    if (type == ";") return cont();
    if (type == "if") {
      if (cx.state.lexical.info == "else" && cx.state.cc[cx.state.cc.length - 1] == poplex)
        cx.state.cc.pop()();
      return cont(pushlex("form"), parenExpr, statement, poplex, maybeelse);
    }
    if (type == "function") return cont(functiondef);
    if (type == "for") return cont(pushlex("form"), forspec, statement, poplex);
    if (type == "class" || (isTS && value == "interface")) {
      cx.marked = "keyword"
      return cont(pushlex("form", type == "class" ? type : value), className, poplex)
    }
    if (type == "variable") {
      if (isTS && value == "declare") {
        cx.marked = "keyword"
        return cont(statement)
      } else if (isTS && (value == "module" || value == "enum" || value == "type") && cx.stream.match(/^\s*\w/, false)) {
        cx.marked = "keyword"
        if (value == "enum") return cont(enumdef);
        else if (value == "type") return cont(typename, expect("operator"), typeexpr, expect(";"));
        else return cont(pushlex("form"), pattern, expect("{"), pushlex("}"), block, poplex, poplex)
      } else if (isTS && value == "namespace") {
        cx.marked = "keyword"
        return cont(pushlex("form"), expression, statement, poplex)
      } else if (isTS && value == "abstract") {
        cx.marked = "keyword"
        return cont(statement)
      } else {
        return cont(pushlex("stat"), maybelabel);
      }
    }
    if (type == "switch") return cont(pushlex("form"), parenExpr, expect("{"), pushlex("}", "switch"), pushblockcontext,
                                      block, poplex, poplex, popcontext);
    if (type == "case") return cont(expression, expect(":"));
    if (type == "default") return cont(expect(":"));
    if (type == "catch") return cont(pushlex("form"), pushcontext, maybeCatchBinding, statement, poplex, popcontext);
    if (type == "export") return cont(pushlex("stat"), afterExport, poplex);
    if (type == "import") return cont(pushlex("stat"), afterImport, poplex);
    if (type == "async") return cont(statement)
    if (value == "@") return cont(expression, statement)
    return pass(pushlex("stat"), expression, expect(";"), poplex);
  }
  function maybeCatchBinding(type) {
    if (type == "(") return cont(funarg, expect(")"))
  }
  function expression(type, value) {
    return expressionInner(type, value, false);
  }
  function expressionNoComma(type, value) {
    return expressionInner(type, value, true);
  }
  function parenExpr(type) {
    if (type != "(") return pass()
    return cont(pushlex(")"), expression, expect(")"), poplex)
  }
  function expressionInner(type, value, noComma) {
    if (cx.state.fatArrowAt == cx.stream.start) {
      var body = noComma ? arrowBodyNoComma : arrowBody;
      if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, expect("=>"), body, popcontext);
      else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
    }

    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
    if (type == "function") return cont(functiondef, maybeop);
    if (type == "class" || (isTS && value == "interface")) { cx.marked = "keyword"; return cont(pushlex("form"), classExpression, poplex); }
    if (type == "keyword c" || type == "async") return cont(noComma ? expressionNoComma : expression);
    if (type == "(") return cont(pushlex(")"), maybeexpression, expect(")"), poplex, maybeop);
    if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
    if (type == "[") return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
    if (type == "{") return contCommasep(objprop, "}", null, maybeop);
    if (type == "quasi") return pass(quasi, maybeop);
    if (type == "new") return cont(maybeTarget(noComma));
    if (type == "import") return cont(expression);
    return cont();
  }
  function maybeexpression(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expression);
  }

  function maybeoperatorComma(type, value) {
    if (type == ",") return cont(expression);
    return maybeoperatorNoComma(type, value, false);
  }
  function maybeoperatorNoComma(type, value, noComma) {
    var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
    var expr = noComma == false ? expression : expressionNoComma;
    if (type == "=>") return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
    if (type == "operator") {
      if (/\+\+|--/.test(value) || isTS && value == "!") return cont(me);
      if (isTS && value == "<" && cx.stream.match(/^([^>]|<.*?>)*>\s*\(/, false))
        return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, me);
      if (value == "?") return cont(expression, expect(":"), expr);
      return cont(expr);
    }
    if (type == "quasi") { return pass(quasi, me); }
    if (type == ";") return;
    if (type == "(") return contCommasep(expressionNoComma, ")", "call", me);
    if (type == ".") return cont(property, me);
    if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
    if (isTS && value == "as") { cx.marked = "keyword"; return cont(typeexpr, me) }
    if (type == "regexp") {
      cx.state.lastType = cx.marked = "operator"
      cx.stream.backUp(cx.stream.pos - cx.stream.start - 1)
      return cont(expr)
    }
  }
  function quasi(type, value) {
    if (type != "quasi") return pass();
    if (value.slice(value.length - 2) != "${") return cont(quasi);
    return cont(expression, continueQuasi);
  }
  function continueQuasi(type) {
    if (type == "}") {
      cx.marked = "string-2";
      cx.state.tokenize = tokenQuasi;
      return cont(quasi);
    }
  }
  function arrowBody(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == "{" ? statement : expression);
  }
  function arrowBodyNoComma(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == "{" ? statement : expressionNoComma);
  }
  function maybeTarget(noComma) {
    return function(type) {
      if (type == ".") return cont(noComma ? targetNoComma : target);
      else if (type == "variable" && isTS) return cont(maybeTypeArgs, noComma ? maybeoperatorNoComma : maybeoperatorComma)
      else return pass(noComma ? expressionNoComma : expression);
    };
  }
  function target(_, value) {
    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorComma); }
  }
  function targetNoComma(_, value) {
    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorNoComma); }
  }
  function maybelabel(type) {
    if (type == ":") return cont(poplex, statement);
    return pass(maybeoperatorComma, expect(";"), poplex);
  }
  function property(type) {
    if (type == "variable") {cx.marked = "property"; return cont();}
  }
  function objprop(type, value) {
    if (type == "async") {
      cx.marked = "property";
      return cont(objprop);
    } else if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property";
      if (value == "get" || value == "set") return cont(getterSetter);
      var m // Work around fat-arrow-detection complication for detecting typescript typed arrow params
      if (isTS && cx.state.fatArrowAt == cx.stream.start && (m = cx.stream.match(/^\s*:\s*/, false)))
        cx.state.fatArrowAt = cx.stream.pos + m[0].length
      return cont(afterprop);
    } else if (type == "number" || type == "string") {
      cx.marked = jsonldMode ? "property" : (cx.style + " property");
      return cont(afterprop);
    } else if (type == "jsonld-keyword") {
      return cont(afterprop);
    } else if (isTS && isModifier(value)) {
      cx.marked = "keyword"
      return cont(objprop)
    } else if (type == "[") {
      return cont(expression, maybetype, expect("]"), afterprop);
    } else if (type == "spread") {
      return cont(expressionNoComma, afterprop);
    } else if (value == "*") {
      cx.marked = "keyword";
      return cont(objprop);
    } else if (type == ":") {
      return pass(afterprop)
    }
  }
  function getterSetter(type) {
    if (type != "variable") return pass(afterprop);
    cx.marked = "property";
    return cont(functiondef);
  }
  function afterprop(type) {
    if (type == ":") return cont(expressionNoComma);
    if (type == "(") return pass(functiondef);
  }
  function commasep(what, end, sep) {
    function proceed(type, value) {
      if (sep ? sep.indexOf(type) > -1 : type == ",") {
        var lex = cx.state.lexical;
        if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
        return cont(function(type, value) {
          if (type == end || value == end) return pass()
          return pass(what)
        }, proceed);
      }
      if (type == end || value == end) return cont();
      if (sep && sep.indexOf(";") > -1) return pass(what)
      return cont(expect(end));
    }
    return function(type, value) {
      if (type == end || value == end) return cont();
      return pass(what, proceed);
    };
  }
  function contCommasep(what, end, info) {
    for (var i = 3; i < arguments.length; i++)
      cx.cc.push(arguments[i]);
    return cont(pushlex(end, info), commasep(what, end), poplex);
  }
  function block(type) {
    if (type == "}") return cont();
    return pass(statement, block);
  }
  function maybetype(type, value) {
    if (isTS) {
      if (type == ":" || value == "in") return cont(typeexpr);
      if (value == "?") return cont(maybetype);
    }
  }
  function mayberettype(type) {
    if (isTS && type == ":") {
      if (cx.stream.match(/^\s*\w+\s+is\b/, false)) return cont(expression, isKW, typeexpr)
      else return cont(typeexpr)
    }
  }
  function isKW(_, value) {
    if (value == "is") {
      cx.marked = "keyword"
      return cont()
    }
  }
  function typeexpr(type, value) {
    if (value == "keyof" || value == "typeof" || value == "infer") {
      cx.marked = "keyword"
      return cont(value == "typeof" ? expressionNoComma : typeexpr)
    }
    if (type == "variable" || value == "void") {
      cx.marked = "type"
      return cont(afterType)
    }
    if (value == "|" || value == "&") return cont(typeexpr)
    if (type == "string" || type == "number" || type == "atom") return cont(afterType);
    if (type == "[") return cont(pushlex("]"), commasep(typeexpr, "]", ","), poplex, afterType)
    if (type == "{") return cont(pushlex("}"), commasep(typeprop, "}", ",;"), poplex, afterType)
    if (type == "(") return cont(commasep(typearg, ")"), maybeReturnType, afterType)
    if (type == "<") return cont(commasep(typeexpr, ">"), typeexpr)
  }
  function maybeReturnType(type) {
    if (type == "=>") return cont(typeexpr)
  }
  function typeprop(type, value) {
    if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property"
      return cont(typeprop)
    } else if (value == "?" || type == "number" || type == "string") {
      return cont(typeprop)
    } else if (type == ":") {
      return cont(typeexpr)
    } else if (type == "[") {
      return cont(expect("variable"), maybetype, expect("]"), typeprop)
    } else if (type == "(") {
      return pass(functiondecl, typeprop)
    }
  }
  function typearg(type, value) {
    if (type == "variable" && cx.stream.match(/^\s*[?:]/, false) || value == "?") return cont(typearg)
    if (type == ":") return cont(typeexpr)
    if (type == "spread") return cont(typearg)
    return pass(typeexpr)
  }
  function afterType(type, value) {
    if (value == "<") return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, afterType)
    if (value == "|" || type == "." || value == "&") return cont(typeexpr)
    if (type == "[") return cont(typeexpr, expect("]"), afterType)
    if (value == "extends" || value == "implements") { cx.marked = "keyword"; return cont(typeexpr) }
    if (value == "?") return cont(typeexpr, expect(":"), typeexpr)
  }
  function maybeTypeArgs(_, value) {
    if (value == "<") return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, afterType)
  }
  function typeparam() {
    return pass(typeexpr, maybeTypeDefault)
  }
  function maybeTypeDefault(_, value) {
    if (value == "=") return cont(typeexpr)
  }
  function vardef(_, value) {
    if (value == "enum") {cx.marked = "keyword"; return cont(enumdef)}
    return pass(pattern, maybetype, maybeAssign, vardefCont);
  }
  function pattern(type, value) {
    if (isTS && isModifier(value)) { cx.marked = "keyword"; return cont(pattern) }
    if (type == "variable") { register(value); return cont(); }
    if (type == "spread") return cont(pattern);
    if (type == "[") return contCommasep(eltpattern, "]");
    if (type == "{") return contCommasep(proppattern, "}");
  }
  function proppattern(type, value) {
    if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
      register(value);
      return cont(maybeAssign);
    }
    if (type == "variable") cx.marked = "property";
    if (type == "spread") return cont(pattern);
    if (type == "}") return pass();
    if (type == "[") return cont(expression, expect(']'), expect(':'), proppattern);
    return cont(expect(":"), pattern, maybeAssign);
  }
  function eltpattern() {
    return pass(pattern, maybeAssign)
  }
  function maybeAssign(_type, value) {
    if (value == "=") return cont(expressionNoComma);
  }
  function vardefCont(type) {
    if (type == ",") return cont(vardef);
  }
  function maybeelse(type, value) {
    if (type == "keyword b" && value == "else") return cont(pushlex("form", "else"), statement, poplex);
  }
  function forspec(type, value) {
    if (value == "await") return cont(forspec);
    if (type == "(") return cont(pushlex(")"), forspec1, poplex);
  }
  function forspec1(type) {
    if (type == "var") return cont(vardef, forspec2);
    if (type == "variable") return cont(forspec2);
    return pass(forspec2)
  }
  function forspec2(type, value) {
    if (type == ")") return cont()
    if (type == ";") return cont(forspec2)
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression, forspec2) }
    return pass(expression, forspec2)
  }
  function functiondef(type, value) {
    if (value == "*") {cx.marked = "keyword"; return cont(functiondef);}
    if (type == "variable") {register(value); return cont(functiondef);}
    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, mayberettype, statement, popcontext);
    if (isTS && value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, functiondef)
  }
  function functiondecl(type, value) {
    if (value == "*") {cx.marked = "keyword"; return cont(functiondecl);}
    if (type == "variable") {register(value); return cont(functiondecl);}
    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, mayberettype, popcontext);
    if (isTS && value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, functiondecl)
  }
  function typename(type, value) {
    if (type == "keyword" || type == "variable") {
      cx.marked = "type"
      return cont(typename)
    } else if (value == "<") {
      return cont(pushlex(">"), commasep(typeparam, ">"), poplex)
    }
  }
  function funarg(type, value) {
    if (value == "@") cont(expression, funarg)
    if (type == "spread") return cont(funarg);
    if (isTS && isModifier(value)) { cx.marked = "keyword"; return cont(funarg); }
    if (isTS && type == "this") return cont(maybetype, maybeAssign)
    return pass(pattern, maybetype, maybeAssign);
  }
  function classExpression(type, value) {
    // Class expressions may have an optional name.
    if (type == "variable") return className(type, value);
    return classNameAfter(type, value);
  }
  function className(type, value) {
    if (type == "variable") {register(value); return cont(classNameAfter);}
  }
  function classNameAfter(type, value) {
    if (value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, classNameAfter)
    if (value == "extends" || value == "implements" || (isTS && type == ",")) {
      if (value == "implements") cx.marked = "keyword";
      return cont(isTS ? typeexpr : expression, classNameAfter);
    }
    if (type == "{") return cont(pushlex("}"), classBody, poplex);
  }
  function classBody(type, value) {
    if (type == "async" ||
        (type == "variable" &&
         (value == "static" || value == "get" || value == "set" || (isTS && isModifier(value))) &&
         cx.stream.match(/^\s+[\w$\xa1-\uffff]/, false))) {
      cx.marked = "keyword";
      return cont(classBody);
    }
    if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property";
      return cont(isTS ? classfield : functiondef, classBody);
    }
    if (type == "number" || type == "string") return cont(isTS ? classfield : functiondef, classBody);
    if (type == "[")
      return cont(expression, maybetype, expect("]"), isTS ? classfield : functiondef, classBody)
    if (value == "*") {
      cx.marked = "keyword";
      return cont(classBody);
    }
    if (isTS && type == "(") return pass(functiondecl, classBody)
    if (type == ";" || type == ",") return cont(classBody);
    if (type == "}") return cont();
    if (value == "@") return cont(expression, classBody)
  }
  function classfield(type, value) {
    if (value == "?") return cont(classfield)
    if (type == ":") return cont(typeexpr, maybeAssign)
    if (value == "=") return cont(expressionNoComma)
    var context = cx.state.lexical.prev, isInterface = context && context.info == "interface"
    return pass(isInterface ? functiondecl : functiondef)
  }
  function afterExport(type, value) {
    if (value == "*") { cx.marked = "keyword"; return cont(maybeFrom, expect(";")); }
    if (value == "default") { cx.marked = "keyword"; return cont(expression, expect(";")); }
    if (type == "{") return cont(commasep(exportField, "}"), maybeFrom, expect(";"));
    return pass(statement);
  }
  function exportField(type, value) {
    if (value == "as") { cx.marked = "keyword"; return cont(expect("variable")); }
    if (type == "variable") return pass(expressionNoComma, exportField);
  }
  function afterImport(type) {
    if (type == "string") return cont();
    if (type == "(") return pass(expression);
    return pass(importSpec, maybeMoreImports, maybeFrom);
  }
  function importSpec(type, value) {
    if (type == "{") return contCommasep(importSpec, "}");
    if (type == "variable") register(value);
    if (value == "*") cx.marked = "keyword";
    return cont(maybeAs);
  }
  function maybeMoreImports(type) {
    if (type == ",") return cont(importSpec, maybeMoreImports)
  }
  function maybeAs(_type, value) {
    if (value == "as") { cx.marked = "keyword"; return cont(importSpec); }
  }
  function maybeFrom(_type, value) {
    if (value == "from") { cx.marked = "keyword"; return cont(expression); }
  }
  function arrayLiteral(type) {
    if (type == "]") return cont();
    return pass(commasep(expressionNoComma, "]"));
  }
  function enumdef() {
    return pass(pushlex("form"), pattern, expect("{"), pushlex("}"), commasep(enummember, "}"), poplex, poplex)
  }
  function enummember() {
    return pass(pattern, maybeAssign);
  }

  function isContinuedStatement(state, textAfter) {
    return state.lastType == "operator" || state.lastType == "," ||
      isOperatorChar.test(textAfter.charAt(0)) ||
      /[,.]/.test(textAfter.charAt(0));
  }

  function expressionAllowed(stream, state, backUp) {
    return state.tokenize == tokenBase &&
      /^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(state.lastType) ||
      (state.lastType == "quasi" && /\{\s*$/.test(stream.string.slice(0, stream.pos - (backUp || 0))))
  }

  // Interface

  return {
    startState: function(basecolumn) {
      var state = {
        tokenize: tokenBase,
        lastType: "sof",
        cc: [],
        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
        localVars: parserConfig.localVars,
        context: parserConfig.localVars && new Context(null, null, false),
        indented: basecolumn || 0
      };
      if (parserConfig.globalVars && typeof parserConfig.globalVars == "object")
        state.globalVars = parserConfig.globalVars;
      return state;
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (!state.lexical.hasOwnProperty("align"))
          state.lexical.align = false;
        state.indented = stream.indentation();
        findFatArrow(stream, state);
      }
      if (state.tokenize != tokenComment && stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      if (type == "comment") return style;
      state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
      return parseJS(state, style, type, content, stream);
    },

    indent: function(state, textAfter) {
      if (state.tokenize == tokenComment) return CodeMirror.Pass;
      if (state.tokenize != tokenBase) return 0;
      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical, top
      // Kludge to prevent 'maybelse' from blocking lexical scope pops
      if (!/^\s*else\b/.test(textAfter)) for (var i = state.cc.length - 1; i >= 0; --i) {
        var c = state.cc[i];
        if (c == poplex) lexical = lexical.prev;
        else if (c != maybeelse) break;
      }
      while ((lexical.type == "stat" || lexical.type == "form") &&
             (firstChar == "}" || ((top = state.cc[state.cc.length - 1]) &&
                                   (top == maybeoperatorComma || top == maybeoperatorNoComma) &&
                                   !/^[,\.=+\-*:?[\(]/.test(textAfter))))
        lexical = lexical.prev;
      if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
        lexical = lexical.prev;
      var type = lexical.type, closing = firstChar == type;

      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info.length + 1 : 0);
      else if (type == "form" && firstChar == "{") return lexical.indented;
      else if (type == "form") return lexical.indented + indentUnit;
      else if (type == "stat")
        return lexical.indented + (isContinuedStatement(state, textAfter) ? statementIndent || indentUnit : 0);
      else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
      else if (lexical.align) return lexical.column + (closing ? 0 : 1);
      else return lexical.indented + (closing ? 0 : indentUnit);
    },

    electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
    blockCommentStart: jsonMode ? null : "/*",
    blockCommentEnd: jsonMode ? null : "*/",
    blockCommentContinue: jsonMode ? null : " * ",
    lineComment: jsonMode ? null : "//",
    fold: "brace",
    closeBrackets: "()[]{}''\"\"``",

    helperType: jsonMode ? "json" : "javascript",
    jsonldMode: jsonldMode,
    jsonMode: jsonMode,

    expressionAllowed: expressionAllowed,

    skipExpression: function(state) {
      var top = state.cc[state.cc.length - 1]
      if (top == expression || top == expressionNoComma) state.cc.pop()
    }
  };
});

CodeMirror.registerHelper("wordChars", "javascript", /[\w$]/);

CodeMirror.defineMIME("text/javascript", "javascript");
CodeMirror.defineMIME("text/ecmascript", "javascript");
CodeMirror.defineMIME("application/javascript", "javascript");
CodeMirror.defineMIME("application/x-javascript", "javascript");
CodeMirror.defineMIME("application/ecmascript", "javascript");
CodeMirror.defineMIME("application/json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/x-json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/ld+json", {name: "javascript", jsonld: true});
CodeMirror.defineMIME("text/typescript", { name: "javascript", typescript: true });
CodeMirror.defineMIME("application/typescript", { name: "javascript", typescript: true });

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

define('skylark-codemirror/mode/css/css',["../../CodeMirror"], function(CodeMirror) {
"use strict";

CodeMirror.defineMode("css", function(config, parserConfig) {
  var inline = parserConfig.inline
  if (!parserConfig.propertyKeywords) parserConfig = CodeMirror.resolveMode("text/css");

  var indentUnit = config.indentUnit,
      tokenHooks = parserConfig.tokenHooks,
      documentTypes = parserConfig.documentTypes || {},
      mediaTypes = parserConfig.mediaTypes || {},
      mediaFeatures = parserConfig.mediaFeatures || {},
      mediaValueKeywords = parserConfig.mediaValueKeywords || {},
      propertyKeywords = parserConfig.propertyKeywords || {},
      nonStandardPropertyKeywords = parserConfig.nonStandardPropertyKeywords || {},
      fontProperties = parserConfig.fontProperties || {},
      counterDescriptors = parserConfig.counterDescriptors || {},
      colorKeywords = parserConfig.colorKeywords || {},
      valueKeywords = parserConfig.valueKeywords || {},
      allowNested = parserConfig.allowNested,
      lineComment = parserConfig.lineComment,
      supportsAtComponent = parserConfig.supportsAtComponent === true;

  var type, override;
  function ret(style, tp) { type = tp; return style; }

  // Tokenizers

  function tokenBase(stream, state) {
    var ch = stream.next();
    if (tokenHooks[ch]) {
      var result = tokenHooks[ch](stream, state);
      if (result !== false) return result;
    }
    if (ch == "@") {
      stream.eatWhile(/[\w\\\-]/);
      return ret("def", stream.current());
    } else if (ch == "=" || (ch == "~" || ch == "|") && stream.eat("=")) {
      return ret(null, "compare");
    } else if (ch == "\"" || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == "#") {
      stream.eatWhile(/[\w\\\-]/);
      return ret("atom", "hash");
    } else if (ch == "!") {
      stream.match(/^\s*\w*/);
      return ret("keyword", "important");
    } else if (/\d/.test(ch) || ch == "." && stream.eat(/\d/)) {
      stream.eatWhile(/[\w.%]/);
      return ret("number", "unit");
    } else if (ch === "-") {
      if (/[\d.]/.test(stream.peek())) {
        stream.eatWhile(/[\w.%]/);
        return ret("number", "unit");
      } else if (stream.match(/^-[\w\\\-]*/)) {
        stream.eatWhile(/[\w\\\-]/);
        if (stream.match(/^\s*:/, false))
          return ret("variable-2", "variable-definition");
        return ret("variable-2", "variable");
      } else if (stream.match(/^\w+-/)) {
        return ret("meta", "meta");
      }
    } else if (/[,+>*\/]/.test(ch)) {
      return ret(null, "select-op");
    } else if (ch == "." && stream.match(/^-?[_a-z][_a-z0-9-]*/i)) {
      return ret("qualifier", "qualifier");
    } else if (/[:;{}\[\]\(\)]/.test(ch)) {
      return ret(null, ch);
    } else if (stream.match(/[\w-.]+(?=\()/)) {
      if (/^(url(-prefix)?|domain|regexp)$/.test(stream.current().toLowerCase())) {
        state.tokenize = tokenParenthesized;
      }
      return ret("variable callee", "variable");
    } else if (/[\w\\\-]/.test(ch)) {
      stream.eatWhile(/[\w\\\-]/);
      return ret("property", "word");
    } else {
      return ret(null, null);
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          if (quote == ")") stream.backUp(1);
          break;
        }
        escaped = !escaped && ch == "\\";
      }
      if (ch == quote || !escaped && quote != ")") state.tokenize = null;
      return ret("string", "string");
    };
  }

  function tokenParenthesized(stream, state) {
    stream.next(); // Must be '('
    if (!stream.match(/\s*[\"\')]/, false))
      state.tokenize = tokenString(")");
    else
      state.tokenize = null;
    return ret(null, "(");
  }

  // Context management

  function Context(type, indent, prev) {
    this.type = type;
    this.indent = indent;
    this.prev = prev;
  }

  function pushContext(state, stream, type, indent) {
    state.context = new Context(type, stream.indentation() + (indent === false ? 0 : indentUnit), state.context);
    return type;
  }

  function popContext(state) {
    if (state.context.prev)
      state.context = state.context.prev;
    return state.context.type;
  }

  function pass(type, stream, state) {
    return states[state.context.type](type, stream, state);
  }
  function popAndPass(type, stream, state, n) {
    for (var i = n || 1; i > 0; i--)
      state.context = state.context.prev;
    return pass(type, stream, state);
  }

  // Parser

  function wordAsValue(stream) {
    var word = stream.current().toLowerCase();
    if (valueKeywords.hasOwnProperty(word))
      override = "atom";
    else if (colorKeywords.hasOwnProperty(word))
      override = "keyword";
    else
      override = "variable";
  }

  var states = {};

  states.top = function(type, stream, state) {
    if (type == "{") {
      return pushContext(state, stream, "block");
    } else if (type == "}" && state.context.prev) {
      return popContext(state);
    } else if (supportsAtComponent && /@component/i.test(type)) {
      return pushContext(state, stream, "atComponentBlock");
    } else if (/^@(-moz-)?document$/i.test(type)) {
      return pushContext(state, stream, "documentTypes");
    } else if (/^@(media|supports|(-moz-)?document|import)$/i.test(type)) {
      return pushContext(state, stream, "atBlock");
    } else if (/^@(font-face|counter-style)/i.test(type)) {
      state.stateArg = type;
      return "restricted_atBlock_before";
    } else if (/^@(-(moz|ms|o|webkit)-)?keyframes$/i.test(type)) {
      return "keyframes";
    } else if (type && type.charAt(0) == "@") {
      return pushContext(state, stream, "at");
    } else if (type == "hash") {
      override = "builtin";
    } else if (type == "word") {
      override = "tag";
    } else if (type == "variable-definition") {
      return "maybeprop";
    } else if (type == "interpolation") {
      return pushContext(state, stream, "interpolation");
    } else if (type == ":") {
      return "pseudo";
    } else if (allowNested && type == "(") {
      return pushContext(state, stream, "parens");
    }
    return state.context.type;
  };

  states.block = function(type, stream, state) {
    if (type == "word") {
      var word = stream.current().toLowerCase();
      if (propertyKeywords.hasOwnProperty(word)) {
        override = "property";
        return "maybeprop";
      } else if (nonStandardPropertyKeywords.hasOwnProperty(word)) {
        override = "string-2";
        return "maybeprop";
      } else if (allowNested) {
        override = stream.match(/^\s*:(?:\s|$)/, false) ? "property" : "tag";
        return "block";
      } else {
        override += " error";
        return "maybeprop";
      }
    } else if (type == "meta") {
      return "block";
    } else if (!allowNested && (type == "hash" || type == "qualifier")) {
      override = "error";
      return "block";
    } else {
      return states.top(type, stream, state);
    }
  };

  states.maybeprop = function(type, stream, state) {
    if (type == ":") return pushContext(state, stream, "prop");
    return pass(type, stream, state);
  };

  states.prop = function(type, stream, state) {
    if (type == ";") return popContext(state);
    if (type == "{" && allowNested) return pushContext(state, stream, "propBlock");
    if (type == "}" || type == "{") return popAndPass(type, stream, state);
    if (type == "(") return pushContext(state, stream, "parens");

    if (type == "hash" && !/^#([0-9a-fA-f]{3,4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(stream.current())) {
      override += " error";
    } else if (type == "word") {
      wordAsValue(stream);
    } else if (type == "interpolation") {
      return pushContext(state, stream, "interpolation");
    }
    return "prop";
  };

  states.propBlock = function(type, _stream, state) {
    if (type == "}") return popContext(state);
    if (type == "word") { override = "property"; return "maybeprop"; }
    return state.context.type;
  };

  states.parens = function(type, stream, state) {
    if (type == "{" || type == "}") return popAndPass(type, stream, state);
    if (type == ")") return popContext(state);
    if (type == "(") return pushContext(state, stream, "parens");
    if (type == "interpolation") return pushContext(state, stream, "interpolation");
    if (type == "word") wordAsValue(stream);
    return "parens";
  };

  states.pseudo = function(type, stream, state) {
    if (type == "meta") return "pseudo";

    if (type == "word") {
      override = "variable-3";
      return state.context.type;
    }
    return pass(type, stream, state);
  };

  states.documentTypes = function(type, stream, state) {
    if (type == "word" && documentTypes.hasOwnProperty(stream.current())) {
      override = "tag";
      return state.context.type;
    } else {
      return states.atBlock(type, stream, state);
    }
  };

  states.atBlock = function(type, stream, state) {
    if (type == "(") return pushContext(state, stream, "atBlock_parens");
    if (type == "}" || type == ";") return popAndPass(type, stream, state);
    if (type == "{") return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top");

    if (type == "interpolation") return pushContext(state, stream, "interpolation");

    if (type == "word") {
      var word = stream.current().toLowerCase();
      if (word == "only" || word == "not" || word == "and" || word == "or")
        override = "keyword";
      else if (mediaTypes.hasOwnProperty(word))
        override = "attribute";
      else if (mediaFeatures.hasOwnProperty(word))
        override = "property";
      else if (mediaValueKeywords.hasOwnProperty(word))
        override = "keyword";
      else if (propertyKeywords.hasOwnProperty(word))
        override = "property";
      else if (nonStandardPropertyKeywords.hasOwnProperty(word))
        override = "string-2";
      else if (valueKeywords.hasOwnProperty(word))
        override = "atom";
      else if (colorKeywords.hasOwnProperty(word))
        override = "keyword";
      else
        override = "error";
    }
    return state.context.type;
  };

  states.atComponentBlock = function(type, stream, state) {
    if (type == "}")
      return popAndPass(type, stream, state);
    if (type == "{")
      return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top", false);
    if (type == "word")
      override = "error";
    return state.context.type;
  };

  states.atBlock_parens = function(type, stream, state) {
    if (type == ")") return popContext(state);
    if (type == "{" || type == "}") return popAndPass(type, stream, state, 2);
    return states.atBlock(type, stream, state);
  };

  states.restricted_atBlock_before = function(type, stream, state) {
    if (type == "{")
      return pushContext(state, stream, "restricted_atBlock");
    if (type == "word" && state.stateArg == "@counter-style") {
      override = "variable";
      return "restricted_atBlock_before";
    }
    return pass(type, stream, state);
  };

  states.restricted_atBlock = function(type, stream, state) {
    if (type == "}") {
      state.stateArg = null;
      return popContext(state);
    }
    if (type == "word") {
      if ((state.stateArg == "@font-face" && !fontProperties.hasOwnProperty(stream.current().toLowerCase())) ||
          (state.stateArg == "@counter-style" && !counterDescriptors.hasOwnProperty(stream.current().toLowerCase())))
        override = "error";
      else
        override = "property";
      return "maybeprop";
    }
    return "restricted_atBlock";
  };

  states.keyframes = function(type, stream, state) {
    if (type == "word") { override = "variable"; return "keyframes"; }
    if (type == "{") return pushContext(state, stream, "top");
    return pass(type, stream, state);
  };

  states.at = function(type, stream, state) {
    if (type == ";") return popContext(state);
    if (type == "{" || type == "}") return popAndPass(type, stream, state);
    if (type == "word") override = "tag";
    else if (type == "hash") override = "builtin";
    return "at";
  };

  states.interpolation = function(type, stream, state) {
    if (type == "}") return popContext(state);
    if (type == "{" || type == ";") return popAndPass(type, stream, state);
    if (type == "word") override = "variable";
    else if (type != "variable" && type != "(" && type != ")") override = "error";
    return "interpolation";
  };

  return {
    startState: function(base) {
      return {tokenize: null,
              state: inline ? "block" : "top",
              stateArg: null,
              context: new Context(inline ? "block" : "top", base || 0, null)};
    },

    token: function(stream, state) {
      if (!state.tokenize && stream.eatSpace()) return null;
      var style = (state.tokenize || tokenBase)(stream, state);
      if (style && typeof style == "object") {
        type = style[1];
        style = style[0];
      }
      override = style;
      if (type != "comment")
        state.state = states[state.state](type, stream, state);
      return override;
    },

    indent: function(state, textAfter) {
      var cx = state.context, ch = textAfter && textAfter.charAt(0);
      var indent = cx.indent;
      if (cx.type == "prop" && (ch == "}" || ch == ")")) cx = cx.prev;
      if (cx.prev) {
        if (ch == "}" && (cx.type == "block" || cx.type == "top" ||
                          cx.type == "interpolation" || cx.type == "restricted_atBlock")) {
          // Resume indentation from parent context.
          cx = cx.prev;
          indent = cx.indent;
        } else if (ch == ")" && (cx.type == "parens" || cx.type == "atBlock_parens") ||
            ch == "{" && (cx.type == "at" || cx.type == "atBlock")) {
          // Dedent relative to current context.
          indent = Math.max(0, cx.indent - indentUnit);
        }
      }
      return indent;
    },

    electricChars: "}",
    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    blockCommentContinue: " * ",
    lineComment: lineComment,
    fold: "brace"
  };
});

  function keySet(array) {
    var keys = {};
    for (var i = 0; i < array.length; ++i) {
      keys[array[i].toLowerCase()] = true;
    }
    return keys;
  }

  var documentTypes_ = [
    "domain", "regexp", "url", "url-prefix"
  ], documentTypes = keySet(documentTypes_);

  var mediaTypes_ = [
    "all", "aural", "braille", "handheld", "print", "projection", "screen",
    "tty", "tv", "embossed"
  ], mediaTypes = keySet(mediaTypes_);

  var mediaFeatures_ = [
    "width", "min-width", "max-width", "height", "min-height", "max-height",
    "device-width", "min-device-width", "max-device-width", "device-height",
    "min-device-height", "max-device-height", "aspect-ratio",
    "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio",
    "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color",
    "max-color", "color-index", "min-color-index", "max-color-index",
    "monochrome", "min-monochrome", "max-monochrome", "resolution",
    "min-resolution", "max-resolution", "scan", "grid", "orientation",
    "device-pixel-ratio", "min-device-pixel-ratio", "max-device-pixel-ratio",
    "pointer", "any-pointer", "hover", "any-hover"
  ], mediaFeatures = keySet(mediaFeatures_);

  var mediaValueKeywords_ = [
    "landscape", "portrait", "none", "coarse", "fine", "on-demand", "hover",
    "interlace", "progressive"
  ], mediaValueKeywords = keySet(mediaValueKeywords_);

  var propertyKeywords_ = [
    "align-content", "align-items", "align-self", "alignment-adjust",
    "alignment-baseline", "anchor-point", "animation", "animation-delay",
    "animation-direction", "animation-duration", "animation-fill-mode",
    "animation-iteration-count", "animation-name", "animation-play-state",
    "animation-timing-function", "appearance", "azimuth", "backface-visibility",
    "background", "background-attachment", "background-blend-mode", "background-clip",
    "background-color", "background-image", "background-origin", "background-position",
    "background-repeat", "background-size", "baseline-shift", "binding",
    "bleed", "bookmark-label", "bookmark-level", "bookmark-state",
    "bookmark-target", "border", "border-bottom", "border-bottom-color",
    "border-bottom-left-radius", "border-bottom-right-radius",
    "border-bottom-style", "border-bottom-width", "border-collapse",
    "border-color", "border-image", "border-image-outset",
    "border-image-repeat", "border-image-slice", "border-image-source",
    "border-image-width", "border-left", "border-left-color",
    "border-left-style", "border-left-width", "border-radius", "border-right",
    "border-right-color", "border-right-style", "border-right-width",
    "border-spacing", "border-style", "border-top", "border-top-color",
    "border-top-left-radius", "border-top-right-radius", "border-top-style",
    "border-top-width", "border-width", "bottom", "box-decoration-break",
    "box-shadow", "box-sizing", "break-after", "break-before", "break-inside",
    "caption-side", "caret-color", "clear", "clip", "color", "color-profile", "column-count",
    "column-fill", "column-gap", "column-rule", "column-rule-color",
    "column-rule-style", "column-rule-width", "column-span", "column-width",
    "columns", "content", "counter-increment", "counter-reset", "crop", "cue",
    "cue-after", "cue-before", "cursor", "direction", "display",
    "dominant-baseline", "drop-initial-after-adjust",
    "drop-initial-after-align", "drop-initial-before-adjust",
    "drop-initial-before-align", "drop-initial-size", "drop-initial-value",
    "elevation", "empty-cells", "fit", "fit-position", "flex", "flex-basis",
    "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap",
    "float", "float-offset", "flow-from", "flow-into", "font", "font-feature-settings",
    "font-family", "font-kerning", "font-language-override", "font-size", "font-size-adjust",
    "font-stretch", "font-style", "font-synthesis", "font-variant",
    "font-variant-alternates", "font-variant-caps", "font-variant-east-asian",
    "font-variant-ligatures", "font-variant-numeric", "font-variant-position",
    "font-weight", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow",
    "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-gap",
    "grid-column-start", "grid-gap", "grid-row", "grid-row-end", "grid-row-gap",
    "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns",
    "grid-template-rows", "hanging-punctuation", "height", "hyphens",
    "icon", "image-orientation", "image-rendering", "image-resolution",
    "inline-box-align", "justify-content", "justify-items", "justify-self", "left", "letter-spacing",
    "line-break", "line-height", "line-stacking", "line-stacking-ruby",
    "line-stacking-shift", "line-stacking-strategy", "list-style",
    "list-style-image", "list-style-position", "list-style-type", "margin",
    "margin-bottom", "margin-left", "margin-right", "margin-top",
    "marks", "marquee-direction", "marquee-loop",
    "marquee-play-count", "marquee-speed", "marquee-style", "max-height",
    "max-width", "min-height", "min-width", "mix-blend-mode", "move-to", "nav-down", "nav-index",
    "nav-left", "nav-right", "nav-up", "object-fit", "object-position",
    "opacity", "order", "orphans", "outline",
    "outline-color", "outline-offset", "outline-style", "outline-width",
    "overflow", "overflow-style", "overflow-wrap", "overflow-x", "overflow-y",
    "padding", "padding-bottom", "padding-left", "padding-right", "padding-top",
    "page", "page-break-after", "page-break-before", "page-break-inside",
    "page-policy", "pause", "pause-after", "pause-before", "perspective",
    "perspective-origin", "pitch", "pitch-range", "place-content", "place-items", "place-self", "play-during", "position",
    "presentation-level", "punctuation-trim", "quotes", "region-break-after",
    "region-break-before", "region-break-inside", "region-fragment",
    "rendering-intent", "resize", "rest", "rest-after", "rest-before", "richness",
    "right", "rotation", "rotation-point", "ruby-align", "ruby-overhang",
    "ruby-position", "ruby-span", "shape-image-threshold", "shape-inside", "shape-margin",
    "shape-outside", "size", "speak", "speak-as", "speak-header",
    "speak-numeral", "speak-punctuation", "speech-rate", "stress", "string-set",
    "tab-size", "table-layout", "target", "target-name", "target-new",
    "target-position", "text-align", "text-align-last", "text-decoration",
    "text-decoration-color", "text-decoration-line", "text-decoration-skip",
    "text-decoration-style", "text-emphasis", "text-emphasis-color",
    "text-emphasis-position", "text-emphasis-style", "text-height",
    "text-indent", "text-justify", "text-outline", "text-overflow", "text-shadow",
    "text-size-adjust", "text-space-collapse", "text-transform", "text-underline-position",
    "text-wrap", "top", "transform", "transform-origin", "transform-style",
    "transition", "transition-delay", "transition-duration",
    "transition-property", "transition-timing-function", "unicode-bidi",
    "user-select", "vertical-align", "visibility", "voice-balance", "voice-duration",
    "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress",
    "voice-volume", "volume", "white-space", "widows", "width", "will-change", "word-break",
    "word-spacing", "word-wrap", "z-index",
    // SVG-specific
    "clip-path", "clip-rule", "mask", "enable-background", "filter", "flood-color",
    "flood-opacity", "lighting-color", "stop-color", "stop-opacity", "pointer-events",
    "color-interpolation", "color-interpolation-filters",
    "color-rendering", "fill", "fill-opacity", "fill-rule", "image-rendering",
    "marker", "marker-end", "marker-mid", "marker-start", "shape-rendering", "stroke",
    "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin",
    "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-rendering",
    "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal",
    "glyph-orientation-vertical", "text-anchor", "writing-mode"
  ], propertyKeywords = keySet(propertyKeywords_);

  var nonStandardPropertyKeywords_ = [
    "scrollbar-arrow-color", "scrollbar-base-color", "scrollbar-dark-shadow-color",
    "scrollbar-face-color", "scrollbar-highlight-color", "scrollbar-shadow-color",
    "scrollbar-3d-light-color", "scrollbar-track-color", "shape-inside",
    "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button",
    "searchfield-results-decoration", "zoom"
  ], nonStandardPropertyKeywords = keySet(nonStandardPropertyKeywords_);

  var fontProperties_ = [
    "font-family", "src", "unicode-range", "font-variant", "font-feature-settings",
    "font-stretch", "font-weight", "font-style"
  ], fontProperties = keySet(fontProperties_);

  var counterDescriptors_ = [
    "additive-symbols", "fallback", "negative", "pad", "prefix", "range",
    "speak-as", "suffix", "symbols", "system"
  ], counterDescriptors = keySet(counterDescriptors_);

  var colorKeywords_ = [
    "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige",
    "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown",
    "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue",
    "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod",
    "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen",
    "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen",
    "darkslateblue", "darkslategray", "darkturquoise", "darkviolet",
    "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick",
    "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite",
    "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew",
    "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender",
    "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral",
    "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink",
    "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray",
    "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta",
    "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple",
    "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise",
    "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin",
    "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered",
    "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred",
    "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue",
    "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown",
    "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue",
    "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan",
    "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white",
    "whitesmoke", "yellow", "yellowgreen"
  ], colorKeywords = keySet(colorKeywords_);

  var valueKeywords_ = [
    "above", "absolute", "activeborder", "additive", "activecaption", "afar",
    "after-white-space", "ahead", "alias", "all", "all-scroll", "alphabetic", "alternate",
    "always", "amharic", "amharic-abegede", "antialiased", "appworkspace",
    "arabic-indic", "armenian", "asterisks", "attr", "auto", "auto-flow", "avoid", "avoid-column", "avoid-page",
    "avoid-region", "background", "backwards", "baseline", "below", "bidi-override", "binary",
    "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box",
    "both", "bottom", "break", "break-all", "break-word", "bullets", "button", "button-bevel",
    "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "calc", "cambodian",
    "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret",
    "cell", "center", "checkbox", "circle", "cjk-decimal", "cjk-earthly-branch",
    "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote",
    "col-resize", "collapse", "color", "color-burn", "color-dodge", "column", "column-reverse",
    "compact", "condensed", "contain", "content", "contents",
    "content-box", "context-menu", "continuous", "copy", "counter", "counters", "cover", "crop",
    "cross", "crosshair", "currentcolor", "cursive", "cyclic", "darken", "dashed", "decimal",
    "decimal-leading-zero", "default", "default-button", "dense", "destination-atop",
    "destination-in", "destination-out", "destination-over", "devanagari", "difference",
    "disc", "discard", "disclosure-closed", "disclosure-open", "document",
    "dot-dash", "dot-dot-dash",
    "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out",
    "element", "ellipse", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede",
    "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er",
    "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er",
    "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et",
    "ethiopic-halehame-gez", "ethiopic-halehame-om-et",
    "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et",
    "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig",
    "ethiopic-numeric", "ew-resize", "exclusion", "expanded", "extends", "extra-condensed",
    "extra-expanded", "fantasy", "fast", "fill", "fixed", "flat", "flex", "flex-end", "flex-start", "footnotes",
    "forwards", "from", "geometricPrecision", "georgian", "graytext", "grid", "groove",
    "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hard-light", "hebrew",
    "help", "hidden", "hide", "higher", "highlight", "highlighttext",
    "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "hue", "icon", "ignore",
    "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite",
    "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis",
    "inline-block", "inline-flex", "inline-grid", "inline-table", "inset", "inside", "intrinsic", "invert",
    "italic", "japanese-formal", "japanese-informal", "justify", "kannada",
    "katakana", "katakana-iroha", "keep-all", "khmer",
    "korean-hangul-formal", "korean-hanja-formal", "korean-hanja-informal",
    "landscape", "lao", "large", "larger", "left", "level", "lighter", "lighten",
    "line-through", "linear", "linear-gradient", "lines", "list-item", "listbox", "listitem",
    "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian",
    "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian",
    "lower-roman", "lowercase", "ltr", "luminosity", "malayalam", "match", "matrix", "matrix3d",
    "media-controls-background", "media-current-time-display",
    "media-fullscreen-button", "media-mute-button", "media-play-button",
    "media-return-to-realtime-button", "media-rewind-button",
    "media-seek-back-button", "media-seek-forward-button", "media-slider",
    "media-sliderthumb", "media-time-remaining-display", "media-volume-slider",
    "media-volume-slider-container", "media-volume-sliderthumb", "medium",
    "menu", "menulist", "menulist-button", "menulist-text",
    "menulist-textfield", "menutext", "message-box", "middle", "min-intrinsic",
    "mix", "mongolian", "monospace", "move", "multiple", "multiply", "myanmar", "n-resize",
    "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop",
    "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap",
    "ns-resize", "numbers", "numeric", "nw-resize", "nwse-resize", "oblique", "octal", "opacity", "open-quote",
    "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset",
    "outside", "outside-shape", "overlay", "overline", "padding", "padding-box",
    "painted", "page", "paused", "persian", "perspective", "plus-darker", "plus-lighter",
    "pointer", "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d",
    "progress", "push-button", "radial-gradient", "radio", "read-only",
    "read-write", "read-write-plaintext-only", "rectangle", "region",
    "relative", "repeat", "repeating-linear-gradient",
    "repeating-radial-gradient", "repeat-x", "repeat-y", "reset", "reverse",
    "rgb", "rgba", "ridge", "right", "rotate", "rotate3d", "rotateX", "rotateY",
    "rotateZ", "round", "row", "row-resize", "row-reverse", "rtl", "run-in", "running",
    "s-resize", "sans-serif", "saturation", "scale", "scale3d", "scaleX", "scaleY", "scaleZ", "screen",
    "scroll", "scrollbar", "scroll-position", "se-resize", "searchfield",
    "searchfield-cancel-button", "searchfield-decoration",
    "searchfield-results-button", "searchfield-results-decoration", "self-start", "self-end",
    "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama",
    "simp-chinese-formal", "simp-chinese-informal", "single",
    "skew", "skewX", "skewY", "skip-white-space", "slide", "slider-horizontal",
    "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow",
    "small", "small-caps", "small-caption", "smaller", "soft-light", "solid", "somali",
    "source-atop", "source-in", "source-out", "source-over", "space", "space-around", "space-between", "space-evenly", "spell-out", "square",
    "square-button", "start", "static", "status-bar", "stretch", "stroke", "sub",
    "subpixel-antialiased", "super", "sw-resize", "symbolic", "symbols", "system-ui", "table",
    "table-caption", "table-cell", "table-column", "table-column-group",
    "table-footer-group", "table-header-group", "table-row", "table-row-group",
    "tamil",
    "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai",
    "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight",
    "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er",
    "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top",
    "trad-chinese-formal", "trad-chinese-informal", "transform",
    "translate", "translate3d", "translateX", "translateY", "translateZ",
    "transparent", "ultra-condensed", "ultra-expanded", "underline", "unset", "up",
    "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal",
    "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url",
    "var", "vertical", "vertical-text", "visible", "visibleFill", "visiblePainted",
    "visibleStroke", "visual", "w-resize", "wait", "wave", "wider",
    "window", "windowframe", "windowtext", "words", "wrap", "wrap-reverse", "x-large", "x-small", "xor",
    "xx-large", "xx-small"
  ], valueKeywords = keySet(valueKeywords_);

  var allWords = documentTypes_.concat(mediaTypes_).concat(mediaFeatures_).concat(mediaValueKeywords_)
    .concat(propertyKeywords_).concat(nonStandardPropertyKeywords_).concat(colorKeywords_)
    .concat(valueKeywords_);
  CodeMirror.registerHelper("hintWords", "css", allWords);

  function tokenCComment(stream, state) {
    var maybeEnd = false, ch;
    while ((ch = stream.next()) != null) {
      if (maybeEnd && ch == "/") {
        state.tokenize = null;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ["comment", "comment"];
  }

  CodeMirror.defineMIME("text/css", {
    documentTypes: documentTypes,
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    fontProperties: fontProperties,
    counterDescriptors: counterDescriptors,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    tokenHooks: {
      "/": function(stream, state) {
        if (!stream.eat("*")) return false;
        state.tokenize = tokenCComment;
        return tokenCComment(stream, state);
      }
    },
    name: "css"
  });

  CodeMirror.defineMIME("text/x-scss", {
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    fontProperties: fontProperties,
    allowNested: true,
    lineComment: "//",
    tokenHooks: {
      "/": function(stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      ":": function(stream) {
        if (stream.match(/\s*\{/, false))
          return [null, null]
        return false;
      },
      "$": function(stream) {
        stream.match(/^[\w-]+/);
        if (stream.match(/^\s*:/, false))
          return ["variable-2", "variable-definition"];
        return ["variable-2", "variable"];
      },
      "#": function(stream) {
        if (!stream.eat("{")) return false;
        return [null, "interpolation"];
      }
    },
    name: "css",
    helperType: "scss"
  });

  CodeMirror.defineMIME("text/x-less", {
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    fontProperties: fontProperties,
    allowNested: true,
    lineComment: "//",
    tokenHooks: {
      "/": function(stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      "@": function(stream) {
        if (stream.eat("{")) return [null, "interpolation"];
        if (stream.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/i, false)) return false;
        stream.eatWhile(/[\w\\\-]/);
        if (stream.match(/^\s*:/, false))
          return ["variable-2", "variable-definition"];
        return ["variable-2", "variable"];
      },
      "&": function() {
        return ["atom", "atom"];
      }
    },
    name: "css",
    helperType: "less"
  });

  CodeMirror.defineMIME("text/x-gss", {
    documentTypes: documentTypes,
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    fontProperties: fontProperties,
    counterDescriptors: counterDescriptors,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    supportsAtComponent: true,
    tokenHooks: {
      "/": function(stream, state) {
        if (!stream.eat("*")) return false;
        state.tokenize = tokenCComment;
        return tokenCComment(stream, state);
      }
    },
    name: "css",
    helperType: "gss"
  });

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE


define('skylark-codemirror/mode/htmlmixed/htmlmixed',[
  "../../CodeMirror",
  "../xml/xml",
  "../javascript/javascript",
  "../css/css"
], function(CodeMirror) {

  "use strict";

  var defaultTags = {
    script: [
      ["lang", /(javascript|babel)/i, "javascript"],
      ["type", /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i, "javascript"],
      ["type", /./, "text/plain"],
      [null, null, "javascript"]
    ],
    style:  [
      ["lang", /^css$/i, "css"],
      ["type", /^(text\/)?(x-)?(stylesheet|css)$/i, "css"],
      ["type", /./, "text/plain"],
      [null, null, "css"]
    ]
  };

  function maybeBackup(stream, pat, style) {
    var cur = stream.current(), close = cur.search(pat);
    if (close > -1) {
      stream.backUp(cur.length - close);
    } else if (cur.match(/<\/?$/)) {
      stream.backUp(cur.length);
      if (!stream.match(pat, false)) stream.match(cur);
    }
    return style;
  }

  var attrRegexpCache = {};
  function getAttrRegexp(attr) {
    var regexp = attrRegexpCache[attr];
    if (regexp) return regexp;
    return attrRegexpCache[attr] = new RegExp("\\s+" + attr + "\\s*=\\s*('|\")?([^'\"]+)('|\")?\\s*");
  }

  function getAttrValue(text, attr) {
    var match = text.match(getAttrRegexp(attr))
    return match ? /^\s*(.*?)\s*$/.exec(match[2])[1] : ""
  }

  function getTagRegexp(tagName, anchored) {
    return new RegExp((anchored ? "^" : "") + "<\/\s*" + tagName + "\s*>", "i");
  }

  function addTags(from, to) {
    for (var tag in from) {
      var dest = to[tag] || (to[tag] = []);
      var source = from[tag];
      for (var i = source.length - 1; i >= 0; i--)
        dest.unshift(source[i])
    }
  }

  function findMatchingMode(tagInfo, tagText) {
    for (var i = 0; i < tagInfo.length; i++) {
      var spec = tagInfo[i];
      if (!spec[0] || spec[1].test(getAttrValue(tagText, spec[0]))) return spec[2];
    }
  }

  CodeMirror.defineMode("htmlmixed", function (config, parserConfig) {
    var htmlMode = CodeMirror.getMode(config, {
      name: "xml",
      htmlMode: true,
      multilineTagIndentFactor: parserConfig.multilineTagIndentFactor,
      multilineTagIndentPastTag: parserConfig.multilineTagIndentPastTag
    });

    var tags = {};
    var configTags = parserConfig && parserConfig.tags, configScript = parserConfig && parserConfig.scriptTypes;
    addTags(defaultTags, tags);
    if (configTags) addTags(configTags, tags);
    if (configScript) for (var i = configScript.length - 1; i >= 0; i--)
      tags.script.unshift(["type", configScript[i].matches, configScript[i].mode])

    function html(stream, state) {
      var style = htmlMode.token(stream, state.htmlState), tag = /\btag\b/.test(style), tagName
      if (tag && !/[<>\s\/]/.test(stream.current()) &&
          (tagName = state.htmlState.tagName && state.htmlState.tagName.toLowerCase()) &&
          tags.hasOwnProperty(tagName)) {
        state.inTag = tagName + " "
      } else if (state.inTag && tag && />$/.test(stream.current())) {
        var inTag = /^([\S]+) (.*)/.exec(state.inTag)
        state.inTag = null
        var modeSpec = stream.current() == ">" && findMatchingMode(tags[inTag[1]], inTag[2])
        var mode = CodeMirror.getMode(config, modeSpec)
        var endTagA = getTagRegexp(inTag[1], true), endTag = getTagRegexp(inTag[1], false);
        state.token = function (stream, state) {
          if (stream.match(endTagA, false)) {
            state.token = html;
            state.localState = state.localMode = null;
            return null;
          }
          return maybeBackup(stream, endTag, state.localMode.token(stream, state.localState));
        };
        state.localMode = mode;
        state.localState = CodeMirror.startState(mode, htmlMode.indent(state.htmlState, "", ""));
      } else if (state.inTag) {
        state.inTag += stream.current()
        if (stream.eol()) state.inTag += " "
      }
      return style;
    };

    return {
      startState: function () {
        var state = CodeMirror.startState(htmlMode);
        return {token: html, inTag: null, localMode: null, localState: null, htmlState: state};
      },

      copyState: function (state) {
        var local;
        if (state.localState) {
          local = CodeMirror.copyState(state.localMode, state.localState);
        }
        return {token: state.token, inTag: state.inTag,
                localMode: state.localMode, localState: local,
                htmlState: CodeMirror.copyState(htmlMode, state.htmlState)};
      },

      token: function (stream, state) {
        return state.token(stream, state);
      },

      indent: function (state, textAfter, line) {
        if (!state.localMode || /^\s*<\//.test(textAfter))
          return htmlMode.indent(state.htmlState, textAfter, line);
        else if (state.localMode.indent)
          return state.localMode.indent(state.localState, textAfter, line);
        else
          return CodeMirror.Pass;
      },

      innerMode: function (state) {
        return {state: state.localState || state.htmlState, mode: state.localMode || htmlMode};
      }
    };
  }, "xml", "javascript", "css");

  CodeMirror.defineMIME("text/html", "htmlmixed");
});

define('skylark-grapejs/code_manager/model/formating',[
    "skylark-codemirror/CodeMirror"
], function (CodeMirror) {

  CodeMirror.extendMode("css", {
    commentStart: "/*",
    commentEnd: "*/",
    newlineAfterToken: function(_type, content) {
      return /^[;{}]$/.test(content);
    }
  });

  CodeMirror.extendMode("javascript", {
    commentStart: "/*",
    commentEnd: "*/",
    // FIXME semicolons inside of for
    newlineAfterToken: function(_type, content, textAfter, state) {
      if (this.jsonMode) {
        return /^[\[,{]$/.test(content) || /^}/.test(textAfter);
      } else {
        if (content == ";" && state.lexical && state.lexical.type == ")") return false;
        return /^[;{}]$/.test(content) && !/^;/.test(textAfter);
      }
    }
  });

  var inlineElements = /^(a|abbr|acronym|area|base|bdo|big|br|button|caption|cite|code|col|colgroup|dd|del|dfn|em|frame|hr|iframe|img|input|ins|kbd|label|legend|link|map|object|optgroup|option|param|q|samp|script|select|small|span|strong|sub|sup|textarea|tt|var)$/;

  CodeMirror.extendMode("xml", {
    commentStart: "<!--",
    commentEnd: "-->",
    newlineAfterToken: function(type, content, textAfter, state) {
      var inline = false;
      if (this.configuration == "html")
        inline = state.context ? inlineElements.test(state.context.tagName) : false;
      return !inline && ((type == "tag" && />$/.test(content) && state.context) ||
                         /^</.test(textAfter));
    }
  });

  // Comment/uncomment the specified range
  CodeMirror.defineExtension("commentRange", function (isComment, from, to) {
    var cm = this, curMode = CodeMirror.innerMode(cm.getMode(), cm.getTokenAt(from).state).mode;
    cm.operation(function() {
      if (isComment) { // Comment range
        cm.replaceRange(curMode.commentEnd, to);
        cm.replaceRange(curMode.commentStart, from);
        if (from.line == to.line && from.ch == to.ch) // An empty comment inserted - put cursor inside
          cm.setCursor(from.line, from.ch + curMode.commentStart.length);
      } else { // Uncomment range
        var selText = cm.getRange(from, to);
        var startIndex = selText.indexOf(curMode.commentStart);
        var endIndex = selText.lastIndexOf(curMode.commentEnd);
        if (startIndex > -1 && endIndex > -1 && endIndex > startIndex) {
          // Take string till comment start
          selText = selText.substr(0, startIndex) +
          // From comment start till comment end
             selText.substring(startIndex + curMode.commentStart.length, endIndex) +
          // From comment end till string end
             selText.substr(endIndex + curMode.commentEnd.length);
        }
        cm.replaceRange(selText, from, to);
      }
    });
  });

  // Applies automatic mode-aware indentation to the specified range
  CodeMirror.defineExtension("autoIndentRange", function (from, to) {
    var cmInstance = this;
    this.operation(function () {
      for (var i = from.line; i <= to.line; i++) {
        cmInstance.indentLine(i, "smart");
      }
    });
  });

  // Applies automatic formatting to the specified range
  CodeMirror.defineExtension("autoFormatRange", function (from, to) {
    var cm = this;
    var outer = cm.getMode(), text = cm.getRange(from, to).split("\n");
    var state = CodeMirror.copyState(outer, cm.getTokenAt(from).state);
    var tabSize = cm.getOption("tabSize");

    var out = "", lines = 0, atSol = from.ch === 0;
    function newline() {
      out += "\n";
      atSol = true;
      ++lines;
    }

    for (var i = 0; i < text.length; ++i) {
      var stream = new CodeMirror.StringStream(text[i], tabSize);
      while (!stream.eol()) {
        var inner = CodeMirror.innerMode(outer, state);
        var style = outer.token(stream, state), cur = stream.current();
        stream.start = stream.pos;
        if (!atSol || /\S/.test(cur)) {
          out += cur;
          atSol = false;
        }
        if (!atSol && inner.mode.newlineAfterToken &&
            inner.mode.newlineAfterToken(style, cur, stream.string.slice(stream.pos) || text[i+1] || "", inner.state))
          newline();
      }
      if (!stream.pos && outer.blankLine) outer.blankLine(state);
      if (!atSol && i < text.length - 1) newline();
    }

    cm.operation(function () {
      cm.replaceRange(out, from, to);
      for (var cur = from.line + 1, end = from.line + lines; cur <= end; ++cur)
        cm.indentLine(cur, "smart");
      cm.setSelection(from, cm.getCursor(false));
    });
  });
});

define('skylark-grapejs/code_manager/model/CodeMirrorEditor',[
    'skylark-underscore',
    'skylark-backbone',
    "skylark-codemirror/CodeMirror",
    'skylark-codemirror/mode/htmlmixed/htmlmixed',
    'skylark-codemirror/mode/css/css',
    './formating'
], function (a, Backbone, CodeMirror) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            input: '',
            label: '',
            codeName: '',
            theme: 'hopscotch',
            readOnly: true,
            lineNumbers: true
        },
        init(el) {
            a.bindAll(this, 'onChange');
            this.editor = CodeMirror.fromTextArea(el, {
                dragDrop: false,
                lineWrapping: true,
                mode: this.get('codeName'),
                ...this.attributes
            });
            this.element = el;
            this.editor.on('change', this.onChange);
            return this;
        },
        onChange() {
            this.trigger('update', this);
        },
        getEditor() {
            return this.editor;
        },
        getElement() {
            return this.element;
        },
        setElement(el) {
            this.element = el;
            return this;
        },
        refresh() {
            this.getEditor().refresh();
            return this;
        },
        focus() {
            this.getEditor().focus();
            return this;
        },
        getContent() {
            const ed = this.getEditor();
            return ed && ed.getValue();
        },
        setContent(v, opts = {}) {
            const {editor} = this;
            if (!editor)
                return;
            editor.setValue(v);
            if (editor.autoFormatRange) {
                CodeMirror.commands.selectAll(editor);
                editor.autoFormatRange(editor.getCursor(true), editor.getCursor(false));
                CodeMirror.commands.goDocStart(editor);
            }
            !opts.noRefresh && setTimeout(() => this.refresh());
        }
    });
});
define('skylark-grapejs/code_manager/view/EditorView',[
    'skylark-underscore',
    'skylark-backbone'
], function (_, Backbone) {
    'use strict';
    return Backbone.View.extend({
        template: _.template(`
  <div class="<%= pfx %>editor" id="<%= pfx %><%= codeName %>">
  	<div id="<%= pfx %>title"><%= label %></div>
  	<div id="<%= pfx %>code"></div>
  </div>`),
        initialize(o) {
            this.config = o.config || {};
            this.pfx = this.config.stylePrefix;
        },
        render() {
            var obj = this.model.toJSON();
            obj.pfx = this.pfx;
            this.$el.html(this.template(obj));
            this.$el.attr('class', this.pfx + 'editor-c');
            this.$el.find('#' + this.pfx + 'code').append(this.model.get('input'));
            return this;
        }
    });
});
define('skylark-grapejs/code_manager/index',[
    'skylark-underscore',
    './config/config',
    './model/HtmlGenerator',
    './model/CssGenerator',
    './model/JsonGenerator',
    './model/JsGenerator',
    './model/CodeMirrorEditor',
    './view/EditorView'
], function (a, defaults, gHtml, gCss, gJson, gJs, eCM, editorView) {
    'use strict';
    return () => {
        var c = {};
        var generators = {}, defGenerators = {}, viewers = {}, defViewers = {};
        const defaultViewer = 'CodeMirror';
        return {
            getConfig() {
                return c;
            },
            config: c,
            EditorView: editorView,
            name: 'CodeManager',
            init(config) {
                c = config || {};
                for (var name in defaults) {
                    if (!(name in c))
                        c[name] = defaults[name];
                }
                var ppfx = c.pStylePrefix;
                if (ppfx)
                    c.stylePrefix = ppfx + c.stylePrefix;
                defGenerators.html = new gHtml();
                defGenerators.css = new gCss();
                defGenerators.json = new gJson();
                defGenerators.js = new gJs();
                defViewers.CodeMirror = new eCM();
                this.loadDefaultGenerators().loadDefaultViewers();
                return this;
            },
            addGenerator(id, generator) {
                generators[id] = generator;
                return this;
            },
            getGenerator(id) {
                return generators[id] || null;
            },
            getGenerators() {
                return generators;
            },
            addViewer(id, viewer) {
                viewers[id] = viewer;
                return this;
            },
            getViewer(id) {
                return viewers[id] || null;
            },
            getViewers() {
                return viewers;
            },
            createViewer(opts = {}) {
                const type = !a.isUndefined(opts.type) ? opts.type : defaultViewer;
                const viewer = this.getViewer(type) && this.getViewer(type).clone();
                const cont = document.createElement('div');
                const txtarea = document.createElement('textarea');
                cont.appendChild(txtarea);
                viewer.set(opts);
                viewer.init(txtarea);
                viewer.setElement(cont);
                return viewer;
            },
            updateViewer(viewer, code) {
                viewer.setContent(code);
            },
            getCode(model, genId, opt = {}) {
                opt.em = c.em;
                var generator = this.getGenerator(genId);
                return generator ? generator.build(model, opt) : '';
            },
            loadDefaultGenerators() {
                for (var id in defGenerators)
                    this.addGenerator(id, defGenerators[id]);
                return this;
            },
            loadDefaultViewers() {
                for (var id in defViewers)
                    this.addViewer(id, defViewers[id]);
                return this;
            }
        };
    };
});
define('skylark-grapejs/panels/config/config',[],function () {
    'use strict';
    const swv = 'sw-visibility';
    const expt = 'export-template';
    const osm = 'open-sm';
    const otm = 'open-tm';
    const ola = 'open-layers';
    const obl = 'open-blocks';
    const ful = 'fullscreen';
    const prv = 'preview';
    return {
        stylePrefix: 'pn-',
        defaults: [
            {
                id: 'commands',
                buttons: [{}]
            },
            {
                id: 'options',
                buttons: [
                    {
                        active: true,
                        id: swv,
                        className: 'fa fa-square-o',
                        command: swv,
                        context: swv,
                        attributes: { title: 'View components' }
                    },
                    {
                        id: prv,
                        className: 'fa fa-eye',
                        command: prv,
                        context: prv,
                        attributes: { title: 'Preview' }
                    },
                    {
                        id: ful,
                        className: 'fa fa-arrows-alt',
                        command: ful,
                        context: ful,
                        attributes: { title: 'Fullscreen' }
                    },
                    {
                        id: expt,
                        className: 'fa fa-code',
                        command: expt,
                        attributes: { title: 'View code' }
                    }
                ]
            },
            {
                id: 'views',
                buttons: [
                    {
                        id: osm,
                        className: 'fa fa-paint-brush',
                        command: osm,
                        active: true,
                        togglable: 0,
                        attributes: { title: 'Open Style Manager' }
                    },
                    {
                        id: otm,
                        className: 'fa fa-cog',
                        command: otm,
                        togglable: 0,
                        attributes: { title: 'Settings' }
                    },
                    {
                        id: ola,
                        className: 'fa fa-bars',
                        command: ola,
                        togglable: 0,
                        attributes: { title: 'Open Layer Manager' }
                    },
                    {
                        id: obl,
                        className: 'fa fa-th-large',
                        command: obl,
                        togglable: 0,
                        attributes: { title: 'Open Blocks' }
                    }
                ]
            }
        ],
        em: null,
        delayBtnsShow: 300
    };
});
define('skylark-grapejs/panels/model/Button',['skylark-backbone'], function (Backbone) {
    'use strict';
    var Button =  Backbone.Model.extend({
        defaults: {
            id: '',
            label: '',
            tagName: 'span',
            className: '',
            command: '',
            context: '',
            buttons: [],
            attributes: {},
            options: {},
            active: false,
            dragDrop: false,
            togglable: true,
            runDefaultCommand: true,
            stopDefaultCommand: false,
            disable: false
        },
        initialize(options) {
            if (this.get('buttons').length) {
                var Buttons = Button.Buttons; //require('./Buttons').default; modified by lwf
                this.set('buttons', new Buttons(this.get('buttons')));
            }
        }
    });

    return Button;
});
define('skylark-grapejs/panels/model/Buttons',[
    'skylark-backbone',
    './Button'
], function (Backbone, Button) {
    'use strict';
    var Buttons =  Backbone.Collection.extend({
        model: Button,
        deactivateAllExceptOne(except, r) {
            this.forEach((model, index) => {
                if (model !== except) {
                    model.set('active', false);
                    if (r && model.get('buttons').length)
                        model.get('buttons').deactivateAllExceptOne(except, r);
                }
            });
        },
        deactivateAll(ctx, sender) {
            const context = ctx || '';
            this.forEach(model => {
                if (model.get('context') == context && model !== sender) {
                    model.set('active', false, { silent: 1 });
                    model.trigger('updateActive', { fromCollection: 1 });
                }
            });
        },
        disableAllButtons(ctx) {
            var context = ctx || '';
            this.forEach((model, index) => {
                if (model.get('context') == context) {
                    model.set('disable', true);
                }
            });
        },
        disableAllButtonsExceptOne(except, r) {
            this.forEach((model, index) => {
                if (model !== except) {
                    model.set('disable', true);
                    if (r && model.get('buttons').length)
                        model.get('buttons').disableAllButtonsExceptOne(except, r);
                }
            });
        }
    });

    Button.Buttons = Buttons;

    return Buttons;
});
define('skylark-grapejs/panels/model/Panel',[
    'skylark-backbone',
    './Buttons'
], function (Backbone, Buttons) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            id: '',
            content: '',
            visible: true,
            buttons: [],
            attributes: {}
        },
        initialize(options) {
            this.btn = this.get('buttons') || [];
            this.buttons = new Buttons(this.btn);
            this.set('buttons', this.buttons);
        }
    });
});
define('skylark-grapejs/panels/model/Panels',[
    'skylark-backbone',
    './Panel'
], function (Backbone, Panel) {
    'use strict';
    return Backbone.Collection.extend({ model: Panel });
});
define('skylark-grapejs/panels/view/ButtonView',[
    'skylark-backbone',
    'skylark-underscore'
], function (Backbone, a) {
    'use strict';
    const $ = Backbone.$;
    return Backbone.View.extend({
        tagName() {
            return this.model.get('tagName');
        },
        events: { click: 'clicked' },
        initialize(o) {
            var cls = this.model.get('className');
            this.config = o.config || {};
            this.em = this.config.em || {};
            const pfx = this.config.stylePrefix || '';
            const ppfx = this.config.pStylePrefix || '';
            this.pfx = pfx;
            this.ppfx = this.config.pStylePrefix || '';
            this.id = pfx + this.model.get('id');
            this.activeCls = `${ pfx }active ${ ppfx }four-color`;
            this.disableCls = `${ ppfx }disabled`;
            this.btnsVisCls = `${ pfx }visible`;
            this.className = pfx + 'btn' + (cls ? ' ' + cls : '');
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'change:active updateActive', this.updateActive);
            this.listenTo(this.model, 'checkActive', this.checkActive);
            this.listenTo(this.model, 'change:bntsVis', this.updateBtnsVis);
            this.listenTo(this.model, 'change:attributes', this.updateAttributes);
            this.listenTo(this.model, 'change:className', this.updateClassName);
            this.listenTo(this.model, 'change:disable', this.updateDisable);
            if (this.em && this.em.get)
                this.commands = this.em.get('Commands');
        },
        updateClassName() {
            const {model, pfx} = this;
            const cls = model.get('className');
            const attrCls = model.get('attributes').class;
            const classStr = `${ attrCls ? attrCls : '' } ${ pfx }btn ${ cls ? cls : '' }`;
            this.$el.attr('class', classStr.trim());
        },
        updateAttributes() {
            const {em, model, $el} = this;
            const attr = model.get('attributes') || {};
            const title = em && em.t && em.t(`panels.buttons.titles.${ model.id }`);
            $el.attr(attr);
            title && $el.attr({ title });
            this.updateClassName();
        },
        updateBtnsVis() {
            if (!this.$buttons)
                return;
            if (this.model.get('bntsVis'))
                this.$buttons.addClass(this.btnsVisCls);
            else
                this.$buttons.removeClass(this.btnsVisCls);
        },
        updateActive(opts = {}) {
            const {model, commands, $el, activeCls} = this;
            const {fromCollection} = opts;
            const context = model.get('context');
            const options = model.get('options');
            const commandName = model.get('command');
            let command = {};
            if (commands && a.isString(commandName)) {
                command = commands.get(commandName) || {};
            } else if (a.isFunction(commandName)) {
                command = commands.create({ run: commandName });
            } else if (commandName !== null && a.isObject(commandName)) {
                command = commands.create(commandName);
            }
            if (model.get('active')) {
                !fromCollection && model.collection.deactivateAll(context, model);
                model.set('active', true, { silent: true }).trigger('checkActive');
                commands.runCommand(command, {
                    ...options,
                    sender: model
                });
                command.noStop && model.set('active', false);
            } else {
                $el.removeClass(activeCls);
                commands.stopCommand(command, {
                    ...options,
                    sender: model,
                    force: 1
                });
            }
        },
        updateDisable() {
            const {disableCls, model} = this;
            const disable = model.get('disable');
            this.$el[disable ? 'addClass' : 'removeClass'](disableCls);
        },
        checkActive() {
            const {model, $el, activeCls} = this;
            model.get('active') ? $el.addClass(activeCls) : $el.removeClass(activeCls);
        },
        clicked(e) {
            if (this.model.get('bntsVis'))
                return;
            if (this.model.get('disable'))
                return;
            this.toggleActive();
        },
        toggleActive() {
            const {model} = this;
            const {active, togglable} = model.attributes;
            if (active && !togglable)
                return;
            model.set('active', !active);
            var command = this.em.get('Commands').get('select-comp');
            if (active) {
                if (model.get('runDefaultCommand'))
                    this.em.runDefault();
            } else {
                if (model.get('stopDefaultCommand'))
                    this.em.stopDefault();
            }
        },
        render() {
            const label = this.model.get('label');
            const {$el} = this;
            $el.empty();
            this.updateAttributes();
            label && $el.append(label);
            this.checkActive();
            this.updateDisable();
            return this;
        }
    });
});
define('skylark-grapejs/panels/view/ButtonsView',[
    'skylark-backbone',
    './ButtonView',
    'skylark-underscore'
], function (Backbone, ButtonView, a) {
    'use strict';
    return Backbone.View.extend({
        initialize(o) {
            this.opt = o || {};
            this.config = this.opt.config || {};
            this.pfx = this.config.stylePrefix || '';
            this.parentM = this.opt.parentM || null;
            this.listenTo(this.collection, 'add', this.addTo);
            this.listenTo(this.collection, 'reset remove', this.render);
            this.className = this.pfx + 'buttons';
        },
        addTo(model) {
            this.addToCollection(model);
        },
        addToCollection(model, fragmentEl) {
            var fragment = fragmentEl || null;
            var viewObject = ButtonView;
            var view = new viewObject({
                model,
                config: this.config,
                parentM: this.parentM
            });
            var rendered = view.render().el;
            if (fragment) {
                fragment.appendChild(rendered);
            } else {
                this.$el.append(rendered);
            }
            return rendered;
        },
        render() {
            var fragment = document.createDocumentFragment();
            this.$el.empty();
            this.collection.each(function (model) {
                this.addToCollection(model, fragment);
            }, this);
            this.$el.append(fragment);
            this.$el.attr('class', a.result(this, 'className'));
            return this;
        }
    });
});
define('skylark-grapejs/panels/view/PanelView',[
    'skylark-backbone',
    './ButtonsView'
], function (Backbone, ButtonsView) {
    'use strict';
    return Backbone.View.extend({
        initialize(o) {
            const config = o.config || {};
            const model = this.model;
            this.config = config;
            this.pfx = config.stylePrefix || '';
            this.ppfx = config.pStylePrefix || '';
            this.buttons = model.get('buttons');
            this.className = this.pfx + 'panel';
            this.id = this.pfx + model.get('id');
            this.listenTo(model, 'change:appendContent', this.appendContent);
            this.listenTo(model, 'change:content', this.updateContent);
            this.listenTo(model, 'change:visible', this.toggleVisible);
            model.view = this;
        },
        appendContent() {
            this.$el.append(this.model.get('appendContent'));
        },
        updateContent() {
            this.$el.html(this.model.get('content'));
        },
        toggleVisible() {
            if (!this.model.get('visible')) {
                this.$el.addClass(`${ this.ppfx }hidden`);
                return;
            }
            this.$el.removeClass(`${ this.ppfx }hidden`);
        },
        attributes() {
            return this.model.get('attributes');
        },
        initResize() {
            const em = this.config.em;
            const editor = em ? em.get('Editor') : '';
            const resizable = this.model.get('resizable');
            if (editor && resizable) {
                var resz = resizable === true ? [
                    1,
                    1,
                    1,
                    1
                ] : resizable;
                var resLen = resz.length;
                var tc, cr, bc, cl = 0;
                if (resLen == 2) {
                    tc = resz[0];
                    bc = resz[0];
                    cr = resz[1];
                    cl = resz[1];
                } else if (resLen == 4) {
                    tc = resz[0];
                    cr = resz[1];
                    bc = resz[2];
                    cl = resz[3];
                }
                var resizer = editor.Utils.Resizer.init({
                    tc,
                    cr,
                    bc,
                    cl,
                    tl: 0,
                    tr: 0,
                    bl: 0,
                    br: 0,
                    appendTo: this.el,
                    silentFrames: 1,
                    avoidContainerUpdate: 1,
                    prefix: editor.getConfig().stylePrefix,
                    onEnd() {
                        em && em.trigger('change:canvasOffset');
                    },
                    posFetcher: (el, {target}) => {
                        const style = el.style;
                        const config = resizer.getConfig();
                        const keyWidth = config.keyWidth;
                        const keyHeight = config.keyHeight;
                        const rect = el.getBoundingClientRect();
                        const forContainer = target == 'container';
                        const styleWidth = style[keyWidth];
                        const styleHeight = style[keyHeight];
                        const width = styleWidth && !forContainer ? parseFloat(styleWidth) : rect.width;
                        const height = styleHeight && !forContainer ? parseFloat(styleHeight) : rect.height;
                        return {
                            left: 0,
                            top: 0,
                            width,
                            height
                        };
                    },
                    ...resizable
                });
                resizer.blur = () => {
                };
                resizer.focus(this.el);
            }
        },
        render() {
            const $el = this.$el;
            const ppfx = this.ppfx;
            const cls = `${ this.className } ${ this.id } ${ ppfx }one-bg ${ ppfx }two-color`;
            $el.addClass(cls);
            if (this.buttons.length) {
                var buttons = new ButtonsView({
                    collection: this.buttons,
                    config: this.config
                });
                $el.append(buttons.render().el);
            }
            $el.append(this.model.get('content'));
            return this;
        }
    });
});
define('skylark-grapejs/panels/view/PanelsView',[
    'skylark-backbone',
    './PanelView'
], function (Backbone, PanelView) {
    'use strict';
    return Backbone.View.extend({
        initialize(o) {
            this.opt = o || {};
            this.config = this.opt.config || {};
            this.pfx = this.config.stylePrefix || '';
            const items = this.collection;
            this.listenTo(items, 'add', this.addTo);
            this.listenTo(items, 'reset', this.render);
            this.listenTo(items, 'remove', this.onRemove);
            this.className = this.pfx + 'panels';
        },
        onRemove(model) {
            const view = model.view;
            view && view.remove();
        },
        addTo(model) {
            this.addToCollection(model);
        },
        addToCollection(model, fragmentEl) {
            const fragment = fragmentEl || null;
            const config = this.config;
            const el = model.get('el');
            const view = new PanelView({
                el,
                model,
                config
            });
            const rendered = view.render().el;
            const appendTo = model.get('appendTo');
            if (el) {
            } else if (appendTo) {
                var appendEl = document.querySelector(appendTo);
                appendEl.appendChild(rendered);
            } else {
                if (fragment) {
                    fragment.appendChild(rendered);
                } else {
                    this.$el.append(rendered);
                }
            }
            view.initResize();
            return rendered;
        },
        render() {
            const $el = this.$el;
            const frag = document.createDocumentFragment();
            $el.empty();
            this.collection.each(
                model => this.addToCollection(model, frag)
            );
            $el.append(frag);
            $el.attr('class', this.className);
            return this;
        }
    });
});
define('skylark-grapejs/panels/index',[
    './config/config',
    './model/Panel',
    './model/Panels',
    './view/PanelView',
    './view/PanelsView'
], function (defaults, Panel, Panels, PanelView, PanelsView) {
    'use strict';
    return () => {
        var c = {};
        var panels, PanelsViewObj;
        return {
            name: 'Panels',
            init(config) {
                c = config || {};
                for (var name in defaults) {
                    if (!(name in c))
                        c[name] = defaults[name];
                }
                var ppfx = c.pStylePrefix;
                if (ppfx)
                    c.stylePrefix = ppfx + c.stylePrefix;
                panels = new Panels(c.defaults);
                PanelsViewObj = new PanelsView({
                    collection: panels,
                    config: c
                });
                return this;
            },
            getPanels() {
                return panels;
            },
            getPanelsEl() {
                return PanelsViewObj.el;
            },
            addPanel(panel) {
                return panels.add(panel);
            },
            removePanel(panel) {
                return panels.remove(panel);
            },
            getPanel(id) {
                var res = panels.where({ id });
                return res.length ? res[0] : null;
            },
            addButton(panelId, button) {
                var pn = this.getPanel(panelId);
                return pn ? pn.get('buttons').add(button) : null;
            },
            removeButton(panelId, button) {
                var pn = this.getPanel(panelId);
                return pn && pn.get('buttons').remove(button);
            },
            getButton(panelId, id) {
                var pn = this.getPanel(panelId);
                if (pn) {
                    var res = pn.get('buttons').where({ id });
                    return res.length ? res[0] : null;
                }
                return null;
            },
            render() {
                return PanelsViewObj.render().el;
            },
            active() {
                this.getPanels().each(p => {
                    p.get('buttons').each(btn => {
                        btn.get('active') && btn.trigger('updateActive');
                    });
                });
            },
            disableButtons() {
                this.getPanels().each(p => {
                    p.get('buttons').each(btn => {
                        if (btn.get('disable'))
                            btn.trigger('change:disable');
                    });
                });
            },
            Panel
        };
    };
});
define('skylark-grapejs/rich_text_editor/model/RichTextEditor',['../../utils/mixins'], function (a) {
    'use strict';
    const RTE_KEY = '_rte';
    const btnState = {
        ACTIVE: 1,
        INACTIVE: 0,
        DISABLED: -1
    };
    const isValidAnchor = rte => {
        const anchor = rte.selection().anchorNode;
        const parentNode = anchor && anchor.parentNode;
        const nextSibling = anchor && anchor.nextSibling;
        return parentNode && parentNode.nodeName == 'A' || nextSibling && nextSibling.nodeName == 'A';
    };
    const defActions = {
        bold: {
            name: 'bold',
            icon: '<b>B</b>',
            attributes: { title: 'Bold' },
            result: rte => rte.exec('bold')
        },
        italic: {
            name: 'italic',
            icon: '<i>I</i>',
            attributes: { title: 'Italic' },
            result: rte => rte.exec('italic')
        },
        underline: {
            name: 'underline',
            icon: '<u>U</u>',
            attributes: { title: 'Underline' },
            result: rte => rte.exec('underline')
        },
        strikethrough: {
            name: 'strikethrough',
            icon: '<strike>S</strike>',
            attributes: { title: 'Strike-through' },
            result: rte => rte.exec('strikeThrough')
        },
        link: {
            icon: `<span style="transform:rotate(45deg)">&supdsub;</span>`,
            name: 'link',
            attributes: {
                style: 'font-size:1.4rem;padding:0 4px 2px;',
                title: 'Link'
            },
            state: (rte, doc) => {
                if (rte && rte.selection()) {
                    return isValidAnchor(rte) ? btnState.ACTIVE : btnState.INACTIVE;
                } else {
                    return btnState.INACTIVE;
                }
            },
            result: rte => {
                if (isValidAnchor(rte)) {
                    rte.exec('unlink');
                } else {
                    rte.insertHTML(`<a class="link" href="">${ rte.selection() }</a>`);
                }
            }
        }
    };
    return class RichTextEditor {
        constructor(settings = {}) {
            const el = settings.el;
            if (el[RTE_KEY]) {
                return el[RTE_KEY];
            }
            el[RTE_KEY] = this;
            this.setEl(el);
            this.updateActiveActions = this.updateActiveActions.bind(this);
            const settAct = settings.actions || [];
            settAct.forEach((action, i) => {
                if (typeof action === 'string') {
                    action = defActions[action];
                } else if (defActions[action.name]) {
                    action = {
                        ...defActions[action.name],
                        ...action
                    };
                }
                settAct[i] = action;
            });
            const actions = settAct.length ? settAct : Object.keys(defActions).map(action => defActions[action]);
            settings.classes = {
                ...{
                    actionbar: 'actionbar',
                    button: 'action',
                    active: 'active',
                    disabled: 'disabled',
                    inactive: 'inactive'
                },
                ...settings.classes
            };
            const classes = settings.classes;
            let actionbar = settings.actionbar;
            this.actionbar = actionbar;
            this.settings = settings;
            this.classes = classes;
            this.actions = actions;
            if (!actionbar) {
                const actionbarCont = settings.actionbarContainer;
                actionbar = document.createElement('div');
                actionbar.className = classes.actionbar;
                actionbarCont.appendChild(actionbar);
                this.actionbar = actionbar;
                actions.forEach(action => this.addAction(action));
            }
            settings.styleWithCSS && this.exec('styleWithCSS');
            this.syncActions();
            return this;
        }
        destroy() {
            this.el = 0;
            this.doc = 0;
            this.actionbar = 0;
            this.settings = {};
            this.classes = {};
            this.actions = [];
        }
        setEl(el) {
            this.el = el;
            this.doc = el.ownerDocument;
        }
        updateActiveActions() {
            this.getActions().forEach(action => {
                const btn = action.btn;
                const update = action.update;
                const {active, inactive, disabled} = { ...this.classes };
                const state = action.state;
                const name = action.name;
                const doc = this.doc;
                btn.className = btn.className.replace(active, '').trim();
                btn.className = btn.className.replace(inactive, '').trim();
                btn.className = btn.className.replace(disabled, '').trim();
                if (state) {
                    switch (state(this, doc)) {
                    case btnState.ACTIVE:
                        btn.className += ` ${ active }`;
                        break;
                    case btnState.INACTIVE:
                        btn.className += ` ${ inactive }`;
                        break;
                    case btnState.DISABLED:
                        btn.className += ` ${ disabled }`;
                        break;
                    }
                } else {
                    if (doc.queryCommandSupported(name) && doc.queryCommandState(name)) {
                        btn.className += ` ${ active }`;
                    }
                }
                update && update(this, action);
            });
        }
        enable() {
            if (this.enabled) {
                return this;
            }
            this.actionbarEl().style.display = '';
            this.el.contentEditable = true;
            a.on(this.el, 'mouseup keyup', this.updateActiveActions);
            this.syncActions();
            this.updateActiveActions();
            this.el.focus();
            this.enabled = 1;
            return this;
        }
        disable() {
            this.actionbarEl().style.display = 'none';
            this.el.contentEditable = false;
            a.off(this.el, 'mouseup keyup', this.updateActiveActions);
            this.enabled = 0;
            return this;
        }
        syncActions() {
            this.getActions().forEach(action => {
                if (this.settings.actionbar) {
                    if (!action.state || action.state && action.state(this, this.doc) >= 0) {
                        const event = action.event || 'click';
                        action.btn[`on${ event }`] = e => {
                            action.result(this, action);
                            this.updateActiveActions();
                        };
                    }
                }
            });
        }
        addAction(action, opts = {}) {
            const sync = opts.sync;
            const btn = document.createElement('span');
            const icon = action.icon;
            const attr = action.attributes || {};
            btn.className = this.classes.button;
            action.btn = btn;
            for (let key in attr) {
                btn.setAttribute(key, attr[key]);
            }
            if (typeof icon == 'string') {
                btn.innerHTML = icon;
            } else {
                btn.appendChild(icon);
            }
            this.actionbarEl().appendChild(btn);
            if (sync) {
                this.actions.push(action);
                this.syncActions();
            }
        }
        getActions() {
            return this.actions;
        }
        selection() {
            return this.doc.getSelection();
        }
        exec(command, value = null) {
            this.doc.execCommand(command, false, value);
        }
        actionbarEl() {
            return this.actionbar;
        }
        insertHTML(value) {
            let lastNode;
            const doc = this.doc;
            const sel = doc.getSelection();
            if (sel && sel.rangeCount) {
                const node = doc.createElement('div');
                const range = sel.getRangeAt(0);
                range.deleteContents();
                node.innerHTML = value;
                Array.prototype.slice.call(node.childNodes).forEach(nd => {
                    range.insertNode(nd);
                    lastNode = nd;
                });
                sel.removeAllRanges();
                sel.addRange(range);
                this.el.focus();
            }
        }
    };
});
define('skylark-grapejs/rich_text_editor/config/config',[],function () {
    'use strict';
    return {
        stylePrefix: 'rte-',
        adjustToolbar: 1,
        actions: [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'link'
        ]
    };
});
define('skylark-grapejs/rich_text_editor/index',[
    './model/RichTextEditor',
    '../utils/mixins',
    './config/config'
], function (RichTextEditor, a, defaults) {
    'use strict';
    return () => {
        let config = {};
        let toolbar, actions, lastEl, lastElPos, globalRte;
        const hideToolbar = () => {
            const style = toolbar.style;
            const size = '-1000px';
            style.top = size;
            style.left = size;
            style.display = 'none';
        };
        return {
            customRte: null,
            name: 'RichTextEditor',
            getConfig() {
                return config;
            },
            init(opts = {}) {
                config = {
                    ...defaults,
                    ...opts
                };
                const ppfx = config.pStylePrefix;
                if (ppfx) {
                    config.stylePrefix = ppfx + config.stylePrefix;
                }
                this.pfx = config.stylePrefix;
                actions = config.actions || [];
                toolbar = document.createElement('div');
                toolbar.className = `${ ppfx }rte-toolbar ${ ppfx }one-bg`;
                globalRte = this.initRte(document.createElement('div'));
                a.on(toolbar, 'mousedown', e => e.stopPropagation());
                return this;
            },
            destroy() {
                const {customRte} = this;
                globalRte && globalRte.destroy();
                customRte && customRte.destroy && customRte.destroy();
                toolbar = 0;
                globalRte = 0;
                this.actionbar = 0;
                this.actions = 0;
            },
            postRender(ev) {
                const canvas = ev.model.get('Canvas');
                toolbar.style.pointerEvents = 'all';
                hideToolbar();
                canvas.getToolsEl().appendChild(toolbar);
            },
            initRte(el) {
                const pfx = this.pfx;
                const actionbarContainer = toolbar;
                const actionbar = this.actionbar;
                const actions = this.actions || [...config.actions];
                const classes = {
                    actionbar: `${ pfx }actionbar`,
                    button: `${ pfx }action`,
                    active: `${ pfx }active`,
                    inactive: `${ pfx }inactive`,
                    disabled: `${ pfx }disabled`
                };
                const rte = new RichTextEditor({
                    el,
                    classes,
                    actions,
                    actionbar,
                    actionbarContainer
                });
                globalRte && globalRte.setEl(el);
                if (rte.actionbar) {
                    this.actionbar = rte.actionbar;
                }
                if (rte.actions) {
                    this.actions = rte.actions;
                }
                return rte;
            },
            add(name, action = {}) {
                action.name = name;
                globalRte.addAction(action, { sync: 1 });
            },
            get(name) {
                let result;
                globalRte.getActions().forEach(action => {
                    if (action.name == name) {
                        result = action;
                    }
                });
                return result;
            },
            getAll() {
                return globalRte.getActions();
            },
            remove(name) {
                const actions = this.getAll();
                const action = this.get(name);
                if (action) {
                    const btn = action.btn;
                    const index = actions.indexOf(action);
                    btn.parentNode.removeChild(btn);
                    actions.splice(index, 1);
                }
                return action;
            },
            getToolbarEl() {
                return toolbar;
            },
            updatePosition() {
                const un = 'px';
                const canvas = config.em.get('Canvas');
                const {style} = toolbar;
                const pos = canvas.getTargetToElementFixed(lastEl, toolbar, { event: 'rteToolbarPosUpdate' });
                style.top = pos.top + un;
                style.left = 0 + un;
            },
            enable(view, rte) {
                lastEl = view.el;
                const canvas = config.em.get('Canvas');
                const em = config.em;
                const el = view.getChildrenContainer();
                const customRte = this.customRte;
                lastElPos = canvas.getElementPos(lastEl);
                toolbar.style.display = '';
                rte = customRte ? customRte.enable(el, rte) : this.initRte(el).enable();
                if (em) {
                    setTimeout(this.updatePosition.bind(this), 0);
                    const event = 'change:canvasOffset canvasScroll frame:scroll component:update';
                    em.on(event, this.updatePosition, this);
                    em.on(event, this.updatePosition, this);
                    em.trigger('rte:enable', view, rte);
                }
                return rte;
            },
            disable(view, rte) {
                const em = config.em;
                const customRte = this.customRte;
                var el = view.getChildrenContainer();
                if (customRte) {
                    customRte.disable(el, rte);
                } else {
                    rte && rte.disable();
                }
                hideToolbar();
                em && em.trigger('rte:disable', view, rte);
            }
        };
    };
});
define('skylark-grapejs/asset_manager/config/config',[],function () {
    'use strict';
    return {
        assets: [],
        noAssets: '',
        stylePrefix: 'am-',
        upload: 0,
        uploadName: 'files',
        headers: {},
        params: {},
        credentials: 'include',
        multiUpload: true,
        autoAdd: 1,
        customFetch: '',
        uploadFile: '',
        embedAsBase64: 1,
        handleAdd: '',
        dropzone: 0,
        openAssetsOnDrop: 1,
        dropzoneContent: '',
        beforeUpload: null,
        showUrlInput: true
    };
});
define('skylark-grapejs/asset_manager/model/Asset',[
    'skylark-backbone/Model'
], function (Model) {
    'use strict';
    return Model.extend({
        idAttribute: 'src',
        defaults: {
            type: '',
            src: ''
        },
        getFilename() {
            return this.get('src').split('/').pop();
        },
        getExtension() {
            return this.getFilename().split('.').pop();
        }
    });
});
define('skylark-grapejs/asset_manager/model/AssetImage',[
    "skylark-langx/langx",
    './Asset'
], function (langx,Asset) {
    'use strict';
    return Asset.extend({
        defaults: langx.mixin({},Asset.prototype.defaults,{
            type: 'image',
            unitDim: 'px',
            height: 0,
            width: 0
        })
    });
});
define('skylark-grapejs/asset_manager/view/AssetView',[
    'skylark-backbone',
    'skylark-underscore'
], function (Backbone, _) {
    'use strict';
    return Backbone.View.extend({
        initialize(o = {}) {
            this.options = o;
            this.collection = o.collection;
            const config = o.config || {};
            this.config = config;
            this.pfx = config.stylePrefix || '';
            this.ppfx = config.pStylePrefix || '';
            this.em = config.em;
            this.className = this.pfx + 'asset';
            this.listenTo(this.model, 'destroy remove', this.remove);
            this.model.view = this;
            const init = this.init && this.init.bind(this);
            init && init(o);
        },
        template() {
            const pfx = this.pfx;
            return `
      <div class="${ pfx }preview-cont">
        ${ this.getPreview() }
      </div>
      <div class="${ pfx }meta">
        ${ this.getInfo() }
      </div>
      <div class="${ pfx }close" data-toggle="asset-remove">
        &Cross;
      </div>
    `;
        },
        updateTarget(target) {
            if (target && target.set) {
                target.set('attributes', _.clone(target.get('attributes')));
                target.set('src', this.model.get('src'));
            }
        },
        getPreview() {
            return '';
        },
        getInfo() {
            return '';
        },
        render() {
            const el = this.el;
            el.innerHTML = this.template(this, this.model);
            el.className = this.className;
            return this;
        }
    });
});
define('skylark-grapejs/asset_manager/view/AssetImageView',[
    'skylark-underscore',
    './AssetView'
], function (a, AssetView) {
    'use strict';
    return AssetView.extend({
        events: {
            'click [data-toggle=asset-remove]': 'onRemove',
            click: 'onClick',
            dblclick: 'onDblClick'
        },
        getPreview() {
            const pfx = this.pfx;
            const src = this.model.get('src');
            return `
      <div class="${ pfx }preview" style="background-image: url('${ src }');"></div>
      <div class="${ pfx }preview-bg ${ this.ppfx }checker-bg"></div>
    `;
        },
        getInfo() {
            const pfx = this.pfx;
            const model = this.model;
            let name = model.get('name');
            let width = model.get('width');
            let height = model.get('height');
            let unit = model.get('unitDim');
            let dim = width && height ? `${ width }x${ height }${ unit }` : '';
            name = name || model.getFilename();
            return `
      <div class="${ pfx }name">${ name }</div>
      <div class="${ pfx }dimensions">${ dim }</div>
    `;
        },
        init(o) {
            const pfx = this.pfx;
            this.className += ` ${ pfx }asset-image`;
        },
        onClick() {
            var onClick = this.config.onClick;
            var model = this.model;
            this.collection.trigger('deselectAll');
            this.$el.addClass(this.pfx + 'highlight');
            if (a.isFunction(onClick)) {
                onClick(model);
            } else {
                this.updateTarget(this.collection.target);
            }
        },
        onDblClick() {
            const {em, model} = this;
            const onDblClick = this.config.onDblClick;
            if (a.isFunction(onDblClick)) {
                onDblClick(model);
            } else {
                this.updateTarget(this.collection.target);
                em && em.get('Modal').close();
            }
            var onSelect = this.collection.onSelect;
            a.isFunction(onSelect) && onSelect(model);
        },
        onRemove(e) {
            e.stopImmediatePropagation();
            this.model.collection.remove(this.model);
        }
    });
});
define('skylark-grapejs/asset_manager/model/Assets',[
    'skylark-backbone/Collection',
    './AssetImage',
    './../view/AssetImageView',
    '../../domain_abstract/model/TypeableCollection'
], function (Collection, AssetImage, AssetImageView, TypeableCollection) {
    'use strict';
    return Collection.extend(TypeableCollection).extend({
        types: [{
                id: 'image',
                model: AssetImage,
                view: AssetImageView,
                isType(value) {
                    if (typeof value == 'string') {
                        return {
                            type: 'image',
                            src: value
                        };
                    }
                    return value;
                }
            }]
    });
});
define('skylark-grapejs/asset_manager/view/AssetsView',[
    'skylark-backbone'
], function (Backbone) {
    'use strict';
    return Backbone.View.extend({
        events: { submit: 'handleSubmit' },
        //template({
        //    pfx,
        //    ppfx,
        //    em,
        //    ...view
        //}) {
        template() {
            const {
                pfx,
                ppfx,
                em
            } = this;  // modified by lwf
            let form = '';
            if (this.config.showUrlInput) {
                form = `
          <form class="${ pfx }add-asset">
            <div class="${ ppfx }field ${ pfx }add-field">
              <input placeholder="${ em && em.t('assetManager.inputPlh') }"/>
            </div>
            <button class="${ ppfx }btn-prim">${ em && em.t('assetManager.addButton') }</button>
            <div style="clear:both"></div>
          </form>
      `;
            }
            return `
    <div class="${ pfx }assets-cont">
      <div class="${ pfx }assets-header">
        ${ form }
      </div>
      <div class="${ pfx }assets" data-el="assets"></div>
      <div style="clear:both"></div>
    </div>
    `;
        },
        initialize(o) {
            this.options = o;
            this.config = o.config;
            this.pfx = this.config.stylePrefix || '';
            this.ppfx = this.config.pStylePrefix || '';
            this.em = this.config.em;
            const coll = this.collection;
            this.listenTo(coll, 'reset', this.renderAssets);
            this.listenTo(coll, 'add', this.addToAsset);
            this.listenTo(coll, 'remove', this.removedAsset);
            this.listenTo(coll, 'deselectAll', this.deselectAll);
        },
        handleSubmit(e) {
            e.preventDefault();
            const input = this.getAddInput();
            const url = input && input.value.trim();
            const handleAdd = this.config.handleAdd;
            if (!url) {
                return;
            }
            input.value = '';
            this.getAssetsEl().scrollTop = 0;
            if (handleAdd) {
                handleAdd.bind(this)(url);
            } else {
                this.options.globalCollection.add(url, { at: 0 });
            }
        },
        getAssetsEl() {
            return this.el.querySelector(`.${ this.pfx }assets`);
        },
        getAddInput() {
            if (!this.inputUrl || !this.inputUrl.value)
                this.inputUrl = this.el.querySelector(`.${ this.pfx }add-asset input`);
            return this.inputUrl;
        },
        removedAsset(model) {
            if (!this.collection.length) {
                this.toggleNoAssets();
            }
        },
        addToAsset(model) {
            if (this.collection.length == 1) {
                this.toggleNoAssets(1);
            }
            this.addAsset(model);
        },
        addAsset(model, fragmentEl = null) {
            const fragment = fragmentEl;
            const collection = this.collection;
            const config = this.config;
            const rendered = new model.typeView({
                model,
                collection,
                config
            }).render().el;
            if (fragment) {
                fragment.appendChild(rendered);
            } else {
                const assetsEl = this.getAssetsEl();
                if (assetsEl) {
                    assetsEl.insertBefore(rendered, assetsEl.firstChild);
                }
            }
            return rendered;
        },
        toggleNoAssets(hide) {
            const assetsEl = this.$el.find(`.${ this.pfx }assets`);
            if (hide) {
                assetsEl.empty();
            } else {
                const noAssets = this.config.noAssets;
                noAssets && assetsEl.append(noAssets);
            }
        },
        deselectAll() {
            const pfx = this.pfx;
            this.$el.find(`.${ pfx }highlight`).removeClass(`${ pfx }highlight`);
        },
        renderAssets() {
            const fragment = document.createDocumentFragment();
            const assets = this.$el.find(`.${ this.pfx }assets`);
            assets.empty();
            this.toggleNoAssets(this.collection.length);
            this.collection.each(model => this.addAsset(model, fragment));
            assets.append(fragment);
        },
        render() {
            const fuRendered = this.options.fu.render().el;
            this.$el.empty();
            this.$el.append(fuRendered).append(this.template(this));
            this.el.className = `${ this.ppfx }asset-manager`;
            this.renderAssets();
            this.rendered = 1;
            return this;
        }
    });
});
define('skylark-grapejs/asset_manager/view/FileUploader',[
    'skylark-underscore',
    'skylark-backbone',
    '../../utils/fetch'
], function (_, Backbone, fetch) {
    'use strict';
    return Backbone.View.extend({
        template: _.template(`
  <form>
    <div id="<%= pfx %>title"><%= title %></div>
    <input type="file" id="<%= uploadId %>" name="file" accept="*/*" <%= disabled ? 'disabled' : '' %> <%= multiUpload ? 'multiple' : '' %>/>
    <div style="clear:both;"></div>
  </form>
  `),
        events: {},
        initialize(opts = {}) {
            this.options = opts;
            const c = opts.config || {};
            this.config = c;
            this.em = this.config.em;
            this.pfx = c.stylePrefix || '';
            this.ppfx = c.pStylePrefix || '';
            this.target = this.options.globalCollection || {};
            this.uploadId = this.pfx + 'uploadFile';
            this.disabled = c.disableUpload !== undefined ? c.disableUpload : !c.upload && !c.embedAsBase64;
            this.multiUpload = c.multiUpload !== undefined ? c.multiUpload : true;
            this.events['change #' + this.uploadId] = 'uploadFile';
            let uploadFile = c.uploadFile;
            if (uploadFile) {
                this.uploadFile = uploadFile.bind(this);
            } else if (!c.upload && c.embedAsBase64) {
                this.uploadFile = this.constructor.embedAsBase64;
            }
            this.delegateEvents();
        },
        onUploadStart() {
            const em = this.config.em;
            em && em.trigger('asset:upload:start');
        },
        onUploadEnd(res) {
            const {$el, config} = this;
            const em = config.em;
            em && em.trigger('asset:upload:end', res);
            const input = $el.find('input');
            input && input.val('');
        },
        onUploadError(err) {
            const em = this.config.em;
            console.error(err);
            this.onUploadEnd(err);
            em && em.trigger('asset:upload:error', err);
        },
        onUploadResponse(text, clb) {
            const em = this.config.em;
            const config = this.config;
            const target = this.target;
            let json;
            try {
                json = typeof text === 'string' ? JSON.parse(text) : text;
            } catch (e) {
                json = text;
            }
            em && em.trigger('asset:upload:response', json);
            if (config.autoAdd && target) {
                target.add(json.data, { at: 0 });
            }
            this.onUploadEnd(text);
            clb && clb(json);
        },
        uploadFile(e, clb) {
            const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
            const {config} = this;
            const {beforeUpload} = config;
            const beforeUploadResponse = beforeUpload && beforeUpload(files);
            if (beforeUploadResponse === false)
                return;
            const body = new FormData();
            const {params, customFetch} = config;
            for (let param in params) {
                body.append(param, params[param]);
            }
            if (this.multiUpload) {
                for (let i = 0; i < files.length; i++) {
                    body.append(`${ config.uploadName }[]`, files[i]);
                }
            } else if (files.length) {
                body.append(config.uploadName, files[0]);
            }
            var target = this.target;
            const url = config.upload;
            const headers = config.headers;
            const reqHead = 'X-Requested-With';
            if (typeof headers[reqHead] == 'undefined') {
                headers[reqHead] = 'XMLHttpRequest';
            }
            if (url) {
                this.onUploadStart();
                const fetchOpts = {
                    method: 'post',
                    credentials: config.credentials || 'include',
                    headers,
                    body
                };
                const fetchResult = customFetch ? customFetch(url, fetchOpts) : fetch(url, fetchOpts).then(res => (res.status / 200 | 0) == 1 ? res.text() : res.text().then(text => Promise.reject(text)));
                return fetchResult.then(text => this.onUploadResponse(text, clb)).catch(err => this.onUploadError(err));
            }
        },
        initDrop() {
            var that = this;
            if (!this.uploadForm) {
                this.uploadForm = this.$el.find('form').get(0);
                if ('draggable' in this.uploadForm) {
                    var uploadFile = this.uploadFile;
                    this.uploadForm.ondragover = function () {
                        this.className = that.pfx + 'hover';
                        return false;
                    };
                    this.uploadForm.ondragleave = function () {
                        this.className = '';
                        return false;
                    };
                    this.uploadForm.ondrop = function (e) {
                        this.className = '';
                        e.preventDefault();
                        that.uploadFile(e);
                        return;
                    };
                }
            }
        },
        initDropzone(ev) {
            let addedCls = 0;
            const c = this.config;
            const em = ev.model;
            const edEl = ev.el;
            const editor = em.get('Editor');
            const container = em.get('Config').el;
            const frameEl = em.get('Canvas').getBody();
            const ppfx = this.ppfx;
            const updatedCls = `${ ppfx }dropzone-active`;
            const dropzoneCls = `${ ppfx }dropzone`;
            const cleanEditorElCls = () => {
                edEl.className = edEl.className.replace(updatedCls, '').trim();
                addedCls = 0;
            };
            const onDragOver = () => {
                if (!addedCls) {
                    edEl.className += ` ${ updatedCls }`;
                    addedCls = 1;
                }
                return false;
            };
            const onDragLeave = () => {
                cleanEditorElCls();
                return false;
            };
            const onDrop = e => {
                cleanEditorElCls();
                e.preventDefault();
                e.stopPropagation();
                this.uploadFile(e);
                if (c.openAssetsOnDrop && editor) {
                    const target = editor.getSelected();
                    editor.runCommand('open-assets', {
                        target,
                        onSelect() {
                            editor.Modal.close();
                            editor.AssetManager.setTarget(null);
                        }
                    });
                }
                return false;
            };
            ev.$el.append(`<div class="${ dropzoneCls }">${ c.dropzoneContent }</div>`);
            cleanEditorElCls();
            if ('draggable' in edEl) {
                [
                    edEl,
                    frameEl
                ].forEach(item => {
                    item.ondragover = onDragOver;
                    item.ondragleave = onDragLeave;
                    item.ondrop = onDrop;
                });
            }
        },
        render() {
            const {$el, pfx, em} = this;
            $el.html(this.template({
                title: em && em.t('assetManager.uploadTitle'),
                uploadId: this.uploadId,
                disabled: this.disabled,
                multiUpload: this.multiUpload,
                pfx
            }));
            this.initDrop();
            $el.attr('class', pfx + 'file-uploader');
            return this;
        }
    }, {
        embedAsBase64: function (e, clb) {
            const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
            const response = { data: [] };
            if (!FileReader) {
                this.onUploadError(new Error('Unsupported platform, FileReader is not defined'));
                return;
            }
            const promises = [];
            const mimeTypeMatcher = /^(.+)\/(.+)$/;
            for (const file of files) {
                const promise = new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.addEventListener('load', event => {
                        let type;
                        const name = file.name;
                        const match = mimeTypeMatcher.exec(file.type);
                        if (match) {
                            type = match[1];
                        } else {
                            type = file.type;
                        }
                        if (type === 'image') {
                            const data = {
                                src: reader.result,
                                name,
                                type,
                                height: 0,
                                width: 0
                            };
                            const image = new Image();
                            image.addEventListener('error', error => {
                                reject(error);
                            });
                            image.addEventListener('load', () => {
                                data.height = image.height;
                                data.width = image.width;
                                resolve(data);
                            });
                            image.src = data.src;
                        } else if (type) {
                            resolve({
                                src: reader.result,
                                name,
                                type
                            });
                        } else {
                            resolve(reader.result);
                        }
                    });
                    reader.addEventListener('error', error => {
                        reject(error);
                    });
                    reader.addEventListener('abort', error => {
                        reject('Aborted');
                    });
                    reader.readAsDataURL(file);
                });
                promises.push(promise);
            }
            Promise.all(promises).then(data => {
                response.data = data;
                this.onUploadResponse(response, clb);
            }, error => {
                this.onUploadError(error);
            });
        }
    });
});
define('skylark-grapejs/asset_manager/index',[
    './config/config',
    './model/Assets',
    './view/AssetsView',
    './view/FileUploader'
], function (defaults, Assets, AssetsView, FileUpload) {
    'use strict';
    return () => {
        let c = {};
        let assets, am, fu;
        return {
            name: 'AssetManager',
            storageKey: 'assets',
            getConfig() {
                return c;
            },
            init(config) {
                c = config || {};
                for (let name in defaults) {
                    if (!(name in c))
                        c[name] = defaults[name];
                }
                const ppfx = c.pStylePrefix;
                const em = c.em;
                if (ppfx) {
                    c.stylePrefix = ppfx + c.stylePrefix;
                }
                assets = new Assets([]);
                const obj = {
                    collection: new Assets([]),
                    globalCollection: assets,
                    config: c
                };
                fu = new FileUpload(obj);
                obj.fu = fu;
                am = new AssetsView(obj);
                assets.listenTo(assets, 'add', model => {
                    this.getAllVisible().add(model);
                    em && em.trigger('asset:add', model);
                });
                assets.listenTo(assets, 'remove', model => {
                    this.getAllVisible().remove(model);
                    em && em.trigger('asset:remove', model);
                });
                return this;
            },
            add(asset, opts = {}) {
                if (typeof opts.at == 'undefined') {
                    opts.at = 0;
                }
                return assets.add(asset, opts);
            },
            get(src) {
                return assets.where({ src })[0];
            },
            getAll() {
                return assets;
            },
            getAllVisible() {
                return am.collection;
            },
            remove(src) {
                var asset = this.get(src);
                this.getAll().remove(asset);
                return this;
            },
            store(noStore) {
                var obj = {};
                var assets = JSON.stringify(this.getAll().toJSON());
                obj[this.storageKey] = assets;
                if (!noStore && c.stm)
                    c.stm.store(obj);
                return obj;
            },
            load(data = {}) {
                const name = this.storageKey;
                let assets = data[name] || [];
                if (typeof assets == 'string') {
                    try {
                        assets = JSON.parse(data[name]);
                    } catch (err) {
                    }
                }
                if (assets && assets.length) {
                    this.getAll().reset(assets);
                }
                return assets;
            },
            getContainer() {
                return am.el;
            },
            getAssetsEl() {
                return am.el.querySelector('[data-el=assets]');
            },
            render(assets) {
                const toRender = assets || this.getAll().models;
                if (!am.rendered) {
                    am.render();
                }
                am.collection.reset(toRender);
                return this.getContainer();
            },
            addType(id, definition) {
                this.getAll().addType(id, definition);
            },
            getType(id) {
                return this.getAll().getType(id);
            },
            getTypes() {
                return this.getAll().getTypes();
            },
            AssetsView() {
                return am;
            },
            FileUploader() {
                return fu;
            },
            onLoad() {
                this.getAll().reset(c.assets);
            },
            postRender(editorView) {
                c.dropzone && fu.initDropzone(editorView);
            },
            setTarget(m) {
                am.collection.target = m;
            },
            onSelect(f) {
                am.collection.onSelect = f;
            },
            onClick(func) {
                c.onClick = func;
            },
            onDblClick(func) {
                c.onDblClick = func;
            }
        };
    };
});
define('skylark-grapejs/css_composer/config/config',[],function () {
    'use strict';
    return {
        stylePrefix: 'css-',
        staticRules: '',
        rules: []
    };
});
define('skylark-grapejs/domain_abstract/model/Styleable',[
    'skylark-underscore',
    '../../utils/mixins',
    '../../parser/model/ParserHtml'
], function (a, b, ParserHtml) {
    'use strict';
    const parseStyle = ParserHtml().parseStyle;
    return {
        parseStyle,
        extendStyle(prop) {
            return {
                ...this.getStyle(),
                ...prop
            };
        },
        getStyle() {
            const style = this.get('style') || {};
            return { ...style };
        },
        setStyle(prop = {}, opts = {}) {
            if (a.isString(prop)) {
                prop = parseStyle(prop);
            }
            const propOrig = this.getStyle();
            const propNew = { ...prop };
            this.set('style', propNew, opts);
            const diff = b.shallowDiff(propOrig, propNew);
            a.keys(diff).forEach(pr => {
                const em = this.em;
                this.trigger(`change:style:${ pr }`);
                if (em) {
                    em.trigger(`styleable:change`, this, pr);
                    em.trigger(`styleable:change:${ pr }`, this, pr);
                }
            });
            return propNew;
        },
        addStyle(prop, value = '', opts = {}) {
            if (typeof prop == 'string') {
                prop = { prop: value };
            } else {
                opts = value || {};
            }
            prop = this.extendStyle(prop);
            this.setStyle(prop, opts);
        },
        removeStyle(prop) {
            let style = this.getStyle();
            delete style[prop];
            this.setStyle(style);
        },
        styleToString(opts = {}) {
            const result = [];
            const style = this.getStyle();
            for (let prop in style) {
                const imp = opts.important;
                const important = a.isArray(imp) ? imp.indexOf(prop) >= 0 : imp;
                const value = `${ style[prop] }${ important ? ' !important' : '' }`;
                const propPrv = prop.substr(0, 2) == '__';
                value && !propPrv && result.push(`${ prop }:${ value };`);
            }
            return result.join('');
        },
        getSelectors() {
            return this.get('selectors') || this.get('classes');
        },
        getSelectorsString() {
            return this.selectorsToString ? this.selectorsToString() : this.getSelectors().getFullString();
        }
    };
});
define('skylark-grapejs/css_composer/model/CssRule',[
    'skylark-underscore',
    'skylark-backbone',
    '../../domain_abstract/model/Styleable',
    '../../selector_manager/model/Selectors'
], function (a, Backbone, Styleable, Selectors) {
    'use strict';
    const {CSS} = window;
    return Backbone.Model.extend(Styleable).extend({
        defaults: {
            selectors: {},
            selectorsAdd: '',
            style: {},
            mediaText: '',
            state: '',
            stylable: true,
            atRuleType: '',
            singleAtRule: 0,
            important: 0
        },
        initialize(c, opt = {}) {
            this.config = c || {};
            const em = opt.em;
            let selectors = this.config.selectors || [];
            this.em = em;
            if (em) {
                const sm = em.get('SelectorManager');
                const slct = [];
                selectors.forEach(selector => {
                    slct.push(sm.add(selector));
                });
                selectors = slct;
            }
            this.set('selectors', new Selectors(selectors));
        },
        getAtRule() {
            const type = this.get('atRuleType');
            const condition = this.get('mediaText');
            const typeStr = type ? `@${ type }` : condition ? '@media' : '';
            return typeStr + (condition && typeStr ? ` ${ condition }` : '');
        },
        selectorsToString(opts = {}) {
            const result = [];
            const {em} = this;
            const state = this.get('state');
            const wrapper = this.get('wrapper');
            const addSelector = this.get('selectorsAdd');
            const isBody = wrapper && em && em.getConfig('wrapperIsBody');
            const selOpts = { escape: str => CSS && CSS.escape ? CSS.escape(str) : str };
            const selectors = isBody ? 'body' : this.get('selectors').getFullString(0, selOpts);
            const stateStr = state && !opts.skipState ? `:${ state }` : '';
            selectors && result.push(`${ selectors }${ stateStr }`);
            addSelector && !opts.skipAdd && result.push(addSelector);
            return result.join(', ');
        },
        getDeclaration(opts = {}) {
            let result = '';
            const selectors = this.selectorsToString();
            const style = this.styleToString(opts);
            const singleAtRule = this.get('singleAtRule');
            if ((selectors || singleAtRule) && style) {
                result = singleAtRule ? style : `${ selectors }{${ style }}`;
            }
            return result;
        },
        toCSS(opts = {}) {
            let result = '';
            const atRule = this.getAtRule();
            const block = this.getDeclaration(opts);
            block && (result = block);
            if (atRule && result) {
                result = `${ atRule }{${ result }}`;
            }
            return result;
        },
        toJSON(...args) {
            const obj = Backbone.Model.prototype.toJSON.apply(this, args);
            if (this.em.getConfig('avoidDefaults')) {
                const defaults = this.defaults;
                a.forEach(defaults, (value, key) => {
                    if (obj[key] === value) {
                        delete obj[key];
                    }
                });
                if (a.isEmpty(obj.selectors))
                    delete obj.selectors;
                if (a.isEmpty(obj.style))
                    delete obj.style;
            }
            return obj;
        },
        compare(selectors, state, width, ruleProps = {}) {
            var st = state || '';
            var wd = width || '';
            var selectorsAdd = ruleProps.selectorsAdd || '';
            var atRuleType = ruleProps.atRuleType || '';
            var cId = 'cid';
            if (!(selectors instanceof Array) && !selectors.models)
                selectors = [selectors];
            var a1 = a.map(selectors.models || selectors, model => model.get('name'));
            var a2 = a.map(this.get('selectors').models, model => model.get('name'));
            var f = false;
            if (a1.length !== a2.length)
                return f;
            for (var i = 0; i < a1.length; i++) {
                var re = 0;
                for (var j = 0; j < a2.length; j++) {
                    if (a1[i] === a2[j])
                        re = 1;
                }
                if (re === 0)
                    return f;
            }
            if (this.get('state') !== st || this.get('mediaText') !== wd || this.get('selectorsAdd') !== selectorsAdd || this.get('atRuleType') !== atRuleType) {
                return f;
            }
            return true;
        }
    });
});
define('skylark-grapejs/css_composer/model/CssRules',[
    'skylark-backbone',
    './CssRule'
], function (Backbone, CssRule) {
    'use strict';
    return Backbone.Collection.extend({
        initialize(models, opt) {
            if (opt && opt.em)
                this.editor = opt.em;
            this.model = (attrs, options) => {
                var model;
                if (!options.em && opt && opt.em)
                    options.em = opt.em;
                switch (1) {
                default:
                    model = new CssRule(attrs, options);
                }
                return model;
            };
        },
        add(models, opt = {}) {
            if (typeof models === 'string') {
                models = this.editor.get('Parser').parseCss(models);
            }
            opt.em = this.editor;
            return Backbone.Collection.prototype.add.apply(this, [
                models,
                opt
            ]);
        }
    });
});
define('skylark-grapejs/css_composer/view/CssRuleView',['skylark-backbone'], function (Backbone) {
    'use strict';
    return Backbone.View.extend({
        tagName: 'style',
        initialize(o = {}) {
            this.config = o.config || {};
            const model = this.model;
            const toTrack = 'change:style change:state change:mediaText';
            this.listenTo(model, toTrack, this.render);
            this.listenTo(model, 'destroy remove', this.remove);
            this.listenTo(model.get('selectors'), 'change', this.render);
        },
        render() {
            const model = this.model;
            const important = model.get('important');
            this.el.innerHTML = this.model.toCSS({ important });
            return this;
        }
    });
});
define('skylark-grapejs/css_composer/view/CssGroupRuleView',['./CssRuleView'], function (CssRuleView) {
    'use strict';
    return CssRuleView.extend({
        _createElement: function (tagName) {
            return document.createTextNode('');
        },
        render() {
            const model = this.model;
            const important = model.get('important');
            this.el.textContent = model.getDeclaration({ important });
            return this;
        }
    });
});
define('skylark-grapejs/css_composer/view/CssRulesView',[
    'skylark-backbone',
    './CssRuleView',
    './CssGroupRuleView'
], function (Backbone, CssRuleView, CssGroupRuleView) {
    'use strict';
    const $ = Backbone.$;
    const getBlockId = (pfx, order) => `${ pfx }${ order ? `-${ parseFloat(order) }` : '' }`;
    return Backbone.View.extend({
        initialize(o) {
            const config = o.config || {};
            this.atRules = {};
            this.config = config;
            this.em = config.em;
            this.pfx = config.stylePrefix || '';
            this.className = this.pfx + 'rules';
            const coll = this.collection;
            this.listenTo(coll, 'add', this.addTo);
            this.listenTo(coll, 'reset', this.render);
        },
        addTo(model) {
            this.addToCollection(model);
        },
        addToCollection(model, fragmentEl) {
            if (!this.renderStarted) {
                return;
            }
            const fragment = fragmentEl || null;
            const {config} = this;
            const opts = {
                model,
                config
            };
            let rendered, view;
            if (model.get('atRuleType') === 'keyframes') {
                const atRule = model.getAtRule();
                let atRuleEl = this.atRules[atRule];
                if (!atRuleEl) {
                    const styleEl = document.createElement('style');
                    atRuleEl = document.createTextNode('');
                    styleEl.appendChild(document.createTextNode(`${ atRule }{`));
                    styleEl.appendChild(atRuleEl);
                    styleEl.appendChild(document.createTextNode(`}`));
                    this.atRules[atRule] = atRuleEl;
                    rendered = styleEl;
                }
                view = new CssGroupRuleView(opts);
                atRuleEl.appendData(view.render().el.textContent);
            } else {
                view = new CssRuleView(opts);
                rendered = view.render().el;
            }
            const clsName = this.className;
            const mediaText = model.get('mediaText');
            const defaultBlockId = getBlockId(clsName);
            let blockId = defaultBlockId;
            if (mediaText) {
                blockId = getBlockId(clsName, this.getMediaWidth(mediaText));
            }
            if (rendered) {
                const container = fragment || this.el;
                let contRules;
                try {
                    contRules = container.querySelector(`#${ blockId }`);
                } catch (e) {
                }
                if (!contRules) {
                    contRules = container.querySelector(`#${ defaultBlockId }`);
                }
                contRules.appendChild(rendered);
            }
            return rendered;
        },
        getMediaWidth(mediaText) {
            return mediaText && mediaText.replace(`(${ this.em.getConfig('mediaCondition') }: `, '').replace(')', '');
        },
        render() {
            this.renderStarted = 1;
            this.atRules = {};
            const {em, $el, className, collection} = this;
            const frag = document.createDocumentFragment();
            $el.empty();
            const prs = em.get('DeviceManager').getAll().pluck('priority');
            prs.every(pr => pr) && prs.unshift(0);
            prs.forEach(pr => $(`<div id="${ getBlockId(className, pr) }"></div>`).appendTo(frag));
            collection.each(model => this.addToCollection(model, frag));
            $el.append(frag);
            $el.attr('class', className);
            return this;
        }
    });
});
define('skylark-grapejs/css_composer/index',[
    'skylark-underscore',
    './config/config',
    './model/CssRule',
    './model/CssRules',
    './view/CssRulesView',
    '../selector_manager/model/Selectors',
    '../selector_manager/model/Selector'
], function (a, defaults, CssRule, CssRules, CssRulesView, Selectors, Selector) {
    'use strict';
    return () => {
        let em;
        var c = {};
        var rules, rulesView;
        return {
            Selectors,
            name: 'CssComposer',
            getConfig() {
                return c;
            },
            storageKey() {
                var keys = [];
                var smc = c.stm && c.stm.getConfig() || {};
                if (smc.storeCss)
                    keys.push('css');
                if (smc.storeStyles)
                    keys.push('styles');
                return keys;
            },
            init(config) {
                c = config || {};
                for (var name in defaults) {
                    if (!(name in c))
                        c[name] = defaults[name];
                }
                var ppfx = c.pStylePrefix;
                if (ppfx)
                    c.stylePrefix = ppfx + c.stylePrefix;
                var elStyle = c.em && c.em.config.style || '';
                c.rules = elStyle || c.rules;
                em = c.em;
                rules = new CssRules([], c);
                rulesView = new CssRulesView({
                    collection: rules,
                    config: c
                });
                return this;
            },
            onLoad() {
                rules.add(c.rules);
            },
            postLoad(em) {
                const ev = 'add remove';
                const rules = this.getAll();
                const um = em.get('UndoManager');
                um && um.add(rules);
                em.stopListening(rules, ev, this.handleChange);
                em.listenTo(rules, ev, this.handleChange);
                rules.each(rule => this.handleChange(rule, { avoidStore: 1 }));
            },
            handleChange(model, opts = {}) {
                const ev = 'change:style';
                const um = em.get('UndoManager');
                um && um.add(model);
                const handleUpdates = em.handleUpdates.bind(em);
                em.stopListening(model, ev, handleUpdates);
                em.listenTo(model, ev, handleUpdates);
                !opts.avoidStore && handleUpdates('', '', opts);
            },
            load(data) {
                var d = data || '';
                if (!d && c.stm) {
                    d = c.em.getCacheLoad();
                }
                var obj = d.styles || '';
                if (d.styles) {
                    try {
                        obj = JSON.parse(d.styles);
                    } catch (err) {
                    }
                } else if (d.css) {
                    obj = c.em.get('Parser').parseCss(d.css);
                }
                if (a.isArray(obj)) {
                    obj.length && rules.reset(obj);
                } else if (obj) {
                    rules.reset(obj);
                }
                return obj;
            },
            store(noStore) {
                if (!c.stm)
                    return;
                var obj = {};
                var keys = this.storageKey();
                if (keys.indexOf('css') >= 0)
                    obj.css = c.em.getCss();
                if (keys.indexOf('styles') >= 0)
                    obj.styles = JSON.stringify(rules);
                if (!noStore)
                    c.stm.store(obj);
                return obj;
            },
            add(selectors, state, width, opts = {}) {
                var s = state || '';
                var w = width || '';
                var opt = { ...opts };
                var rule = this.get(selectors, s, w, opt);
                if (rule && rule.config && !rule.config.singleAtRule) {
                    return rule;
                } else {
                    opt.state = s;
                    opt.mediaText = w;
                    opt.selectors = '';
                    rule = new CssRule(opt, c);
                    rule.get('selectors').add(selectors);
                    rules.add(rule);
                    return rule;
                }
            },
            get(selectors, state, width, ruleProps) {
                var rule = null;
                rules.each(m => {
                    if (rule)
                        return;
                    if (m.compare(selectors, state, width, ruleProps))
                        rule = m;
                });
                return rule;
            },
            getAll() {
                return rules;
            },
            clear() {
                this.getAll().reset();
                return this;
            },
            addCollection(data, opts = {}) {
                var result = [];
                var d = data instanceof Array ? data : [data];
                for (var i = 0, l = d.length; i < l; i++) {
                    var rule = d[i] || {};
                    if (!rule.selectors)
                        continue;
                    var sm = c.em && c.em.get('SelectorManager');
                    if (!sm)
                        console.warn('Selector Manager not found');
                    var sl = rule.selectors;
                    var sels = sl instanceof Array ? sl : [sl];
                    var newSels = [];
                    for (var j = 0, le = sels.length; j < le; j++) {
                        var selec = sm.add(sels[j]);
                        newSels.push(selec);
                    }
                    var modelExists = this.get(newSels, rule.state, rule.mediaText, rule);
                    var model = this.add(newSels, rule.state, rule.mediaText, rule);
                    var updateStyle = !modelExists || !opts.avoidUpdateStyle;
                    const style = rule.style || {};
                    if (updateStyle) {
                        let styleUpdate = opts.extend ? {
                            ...model.get('style'),
                            ...style
                        } : style;
                        model.set('style', styleUpdate);
                    }
                    result.push(model);
                }
                return result;
            },
            setRule(selectors, style, opts = {}) {
                const {atRuleType, atRuleParams} = opts;
                const node = em.get('Parser').parserCss.checkNode({
                    selectors,
                    style
                })[0];
                const {state, selectorsAdd} = node;
                const sm = em.get('SelectorManager');
                const selector = sm.add(node.selectors);
                const rule = this.add(selector, state, atRuleParams, {
                    selectorsAdd,
                    atRule: atRuleType
                });
                rule.setStyle(style, opts);
                return rule;
            },
            getRule(selectors, opts = {}) {
                const sm = em.get('SelectorManager');
                const node = em.get('Parser').parserCss.checkNode({ selectors })[0];
                const selector = sm.get(node.selectors);
                const {state, selectorsAdd} = node;
                const {atRuleType, atRuleParams} = opts;
                return selector && this.get(selector, state, atRuleParams, {
                    selectorsAdd,
                    atRule: atRuleType
                });
            },
            setIdRule(name, style = {}, opts = {}) {
                const state = opts.state || '';
                const media = opts.mediaText || em.getCurrentMedia();
                const sm = em.get('SelectorManager');
                const selector = sm.add({
                    name,
                    type: Selector.TYPE_ID
                });
                const rule = this.add(selector, state, media);
                rule.setStyle(style, opts);
                return rule;
            },
            getIdRule(name, opts = {}) {
                const state = opts.state || '';
                const media = opts.mediaText || em.getCurrentMedia();
                const selector = em.get('SelectorManager').get(name, Selector.TYPE_ID);
                return selector && this.get(selector, state, media);
            },
            setClassRule(name, style = {}, opts = {}) {
                const state = opts.state || '';
                const media = opts.mediaText || em.getCurrentMedia();
                const sm = em.get('SelectorManager');
                const selector = sm.add({
                    name,
                    type: Selector.TYPE_CLASS
                });
                const rule = this.add(selector, state, media);
                rule.setStyle(style, opts);
                return rule;
            },
            getClassRule(name, opts = {}) {
                const state = opts.state || '';
                const media = opts.mediaText || em.getCurrentMedia();
                const selector = em.get('SelectorManager').get(name, Selector.TYPE_CLASS);
                return selector && this.get(selector, state, media);
            },
            render() {
                return rulesView.render().el;
            }
        };
    };
});
define('skylark-grapejs/trait_manager/config/config',[],function () {
    'use strict';
    return {
        stylePrefix: 'trt-',
        appendTo: '',
        optionsTarget: [
            { value: false },
            { value: '_blank' }
        ]
    };
});
define('skylark-grapejs/domain_abstract/view/DomainViews',[
    'skylark-underscore',
    'skylark-backbone'
], function (a, Backbone) {
    'use strict';
    return Backbone.View.extend({
        itemView: '',
        itemsView: '',
        itemType: 'type',
        autoAdd: 0,
        initialize(opts = {}, config) {
            this.config = config || opts.config || {};
            this.autoAdd && this.listenTo(this.collection, 'add', this.addTo);
            this.init();
        },
        init() {
        },
        addTo(model) {
            this.add(model);
        },
        itemViewNotFound(type) {
            const {config, ns} = this;
            const {em} = config;
            const warn = `${ ns ? `[${ ns }]: ` : '' }'${ type }' type not found`;
            em && em.logWarning(warn);
        },
        add(model, fragment) {
            const {config, reuseView, itemsView = {}} = this;
            const inputTypes = [
                'button',
                'checkbox',
                'color',
                'date',
                'datetime-local',
                'email',
                'file',
                'hidden',
                'image',
                'month',
                'number',
                'password',
                'radio',
                'range',
                'reset',
                'search',
                'submit',
                'tel',
                'text',
                'time',
                'url',
                'week'
            ];
            var frag = fragment || null;
            var itemView = this.itemView;
            var typeField = model.get(this.itemType);
            let view;
            if (itemsView[typeField]) {
                itemView = itemsView[typeField];
            } else if (typeField && !itemsView[typeField] && !a.includes(inputTypes, typeField)) {
                this.itemViewNotFound(typeField);
            }
            if (model.view && reuseView) {
                view = model.view;
            } else {
                view = new itemView({
                    model,
                    config
                }, config);
            }
            var rendered = view.render().el;
            if (frag)
                frag.appendChild(rendered);
            else
                this.$el.append(rendered);
        },
        render() {
            var frag = document.createDocumentFragment();
            this.$el.empty();
            if (this.collection.length)
                this.collection.each(function (model) {
                    this.add(model, frag);
                }, this);
            this.$el.append(frag);
            this.onRender();
            return this;
        },
        onRender() {
        }
    });
});
define('skylark-grapejs/trait_manager/view/TraitView',[
    'skylark-backbone',
    'skylark-underscore',
    '../../utils/mixins'
], function (Backbone, a, b) {
    'use strict';
    const $ = Backbone.$;
    return Backbone.View.extend({
        events: {},
        eventCapture: ['change'],
        appendInput: 1,
        attributes() {
            return this.model.get('attributes');
        },
        templateLabel() {
            const {ppfx} = this;
            const label = this.getLabel();
            return `<div class="${ ppfx }label" title="${ label }">${ label }</div>`;
        },
        templateInput() {
            const {clsField} = this;
            return `<div class="${ clsField }" data-input></div>`;
        },
        initialize(o = {}) {
            const {
                config = {}
            } = o;
            const {model, eventCapture} = this;
            const {target} = model;
            const {type} = model.attributes;
            this.config = config;
            this.em = config.em;
            this.pfx = config.stylePrefix || '';
            this.ppfx = config.pStylePrefix || '';
            this.target = target;
            const {ppfx} = this;
            this.clsField = `${ ppfx }field ${ ppfx }field-${ type }`;
            [
                [
                    'change:value',
                    this.onValueChange
                ],
                [
                    'remove',
                    this.removeView
                ]
            ].forEach(([event, clb]) => {
                model.off(event, clb);
                this.listenTo(model, event, clb);
            });
            model.view = this;
            this.listenTo(model, 'change:label', this.render);
            this.listenTo(model, 'change:placeholder', this.rerender);
            eventCapture.forEach(event => this.events[event] = 'onChange');
            this.delegateEvents();
            this.init();
        },
        getClbOpts() {
            return {
                component: this.target,
                trait: this.model,
                elInput: this.getInputElem()
            };
        },
        removeView() {
            this.remove();
            this.removed();
        },
        init() {
        },
        removed() {
        },
        onRender() {
        },
        onUpdate() {
        },
        onEvent() {
        },
        onChange(event) {
            const el = this.getInputElem();
            if (el && !a.isUndefined(el.value)) {
                this.model.set('value', el.value);
            }
            this.onEvent({
                ...this.getClbOpts(),
                event
            });
        },
        getValueForTarget() {
            return this.model.get('value');
        },
        setInputValue(value) {
            const el = this.getInputElem();
            el && (el.value = value);
        },
        onValueChange(model, value, opts = {}) {
            if (opts.fromTarget) {
                this.setInputValue(model.get('value'));
                this.postUpdate();
            } else {
                const val = this.getValueForTarget();
                model.setTargetValue(val, opts);
            }
        },
        renderLabel() {
            const {$el, target} = this;
            const label = this.getLabel();
            let tpl = this.templateLabel(target);
            if (this.createLabel) {
                tpl = this.createLabel({
                    label,
                    component: target,
                    trait: this
                }) || '';
            }
            $el.find('[data-label]').append(tpl);
        },
        getLabel() {
            const {em} = this;
            const {label, name} = this.model.attributes;
            return em.t(`traitManager.traits.labels.${ name }`) || b.capitalize(label || name).replace(/-/g, ' ');
        },
        getComponent() {
            return this.target;
        },
        getInputEl() {
            if (!this.$input) {
                const {em, model} = this;
                const md = model;
                const {name} = model.attributes;
                const plh = md.get('placeholder') || md.get('default') || '';
                const type = md.get('type') || 'text';
                const min = md.get('min');
                const max = md.get('max');
                const value = this.getModelValue();
                const input = $(`<input type="${ type }" placeholder="${ plh }">`);
                const i18nAttr = em.t(`traitManager.traits.attributes.${ name }`) || {};
                input.attr(i18nAttr);
                if (!a.isUndefined(value)) {
                    md.set({ value }, { silent: true });
                    input.prop('value', value);
                }
                if (min) {
                    input.prop('min', min);
                }
                if (max) {
                    input.prop('max', max);
                }
                this.$input = input;
            }
            return this.$input.get(0);
        },
        getInputElem() {
            const {input, $input} = this;
            return input || $input && $input.get && $input.get(0) || this.getElInput();
        },
        getModelValue() {
            let value;
            const model = this.model;
            const target = this.target;
            const name = model.get('name');
            if (model.get('changeProp')) {
                value = target.get(name);
            } else {
                const attrs = target.get('attributes');
                value = model.get('value') || attrs[name];
            }
            return !a.isUndefined(value) ? value : '';
        },
        getElInput() {
            return this.elInput;
        },
        renderField() {
            const {$el, appendInput, model} = this;
            const inputs = $el.find('[data-input]');
            const el = inputs[inputs.length - 1];
            let tpl = model.el;
            if (!tpl) {
                tpl = this.createInput ? this.createInput(this.getClbOpts()) : this.getInputEl();
            }
            if (a.isString(tpl)) {
                el.innerHTML = tpl;
                this.elInput = el.firstChild;
            } else {
                appendInput ? el.appendChild(tpl) : el.insertBefore(tpl, el.firstChild);
                this.elInput = tpl;
            }
            model.el = this.elInput;
        },
        hasLabel() {
            const {label} = this.model.attributes;
            return !this.noLabel && label !== false;
        },
        rerender() {
            this.model.el = null;
            this.render();
        },
        postUpdate() {
            this.onUpdate(this.getClbOpts());
        },
        render() {
            const {$el, pfx, ppfx, model} = this;
            const {type} = model.attributes;
            const hasLabel = this.hasLabel && this.hasLabel();
            const cls = `${ pfx }trait`;
            this.$input = null;
            let tmpl = `<div class="${ cls }">
      ${ hasLabel ? `<div class="${ ppfx }label-wrp" data-label></div>` : '' }
      <div class="${ ppfx }field-wrp ${ ppfx }field-wrp--${ type }" data-input>
        ${ this.templateInput ? a.isFunction(this.templateInput) ? this.templateInput(this.getClbOpts()) : this.templateInput : '' }
      </div>
    </div>`;
            $el.empty().append(tmpl);
            hasLabel && this.renderLabel();
            this.renderField();
            this.el.className = `${ cls }__wrp`;
            this.postUpdate();
            this.onRender(this.getClbOpts());
            return this;
        }
    });
});
define('skylark-grapejs/trait_manager/view/TraitSelectView',[
    'skylark-backbone',
    'skylark-underscore',
    './TraitView'
], function (Backbone, a, TraitView) {
    'use strict';
    const $ = Backbone.$;
    return TraitView.extend({
        init() {
            this.listenTo(this.model, 'change:options', this.rerender);
        },
        templateInput() {
            const {ppfx, clsField} = this;
            return `<div class="${ clsField }">
      <div data-input></div>
      <div class="${ ppfx }sel-arrow">
        <div class="${ ppfx }d-s-arrow"></div>
      </div>
    </div>`;
        },
        getInputEl() {
            if (!this.$input) {
                const {model, em} = this;
                const propName = model.get('name');
                const opts = model.get('options') || [];
                let input = '<select>';
                opts.forEach(el => {
                    let attrs = '';
                    let name, value, style;
                    if (a.isString(el)) {
                        name = el;
                        value = el;
                    } else {
                        name = el.name || el.label || el.value;
                        value = `${ a.isUndefined(el.value) ? el.id : el.value }`.replace(/"/g, '&quot;');
                        style = el.style ? el.style.replace(/"/g, '&quot;') : '';
                        attrs += style ? ` style="${ style }"` : '';
                    }
                    const resultName = em.t(`traitManager.traits.options.${ propName }.${ value }`) || name;
                    input += `<option value="${ value }"${ attrs }>${ resultName }</option>`;
                });
                input += '</select>';
                this.$input = $(input);
                const val = model.getTargetValue();
                !a.isUndefined(val) && this.$input.val(val);
            }
            return this.$input.get(0);
        }
    });
});
define('skylark-grapejs/trait_manager/view/TraitCheckboxView',[
    'skylark-underscore',
    './TraitView'
], function (a, TraitView) {
    'use strict';
    return TraitView.extend({
        appendInput: 0,
        templateInput() {
            const {ppfx, clsField} = this;
            return `<label class="${ clsField }" data-input>
    <i class="${ ppfx }chk-icon"></i>
  </label>`;
        },
        onChange() {
            const value = this.getInputElem().checked;
            this.model.set('value', this.getCheckedValue(value));
        },
        getCheckedValue(checked) {
            let result = checked;
            const {valueTrue, valueFalse} = this.model.attributes;
            if (result && !a.isUndefined(valueTrue)) {
                result = valueTrue;
            }
            if (!result && !a.isUndefined(valueFalse)) {
                result = valueFalse;
            }
            return result;
        },
        getInputEl(...args) {
            const toInit = !this.$input;
            const el = TraitView.prototype.getInputEl.apply(this, args);
            if (toInit) {
                let checked, targetValue;
                const {model, target} = this;
                const {valueTrue, valueFalse} = model.attributes;
                const name = model.get('name');
                if (model.get('changeProp')) {
                    checked = target.get(name);
                    targetValue = checked;
                } else {
                    targetValue = target.get('attributes')[name];
                    checked = targetValue || targetValue === '' ? !0 : !1;
                }
                if (!a.isUndefined(valueFalse) && targetValue === valueFalse) {
                    checked = !1;
                }
                el.checked = checked;
            }
            return el;
        }
    });
});
define('skylark-grapejs/trait_manager/view/TraitNumberView',[
    './TraitView',
    '../../domain_abstract/ui/InputNumber'
], function (TraitView, InputNumber) {
    'use strict';
    return TraitView.extend({
        getValueForTarget() {
            const {model} = this;
            const {value, unit} = model.attributes;
            return value ? value + unit : '';
        },
        getInputEl() {
            if (!this.input) {
                var value = this.getModelValue();
                var inputNumber = new InputNumber({
                    contClass: this.ppfx + 'field-int',
                    model: this.model,
                    ppfx: this.ppfx
                });
                this.input = inputNumber.render();
                this.$input = this.input.inputEl;
                this.$unit = this.input.unitEl;
                this.model.set('value', value);
                this.$input.val(value);
                this.input = inputNumber.el;
            }
            return this.input;
        }
    });
});
define('skylark-grapejs/trait_manager/view/TraitColorView',[
    './TraitView',
    '../../domain_abstract/ui/InputColor'
], function (TraitView, InputColor) {
    'use strict';
    return TraitView.extend({
        templateInput: '',
        getInputEl() {
            if (!this.input) {
                const model = this.model;
                const value = this.getModelValue();
                const inputColor = new InputColor({
                    model,
                    target: this.config.em,
                    contClass: this.ppfx + 'field-color',
                    ppfx: this.ppfx
                });
                const input = inputColor.render();
                input.setValue(value, { fromTarget: 1 });
                this.input = input.el;
            }
            return this.input;
        }
    });
});
define('skylark-grapejs/trait_manager/view/TraitButtonView',[
    'skylark-underscore',
    './TraitView'
], function (a, TraitView) {
    'use strict';
    return TraitView.extend({
        events: { 'click button': 'handleClick' },
        templateInput: '',
        handleClick() {
            const {model, em} = this;
            const command = model.get('command');
            if (command) {
                if (a.isString(command)) {
                    em.get('Commands').run(command);
                } else {
                    command(em.get('Editor'), model);
                }
            }
        },
        renderLabel() {
            if (this.model.get('label')) {
                TraitView.prototype.renderLabel.apply(this, arguments);
            }
        },
        getInputEl() {
            const {model, ppfx} = this;
            const {labelButton, text, full} = model.props();
            const label = labelButton || text;
            const className = `${ ppfx }btn`;
            const input = `<button type="button" class="${ className }-prim${ full ? ` ${ className }--full` : '' }">${ label }</button>`;
            return input;
        }
    });
});
define('skylark-grapejs/trait_manager/view/TraitsView',[
    '../../domain_abstract/view/DomainViews',
    './TraitView',
    './TraitSelectView',
    './TraitCheckboxView',
    './TraitNumberView',
    './TraitColorView',
    './TraitButtonView'
], function (DomainViews, TraitView, TraitSelectView, TraitCheckboxView, TraitNumberView, TraitColorView, TraitButtonView) {
    'use strict';
    return DomainViews.extend({
        ns: 'Traits',
        itemView: TraitView,
        reuseView: 1,
        itemsView: {
            text: TraitView,
            number: TraitNumberView,
            select: TraitSelectView,
            checkbox: TraitCheckboxView,
            color: TraitColorView,
            button: TraitButtonView
        },
        initialize(o = {}) {
            const config = o.config || {};
            this.config = config;
            this.em = o.editor;
            this.pfx = config.stylePrefix || '';
            this.ppfx = config.pStylePrefix || '';
            this.className = this.pfx + 'traits';
            const toListen = 'component:toggled';
            this.listenTo(this.em, toListen, this.updatedCollection);
            this.updatedCollection();
        },
        updatedCollection() {
            const ppfx = this.ppfx;
            const comp = this.em.getSelected();
            this.el.className = `${ this.className } ${ ppfx }one-bg ${ ppfx }two-color`;
            this.collection = comp ? comp.get('traits') : [];
            this.render();
        }
    });
});
define('skylark-grapejs/trait_manager/index',[
    'skylark-underscore',
    './config/config',
    './view/TraitsView'
], function (a, defaultOpts, TraitsView) {
    'use strict';
    return () => {
        let c = {};
        let TraitsViewer;
        return {
            TraitsView,
            name: 'TraitManager',
            getConfig() {
                return c;
            },
            init(config = {}) {
                c = config;
                a.defaults(c, defaultOpts);
                const ppfx = c.pStylePrefix;
                ppfx && (c.stylePrefix = `${ ppfx }${ c.stylePrefix }`);
                TraitsViewer = new TraitsView({
                    collection: [],
                    editor: c.em,
                    config: c
                });
                return this;
            },
            postRender() {
                const elTo = this.getConfig().appendTo;
                if (elTo) {
                    const el = a.isElement(elTo) ? elTo : document.querySelector(elTo);
                    el.appendChild(this.render());
                }
            },
            getTraitsViewer() {
                return TraitsViewer;
            },
            addType(name, trait) {
                var itemView = TraitsViewer.itemView;
                TraitsViewer.itemsView[name] = itemView.extend(trait);
            },
            getType(name) {
                return TraitsViewer.itemsView[name];
            },
            render() {
                return TraitsViewer.render().el;
            }
        };
    };
});
define('skylark-grapejs/dom_components/config/config',[],function () {
    'use strict';
    return {
        stylePrefix: 'comp-',
        wrapperId: 'wrapper',
        wrapperName: 'Body',
        wrapper: {
            removable: false,
            copyable: false,
            draggable: false,
            components: [],
            traits: [],
            stylable: [
                'background',
                'background-color',
                'background-image',
                'background-repeat',
                'background-attachment',
                'background-position',
                'background-size'
            ]
        },
        components: [],
        draggableComponents: 1,
        storeWrapper: 0,
        processor: 0,
        voidElements: [
            'area',
            'base',
            'br',
            'col',
            'embed',
            'hr',
            'img',
            'input',
            'keygen',
            'link',
            'menuitem',
            'meta',
            'param',
            'source',
            'track',
            'wbr'
        ]
    };
});
define('skylark-grapejs/dom_components/model/Components',[
    "skylark-langx/langx",
    'skylark-backbone',
    'skylark-underscore'
], function (langx,Backbone, _) {
    'use strict';
    let Component;
    var Components =  Backbone.Collection.extend({
        initialize(models, opt = {}) {
            this.opt = opt;
            this.listenTo(this, 'add', this.onAdd);
            this.config = opt.config;
            this.em = opt.em;
            const {em} = this;
            this.model = function(attrs, options) { // modified by lwf
                var model;
                const df = opt.em.get('DomComponents').componentTypes;
                options.em = opt.em;
                options.config = opt.config;
                options.componentTypes = df;
                options.domc = opt.domc;
                for (var it = 0; it < df.length; it++) {
                    var dfId = df[it].id;
                    if (dfId == attrs.type) {
                        model = df[it].model;
                        break;
                    }
                }
                if (!model) {
                    model = df[df.length - 1].model;
                    em && attrs.type && em.logWarning(`Component type '${ attrs.type }' not found`, {
                        attrs,
                        options
                    });
                }
                return new model(attrs, options);
            };
        },
        parseString(value, opt = {}) {
            const {em} = this;
            const {domc} = this.opt;
            const cssc = em.get('CssComposer');
            const parsed = em.get('Parser').parseHtml(value);
            if (!Component)
                Component =  Components.Component; //require('./Component').default; // modified by lwf
            Component.checkId(parsed.html, parsed.css, domc.componentsById);
            if (parsed.css && cssc && !opt.temporary) {
                cssc.addCollection(parsed.css, langx.mixin({},opt,{
                    extend: 1
                }));
            }
            return parsed.html;
        },
        add(models, opt = {}) {
            if (_.isString(models)) {
                models = this.parseString(models, opt);
            } else if (_.isArray(models)) {
                models.forEach((item, index) => {
                    if (_.isString(item)) {
                        models[index] = this.parseString(item, opt);
                    }
                });
            }
            const isMult = _.isArray(models);
            models = (isMult ? models : [models]).filter(i => i).map(model => this.processDef(model));
            models = isMult ? models : models[0];
            return Backbone.Collection.prototype.add.apply(this, [
                models,
                opt
            ]);
        },
        processDef(mdl) {
            if (mdl.cid && mdl.ccid)
                return mdl;
            const {em, config = {}} = this;
            const {processor} = config;
            let model = mdl;
            if (processor) {
                model = { ...model };
                const modelPr = processor(model);
                if (modelPr) {
                    _.each(model, (val, key) => delete model[key]);
                    _.extend(model, modelPr);
                }
            }
            if (model.$$typeof && typeof model.props == 'object') {
                model = { ...model };
                model.props = { ...model.props };
                const domc = em.get('DomComponents');
                const parser = em.get('Parser');
                const {parserHtml} = parser;
                _.each(model, (value, key) => {
                    if (!_.includes([
                            'props',
                            'type'
                        ], key))
                        delete model[key];
                });
                const {props} = model;
                const comps = props.children;
                delete props.children;
                delete model.props;
                const res = parserHtml.splitPropsFromAttr(props);
                model.attributes = res.attrs;
                if (comps) {
                    model.components = comps;
                }
                if (!model.type) {
                    model.type = 'textnode';
                } else if (!domc.getType(model.type)) {
                    model.tagName = model.type;
                    delete model.type;
                }
                _.extend(model, res.props);
            }
            return model;
        },
        onAdd(model, c, opts = {}) {
            const em = this.em;
            const style = model.getStyle();
            const avoidInline = em && em.getConfig('avoidInlineStyle');
            if (!_.isEmpty(style) && !avoidInline && em && em.get && em.getConfig('forceClass') && !opts.temporary) {
                const name = model.cid;
                const rule = em.get('CssComposer').setClassRule(name, style);
                model.setStyle({});
                model.addClass(name);
            }
        }
    });

    return Components;
});
define('skylark-grapejs/trait_manager/model/Trait',[
    'skylark-backbone',
    'skylark-underscore'
], function (Backbone, a) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            type: 'text',
            label: '',
            name: '',
            min: '',
            max: '',
            unit: '',
            step: 1,
            value: '',
            target: '',
            default: '',
            placeholder: '',
            changeProp: 0,
            options: []
        },
        initialize() {
            const target = this.get('target');
            const name = this.get('name');
            const changeProp = this.get('changeProp');
            if (target) {
                this.target = target;
                this.unset('target');
                const targetEvent = changeProp ? `change:${ name }` : `change:attributes:${ name }`;
                this.listenTo(target, targetEvent, this.targetUpdated);
            }
        },
        props() {
            return this.attributes;
        },
        targetUpdated() {
            const value = this.getTargetValue();
            this.set({ value }, { fromTarget: 1 });
        },
        getTargetValue() {
            const name = this.get('name');
            const target = this.target;
            let value;
            if (this.get('changeProp')) {
                value = target.get(name);
            } else {
                value = target.getAttributes()[name];
            }
            return !a.isUndefined(value) ? value : '';
        },
        setTargetValue(value, opts = {}) {
            const target = this.target;
            const name = this.get('name');
            if (a.isUndefined(value))
                return;
            let valueToSet = value;
            if (value === 'false') {
                valueToSet = false;
            } else if (value === 'true') {
                valueToSet = true;
            }
            if (this.get('changeProp')) {
                target.set(name, valueToSet, opts);
            } else {
                const attrs = { ...target.get('attributes') };
                attrs[name] = valueToSet;
                target.set('attributes', attrs, opts);
            }
        },
        setValueFromInput(value, final = 1, opts = {}) {
            const toSet = { value };
            this.set(toSet, {
                ...opts,
                avoidStore: 1
            });
            if (final) {
                this.set('value', '', opts);
                this.set(toSet, opts);
            }
        },
        getInitValue() {
            const target = this.target;
            const name = this.get('name');
            let value;
            if (target) {
                const attrs = target.get('attributes');
                value = this.get('changeProp') ? target.get(name) : attrs[name];
            }
            return value || this.get('value') || this.get('default');
        }
    });
});
define('skylark-grapejs/trait_manager/model/TraitFactory',[],function () {
    'use strict';
    return (config = {}) => ({
        build(props) {
            var objs = [];
            if (typeof props === 'string')
                props = [props];
            for (var i = 0; i < props.length; i++) {
                var obj = {};
                var prop = props[i];
                obj.name = prop;
                switch (prop) {
                case 'target':
                    obj.type = 'select';
                    break;
                }
                switch (prop) {
                case 'target':
                    obj.options = config.optionsTarget;
                    break;
                }
                objs.push(obj);
            }
            return objs;
        }
    });
});
define('skylark-grapejs/trait_manager/model/Traits',[
    'skylark-backbone',
    'skylark-underscore',
    './Trait',
    './TraitFactory'
], function (Backbone, a, Trait, TraitFactory) {
    'use strict';
    return Backbone.Collection.extend({
        model: Trait,
        initialize(coll, options = {}) {
            this.em = options.em || '';
            this.listenTo(this, 'add', this.handleAdd);
            this.listenTo(this, 'reset', this.handleReset);
        },
        handleReset(coll, {
            previousModels = []
        } = {}) {
            previousModels.forEach(model => model.trigger('remove'));
        },
        handleAdd(model) {
            const target = this.target;
            if (target) {
                model.target = target;
            }
        },
        setTarget(target) {
            this.target = target;
        },
        add(models, opt) {
            const em = this.em;
            if (a.isString(models) || a.isArray(models)) {
                const tm = em && em.get && em.get('TraitManager');
                const tmOpts = tm && tm.getConfig();
                const tf = TraitFactory(tmOpts);
                if (a.isString(models)) {
                    models = [models];
                }
                for (var i = 0, len = models.length; i < len; i++) {
                    const str = models[i];
                    const model = a.isString(str) ? tf.build(str)[0] : str;
                    model.target = this.target;
                    models[i] = model;
                }
            }
            return Backbone.Collection.prototype.add.apply(this, [
                models,
                opt
            ]);
        }
    });
});
define('skylark-grapejs/dom_components/model/Component',[
    "skylark-langx/langx",
    'skylark-underscore',
    '../../utils/mixins',
    '../../domain_abstract/model/Styleable',
    'skylark-backbone',
    './Components',
    '../../selector_manager/model/Selector',
    '../../selector_manager/model/Selectors',
    '../../trait_manager/model/Traits'
], function (langx,_, b, Styleable, Backbone, Components, Selector, Selectors, Traits) {
    'use strict';

    const componentList = {};
    let componentIndex = 0;
    const escapeRegExp = str => {
        return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    };
    const avoidInline = em => em && em.getConfig('avoidInlineStyle');
    const eventDrag = 'component:drag';
    const Component = Backbone.Model.extend(Styleable).extend({
        defaults: {
            tagName: 'div',
            type: '',
            name: '',
            removable: true,
            draggable: true,
            droppable: true,
            badgable: true,
            stylable: true,
            'stylable-require': '',
            'style-signature': '',
            unstylable: '',
            highlightable: true,
            copyable: true,
            resizable: false,
            editable: false,
            layerable: true,
            selectable: true,
            hoverable: true,
            void: false,
            state: '',
            status: '',
            content: '',
            icon: '',
            style: '',
            classes: '',
            script: '',
            'script-export': '',
            attributes: '',
            traits: [
                'id',
                'title'
            ],
            propagate: '',
            dmode: '',
            toolbar: null
        },
        init() {
        },
        updated(property, value, previous) {
        },
        removed() {
        },
        initialize(props = {}, opt = {}) {
            const em = opt.em;
            const parent = this.parent();
            const parentAttr = parent && parent.attributes;
            if (parentAttr && parentAttr.propagate) {
                let newAttr = {};
                const toPropagate = parentAttr.propagate;
                toPropagate.forEach(prop => newAttr[prop] = parent.get(prop));
                newAttr.propagate = toPropagate;
                newAttr = langx.mixin({},newAttr,props);
                this.set(newAttr);
            }
            const propagate = this.get('propagate');
            propagate && this.set('propagate', _.isArray(propagate) ? propagate : [propagate]);
            if (opt && opt.config && opt.config.voidElements.indexOf(this.get('tagName')) >= 0) {
                this.set('void', true);
            }
            opt.em = em;
            this.opt = opt;
            this.em = em;
            this.frame = opt.frame;
            this.config = opt.config || {};
            this.set('attributes', langx.mixin({},this.defaults.attributes ,this.get('attributes') ));
            this.ccid = Component.createId(this);
            this.initClasses();
            this.initTraits();
            this.initComponents();
            this.initToolbar();
            this.listenTo(this, 'change:script', this.scriptUpdated);
            this.listenTo(this, 'change:tagName', this.tagUpdated);
            this.listenTo(this, 'change:attributes', this.attrUpdated);
            this.listenTo(this, 'change:attributes:id', this._idUpdated);
            this.set('status', '');
            this.views = [];
            [
                'classes',
                'traits',
                'components'
            ].forEach(name => {
                const events = `add remove ${ name !== 'components' ? 'change' : '' }`;
                this.listenTo(this.get(name), events.trim(), (...args) => this.emitUpdate(name, ...args));
            });
            if (!opt.temporary) {
                this.init();
                em && em.trigger('component:create', this);
            }
        },
        is(type) {
            return !!(this.get('type') == type);
        },
        props() {
            return this.attributes;
        },
        index() {
            const {collection} = this;
            return collection && collection.indexOf(this);
        },
        setDragMode(value) {
            return this.set('dmode', value);
        },
        find(query) {
            const result = [];
            const $els = this.view.$el.find(query);
            $els.each(i => {
                const $el = $els.eq(i);
                const model = $el.data('model');
                model && result.push(model);
            });
            return result;
        },
        findType(id) {
            const result = [];
            const find = components => components.forEach(item => {
                item.is(id) && result.push(item);
                find(item.components());
            });
            find(this.components());
            return result;
        },
        closest(query) {
            const result = this.view.$el.closest(query);
            return result.length && result.data('model');
        },
        tagUpdated() {
            const coll = this.collection;
            const at = coll.indexOf(this);
            coll.remove(this);
            coll.add(this, { at });
        },
        replaceWith(el) {
            const coll = this.collection;
            const at = coll.indexOf(this);
            coll.remove(this);
            return coll.add(el, { at });
        },
        attrUpdated(m, v, opts = {}) {
            const attrs = this.get('attributes');
            const classes = attrs.class;
            classes && this.setClass(classes);
            delete attrs.class;
            const style = attrs.style;
            style && this.setStyle(style);
            delete attrs.style;
            const attrPrev = { ...this.previous('attributes') };
            const diff = b.shallowDiff(attrPrev, this.get('attributes'));
            _.keys(diff).forEach(pr => this.trigger(`change:attributes:${ pr }`, this, diff[pr], opts));
        },
        setAttributes(attrs, opts = {}) {
            this.set('attributes', { ...attrs }, opts);
            return this;
        },
        addAttributes(attrs) {
            const newAttrs = {
                ...this.getAttributes(),
                ...attrs
            };
            this.setAttributes(newAttrs);
            return this;
        },
        getStyle() {
            const em = this.em;
            if (em && em.getConfig('avoidInlineStyle')) {
                const state = em.get('state');
                const cc = em.get('CssComposer');
                const rule = cc.getIdRule(this.getId(), { state });
                this.rule = rule;
                if (rule) {
                    return rule.getStyle();
                }
            }
            return Styleable.getStyle.call(this);
        },
        setStyle(prop = {}, opts = {}) {
            const em = this.em;
            const {opt} = this;
            if (em && em.getConfig('avoidInlineStyle') && !opt.temporary) {
                const style = this.get('style') || {};
                prop = _.isString(prop) ? this.parseStyle(prop) : prop;
                prop = {
                    ...prop,
                    ...style
                };
                const state = em.get('state');
                const cc = em.get('CssComposer');
                const propOrig = this.getStyle();
                this.rule = cc.setIdRule(this.getId(), prop, {
                    ...opts,
                    state
                });
                const diff = b.shallowDiff(propOrig, prop);
                this.set('style', {}, { silent: 1 });
                _.keys(diff).forEach(pr => this.trigger(`change:style:${ pr }`));
            } else {
                prop = Styleable.setStyle.apply(this, arguments);
            }
            return prop;
        },
        getAttributes() {
            const {em} = this;
            const classes = [];
            const attributes = { ...this.get('attributes') };
            const sm = em && em.get('SelectorManager');
            const id = this.getId();
            this.get('classes').forEach(cls => classes.push(_.isString(cls) ? cls : cls.get('name')));
            classes.length && (attributes.class = classes.join(' '));
            if (!_.has(attributes, 'id')) {
                let hasStyle;
                if (avoidInline(em)) {
                    hasStyle = sm && sm.get(id, sm.Selector.TYPE_ID);
                } else if (!_.isEmpty(this.getStyle())) {
                    hasStyle = 1;
                }
                if (hasStyle) {
                    attributes.id = this.getId();
                }
            }
            return attributes;
        },
        addClass(classes) {
            const added = this.em.get('SelectorManager').addClass(classes);
            return this.get('classes').add(added);
        },
        setClass(classes) {
            this.get('classes').reset();
            return this.addClass(classes);
        },
        removeClass(classes) {
            const removed = [];
            classes = _.isArray(classes) ? classes : [classes];
            const selectors = this.get('classes');
            const type = Selector.TYPE_CLASS;
            classes.forEach(classe => {
                const classes = classe.split(' ');
                classes.forEach(name => {
                    const selector = selectors.where({
                        name,
                        type
                    })[0];
                    selector && removed.push(selectors.remove(selector));
                });
            });
            return removed;
        },
        getClasses() {
            const attr = this.getAttributes();
            const classStr = attr.class;
            return classStr ? classStr.split(' ') : [];
        },
        initClasses() {
            const event = 'change:classes';
            const toListen = [
                this,
                event,
                this.initClasses
            ];
            const cls = this.get('classes') || [];
            const clsArr = _.isString(cls) ? cls.split(' ') : cls;
            this.stopListening(...toListen);
            const classes = this.normalizeClasses(clsArr);
            const selectors = new Selectors([]);
            this.set('classes', selectors);
            selectors.add(classes);
            this.listenTo(...toListen);
            return this;
        },
        initComponents() {
            const event = 'change:components';
            const toListen = [
                this,
                event,
                this.initComponents
            ];
            this.stopListening(...toListen);
            const comps = new Components(null, this.opt);
            comps.parent = this;
            const components = this.get('components');
            const addChild = !this.opt.avoidChildren;
            this.set('components', comps);
            addChild && comps.add(_.isFunction(components) ? components(this) : components);
            this.listenTo(...toListen);
            return this;
        },
        initTraits(changed) {
            const {em} = this;
            const event = 'change:traits';
            const toListen = [
                this,
                event,
                this.initTraits
            ];
            this.stopListening(...toListen);
            this.loadTraits();
            const attrs = { ...this.get('attributes') };
            const traits = this.get('traits');
            traits.each(trait => {
                if (!trait.get('changeProp')) {
                    const name = trait.get('name');
                    const value = trait.getInitValue();
                    if (name && value)
                        attrs[name] = value;
                }
            });
            traits.length && this.set('attributes', attrs);
            this.listenTo(...toListen);
            changed && em && em.trigger('component:toggled');
            return this;
        },
        append(components, opts = {}) {
            const result = this.components().add(components, opts);
            return _.isArray(result) ? result : [result];
        },
        components(components) {
            const coll = this.get('components');
            if (_.isUndefined(components)) {
                return coll;
            } else {
                coll.reset();
                return components && this.append(components);
            }
        },
        parent() {
            const coll = this.collection;
            return coll && coll.parent;
        },
        scriptUpdated() {
            this.set('scriptUpdated', 1);
        },
        initToolbar() {
            const {em} = this;
            const model = this;
            const ppfx = em && em.getConfig('stylePrefix') || '';
            if (!model.get('toolbar')) {
                var tb = [];
                if (model.collection) {
                    tb.push({
                        attributes: { class: 'fa fa-arrow-up' },
                        command: ed => ed.runCommand('core:component-exit', { force: 1 })
                    });
                }
                if (model.get('draggable')) {
                    tb.push({
                        attributes: {
                            class: `fa fa-arrows ${ ppfx }no-touch-actions`,
                            draggable: true
                        },
                        command: 'tlb-move'
                    });
                }
                if (model.get('copyable')) {
                    tb.push({
                        attributes: { class: 'fa fa-clone' },
                        command: 'tlb-clone'
                    });
                }
                if (model.get('removable')) {
                    tb.push({
                        attributes: { class: 'fa fa-trash-o' },
                        command: 'tlb-delete'
                    });
                }
                model.set('toolbar', tb);
            }
        },
        loadTraits(traits, opts = {}) {
            traits = traits || this.get('traits');
            traits = _.isFunction(traits) ? traits(this) : traits;
            if (!(traits instanceof Traits)) {
                const trt = new Traits([], this.opt);
                trt.setTarget(this);
                if (traits.length) {
                    traits.forEach(tr => tr.attributes && delete tr.attributes.value);
                    trt.add(traits);
                }
                this.set('traits', trt, opts);
            }
            return this;
        },
        getTrait(id) {
            return this.get('traits').filter(trait => {
                return trait.get('id') === id || trait.get('name') === id;
            })[0];
        },
        updateTrait(id, props) {
            const {em} = this;
            const trait = this.getTrait(id);
            trait && trait.set(props);
            em && em.trigger('component:toggled');
            return this;
        },
        getTraitIndex(id) {
            const trait = this.getTrait(id);
            return trait ? this.get('traits').indexOf(trait) : trait;
        },
        removeTrait(id) {
            const {em} = this;
            const ids = _.isArray(id) ? id : [id];
            const toRemove = ids.map(id => this.getTrait(id));
            const removed = this.get('traits').remove(toRemove);
            em && em.trigger('component:toggled');
            return removed;
        },
        addTrait(trait, opts = {}) {
            const {em} = this;
            const added = this.get('traits').add(trait, opts);
            em && em.trigger('component:toggled');
            return added;
        },
        normalizeClasses(arr) {
            var res = [];
            const em = this.em;
            if (!em)
                return;
            var clm = em.get('SelectorManager');
            if (!clm)
                return;
            arr.forEach(val => {
                var name = '';
                if (typeof val === 'string')
                    name = val;
                else
                    name = val.name;
                var model = clm.add(name);
                res.push(model);
            });
            return res;
        },
        clone() {
            const em = this.em;
            const style = this.getStyle();
            const attr = { ...this.attributes };
            const opts = { ...this.opt };
            attr.attributes = { ...attr.attributes };
            delete attr.attributes.id;
            attr.components = [];
            attr.classes = [];
            attr.traits = [];
            this.get('components').each((md, i) => {
                attr.components[i] = md.clone();
            });
            this.get('traits').each((md, i) => {
                attr.traits[i] = md.clone();
            });
            this.get('classes').each((md, i) => {
                attr.classes[i] = md.get('name');
            });
            attr.status = '';
            attr.view = '';
            opts.collection = null;
            if (em && em.getConfig('avoidInlineStyle') && !_.isEmpty(style)) {
                attr.style = style;
            }
            const cloned = new this.constructor(attr, opts);
            const event = 'component:clone';
            em && em.trigger(event, cloned);
            this.trigger(event, cloned);
            return cloned;
        },
        getName() {
            const {em} = this;
            const {type, tagName} = this.attributes;
            const cName = this.get('name');
            const isDiv = tagName == 'div';
            const tag = isDiv ? 'box' : tagName;
            const defName = type || tag;
            const nameTag = !type && tagName && !isDiv && tagName;
            const i18nPfx = 'domComponents.names.';
            const i18nName = cName && em && em.t(`${ i18nPfx }${ cName }`);
            const i18nNameTag = nameTag && em && em.t(`${ i18nPfx }${ nameTag }`);
            const i18nDefName = em && (em.t(`${ i18nPfx }${ type }`) || em.t(`${ i18nPfx }${ tagName }`));
            return this.get('custom-name') || i18nName || cName || i18nNameTag || b.capitalize(nameTag) || i18nDefName || b.capitalize(defName);
        },
        getIcon() {
            let icon = this.get('icon');
            return icon ? icon + ' ' : '';
        },
        toHTML(opts = {}) {
            const model = this;
            const attrs = [];
            const customTag = opts.tag;
            const tag = customTag || model.get('tagName');
            const sTag = model.get('void');
            const customAttr = opts.attributes;
            let attributes = this.getAttrToHTML();
            delete opts.tag;
            if (customAttr) {
                if (_.isFunction(customAttr)) {
                    attributes = customAttr(model, attributes) || {};
                } else if (_.isObject(customAttr)) {
                    attributes = customAttr;
                }
            }
            for (let attr in attributes) {
                const val = attributes[attr];
                const value = _.isString(val) ? val.replace(/"/g, '&quot;') : val;
                if (!_.isUndefined(value)) {
                    if (_.isBoolean(value)) {
                        value && attrs.push(attr);
                    } else {
                        attrs.push(`${ attr }="${ value }"`);
                    }
                }
            }
            let attrString = attrs.length ? ` ${ attrs.join(' ') }` : '';
            let code = `<${ tag }${ attrString }${ sTag ? '/' : '' }>${ model.get('content') }`;
            model.get('components').each(comp => code += comp.toHTML(opts));
            !sTag && (code += `</${ tag }>`);
            return code;
        },
        getAttrToHTML() {
            var attr = this.getAttributes();
            delete attr.style;
            return attr;
        },
        toJSON(...args) {
            const obj = Backbone.Model.prototype.toJSON.apply(this, args);
            obj.attributes = this.getAttributes();
            delete obj.attributes.class;
            delete obj.toolbar;
            delete obj.traits;
            if (this.em.getConfig('avoidDefaults')) {
                const defaults = _.result(this, 'defaults');
                _.forEach(defaults, (value, key) => {
                    if ([
                            'type',
                            'content'
                        ].indexOf(key) === -1 && obj[key] === value) {
                        delete obj[key];
                    }
                });
                if (_.isEmpty(obj.type)) {
                    delete obj.type;
                }
                _.forEach([
                    'attributes',
                    'style'
                ], prop => {
                    if (_.isEmpty(defaults[prop]) && _.isEmpty(obj[prop])) {
                        delete obj[prop];
                    }
                });
                _.forEach([
                    'classes',
                    'components'
                ], prop => {
                    if (_.isEmpty(defaults[prop]) && !obj[prop].length) {
                        delete obj[prop];
                    }
                });
            }
            return obj;
        },
        getId() {
            let attrs = this.get('attributes') || {};
            return attrs.id || this.ccid || this.cid;
        },
        setId(id, opts) {
            const attrs = { ...this.get('attributes') };
            attrs.id = id;
            this.set('attributes', attrs, opts);
            return this;
        },
        getEl(frame) {
            const view = this.getView(frame);
            return view && view.el;
        },
        getView(frame) {
            let {view, views} = this;
            if (frame) {
                view = views.filter(view => view._getFrame() === frame.view)[0];
            }
            return view;
        },
        getCurrentView() {
            const frame = (this.em.get('currentFrame') || {}).model;
            return this.getView(frame);
        },
        getScriptString(script) {
            var scr = script || this.get('script');
            if (!scr) {
                return scr;
            }
            if (typeof scr == 'function') {
                var scrStr = scr.toString().trim();
                scrStr = scrStr.replace(/^function[\s\w]*\(\)\s?\{/, '').replace(/\}$/, '');
                scr = scrStr.trim();
            }
            var config = this.em.getConfig();
            var tagVarStart = escapeRegExp(config.tagVarStart || '{[ ');
            var tagVarEnd = escapeRegExp(config.tagVarEnd || ' ]}');
            var reg = new RegExp(`${ tagVarStart }([\\w\\d-]*)${ tagVarEnd }`, 'g');
            scr = scr.replace(reg, (match, v) => {
                this.scriptUpdated();
                const result = this.attributes[v] || '';
                return _.isArray(result) || typeof result == 'object' ? JSON.stringify(result) : result;
            });
            return scr;
        },
        emitUpdate(property, ...args) {
            const em = this.em;
            const event = 'component:update' + (property ? `:${ property }` : '');
            property && this.updated(property, property && this.get(property), property && this.previous(property), ...args);
            this.trigger(event, ...args);
            em && em.trigger(event, this, ...args);
        },
        onAll(clb) {
            if (_.isFunction(clb)) {
                clb(this);
                this.components().forEach(model => model.onAll(clb));
            }
            return this;
        },
        remove() {
            const coll = this.collection;
            return coll && coll.remove(this);
        },
        resetId(opts = {}) {
            const {em} = this;
            const oldId = this.getId();
            if (!oldId)
                return;
            const newId = Component.createId(this);
            this.setId(newId);
            const rule = em && em.get('CssComposer').getIdRule(oldId);
            const selector = rule && rule.get('selectors').at(0);
            selector && selector.set('name', newId);
            return this;
        },
        _getStyleRule({id} = {}) {
            const {em} = this;
            const idS = id || this.getId();
            return em && em.get('CssComposer').getIdRule(idS);
        },
        _getStyleSelector(opts) {
            const rule = this._getStyleRule(opts);
            return rule && rule.get('selectors').at(0);
        },
        _idUpdated(m, v, opts = {}) {
            if (opts.idUpdate)
                return;
            const {ccid} = this;
            const {id} = this.get('attributes') || {};
            const idPrev = (this.previous('attributes') || {}).id || ccid;
            const list = Component.getList(this);
            if (list[id]) {
                return this.setId(idPrev, { idUpdate: 1 });
            }
            delete list[idPrev];
            list[id] = this;
            this.ccid = id;
            const selector = this._getStyleSelector({ id: idPrev });
            selector && selector.set({
                name: id,
                label: id
            });
        }
    }, {
        isComponent(el) {
            return { tagName: el.tagName ? el.tagName.toLowerCase() : '' };
        },
        createId(model) {
            const list = Component.getList(model);
            let {id} = model.get('attributes');
            let nextId;
            if (id) {
                nextId = Component.getIncrementId(id, list);
                model.setId(nextId);
            } else {
                nextId = Component.getNewId(list);
            }
            list[nextId] = model;
            return nextId;
        },
        getNewId(list) {
            const count = Object.keys(list).length;
            const ilen = count.toString().length + 2;
            const uid = (Math.random() + 1.1).toString(36).slice(-ilen);
            let newId = `i${ uid }`;
            while (list[newId]) {
                newId = Component.getNewId(list);
            }
            return newId;
        },
        getIncrementId(id, list) {
            let counter = 1;
            let newId = id;
            while (list[newId]) {
                counter++;
                newId = `${ id }-${ counter }`;
            }
            return newId;
        },
        getList(model) {
            const domc = model.opt && model.opt.domc;
            return domc ? domc.componentsById : {};
        },
        checkId(components, styles = [], list = {}) {
            const comps = _.isArray(components) ? components : [components];
            comps.forEach(comp => {
                const {attributes = {}, components} = comp;
                const {id} = attributes;
                if (id && list[id]) {
                    const newId = Component.getIncrementId(id, list);
                    attributes.id = newId;
                    _.isArray(styles) && styles.forEach(style => {
                        const {selectors} = style;
                        selectors.forEach((sel, idx) => {
                            if (sel === `#${ id }`)
                                selectors[idx] = `#${ newId }`;
                        });
                    });
                }
                components && Component.checkId(components, styles, list);
            });
        }
    });
    
    Component.eventDrag = eventDrag;

    Components.Component = Component;
    
    
    return Component;
});
define('skylark-grapejs/dom_components/view/ComponentsView',[
    'skylark-backbone',
    'skylark-underscore'
], function (Backbone, a) {
    'use strict';

    var ComponentsView =  Backbone.View.extend({
        initialize(o) {
            this.opts = o || {};
            this.config = o.config || {};
            this.em = this.config.em;
            const coll = this.collection;
            this.listenTo(coll, 'add', this.addTo);
            this.listenTo(coll, 'reset', this.resetChildren);
            this.listenTo(coll, 'remove', this.removeChildren);
        },
        removeChildren(removed, coll, opts = {}) {
            const {em} = this.config;
            const tempRemove = opts.temporary;
            removed.views.forEach(view => {
                if (!view)
                    return;
                view.remove.apply(view);
                const {childrenView, scriptContainer} = view;
                childrenView && childrenView.stopListening();
                scriptContainer && scriptContainer.remove();
            });
            removed.components().forEach(it => this.removeChildren(it, coll, opts));
            if (em && !tempRemove) {
                const id = removed.getId();
                const domc = em.get('DomComponents');
                delete domc.componentsById[id];
                const allRules = em.get('CssComposer').getAll();
                allRules.remove(allRules.filter(rule => rule.getSelectors().getFullString() === `#${ id }`));
                if (!removed.opt.temporary) {
                    const cm = em.get('Commands');
                    const hasSign = removed.get('style-signature');
                    const optStyle = { target: removed };
                    hasSign && cm.run('core:component-style-clear', optStyle);
                    removed.removed();
                    em.trigger('component:remove', removed);
                }
            }
        },
        addTo(model, coll = {}, opts = {}) {
            const em = this.config.em;
            const i = this.collection.indexOf(model);
            this.addToCollection(model, null, i);
            if (em && !opts.temporary) {
                const triggerAdd = model => {
                    em.trigger('component:add', model);
                    model.components().forEach(comp => triggerAdd(comp));
                };
                triggerAdd(model);
            }
        },
        addToCollection(model, fragmentEl, index) {
            if (!this.compView)
                this.compView = ComponentsView.ComponentView ;//require('./ComponentView').default; // modified by lwf
            const {config, opts, em} = this;
            const fragment = fragmentEl || null;
            const dt = opts.componentTypes || em && em.get('DomComponents').getTypes();
            const type = model.get('type');
            let viewObject = this.compView;
            for (let it = 0; it < dt.length; it++) {
                if (dt[it].id == type) {
                    viewObject = dt[it].view;
                    break;
                }
            }
            const view = new viewObject({
                model,
                config,
                componentTypes: dt
            });
            let rendered = view.render().el;
            if (fragment) {
                fragment.appendChild(rendered);
            } else {
                const parent = this.parentEl;
                const children = parent.childNodes;
                if (!a.isUndefined(index)) {
                    const lastIndex = children.length == index;
                    if (lastIndex) {
                        index--;
                    }
                    if (lastIndex || !children.length) {
                        parent.appendChild(rendered);
                    } else {
                        parent.insertBefore(rendered, children[index]);
                    }
                } else {
                    parent.appendChild(rendered);
                }
            }
            return rendered;
        },
        resetChildren() {
            this.parentEl.innerHTML = '';
            this.collection.each(model => this.addToCollection(model));
        },
        render(parent) {
            const el = this.el;
            const frag = document.createDocumentFragment();
            this.parentEl = parent || this.el;
            this.collection.each(model => this.addToCollection(model, frag));
            el.innerHTML = '';
            el.appendChild(frag);
            return this;
        }
    });

    return ComponentsView;
});
define('skylark-grapejs/dom_components/view/ComponentView',[
    'skylark-backbone',
    'skylark-underscore',
    '../model/Components',
    './ComponentsView',
    '../../selector_manager/model/Selectors',
    '../../utils/dom',
    '../../utils/mixins'
], function (Backbone, a, Components, ComponentsView, Selectors, b, c) {
    'use strict';
    var ComponentView = Backbone.View.extend({
        className() {
            return this.getClasses();
        },
        tagName() {
            return this.model.get('tagName');
        },
        initialize(opt = {}) {
            const model = this.model;
            const config = opt.config || {};
            const em = config.em;
            const modelOpt = model.opt || {};
            const {$el, el} = this;
            const {draggableComponents} = config;
            this.opts = opt;
            this.modelOpt = modelOpt;
            this.config = config;
            this.em = em || '';
            this.pfx = config.stylePrefix || '';
            this.ppfx = config.pStylePrefix || '';
            this.attr = model.get('attributes');
            this.classe = this.attr.class || [];
            this.listenTo(model, 'change:style', this.updateStyle);
            this.listenTo(model, 'change:attributes change:_innertext', this.renderAttributes);
            this.listenTo(model, 'change:highlightable', this.updateHighlight);
            this.listenTo(model, 'change:status', this.updateStatus);
            this.listenTo(model, 'change:script', this.reset);
            this.listenTo(model, 'change:content', this.updateContent);
            this.listenTo(model, 'change', this.handleChange);
            this.listenTo(model, 'active', this.onActive);
            this.listenTo(model, 'disable', this.onDisable);
            $el.data('model', model);
            c.setViewEl(el, this);
            model.view = this;
            this._getFrame() && model.views.push(this);
            this.initClasses();
            this.initComponents({ avoidRender: 1 });
            this.events = {
                ...this.events,
                ...draggableComponents && { dragstart: 'handleDragStart' }
            };
            this.delegateEvents();
            !modelOpt.temporary && this.init(this._clbObj());
        },
        _clbObj() {
            const {em, model, el} = this;
            return {
                editor: em && em.getEditor(),
                model,
                el
            };
        },
        init() {
        },
        removed() {
        },
        onActive() {
        },
        onDisable() {
        },
        remove() {
            Backbone.View.prototype.remove.apply(this, arguments);
            const {model} = this;
            const frame = this._getFrame() || {};
            const frameM = frame.model;
            model.components().forEach(comp => {
                const view = comp.getView(frameM);
                view && view.remove();
            });
            const {views} = model;
            views.splice(views.indexOf(this), 1);
            this.removed(this._clbObj());
            return this;
        },
        handleDragStart(event) {
            event.preventDefault();
            event.stopPropagation();
            this.em.get('Commands').run('tlb-move', {
                target: this.model,
                event
            });
        },
        initClasses() {
            const {model} = this;
            const event = 'change:classes';
            const classes = model.get('classes');
            if (classes instanceof Selectors) {
                this.stopListening(model, event, this.initClasses);
                this.listenTo(model, event, this.initClasses);
                this.listenTo(classes, 'add remove change', this.updateClasses);
                classes.length && this.importClasses();
            }
        },
        initComponents(opts = {}) {
            const {model, $el, childrenView} = this;
            const event = 'change:components';
            const comps = model.get('components');
            const toListen = [
                model,
                event,
                this.initComponents
            ];
            if (comps instanceof Components) {
                $el.data('collection', comps);
                childrenView && childrenView.remove();
                this.stopListening(...toListen);
                !opts.avoidRender && this.renderChildren();
                this.listenTo(...toListen);
            }
        },
        handleChange() {
            const {model} = this;
            const chgArr = a.keys(model.changed);
            if (chgArr.length === 1 && chgArr[0] === 'status')
                return;
            model.emitUpdate();
            for (let prop in model.changed) {
                model.emitUpdate(prop);
            }
        },
        importClasses() {
            var clm = this.config.em.get('SelectorManager');
            if (clm) {
                this.model.get('classes').each(m => {
                    clm.add(m.get('name'));
                });
            }
        },
        updateStatus(opts = {}) {
            const em = this.em;
            const el = this.el;
            const status = this.model.get('status');
            const pfx = this.pfx;
            const ppfx = this.ppfx;
            const selectedCls = `${ ppfx }selected`;
            const selectedParentCls = `${ selectedCls }-parent`;
            const freezedCls = `${ ppfx }freezed`;
            const hoveredCls = `${ ppfx }hovered`;
            const toRemove = [
                selectedCls,
                selectedParentCls,
                freezedCls,
                hoveredCls
            ];
            this.$el.removeClass(toRemove.join(' '));
            var actualCls = el.getAttribute('class') || '';
            var cls = '';
            switch (status) {
            case 'selected':
                cls = `${ actualCls } ${ selectedCls }`;
                break;
            case 'selected-parent':
                cls = `${ actualCls } ${ selectedParentCls }`;
                break;
            case 'freezed':
                cls = `${ actualCls } ${ freezedCls }`;
                break;
            case 'freezed-selected':
                cls = `${ actualCls } ${ freezedCls } ${ selectedCls }`;
                break;
            case 'hovered':
                cls = !opts.avoidHover ? `${ actualCls } ${ hoveredCls }` : '';
                break;
            }
            cls = cls.trim();
            cls && el.setAttribute('class', cls);
        },
        updateHighlight() {
            const hl = this.model.get('highlightable');
            this.setAttribute('data-highlightable', hl ? 1 : '');
        },
        updateStyle() {
            const {model, em, el} = this;
            if (em && em.getConfig('avoidInlineStyle')) {
                if (model.get('_innertext')) {
                    el.removeAttribute('id');
                } else {
                    el.id = model.getId();
                }
                const style = model.getStyle();
                !a.isEmpty(style) && model.setStyle(style);
            } else {
                this.setAttribute('style', model.styleToString());
            }
        },
        updateClasses() {
            const str = this.model.get('classes').pluck('name').join(' ');
            this.setAttribute('class', str);
            this.updateStatus();
        },
        setAttribute(name, value) {
            const el = this.$el;
            value ? el.attr(name, value) : el.removeAttr(name);
        },
        getClasses() {
            return this.model.getClasses().join(' ');
        },
        updateAttributes() {
            const attrs = [];
            const {model, $el, el, config} = this;
            const {highlightable, textable, type, _innertext} = model.attributes;
            const {draggableComponents} = config;
            const defaultAttr = {
                'data-gjs-type': type || 'default',
                ...draggableComponents && !_innertext ? { draggable: true } : {},
                ...highlightable ? { 'data-highlightable': 1 } : {},
                ...textable ? {
                    contenteditable: 'false',
                    'data-gjs-textable': 'true'
                } : {}
            };
            a.each(el.attributes, attr => attrs.push(attr.nodeName));
            attrs.forEach(attr => $el.removeAttr(attr));
            const attr = {
                ...defaultAttr,
                ...model.getAttributes()
            };
            a.keys(attr).forEach(key => attr[key] === false && delete attr[key]);
            $el.attr(attr);
            this.updateStyle();
        },
        updateContent() {
            this.getChildrenContainer().innerHTML = this.model.get('content');
        },
        prevDef(e) {
            e.preventDefault();
        },
        updateScript() {
            const {model, em} = this;
            if (!model.get('script'))
                return;
            em && em.get('Canvas').getCanvasView().updateScript(this);
        },
        getChildrenContainer() {
            var container = this.el;
            if (typeof this.getChildrenSelector == 'function') {
                container = this.el.querySelector(this.getChildrenSelector());
            } else if (typeof this.getTemplate == 'function') {
            }
            return container;
        },
        getOffsetRect() {
            const rect = {};
            const target = this.el;
            let gtop = 0;
            let gleft = 0;
            const assignRect = el => {
                const {offsetParent} = el;
                if (offsetParent) {
                    gtop += offsetParent.offsetTop;
                    gleft += offsetParent.offsetLeft;
                    assignRect(offsetParent);
                } else {
                    rect.top = target.offsetTop + gtop;
                    rect.left = target.offsetLeft + gleft;
                    rect.bottom = rect.top + target.offsetHeight;
                    rect.right = rect.left + target.offsetWidth;
                }
            };
            assignRect(target);
            return rect;
        },
        isInViewport({rect} = {}) {
            const {el} = this;
            const elDoc = el.ownerDocument;
            const {body} = elDoc;
            const {frameElement} = elDoc.defaultView;
            const {top, left} = rect || this.getOffsetRect();
            const frame = this._getFrame().getOffsetRect();
            return top >= frame.scrollTop && left >= frame.scrollLeft && top <= frame.scrollBottom && left <= frameElement.offsetWidth + body.scrollLeft;
        },
        scrollIntoView(opts = {}) {
            const rect = this.getOffsetRect();
            const isInViewport = this.isInViewport({ rect });
            if (!isInViewport || opts.force) {
                const {el} = this;
                if (opts.behavior !== 'smooth') {
                    el.ownerDocument.defaultView.scrollTo(0, rect.top);
                } else {
                    el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        ...opts
                    });
                }
            }
        },
        reset() {
            const {el} = this;
            this.el = '';
            this._ensureElement();
            this._setData();
            b.replaceWith(el, this.el);
            this.render();
        },
        _setData() {
            const {model} = this;
            const collection = model.components();
            const view = this;
            this.$el.data({
                model,
                collection,
                view
            });
        },
        _getFrame() {
            return this.config.frameView;
        },
        renderChildren() {
            this.updateContent();
            const container = this.getChildrenContainer();
            const view = new ComponentsView({
                collection: this.model.get('components'),
                config: this.config,
                componentTypes: this.opts.componentTypes
            });
            view.render(container);
            this.childrenView = view;
            const childNodes = Array.prototype.slice.call(view.el.childNodes);
            for (var i = 0, len = childNodes.length; i < len; i++) {
                container.appendChild(childNodes.shift());
            }
        },
        renderAttributes() {
            this.updateAttributes();
            this.updateClasses();
        },
        render() {
            this.renderAttributes();
            if (this.modelOpt.temporary)
                return this;
            this.renderChildren();
            this.updateScript();
            this.postRender();
            return this;
        },
        postRender() {
            const {em, model, modelOpt} = this;
            if (!modelOpt.temporary) {
                this.onRender(this._clbObj());
                em && em.trigger('component:mount', model);
            }
        },
        onRender() {
        }
    });

    ComponentsView.ComponentView = ComponentView;

    return ComponentView;
});
define('skylark-grapejs/dom_components/model/ComponentTableCell',['./Component'], function (Component) {
    'use strict';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            type: 'cell',
            tagName: 'td',
            draggable: ['tr']
        }
    }, {
        isComponent(el) {
            let result = '';
            const tag = el.tagName;
            if (tag == 'TD' || tag == 'TH') {
                result = {
                    type: 'cell',
                    tagName: tag.toLowerCase()
                };
            }
            return result;
        }
    });
});
define('skylark-grapejs/dom_components/view/ComponentTableCellView',['./ComponentView'], function (ComponentView) {
    'use strict';
    return ComponentView.extend({});
});
define('skylark-grapejs/dom_components/model/ComponentTableRow',['./Component'], function (Component) {
    'use strict';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            type: 'row',
            tagName: 'tr',
            draggable: [
                'thead',
                'tbody',
                'tfoot'
            ],
            droppable: [
                'th',
                'td'
            ]
        },
        initialize(o, opt) {
            Component.prototype.initialize.apply(this, arguments);
            const cells = [];
            const components = this.get('components');
            components.each(model => model.is('cell') && cells.push(model));
            components.reset(cells);
        }
    }, {
        isComponent(el) {
            let result = '';
            if (el.tagName == 'TR') {
                result = { type: 'row' };
            }
            return result;
        }
    });
});
define('skylark-grapejs/dom_components/view/ComponentTableRowView',['./ComponentView'], function (ComponentView) {
    'use strict';
    return ComponentView.extend({});
});
define('skylark-grapejs/dom_components/model/ComponentTable',['./Component'], function (Component) {
    'use strict';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            type: 'table',
            tagName: 'table',
            droppable: [
                'tbody',
                'thead',
                'tfoot'
            ]
        },
        initialize(o, opt) {
            Component.prototype.initialize.apply(this, arguments);
            const components = this.get('components');
            !components.length && components.add({ type: 'tbody' });
        }
    }, {
        isComponent(el) {
            let result = '';
            if (el.tagName == 'TABLE') {
                result = { type: 'table' };
            }
            return result;
        }
    });
});
define('skylark-grapejs/dom_components/view/ComponentTableView',['./ComponentView'], function (ComponentView) {
    'use strict';
    return ComponentView.extend({ events: {} });
});
define('skylark-grapejs/dom_components/model/ComponentTableBody',['./Component'], function (Component) {
    'use strict';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            type: 'tbody',
            tagName: 'tbody',
            draggable: ['table'],
            droppable: ['tr'],
            columns: 1,
            rows: 1
        },
        initialize(o, opt) {
            Component.prototype.initialize.apply(this, arguments);
            const components = this.get('components');
            let columns = this.get('columns');
            let rows = this.get('rows');
            if (!components.length) {
                const rowsToAdd = [];
                while (rows--) {
                    const columnsToAdd = [];
                    let clm = columns;
                    while (clm--) {
                        columnsToAdd.push({
                            type: 'cell',
                            classes: ['cell']
                        });
                    }
                    rowsToAdd.push({
                        type: 'row',
                        classes: ['row'],
                        components: columnsToAdd
                    });
                }
                components.add(rowsToAdd);
            }
        }
    }, {
        isComponent(el) {
            let result = '';
            if (el.tagName == 'TBODY') {
                result = { type: 'tbody' };
            }
            return result;
        }
    });
});
define('skylark-grapejs/dom_components/model/ComponentTableHead',['./ComponentTableBody'], function (ComponentTableBody) {
    'use strict';
    return ComponentTableBody.extend({
        defaults: {
            ...ComponentTableBody.prototype.defaults,
            type: 'thead',
            tagName: 'thead'
        }
    }, {
        isComponent(el) {
            let result = '';
            if (el.tagName == 'THEAD') {
                result = { type: 'thead' };
            }
            return result;
        }
    });
});
define('skylark-grapejs/dom_components/view/ComponentTableHeadView',['./ComponentView'], function (ComponentView) {
    'use strict';
    return ComponentView.extend({});
});
define('skylark-grapejs/dom_components/view/ComponentTableBodyView',['./ComponentView'], function (ComponentView) {
    'use strict';
    return ComponentView.extend({});
});
define('skylark-grapejs/dom_components/model/ComponentTableFoot',['./ComponentTableBody'], function (ComponentTableBody) {
    'use strict';
    return ComponentTableBody.extend({
        defaults: {
            ...ComponentTableBody.prototype.defaults,
            type: 'tfoot',
            tagName: 'tfoot'
        }
    }, {
        isComponent(el) {
            let result = '';
            if (el.tagName == 'TFOOT') {
                result = { type: 'tfoot' };
            }
            return result;
        }
    });
});
define('skylark-grapejs/dom_components/view/ComponentTableFootView',['./ComponentView'], function (ComponentView) {
    'use strict';
    return ComponentView.extend({});
});
define('skylark-grapejs/dom_components/model/ComponentImage',[
    "skylark-langx/langx",
    'skylark-underscore',
    './Component'
], function (langx,_, Component) {
    'use strict';
    const svgAttrs = 'xmlns="http://www.w3.org/2000/svg" width="100" viewBox="0 0 24 24" style="fill: rgba(0,0,0,0.15); transform: scale(0.75)"';
    return Component.extend({
        defaults: langx.mixin({},Component.prototype.defaults,{
            type: 'image',
            tagName: 'img',
            void: 1,
            droppable: 0,
            editable: 1,
            highlightable: 0,
            resizable: { ratioDefault: 1 },
            traits: ['alt'],
            src: `<svg ${ svgAttrs }>
        <path d="M8.5 13.5l2.5 3 3.5-4.5 4.5 6H5m16 1V5a2 2 0 0 0-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2z"></path>
      </svg>`,
            fallback: `<svg ${ svgAttrs }>
        <path d="M2.28 3L1 4.27l2 2V19c0 1.1.9 2 2 2h12.73l2 2L21 21.72 2.28 3m2.55 0L21 19.17V5a2 2 0 0 0-2-2H4.83M8.5 13.5l2.5 3 1-1.25L14.73 18H5l3.5-4.5z"></path>
      </svg>`,
            file: ''
        }),
        initialize(o, opt) {
            Component.prototype.initialize.apply(this, arguments);
            var attr = this.get('attributes');
            if (attr.src)
                this.set('src', attr.src);
        },
        initToolbar(...args) {
            Component.prototype.initToolbar.apply(this, args);
            const em = this.em;
            if (em) {
                var cmd = em.get('Commands');
                var cmdName = 'image-editor';
                if (cmd.has(cmdName)) {
                    let hasButtonBool = false;
                    var tb = this.get('toolbar');
                    for (let i = 0; i < tb.length; i++) {
                        if (tb[i].command === 'image-editor') {
                            hasButtonBool = true;
                            break;
                        }
                    }
                    if (!hasButtonBool) {
                        tb.push({
                            attributes: { class: 'fa fa-pencil' },
                            command: cmdName
                        });
                        this.set('toolbar', tb);
                    }
                }
            }
        },
        getAttrToHTML(...args) {
            const attr = Component.prototype.getAttrToHTML.apply(this, args);
            const src = this.getSrcResult();
            if (src)
                attr.src = src;
            return attr;
        },
        getSrcResult(opt = {}) {
            const src = this.get(opt.fallback ? 'fallback' : 'src') || '';
            let result = src;
            if (src && src.substr(0, 4) === '<svg') {
                result = `data:image/svg+xml;base64,${ window.btoa(src) }`;
            }
            return result;
        },
        isDefaultSrc() {
            return this.get('src') === _.result(this, 'defaults').src;
        },
        parseUri(uri) {
            var el = document.createElement('a');
            el.href = uri;
            var query = {};
            var qrs = el.search.substring(1).split('&');
            for (var i = 0; i < qrs.length; i++) {
                var pair = qrs[i].split('=');
                var name = decodeURIComponent(pair[0]);
                if (name)
                    query[name] = decodeURIComponent(pair[1]);
            }
            return {
                hostname: el.hostname,
                pathname: el.pathname,
                protocol: el.protocol,
                search: el.search,
                hash: el.hash,
                port: el.port,
                query
            };
        }
    }, {
        isComponent(el) {
            var result = '';
            if (el.tagName == 'IMG') {
                result = { type: 'image' };
            }
            return result;
        }
    });
});
define('skylark-grapejs/dom_components/model/ComponentMap',[
    './ComponentImage',
    './Component'
], function (Component, OComponent) {
    'use strict';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            type: 'map',
            src: '',
            void: 0,
            mapUrl: 'https://maps.google.com/maps',
            tagName: 'iframe',
            mapType: 'q',
            address: '',
            zoom: '1',
            attributes: { frameborder: 0 },
            toolbar: OComponent.prototype.defaults.toolbar,
            traits: [
                {
                    label: 'Address',
                    name: 'address',
                    placeholder: 'eg. London, UK',
                    changeProp: 1
                },
                {
                    type: 'select',
                    label: 'Map type',
                    name: 'mapType',
                    changeProp: 1,
                    options: [
                        {
                            value: 'q',
                            name: 'Roadmap'
                        },
                        {
                            value: 'w',
                            name: 'Satellite'
                        }
                    ]
                },
                {
                    label: 'Zoom',
                    name: 'zoom',
                    type: 'range',
                    min: '1',
                    max: '20',
                    changeProp: 1
                }
            ]
        },
        initialize(o, opt) {
            if (this.get('src'))
                this.parseFromSrc();
            else
                this.updateSrc();
            Component.prototype.initialize.apply(this, arguments);
            this.listenTo(this, 'change:address change:zoom change:mapType', this.updateSrc);
        },
        updateSrc() {
            this.set('src', this.getMapUrl());
        },
        getMapUrl() {
            var md = this;
            var addr = md.get('address');
            var zoom = md.get('zoom');
            var type = md.get('mapType');
            var size = '';
            addr = addr ? '&q=' + addr : '';
            zoom = zoom ? '&z=' + zoom : '';
            type = type ? '&t=' + type : '';
            var result = md.get('mapUrl') + '?' + addr + zoom + type;
            result += '&output=embed';
            return result;
        },
        parseFromSrc() {
            var uri = this.parseUri(this.get('src'));
            var qr = uri.query;
            if (qr.q)
                this.set('address', qr.q);
            if (qr.z)
                this.set('zoom', qr.z);
            if (qr.t)
                this.set('mapType', qr.t);
        }
    }, {
        isComponent(el) {
            var result = '';
            if (el.tagName == 'IFRAME' && /maps\.google\.com/.test(el.src)) {
                result = {
                    type: 'map',
                    src: el.src
                };
            }
            return result;
        }
    });
});
define('skylark-grapejs/dom_components/view/ComponentImageView',[
    'skylark-underscore',
    './ComponentView'
], function (a, ComponentView) {
    'use strict';
    return ComponentView.extend({
        tagName: 'img',
        events: {
            dblclick: 'onActive',
            click: 'initResize',
            error: 'onError',
            dragstart: 'noDrag'
        },
        initialize(o) {
            const model = this.model;
            ComponentView.prototype.initialize.apply(this, arguments);
            this.listenTo(model, 'change:src', this.updateSrc);
            this.classEmpty = `${ this.ppfx }plh-image`;
            const config = this.config;
            config.modal && (this.modal = config.modal);
            config.am && (this.am = config.am);
            this.fetchFile();
        },
        fetchFile() {
            if (this.modelOpt.temporary)
                return;
            const model = this.model;
            const file = model.get('file');
            if (file) {
                const fu = this.em.get('AssetManager').FileUploader();
                fu.uploadFile({ dataTransfer: { files: [file] } }, res => {
                    const obj = res && res.data && res.data[0];
                    const src = obj && (a.isString(obj) ? obj : obj.src);
                    src && model.set({ src });
                });
                model.set('file', '');
            }
        },
        updateSrc() {
            const {model, classEmpty, $el} = this;
            const src = model.getSrcResult();
            const srcExists = src && !model.isDefaultSrc();
            model.addAttributes({ src });
            $el[srcExists ? 'removeClass' : 'addClass'](classEmpty);
        },
        onActive(ev) {
            ev && ev.stopPropagation();
            var em = this.opts.config.em;
            var editor = em ? em.get('Editor') : '';
            if (editor && this.model.get('editable')) {
                editor.runCommand('open-assets', {
                    target: this.model,
                    types: ['image'],
                    accept: 'image/*',
                    onSelect() {
                        editor.Modal.close();
                        editor.AssetManager.setTarget(null);
                    }
                });
            }
        },
        onError() {
            const fallback = this.model.getSrcResult({ fallback: 1 });
            if (fallback)
                this.el.src = fallback;
        },
        noDrag(ev) {
            ev.preventDefault();
            return false;
        },
        render() {
            this.renderAttributes();
            this.updateSrc();
            const {$el, model} = this;
            const cls = $el.attr('class') || '';
            !model.get('src') && $el.attr('class', `${ cls } ${ this.classEmpty }`.trim());
            this.postRender();
            return this;
        }
    });
});
define('skylark-grapejs/dom_components/view/ComponentMapView',[
    'skylark-backbone',
    './ComponentImageView'
], function (Backbone, ComponentView) {
    'use strict';
    return ComponentView.extend({
        tagName: 'div',
        events: {},
        initialize(o) {
            ComponentView.prototype.initialize.apply(this, arguments);
            this.classEmpty = this.ppfx + 'plh-map';
        },
        updateSrc() {
            this.getIframe().src = this.model.get('src');
        },
        getIframe() {
            if (!this.iframe) {
                var ifrm = document.createElement('iframe');
                ifrm.src = this.model.get('src');
                ifrm.frameBorder = 0;
                ifrm.style.height = '100%';
                ifrm.style.width = '100%';
                ifrm.className = this.ppfx + 'no-pointer';
                this.iframe = ifrm;
            }
            return this.iframe;
        },
        render(...args) {
            ComponentView.prototype.render.apply(this, args);
            this.updateClasses();
            this.el.appendChild(this.getIframe());
            return this;
        }
    });
});
define('skylark-grapejs/dom_components/model/ComponentText',['./Component'], function (Component) {
    'use strict';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            type: 'text',
            droppable: false,
            editable: true
        },
        toHTML() {
            this.trigger('sync:content', { silent: 1 });
            return Component.prototype.toHTML.apply(this, arguments);
        }
    });
});
define('skylark-grapejs/dom_components/model/ComponentLink',[    
    "skylark-langx/langx",
    './ComponentText'
], function (langx,Component) {
    'use strict';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            type: 'link',
            tagName: 'a',
            traits: [
                'title',
                'href',
                'target'
            ]
        },
        getAttrToHTML(...args) {
            const attr = Component.prototype.getAttrToHTML.apply(this, args);
            delete attr.onmousedown;
            return attr;
        }
    }, {
        isComponent(el) {
            let result;
            let avoidEdit;
            if (el.tagName == 'A') {
                result = {
                    type: 'link',
                    editable: 0
                };
                const children = el.childNodes;
                const len = children.length;
                if (!len)
                    delete result.editable;
                for (let i = 0; i < len; i++) {
                    const child = children[i];
                    if (child.nodeType == 3 && child.textContent.trim() != '') {
                        delete result.editable;
                        break;
                    }
                }
            }
            return result;
        }
    });
});
define('skylark-grapejs/dom_components/view/ComponentTextView',[
    '../../utils/mixins',
    './ComponentView'
], function (mixins, ComponentView) {
    'use strict';
    const compProt = ComponentView.prototype;
    return ComponentView.extend({
        events: {
            dblclick: 'onActive',
            input: 'onInput'
        },
        initialize(o) {
            compProt.initialize.apply(this, arguments);
            this.disableEditing = this.disableEditing.bind(this);
            const model = this.model;
            const em = this.em;
            this.listenTo(model, 'focus', this.onActive);
            this.listenTo(model, 'change:content', this.updateContentText);
            this.listenTo(model, 'sync:content', this.syncContent);
            this.rte = em && em.get('RichTextEditor');
        },
        updateContentText(m, v, opts = {}) {
            !opts.fromDisable && this.disableEditing();
        },
        onActive(e) {
            if (this.rteEnabled || !this.model.get('editable')) {
                return;
            }
            e && e.stopPropagation && e.stopPropagation();
            const {rte, em} = this;
            if (rte) {
                try {
                    this.activeRte = rte.enable(this, this.activeRte);
                } catch (err) {
                    em.logError(err);
                }
            }
            this.toggleEvents(1);
        },
        onDisable() {
            this.disableEditing();
        },
        disableEditing() {
            const {model, rte, activeRte, em} = this;
            const editable = model.get('editable');
            if (rte && editable) {
                try {
                    rte.disable(this, activeRte);
                } catch (err) {
                    em.logError(err);
                }
                this.syncContent();
            }
            this.toggleEvents();
        },
        getContent() {
            const {rte} = this;
            const {activeRte} = rte || {};
            let content = '';
            if (activeRte && typeof activeRte.getContent === 'function') {
                content = activeRte.getContent();
            } else {
                content = this.getChildrenContainer().innerHTML;
            }
            return content;
        },
        syncContent(opts = {}) {
            const {model, rte, rteEnabled} = this;
            if (!rteEnabled && !opts.force)
                return;
            const content = this.getContent();
            const comps = model.components();
            const contentOpt = {
                fromDisable: 1,
                ...opts
            };
            comps.length && comps.reset(null, opts);
            model.set('content', '', contentOpt);
            if (rte.customRte) {
                model.set('content', content, contentOpt);
            } else {
                const clean = model => {
                    const textable = !!model.get('textable');
                    const selectable = ![
                        'text',
                        'default',
                        ''
                    ].some(type => model.is(type)) || textable;
                    model.set({
                        _innertext: !selectable,
                        editable: selectable && model.get('editable'),
                        selectable: selectable,
                        hoverable: selectable,
                        removable: textable,
                        draggable: textable,
                        highlightable: 0,
                        copyable: textable,
                        ...!textable && { toolbar: '' }
                    }, opts);
                    model.get('components').each(model => clean(model));
                };
                !opts.silent && model.trigger('change:content', model, '', contentOpt);
                comps.add(content, opts);
                comps.each(model => clean(model));
                comps.trigger('resetNavigator');
            }
        },
        onInput() {
            const {em} = this;
            em && em.trigger('component:update', this.model);
        },
        disablePropagation(e) {
            e.stopPropagation();
        },
        toggleEvents(enable) {
            const {em} = this;

            const method = enable ? 'on' : 'off';
            em.setEditing(enable);
            this.rteEnabled = !!enable;
            var elDocs = [
                this.el.ownerDocument,
                document
            ];
            mixins.off(elDocs, 'mousedown', this.disableEditing);
            mixins[method](elDocs, 'mousedown', this.disableEditing);
            em[method]('toolbar:run:before', this.disableEditing);
            this.$el.off('mousedown', this.disablePropagation);
            this.$el[method]('mousedown', this.disablePropagation);
            if (this.config.draggableComponents) {
                let {el} = this;
                while (el) {
                    el.draggable = enable ? !1 : !0;
                    el = el.parentNode;
                    el && el.tagName == 'BODY' && (el = 0);
                }
            }
        }
    });
});
define('skylark-grapejs/dom_components/view/ComponentLinkView',['./ComponentTextView'], function (ComponentView) {
    'use strict';
    return ComponentView.extend({
        render(...args) {
            ComponentView.prototype.render.apply(this, args);
            this.el.addEventListener('click', this.prevDef, true);
            return this;
        }
    });
});
define('skylark-grapejs/dom_components/model/ComponentLabel',[    
    "skylark-langx/langx",
    './ComponentText'
], function (langx,Component) {
    'use strict';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            tagName: 'label',
            traits: [
                'id',
                'title',
                'for'
            ]
        }
    }, {
        isComponent(el) {
            if (el.tagName == 'LABEL') {
                return { type: 'label' };
            }
        }
    });
});
define('skylark-grapejs/dom_components/view/ComponentLabelView',['./ComponentLinkView'], function (ComponentLinkView) {
    'use strict';
    return ComponentLinkView.extend({ tagName: 'span' });
});
define('skylark-grapejs/dom_components/model/ComponentVideo',[
    './ComponentImage',
    './Component'
], function (Component, OComponent) {
    'use strict';
    const yt = 'yt';
    const vi = 'vi';
    const ytnc = 'ytnc';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            type: 'video',
            tagName: 'video',
            videoId: '',
            void: 0,
            provider: 'so',
            ytUrl: 'https://www.youtube.com/embed/',
            ytncUrl: 'https://www.youtube-nocookie.com/embed/',
            viUrl: 'https://player.vimeo.com/video/',
            loop: 0,
            poster: '',
            muted: 0,
            autoplay: 0,
            controls: 1,
            color: '',
            rel: 1,
            modestbranding: 0,
            sources: [],
            attributes: { allowfullscreen: 'allowfullscreen' },
            toolbar: OComponent.prototype.defaults.toolbar
        },
        initialize(o, opt) {
            var traits = [];
            var prov = this.get('provider');
            switch (prov) {
            case yt:
            case ytnc:
                traits = this.getYoutubeTraits();
                break;
            case vi:
                traits = this.getVimeoTraits();
                break;
            default:
                traits = this.getSourceTraits();
            }
            if (this.get('src'))
                this.parseFromSrc();
            this.set('traits', traits);
            Component.prototype.initialize.apply(this, arguments);
            this.listenTo(this, 'change:provider', this.updateTraits);
            this.listenTo(this, 'change:videoId change:provider', this.updateSrc);
        },
        initToolbar(...args) {
            OComponent.prototype.initToolbar.apply(this, args);
        },
        parseFromSrc() {
            var prov = this.get('provider');
            var uri = this.parseUri(this.get('src'));
            var qr = uri.query;
            switch (prov) {
            case yt:
            case ytnc:
            case vi:
                var videoId = uri.pathname.split('/').pop();
                this.set('videoId', videoId);
                if (qr.autoplay)
                    this.set('autoplay', 1);
                if (qr.loop)
                    this.set('loop', 1);
                if (parseInt(qr.controls) === 0)
                    this.set('controls', 0);
                if (qr.color)
                    this.set('color', qr.color);
                if (qr.rel === '0')
                    this.set('rel', 0);
                if (qr.modestbranding === '1')
                    this.set('modestbranding', 1);
                break;
            default:
            }
        },
        updateSrc() {
            var prov = this.get('provider');
            switch (prov) {
            case yt:
                this.set('src', this.getYoutubeSrc());
                break;
            case ytnc:
                this.set('src', this.getYoutubeNoCookieSrc());
                break;
            case vi:
                this.set('src', this.getVimeoSrc());
                break;
            }
        },
        getAttrToHTML(...args) {
            var attr = Component.prototype.getAttrToHTML.apply(this, args);
            var prov = this.get('provider');
            switch (prov) {
            case yt:
            case ytnc:
            case vi:
                break;
            default:
                if (this.get('loop'))
                    attr.loop = 'loop';
                if (this.get('autoplay'))
                    attr.autoplay = 'autoplay';
                if (this.get('controls'))
                    attr.controls = 'controls';
            }
            return attr;
        },
        updateTraits() {
            var prov = this.get('provider');
            var traits = this.getSourceTraits();
            switch (prov) {
            case yt:
            case ytnc:
                this.set('tagName', 'iframe');
                traits = this.getYoutubeTraits();
                break;
            case vi:
                this.set('tagName', 'iframe');
                traits = this.getVimeoTraits();
                break;
            default:
                this.set('tagName', 'video');
            }
            this.loadTraits(traits);
            this.em.trigger('component:toggled');
        },
        getProviderTrait() {
            return {
                type: 'select',
                label: 'Provider',
                name: 'provider',
                changeProp: 1,
                options: [
                    {
                        value: 'so',
                        name: 'HTML5 Source'
                    },
                    {
                        value: yt,
                        name: 'Youtube'
                    },
                    {
                        value: ytnc,
                        name: 'Youtube (no cookie)'
                    },
                    {
                        value: vi,
                        name: 'Vimeo'
                    }
                ]
            };
        },
        getSourceTraits() {
            return [
                this.getProviderTrait(),
                {
                    label: 'Source',
                    name: 'src',
                    placeholder: 'eg. ./media/video.mp4',
                    changeProp: 1
                },
                {
                    label: 'Poster',
                    name: 'poster',
                    placeholder: 'eg. ./media/image.jpg'
                },
                this.getAutoplayTrait(),
                this.getLoopTrait(),
                this.getControlsTrait()
            ];
        },
        getYoutubeTraits() {
            return [
                this.getProviderTrait(),
                {
                    label: 'Video ID',
                    name: 'videoId',
                    placeholder: 'eg. jNQXAC9IVRw',
                    changeProp: 1
                },
                this.getAutoplayTrait(),
                this.getLoopTrait(),
                this.getControlsTrait(),
                {
                    type: 'checkbox',
                    label: 'Related',
                    name: 'rel',
                    changeProp: 1
                },
                {
                    type: 'checkbox',
                    label: 'Modest',
                    name: 'modestbranding',
                    changeProp: 1
                }
            ];
        },
        getVimeoTraits() {
            return [
                this.getProviderTrait(),
                {
                    label: 'Video ID',
                    name: 'videoId',
                    placeholder: 'eg. 123456789',
                    changeProp: 1
                },
                {
                    label: 'Color',
                    name: 'color',
                    placeholder: 'eg. FF0000',
                    changeProp: 1
                },
                this.getAutoplayTrait(),
                this.getLoopTrait()
            ];
        },
        getAutoplayTrait() {
            return {
                type: 'checkbox',
                label: 'Autoplay',
                name: 'autoplay',
                changeProp: 1
            };
        },
        getLoopTrait() {
            return {
                type: 'checkbox',
                label: 'Loop',
                name: 'loop',
                changeProp: 1
            };
        },
        getControlsTrait() {
            return {
                type: 'checkbox',
                label: 'Controls',
                name: 'controls',
                changeProp: 1
            };
        },
        getYoutubeSrc() {
            const id = this.get('videoId');
            let url = this.get('ytUrl');
            url += id + '?';
            url += this.get('autoplay') ? '&autoplay=1' : '';
            url += !this.get('controls') ? '&controls=0&showinfo=0' : '';
            url += this.get('loop') ? `&loop=1&playlist=${ id }` : '';
            url += this.get('rel') ? '' : '&rel=0';
            url += this.get('modestbranding') ? '&modestbranding=1' : '';
            return url;
        },
        getYoutubeNoCookieSrc() {
            let url = this.getYoutubeSrc();
            url = url.replace(this.get('ytUrl'), this.get('ytncUrl'));
            return url;
        },
        getVimeoSrc() {
            var url = this.get('viUrl');
            url += this.get('videoId') + '?';
            url += this.get('autoplay') ? '&autoplay=1' : '';
            url += this.get('loop') ? '&loop=1' : '';
            url += !this.get('controls') ? '&title=0&portrait=0&badge=0' : '';
            url += this.get('color') ? '&color=' + this.get('color') : '';
            return url;
        }
    }, {
        isComponent(el) {
            var result = '';
            var isYtProv = /youtube\.com\/embed/.test(el.src);
            var isYtncProv = /youtube-nocookie\.com\/embed/.test(el.src);
            var isViProv = /player\.vimeo\.com\/video/.test(el.src);
            var isExtProv = isYtProv || isYtncProv || isViProv;
            if (el.tagName == 'VIDEO' || el.tagName == 'IFRAME' && isExtProv) {
                result = { type: 'video' };
                if (el.src)
                    result.src = el.src;
                if (isExtProv) {
                    if (isYtProv)
                        result.provider = yt;
                    else if (isYtncProv)
                        result.provider = ytnc;
                    else if (isViProv)
                        result.provider = vi;
                }
            }
            return result;
        }
    });
});
define('skylark-grapejs/dom_components/view/ComponentVideoView',[
    './ComponentImageView',
    './ComponentView'
], function (ComponentView, OComponentView) {
    'use strict';
    return ComponentView.extend({
        tagName: 'div',
        events: {},
        initialize(o) {
            OComponentView.prototype.initialize.apply(this, arguments);
            const {model} = this;
            const props = [
                'loop',
                'autoplay',
                'controls',
                'color',
                'rel',
                'modestbranding',
                'poster'
            ];
            const events = props.map(p => `change:${ p }`).join(' ');
            this.listenTo(model, 'change:provider', this.updateProvider);
            this.listenTo(model, 'change:src', this.updateSrc);
            this.listenTo(model, events, this.updateVideo);
        },
        updateProvider() {
            var prov = this.model.get('provider');
            this.el.innerHTML = '';
            this.el.appendChild(this.renderByProvider(prov));
        },
        updateSrc() {
            const {model, videoEl} = this;
            if (!videoEl)
                return;
            const prov = model.get('provider');
            let src = model.get('src');
            switch (prov) {
            case 'yt':
                src = model.getYoutubeSrc();
                break;
            case 'ytnc':
                src = model.getYoutubeNoCookieSrc();
                break;
            case 'vi':
                src = model.getVimeoSrc();
                break;
            }
            videoEl.src = src;
        },
        updateVideo() {
            var prov = this.model.get('provider');
            var videoEl = this.videoEl;
            var md = this.model;
            switch (prov) {
            case 'yt':
            case 'ytnc':
            case 'vi':
                this.model.trigger('change:videoId');
                break;
            default:
                videoEl.loop = md.get('loop');
                videoEl.autoplay = md.get('autoplay');
                videoEl.controls = md.get('controls');
                videoEl.poster = md.get('poster');
            }
        },
        renderByProvider(prov) {
            var videoEl;
            switch (prov) {
            case 'yt':
                videoEl = this.renderYoutube();
                break;
            case 'ytnc':
                videoEl = this.renderYoutubeNoCookie();
                break;
            case 'vi':
                videoEl = this.renderVimeo();
                break;
            default:
                videoEl = this.renderSource();
            }
            this.videoEl = videoEl;
            return videoEl;
        },
        renderSource() {
            var el = document.createElement('video');
            el.src = this.model.get('src');
            this.initVideoEl(el);
            return el;
        },
        renderYoutube() {
            var el = document.createElement('iframe');
            el.src = this.model.getYoutubeSrc();
            el.frameBorder = 0;
            el.setAttribute('allowfullscreen', true);
            this.initVideoEl(el);
            return el;
        },
        renderYoutubeNoCookie() {
            var el = document.createElement('iframe');
            el.src = this.model.getYoutubeNoCookieSrc();
            el.frameBorder = 0;
            el.setAttribute('allowfullscreen', true);
            this.initVideoEl(el);
            return el;
        },
        renderVimeo() {
            var el = document.createElement('iframe');
            el.src = this.model.getVimeoSrc();
            el.frameBorder = 0;
            el.setAttribute('allowfullscreen', true);
            this.initVideoEl(el);
            return el;
        },
        initVideoEl(el) {
            el.className = this.ppfx + 'no-pointer';
            el.style.height = '100%';
            el.style.width = '100%';
        },
        render(...args) {
            ComponentView.prototype.render.apply(this, args);
            this.updateClasses();
            var prov = this.model.get('provider');
            this.el.appendChild(this.renderByProvider(prov));
            this.updateVideo();
            return this;
        }
    });
});
define('skylark-grapejs/dom_components/model/ComponentScript',['./Component'], function (Component) {
    'use strict';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            type: 'script',
            droppable: false,
            draggable: false,
            layerable: false
        }
    }, {
        isComponent(el) {
            if (el.tagName == 'SCRIPT') {
                var result = { type: 'script' };
                if (el.src) {
                    result.src = el.src;
                    result.onload = el.onload;
                }
                return result;
            }
        }
    });
});
define('skylark-grapejs/dom_components/view/ComponentScriptView',[
    'skylark-backbone',
    './ComponentImageView'
], function (Backbone, ComponentView) {
    'use strict';
    return ComponentView.extend({
        tagName: 'script',
        events: {},
        render() {
            var model = this.model;
            var src = model.get('src');
            var em = this.em;
            var scriptCount = em && em.get('scriptCount') ? em.get('scriptCount') : 0;
            var content = '';
            if (src) {
                var onload = model.get('onload');
                var svar = 'script' + scriptCount;
                var svarNext = 'script' + (scriptCount + 1);
                content = 'var ' + svar + " = document.createElement('script');\n" + svar + '.onload = function(){\n' + (onload ? onload + '();\n' : '') + 'typeof ' + svarNext + "Start == 'function' && " + svarNext + 'Start();\n' + '};\n' + svar + ".src = '" + src + "';\n" + 'function ' + svar + 'Start() { document.body.appendChild(' + svar + '); };\n' + (!scriptCount ? svar + 'Start();' : '');
                if (em) {
                    em.set('scriptCount', scriptCount + 1);
                }
            } else {
                content = model.get('content');
            }
            this.el.innerHTML = content;
            return this;
        }
    });
});
define('skylark-grapejs/dom_components/model/ComponentSvg',['./Component'], function (Component) {
    'use strict';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            resizable: { ratioDefault: 1 },
            highlightable: 0
        },
        getName() {
            let name = this.get('tagName');
            let customName = this.get('custom-name');
            name = name.charAt(0).toUpperCase() + name.slice(1);
            return customName || name;
        }
    }, {
        isComponent(el) {
            if (SVGElement && el instanceof SVGElement) {
                return {
                    tagName: el.tagName,
                    type: 'svg'
                };
            }
        }
    });
});
define('skylark-grapejs/dom_components/model/ComponentSvgIn',['./ComponentSvg'], function (Component) {
    'use strict';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            selectable: false,
            hoverable: false,
            layerable: false
        }
    }, {
        isComponent(el) {
            if (Component.isComponent(el) && el.tagName.toLowerCase() !== 'svg') {
                return {
                    tagName: el.tagName,
                    type: 'svg-in'
                };
            }
        }
    });
});
define('skylark-grapejs/dom_components/view/ComponentSvgView',['./ComponentView'], function (ComponentView) {
    'use strict';
    return ComponentView.extend({
        _createElement: function (tagName) {
            return document.createElementNS('http://www.w3.org/2000/svg', tagName);
        }
    });
});
define('skylark-grapejs/dom_components/model/ComponentTextNode',['./Component'], function (Component) {
    'use strict';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            droppable: false,
            layerable: false,
            editable: true
        },
        toHTML() {
            return this.get('content').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
        }
    }, {
        isComponent(el) {
            var result = '';
            if (el.nodeType === 3) {
                result = {
                    type: 'textnode',
                    content: el.textContent
                };
            }
            return result;
        }
    });
});
define('skylark-grapejs/dom_components/model/ComponentComment',[
    "skylark-langx/langx",
    './ComponentTextNode'
], function (langx,Component) {
    'use strict';
    return Component.extend({
        defaults: { ...Component.prototype.defaults },
        toHTML() {
            return `<!--${ this.get('content') }-->`;
        }
    }, {
        isComponent(el) {
            if (el.nodeType == 8) {
                return {
                    tagName: 'NULL',
                    type: 'comment',
                    content: el.textContent
                };
            }
        }
    });
});
define('skylark-grapejs/dom_components/view/ComponentTextNodeView',['skylark-backbone'], function (Backbone) {
    'use strict';
    return Backbone.View.extend({
        initialize() {
            const {$el, model} = this;
            $el.data('model', model);
            model.view = this;
        },
        _createElement() {
            return document.createTextNode(this.model.get('content'));
        }
    });
});
define('skylark-grapejs/dom_components/view/ComponentCommentView',['./ComponentTextNodeView'], function (ComponentView) {
    'use strict';
    return ComponentView.extend({
        _createElement() {
            return document.createComment(this.model.get('content'));
        }
    });
});
define('skylark-grapejs/dom_components/model/ComponentWrapper',['./Component'], function (Component) {
    'use strict';
    return Component.extend({}, {
        isComponent() {
            return false;
        }
    });
});
define('skylark-grapejs/dom_components/index',[
    'skylark-backbone',
    'skylark-underscore',
    './config/config',
    './model/Component',
    './model/Components',
    './view/ComponentView',
    './view/ComponentsView',
    './model/ComponentTableCell',
    './view/ComponentTableCellView',
    './model/ComponentTableRow',
    './view/ComponentTableRowView',
    './model/ComponentTable',
    './view/ComponentTableView',
    './model/ComponentTableHead',
    './view/ComponentTableHeadView',
    './model/ComponentTableBody',
    './view/ComponentTableBodyView',
    './model/ComponentTableFoot',
    './view/ComponentTableFootView',
    './model/ComponentMap',
    './view/ComponentMapView',
    './model/ComponentLink',
    './view/ComponentLinkView',
    './model/ComponentLabel',
    './view/ComponentLabelView',
    './model/ComponentVideo',
    './view/ComponentVideoView',
    './model/ComponentImage',
    './view/ComponentImageView',
    './model/ComponentScript',
    './view/ComponentScriptView',
    './model/ComponentSvg',
    './model/ComponentSvgIn',
    './view/ComponentSvgView',
    './model/ComponentComment',
    './view/ComponentCommentView',
    './model/ComponentTextNode',
    './view/ComponentTextNodeView',
    './model/ComponentText',
    './view/ComponentTextView',
    './model/ComponentWrapper'
], function (Backbone, _, defaults, Component, Components, ComponentView, ComponentsView, ComponentTableCell, ComponentTableCellView, ComponentTableRow, ComponentTableRowView, ComponentTable, ComponentTableView, ComponentTableHead, ComponentTableHeadView, ComponentTableBody, ComponentTableBodyView, ComponentTableFoot, ComponentTableFootView, ComponentMap, ComponentMapView, ComponentLink, ComponentLinkView, ComponentLabel, ComponentLabelView, ComponentVideo, ComponentVideoView, ComponentImage, ComponentImageView, ComponentScript, ComponentScriptView, ComponentSvg, ComponentSvgIn, ComponentSvgView, ComponentComment, ComponentCommentView, ComponentTextNode, ComponentTextNodeView, ComponentText, ComponentTextView, ComponentWrapper) {
    'use strict';
    return () => {
        var c = {};
        let em;
        const componentsById = {};
        var component, componentView;
        var componentTypes = [
            {
                id: 'cell',
                model: ComponentTableCell,
                view: ComponentTableCellView
            },
            {
                id: 'row',
                model: ComponentTableRow,
                view: ComponentTableRowView
            },
            {
                id: 'table',
                model: ComponentTable,
                view: ComponentTableView
            },
            {
                id: 'thead',
                model: ComponentTableHead,
                view: ComponentTableHeadView
            },
            {
                id: 'tbody',
                model: ComponentTableBody,
                view: ComponentTableBodyView
            },
            {
                id: 'tfoot',
                model: ComponentTableFoot,
                view: ComponentTableFootView
            },
            {
                id: 'map',
                model: ComponentMap,
                view: ComponentMapView
            },
            {
                id: 'link',
                model: ComponentLink,
                view: ComponentLinkView
            },
            {
                id: 'label',
                model: ComponentLabel,
                view: ComponentLabelView
            },
            {
                id: 'video',
                model: ComponentVideo,
                view: ComponentVideoView
            },
            {
                id: 'image',
                model: ComponentImage,
                view: ComponentImageView
            },
            {
                id: 'script',
                model: ComponentScript,
                view: ComponentScriptView
            },
            {
                id: 'svg-in',
                model: ComponentSvgIn,
                view: ComponentSvgView
            },
            {
                id: 'svg',
                model: ComponentSvg,
                view: ComponentSvgView
            },
            {
                id: 'comment',
                model: ComponentComment,
                view: ComponentCommentView
            },
            {
                id: 'textnode',
                model: ComponentTextNode,
                view: ComponentTextNodeView
            },
            {
                id: 'text',
                model: ComponentText,
                view: ComponentTextView
            },
            {
                id: 'wrapper',
                model: ComponentWrapper,
                view: ComponentView
            },
            {
                id: 'default',
                model: Component,
                view: ComponentView
            }
        ];
        return {
            Component,
            Components,
            ComponentsView,
            componentTypes,
            componentsById,
            name: 'DomComponents',
            getConfig() {
                return c;
            },
            storageKey() {
                var keys = [];
                var smc = c.stm && c.stm.getConfig() || {};
                if (smc.storeHtml)
                    keys.push('html');
                if (smc.storeComponents)
                    keys.push('components');
                return keys;
            },
            init(config) {
                c = config || {};
                em = c.em;
                this.em = em;
                if (em) {
                    c.components = em.config.components || c.components;
                }
                for (var name in defaults) {
                    if (!(name in c))
                        c[name] = defaults[name];
                }
                var ppfx = c.pStylePrefix;
                if (ppfx)
                    c.stylePrefix = ppfx + c.stylePrefix;
                if (em) {
                    c.modal = em.get('Modal') || '';
                    c.am = em.get('AssetManager') || '';
                    em.get('Parser').compTypes = componentTypes;
                    em.on('change:componentHovered', this.componentHovered, this);
                    const selected = em.get('selected');
                    em.listenTo(selected, 'add', (sel, c, opts) => this.selectAdd(sel, opts));
                    em.listenTo(selected, 'remove', (sel, c, opts) => this.selectRemove(sel, opts));
                }
                let components = c.components;
                let wrapper = { ...c.wrapper };
                wrapper['custom-name'] = c.wrapperName;
                wrapper.wrapper = 1;
                wrapper.type = 'wrapper';
                if (components && components.constructor === Object && components.wrapper) {
                    wrapper = { ...components };
                    components = components.components || [];
                    wrapper.components = [];
                    if (em) {
                        em.config.components = components;
                        c.components = components;
                    }
                }
                component = new Component(wrapper, {
                    em,
                    config: c,
                    componentTypes,
                    domc: this
                });
                component.set({ attributes: { id: 'wrapper' } });
                componentView = new ComponentView({
                    model: component,
                    config: c,
                    componentTypes
                });
                return this;
            },
            onLoad() {
                this.setComponents(c.components);
            },
            postLoad(em) {
                this.handleChanges(this.getWrapper(), null, { avoidStore: 1 });
            },
            handleChanges(model, value, opts = {}) {
                const comps = model.components();
                const um = em.get('UndoManager');
                const handleUpdates = em.handleUpdates.bind(em);
                const handleChanges = this.handleChanges.bind(this);
                const handleChangesColl = this.handleChangesColl.bind(this);
                const handleRemoves = this.handleRemoves.bind(this);
                um && um.add(model);
                um && comps && um.add(comps);
                const evn = 'change:style change:content change:attributes change:src';
                [
                    [
                        model,
                        evn,
                        handleUpdates
                    ],
                    [
                        model,
                        'change:components',
                        handleChangesColl
                    ],
                    [
                        comps,
                        'add',
                        handleChanges
                    ],
                    [
                        comps,
                        'remove',
                        handleRemoves
                    ],
                    [
                        model.get('classes'),
                        'add remove',
                        handleUpdates
                    ]
                ].forEach(els => {
                    em.stopListening(els[0], els[1], els[2]);
                    em.listenTo(els[0], els[1], els[2]);
                });
                !opts.avoidStore && handleUpdates('', '', opts);
                comps.each(model => this.handleChanges(model, value, opts));
            },
            handleChangesColl(model, coll) {
                const um = em.get('UndoManager');
                if (um && coll instanceof Backbone.Collection) {
                    const handleChanges = this.handleChanges.bind(this);
                    const handleRemoves = this.handleRemoves.bind(this);
                    um.add(coll);
                    [
                        [
                            coll,
                            'add',
                            handleChanges
                        ],
                        [
                            coll,
                            'remove',
                            handleRemoves
                        ]
                    ].forEach(els => {
                        em.stopListening(els[0], els[1], els[2]);
                        em.listenTo(els[0], els[1], els[2]);
                    });
                }
            },
            handleRemoves(model, value, opts = {}) {
                !opts.avoidStore && em.handleUpdates(model, value, opts);
            },
            load(data = '') {
                const {em} = this;
                let result = '';
                if (!data && c.stm) {
                    data = c.em.getCacheLoad();
                }
                const {components, html} = data;
                if (components) {
                    if (_.isObject(components) || _.isArray(components)) {
                        result = components;
                    } else {
                        try {
                            result = JSON.parse(components);
                        } catch (err) {
                            em && em.logError(err);
                        }
                    }
                } else if (html) {
                    result = html;
                }
                const isObj = result && result.constructor === Object;
                if (result && result.length || isObj) {
                    this.clear();
                    if (isObj) {
                        this.getWrapper().set(result);
                    } else {
                        this.getComponents().add(result);
                    }
                }
                return result;
            },
            store(noStore) {
                if (!c.stm) {
                    return;
                }
                var obj = {};
                var keys = this.storageKey();
                if (keys.indexOf('html') >= 0) {
                    obj.html = c.em.getHtml();
                }
                if (keys.indexOf('components') >= 0) {
                    const {em} = this;
                    const storeWrap = c.storeWrapper;
                    const toStore = storeWrap ? this.getWrapper() : this.getComponents();
                    obj.components = JSON.stringify(toStore);
                }
                if (!noStore) {
                    c.stm.store(obj);
                }
                return obj;
            },
            getComponent() {
                return component;
            },
            getWrapper() {
                return this.getComponent();
            },
            getComponents() {
                return this.getWrapper().get('components');
            },
            addComponent(component) {
                return this.getComponents().add(component);
            },
            render() {
                return componentView.render().el;
            },
            clear() {
                this.getComponents().map(i => i).forEach(i => i.remove());
                return this;
            },
            setComponents(components) {
                this.clear().addComponent(components);
            },
            addType(type, methods) {
                const {em} = this;
                const {model = {}, view = {}, isComponent, extend, extendView, extendFn = [], extendFnView = []} = methods;
                const compType = this.getType(type);
                const extendType = this.getType(extend);
                const extendViewType = this.getType(extendView);
                const typeToExtend = extendType ? extendType : compType ? compType : this.getType('default');
                const modelToExt = typeToExtend.model;
                const viewToExt = extendViewType ? extendViewType.view : typeToExtend.view;
                const getExtendedObj = (fns, target, srcToExt) => fns.reduce((res, next) => {
                    const fn = target[next];
                    const parentFn = srcToExt.prototype[next];
                    if (fn && parentFn) {
                        res[next] = function (...args) {
                            parentFn.bind(this)(...args);
                            fn.bind(this)(...args);
                        };
                    }
                    return res;
                }, {});
                if (typeof model === 'object') {
                    methods.model = modelToExt.extend({
                        ...model,
                        ...getExtendedObj(extendFn, model, modelToExt),
                        defaults: langx.mixin({},
                            modelToExt.prototype.defaults,
                            _.result(model, 'defaults') 
                        )
                    }, { isComponent: compType && !extendType && !isComponent ? modelToExt.isComponent : isComponent || (() => 0) });
                }
                if (typeof view === 'object') {
                    methods.view = viewToExt.extend(langx.mixin({},
                        view,
                        getExtendedObj(extendFnView, view, viewToExt)
                    ));
                }
                if (compType) {
                    compType.model = methods.model;
                    compType.view = methods.view;
                } else {
                    methods.id = type;
                    componentTypes.unshift(methods);
                }
                const event = `component:type:${ compType ? 'update' : 'add' }`;
                em && em.trigger(event, compType || methods);
                return this;
            },
            getType(type) {
                var df = componentTypes;
                for (var it = 0; it < df.length; it++) {
                    var dfId = df[it].id;
                    if (dfId == type) {
                        return df[it];
                    }
                }
                return;
            },
            removeType(id) {
                const df = componentTypes;
                const type = this.getType(id);
                if (!type)
                    return;
                const index = df.indexOf(type);
                df.splice(index, 1);
                return type;
            },
            getTypes() {
                return componentTypes;
            },
            selectAdd(component, opts = {}) {
                if (component) {
                    component.set({ status: 'selected' });
                    [
                        'component:selected',
                        'component:toggled'
                    ].forEach(event => this.em.trigger(event, component, opts));
                }
            },
            selectRemove(component, opts = {}) {
                if (component) {
                    const {em} = this;
                    component.set({
                        status: '',
                        state: ''
                    });
                    [
                        'component:deselected',
                        'component:toggled'
                    ].forEach(event => this.em.trigger(event, component, opts));
                }
            },
            componentHovered() {
                const em = c.em;
                const model = em.get('componentHovered');
                const previous = em.previous('componentHovered');
                const state = 'hovered';
                previous && previous.get('status') == state && previous.set({
                    status: '',
                    state: ''
                });
                model && _.isEmpty(model.get('status')) && model.set('status', state);
            }
        };
    };
});
define('skylark-grapejs/navigator/config/config',[],function () {
    'use strict';
    return {
        stylePrefix: '',
        appendTo: '',
        sortable: 1,
        hidable: 1,
        hideTextnode: 1,
        root: '',
        showWrapper: 1,
        showHover: 1,
        scrollCanvas: {
            behavior: 'smooth',
            block: 'nearest'
        },
        scrollLayers: {
            behavior: 'auto',
            block: 'nearest'
        },
        highlightHover: 1
    };
});
define('skylark-grapejs/navigator/view/ItemsView',[
    'skylark-backbone',
    '../../dom_components/model/Component'
], function (Backbone, a) {
    'use strict';
    var ItemsView =  Backbone.View.extend({
        initialize(o = {}) {
            this.opt = o;
            const config = o.config || {};
            this.level = o.level;
            this.config = config;
            this.preview = o.preview;
            this.ppfx = config.pStylePrefix || '';
            this.pfx = config.stylePrefix || '';
            this.parent = o.parent;
            this.parentView = o.parentView;
            const pfx = this.pfx;
            const ppfx = this.ppfx;
            const parent = this.parent;
            const coll = this.collection;
            this.listenTo(coll, 'add', this.addTo);
            this.listenTo(coll, 'reset resetNavigator', this.render);
            this.listenTo(coll, 'remove', this.removeChildren);
            this.className = `${ pfx }layers`;
            const em = config.em;
            if (config.sortable && !this.opt.sorter) {
                const utils = em.get('Utils');
                this.opt.sorter = new utils.Sorter({
                    container: config.sortContainer || this.el,
                    containerSel: `.${ this.className }`,
                    itemSel: `.${ pfx }layer`,
                    ignoreViewChildren: 1,
                    onEndMove(created, sorter, data) {
                        const srcModel = sorter.getSourceModel();
                        em.setSelected(srcModel, { forceChange: 1 });
                        em.trigger(`${ a.eventDrag }:end`, data);
                    },
                    avoidSelectOnEnd: 1,
                    nested: 1,
                    ppfx,
                    pfx
                });
            }
            this.sorter = this.opt.sorter || '';
            this.$el.data('collection', coll);
            parent && this.$el.data('model', parent);
        },
        removeChildren(removed) {
            const view = removed.viewLayer;
            if (!view)
                return;
            view.remove.apply(view);
        },
        addTo(model) {
            var i = this.collection.indexOf(model);
            this.addToCollection(model, null, i);
        },
        addToCollection(model, fragmentEl, index) {
            const {level, parentView} = this;
            var fragment = fragmentEl || null;
            var viewObject = ItemsView.ItemView;
            var view = new viewObject({
                level,
                model,
                parentView,
                config: this.config,
                sorter: this.sorter,
                isCountable: this.isCountable,
                opened: this.opt.opened
            });
            var rendered = view.render().el;
            if (fragment) {
                fragment.appendChild(rendered);
            } else {
                if (typeof index != 'undefined') {
                    var method = 'before';
                    if (this.$el.children().length == index) {
                        index--;
                        method = 'after';
                    }
                    if (index < 0) {
                        this.$el.append(rendered);
                    } else
                        this.$el.children().eq(index)[method](rendered);
                } else
                    this.$el.append(rendered);
            }
            return rendered;
        },
        isCountable(model, hide) {
            var type = model.get('type');
            var tag = model.get('tagName');
            if ((type == 'textnode' || tag == 'br') && hide || !model.get('layerable')) {
                return false;
            }
            return true;
        },
        render() {
            const frag = document.createDocumentFragment();
            const el = this.el;
            el.innerHTML = '';
            this.collection.each(model => this.addToCollection(model, frag));
            el.appendChild(frag);
            el.className = this.className;
            return this;
        }
    });

    return ItemsView;
});
define('skylark-grapejs/navigator/view/ItemView',[
    'skylark-underscore',
    '../../utils/mixins',
    'skylark-backbone',
    '../../dom_components/view/ComponentView',
    '../../dom_components/model/Component',
    "./ItemsView"
], function (_, b, Backbone, ComponentView, Component,ItemsView) {
    'use strict';
    const inputProp = 'contentEditable';
    const $ = Backbone.$;
    var ItemView = Backbone.View.extend({
        events: {
            'mousedown [data-toggle-move]': 'startSort',
            'touchstart [data-toggle-move]': 'startSort',
            'click [data-toggle-visible]': 'toggleVisibility',
            'click [data-toggle-select]': 'handleSelect',
            'mouseover [data-toggle-select]': 'handleHover',
            'click [data-toggle-open]': 'toggleOpening',
            'dblclick [data-name]': 'handleEdit',
            'focusout [data-name]': 'handleEditEnd'
        },
        template(model) {
            const {pfx, ppfx, config, clsNoEdit} = this;
            const {hidable} = config;
            const count = this.countChildren(model);
            const addClass = !count ? this.clsNoChild : '';
            const clsTitle = `${ this.clsTitle } ${ addClass }`;
            const clsTitleC = `${ this.clsTitleC } ${ ppfx }one-bg`;
            const clsCaret = `${ this.clsCaret } fa fa-chevron-right`;
            const clsInput = `${ this.inputNameCls } ${ clsNoEdit } ${ ppfx }no-app`;
            const level = this.level + 1;
            const gut = `${ 30 + level * 10 }px`;
            const name = model.getName();
            const icon = model.getIcon();
            const clsBase = `${ pfx }layer`;
            return `
      ${ hidable ? `<i class="${ pfx }layer-vis fa fa-eye ${ this.isVisible() ? '' : 'fa-eye-slash' }" data-toggle-visible></i>` : '' }
      <div class="${ clsTitleC }">
        <div class="${ clsTitle }" style="padding-left: ${ gut }" data-toggle-select>
          <div class="${ pfx }layer-title-inn">
            <i class="${ clsCaret }" data-toggle-open></i>
            ${ icon ? `<span class="${ clsBase }__icon">${ icon }</span>` : '' }
            <span class="${ clsInput }" data-name>${ name }</span>
          </div>
        </div>
      </div>
      <div class="${ this.clsCount }" data-count>${ count || '' }</div>
      <div class="${ this.clsMove }" data-toggle-move>
        <i class="fa fa-arrows"></i>
      </div>
      <div class="${ this.clsChildren }"></div>`;
        },
        initialize(o = {}) {
            this.opt = o;
            this.level = o.level;
            this.config = o.config;
            this.em = o.config.em;
            this.ppfx = this.em.get('Config').stylePrefix;
            this.sorter = o.sorter || '';
            this.pfx = this.config.stylePrefix;
            this.parentView = o.parentView;
            const pfx = this.pfx;
            const ppfx = this.ppfx;
            const model = this.model;
            const components = model.get('components');
            const type = model.get('type') || 'default';
            model.set('open', false);
            this.listenTo(components, 'remove add reset', this.checkChildren);
            this.listenTo(model, 'change:status', this.updateStatus);
            this.listenTo(model, 'change:open', this.updateOpening);
            this.listenTo(model, 'change:layerable', this.updateLayerable);
            this.listenTo(model, 'change:style:display', this.updateVisibility);
            this.className = `${ pfx }layer ${ pfx }layer__t-${ type } no-select ${ ppfx }two-color`;
            this.inputNameCls = `${ ppfx }layer-name`;
            this.clsTitleC = `${ pfx }layer-title-c`;
            this.clsTitle = `${ pfx }layer-title`;
            this.clsCaret = `${ pfx }layer-caret`;
            this.clsCount = `${ pfx }layer-count`;
            this.clsMove = `${ pfx }layer-move`;
            this.clsChildren = `${ pfx }layer-children`;
            this.clsNoChild = `${ pfx }layer-no-chld`;
            this.clsEdit = `${ this.inputNameCls }--edit`;
            this.clsNoEdit = `${ this.inputNameCls }--no-edit`;
            this.$el.data('model', model);
            this.$el.data('collection', components);
            model.viewLayer = this;
        },
        getVisibilityEl() {
            if (!this.eyeEl) {
                this.eyeEl = this.$el.children(`.${ this.pfx }layer-vis`);
            }
            return this.eyeEl;
        },
        updateVisibility() {
            const pfx = this.pfx;
            const model = this.model;
            const hClass = `${ pfx }layer-hidden`;
            const hideIcon = 'fa-eye-slash';
            const hidden = model.getStyle().display == 'none';
            const method = hidden ? 'addClass' : 'removeClass';
            this.$el[method](hClass);
            this.getVisibilityEl()[method](hideIcon);
        },
        toggleVisibility(e) {
            e && e.stopPropagation();
            const {model} = this;
            const prevDspKey = '__prev-display';
            const prevDisplay = model.get(prevDspKey);
            const style = model.getStyle();
            const {display} = style;
            const hidden = display == 'none';
            if (hidden) {
                delete style.display;
                if (prevDisplay) {
                    style.display = prevDisplay;
                    model.unset(prevDspKey);
                }
            } else {
                display && model.set(prevDspKey, display);
                style.display = 'none';
            }
            model.setStyle(style);
        },
        handleEdit(e) {
            e && e.stopPropagation();
            const {em, $el, clsNoEdit, clsEdit} = this;
            const inputEl = this.getInputName();
            inputEl[inputProp] = true;
            inputEl.focus();
            em && em.setEditing(1);
            $el.find(`.${ this.inputNameCls }`).removeClass(clsNoEdit).addClass(clsEdit);
        },
        handleEditEnd(e) {
            e && e.stopPropagation();
            const {em, $el, clsNoEdit, clsEdit} = this;
            const inputEl = this.getInputName();
            const name = inputEl.textContent;
            inputEl.scrollLeft = 0;
            inputEl[inputProp] = false;
            this.model.set({ 'custom-name': name });
            em && em.setEditing(0);
            $el.find(`.${ this.inputNameCls }`).addClass(clsNoEdit).removeClass(clsEdit);
        },
        getInputName() {
            if (!this.inputName) {
                this.inputName = this.el.querySelector(`.${ this.inputNameCls }`);
            }
            return this.inputName;
        },
        updateOpening() {
            var opened = this.opt.opened || {};
            var model = this.model;
            const chvDown = 'fa-chevron-down';
            if (model.get('open')) {
                this.$el.addClass('open');
                this.getCaret().addClass(chvDown);
                opened[model.cid] = model;
            } else {
                this.$el.removeClass('open');
                this.getCaret().removeClass(chvDown);
                delete opened[model.cid];
            }
        },
        toggleOpening(e) {
            e.stopPropagation();
            if (!this.model.get('components').length)
                return;
            this.model.set('open', !this.model.get('open'));
        },
        handleSelect(e) {
            e.stopPropagation();
            const {em, config} = this;
            if (em) {
                const model = this.model;
                em.setSelected(model, { fromLayers: 1 });
                const scroll = config.scrollCanvas;
                scroll && model.views.forEach(view => view.scrollIntoView(scroll));
            }
        },
        handleHover(e) {
            e.stopPropagation();
            const {em, config, model} = this;
            em && config.showHover && em.setHovered(model, { fromLayers: 1 });
        },
        startSort(e) {
            e.stopPropagation();
            const {em, sorter} = this;
            if (e.button && e.button !== 0)
                return;
            if (sorter) {
                sorter.onStart = data => em.trigger(`${ Component.eventDrag }:start`, data);
                sorter.onMoveClb = data => em.trigger(Component.eventDrag, data);
                sorter.startSort(e.target);
            }
        },
        freeze() {
            this.$el.addClass(this.pfx + 'opac50');
            this.model.set('open', 0);
        },
        unfreeze() {
            this.$el.removeClass(this.pfx + 'opac50');
        },
        updateStatus(e) {
            ComponentView.prototype.updateStatus.apply(this, [{ avoidHover: !this.config.highlightHover }]);
        },
        isVisible() {
            var css = this.model.get('style'), pr = css.display;
            if (pr && pr == 'none')
                return;
            return 1;
        },
        checkChildren() {
            const {model, clsNoChild} = this;
            const count = this.countChildren(model);
            const title = this.$el.children(`.${ this.clsTitleC }`).children(`.${ this.clsTitle }`);
            let {cnt} = this;
            if (!cnt) {
                cnt = this.$el.children('[data-count]').get(0);
                this.cnt = cnt;
            }
            title[count ? 'removeClass' : 'addClass'](clsNoChild);
            if (cnt)
                cnt.innerHTML = count || '';
            !count && model.set('open', 0);
        },
        countChildren(model) {
            var count = 0;
            model.get('components').each(function (m) {
                var isCountable = this.opt.isCountable;
                var hide = this.config.hideTextnode;
                if (isCountable && !isCountable(m, hide))
                    return;
                count++;
            }, this);
            return count;
        },
        getCaret() {
            if (!this.caret || !this.caret.length) {
                const pfx = this.pfx;
                this.caret = this.$el.children(`.${ this.clsTitleC }`).find(`.${ this.clsCaret }`);
            }
            return this.caret;
        },
        setRoot(el) {
            el = _.isString(el) ? this.em.getWrapper().find(el)[0] : el;
            const model = b.getModel(el, $);
            if (!model)
                return;
            this.stopListening();
            this.model = model;
            this.initialize(this.opt);
            this.render();
        },
        updateLayerable() {
            const {parentView} = this;
            const toRerender = parentView || this;
            toRerender.render();
        },
        render() {
            const {model, config, pfx, ppfx, opt} = this;
            const {isCountable} = opt;
            const hidden = isCountable && !isCountable(model, config.hideTextnode);
            const vis = this.isVisible();
            const el = this.$el.empty();
            const level = this.level + 1;
            //if (_.isUndefined(ItemsView)) {
            //    ItemsView = ItemView.ItemsView; // require('./ItemsView').default; modified by lwf
            //}
            const children = new ItemsView({
                collection: model.get('components'),
                config: this.config,
                sorter: this.sorter,
                opened: this.opt.opened,
                parentView: this,
                parent: model,
                level
            }).render().$el;
            if (!this.config.showWrapper && level === 1) {
                el.append(children);
            } else {
                el.html(this.template(model));
                el.find(`.${ this.clsChildren }`).append(children);
            }
            if (!model.get('draggable') || !this.config.sortable) {
                el.children(`.${ this.clsMove }`).remove();
            }
            !vis && (this.className += ` ${ pfx }hide`);
            hidden && (this.className += ` ${ ppfx }hidden`);
            el.attr('class', this.className);
            this.updateOpening();
            this.updateStatus();
            this.updateVisibility();
            return this;
        }
    });

    ItemsView.ItemView = ItemView;
    return ItemView;
});
define('skylark-grapejs/navigator/index',[
    './config/config',
    './view/ItemView',
    'skylark-underscore'
], function (defaults, ItemView, a) {
    'use strict';
    return () => {
        let em;
        let layers;
        let config = {};
        return {
            name: 'LayerManager',
            init(opts = {}) {
                config = {
                    ...defaults,
                    ...opts
                };
                config.stylePrefix = opts.pStylePrefix;
                em = config.em;
                return this;
            },
            getConfig() {
                return config;
            },
            onLoad() {
                layers = new ItemView({
                    level: 0,
                    config,
                    opened: config.opened || {},
                    model: em.get('DomComponents').getWrapper()
                });
                em && em.on('component:selected', this.componentChanged);
                this.componentChanged();
            },
            postRender() {
                const elTo = config.appendTo;
                const root = config.root;
                root && this.setRoot(root);
                if (elTo) {
                    const el = a.isElement(elTo) ? elTo : document.querySelector(elTo);
                    el.appendChild(this.render());
                }
            },
            setRoot(el) {
                layers.setRoot(el);
                return this;
            },
            getRoot() {
                return layers.model;
            },
            getAll() {
                return layers;
            },
            componentChanged(selected, opts = {}) {
                if (opts.fromLayers)
                    return;
                const opened = em.get('opened');
                const model = em.getSelected();
                const scroll = config.scrollLayers;
                let parent = model && model.collection ? model.collection.parent : null;
                for (let cid in opened)
                    opened[cid].set('open', 0);
                while (parent) {
                    parent.set('open', 1);
                    opened[parent.cid] = parent;
                    parent = parent.collection ? parent.collection.parent : null;
                }
                if (model && scroll) {
                    const el = model.viewLayer && model.viewLayer.el;
                    el && el.scrollIntoView(scroll);
                }
            },
            render() {
                return layers.render().el;
            }
        };
    };
});
define('skylark-grapejs/utils/Droppable',[
    './mixins',
    'skylark-underscore'
], function (mixins, _) {
    'use strict';
    return class Droppable {
        constructor(em, rootEl) {
            this.em = em;
            const el = rootEl || em.get('Canvas').getFrames().map(frame => frame.get('root').getEl());
            const els = Array.isArray(el) ? el : [el];
            this.el = el;
            this.counter = 0;
            _.bindAll(this, 'handleDragEnter', 'handleDragOver', 'handleDrop', 'handleDragLeave');
            els.forEach(el => this.toggleEffects(el, 1));
            return this;
        }
        toggleEffects(el, enable) {

            const method = enable ? 'on' : 'off';
            mixins[method](el, 'dragenter', this.handleDragEnter);
            mixins[method](el, 'dragover', this.handleDragOver);
            mixins[method](el, 'drop', this.handleDrop);
            mixins[method](el, 'dragleave', this.handleDragLeave);
        }
        endDrop(cancel, ev) {
            const {em, dragStop} = this;
            this.counter = 0;
            this.over = 0;
            dragStop && dragStop(cancel);
            em.runDefault({ preserveSelected: 1 });
            em.trigger('canvas:dragend', ev);
        }
        handleDragLeave(ev) {
            this.updateCounter(-1, ev);
        }
        updateCounter(value, ev) {
            this.counter += value;
            this.counter === 0 && this.endDrop(1, ev);
        }
        handleDragEnter(ev) {
            const {em} = this;
            const dt = ev.dataTransfer;
            this.updateCounter(1, ev);
            if (this.over)
                return;
            this.over = 1;
            const utils = em.get('Utils');
            const canvas = em.get('Canvas');
            const container = canvas.getBody();
            let content = em.get('dragContent') || '<br>';
            let dragStop, dragContent;
            em.stopDefault();
            if (em.inAbsoluteMode()) {
                const wrapper = em.get('DomComponents').getWrapper();
                const target = wrapper.append({})[0];
                const dragger = em.get('Commands').run('core:component-drag', {
                    event: ev,
                    guidesInfo: 1,
                    center: 1,
                    target,
                    onEnd: (ev, dragger, {cancelled}) => {
                        if (!cancelled) {
                            const comp = wrapper.append(content)[0];
                            const {left, top, position} = target.getStyle();
                            comp.addStyle({
                                left,
                                top,
                                position
                            });
                            this.handleDragEnd(comp, dt);
                        }
                        target.remove();
                    }
                });
                dragStop = cancel => dragger.stop(ev, { cancel });
                dragContent = cnt => content = cnt;
            } else {
                const sorter = new utils.Sorter({
                    em,
                    wmargin: 1,
                    nested: 1,
                    canvasRelative: 1,
                    direction: 'a',
                    container,
                    placer: canvas.getPlacerEl(),
                    containerSel: '*',
                    itemSel: '*',
                    pfx: 'gjs-',
                    onEndMove: model => this.handleDragEnd(model, dt),
                    document: canvas.getFrameEl().contentDocument
                });
                sorter.setDropContent(content);
                sorter.startSort();
                this.sorter = sorter;
                dragStop = cancel => {
                    cancel && (sorter.moved = 0);
                    sorter.endMove();
                };
                dragContent = content => sorter.setDropContent(content);
            }
            this.dragStop = dragStop;
            this.dragContent = dragContent;
            em.trigger('canvas:dragenter', dt, content);
        }
        handleDragEnd(model, dt) {
            if (!model)
                return;
            const {em} = this;
            em.set('dragResult', model);
            em.trigger('canvas:drop', dt, model);
        }
        handleDragOver(ev) {
            ev.preventDefault();
            this.em.trigger('canvas:dragover', ev);
        }
        handleDrop(ev) {
            ev.preventDefault();
            const {dragContent} = this;
            const dt = ev.dataTransfer;
            const content = this.getContentByData(dt).content;
            ev.target.style.border = '';
            content && dragContent && dragContent(content);
            this.endDrop(!content, ev);
        }
        getContentByData(dataTransfer) {
            const em = this.em;
            const types = dataTransfer.types;
            const files = dataTransfer.files || [];
            const dragContent = em.get('dragContent');
            let content = dataTransfer.getData('text');
            if (files.length) {
                content = [];
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const type = file.type.split('/')[0];
                    if (type == 'image') {
                        content.push({
                            type,
                            file,
                            attributes: { alt: file.name }
                        });
                    }
                }
            } else if (dragContent) {
                content = dragContent;
            } else if (_.indexOf(types, 'text/html') >= 0) {
                content = dataTransfer.getData('text/html').replace(/<\/?meta[^>]*>/g, '');
            } else if (_.indexOf(types, 'text/uri-list') >= 0) {
                content = {
                    type: 'link',
                    attributes: { href: content },
                    content: content
                };
            } else if (_.indexOf(types, 'text/json') >= 0) {
                const json = dataTransfer.getData('text/json');
                json && (content = JSON.parse(json));
            }
            const result = { content };
            em.trigger('canvas:dragdata', dataTransfer, result);
            return result;
        }
    };
});
define('skylark-grapejs/canvas/config/config',[],function () {
    'use strict';
    return {
        stylePrefix: 'cv-',
        scripts: [],
        styles: [],
        customBadgeLabel: '',
        autoscrollLimit: 50,
        notTextable: [
            'button',
            'a',
            'input[type=checkbox]',
            'input[type=radio]'
        ]
    };
});
define('skylark-grapejs/canvas/model/Frame',[
    'skylark-backbone',
    '../../dom_components/model/Component',
    '../../css_composer/model/CssRules',
    'skylark-underscore'
], function (Backbone, Component, CssRules, a) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            wrapper: '',
            width: null,
            height: null,
            head: '',
            x: 0,
            y: 0,
            root: 0,
            components: 0,
            styles: 0,
            attributes: {}
        },
        initialize(props, opts = {}) {
            const {root, styles, components} = this.attributes;
            this.set('head', []);
            this.em = opts.em;
            const modOpts = {
                em: opts.em,
                config: opts.em.get('DomComponents').getConfig(),
                frame: this
            };
            !root && this.set('root', new Component({
                type: 'wrapper',
                components: components || []
            }, modOpts));
            (!styles || a.isString(styles)) && this.set('styles', new CssRules(styles, modOpts));
        },
        remove() {
            this.view = 0;
            const coll = this.collection;
            return coll && coll.remove(this);
        },
        getHead() {
            return [...this.get('head')];
        },
        setHead(value) {
            return this.set('head', [...value]);
        },
        addHeadItem(item) {
            const head = this.getHead();
            head.push(item);
            this.setHead(head);
        },
        getHeadByAttr(attr, value, tag) {
            const head = this.getHead();
            return head.filter(item => item.attributes && item.attributes[attr] == value && (!tag || tag === item.tag))[0];
        },
        removeHeadByAttr(attr, value, tag) {
            const head = this.getHead();
            const item = this.getHeadByAttr(attr, value, tag);
            const index = head.indexOf(item);
            if (index >= 0) {
                head.splice(index, 1);
                this.setHead(head);
            }
        },
        addLink(href) {
            const tag = 'link';
            !this.getHeadByAttr('href', href, tag) && this.addHeadItem({
                tag,
                attributes: {
                    href,
                    rel: 'stylesheet'
                }
            });
        },
        removeLink(href) {
            this.removeHeadByAttr('href', href, 'link');
        },
        addScript(src) {
            const tag = 'script';
            !this.getHeadByAttr('src', src, tag) && this.addHeadItem({
                tag,
                attributes: { src }
            });
        },
        removeScript(src) {
            this.removeHeadByAttr('src', src, 'script');
        },
        _emitUpdated(data = {}) {
            this.em.trigger('frame:updated', {
                frame: this,
                ...data
            });
        }
    });
});
define('skylark-grapejs/canvas/model/Frames',[
    'skylark-underscore',
    'skylark-backbone',
    './Frame'
], function (a, Backbone, model) {
    'use strict';
    return Backbone.Collection.extend({
        model,
        initialize() {
            a.bindAll(this, 'itemLoaded');
        },
        itemLoaded() {
            this.loadedItems++;
            if (this.loadedItems >= this.itemsToLoad) {
                this.trigger('loaded:all');
                this.listenToLoadItems(0);
            }
        },
        listenToLoad() {
            this.loadedItems = 0;
            this.itemsToLoad = this.length;
            this.listenToLoadItems(1);
        },
        listenToLoadItems(on) {
            this.forEach(item => item[on ? 'on' : 'off']('loaded', this.itemLoaded));
        }
    });
});
define('skylark-grapejs/canvas/model/Canvas',[
    'skylark-backbone',
    './Frame',
    './Frames'
], function (Backbone, Frame, Frames) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            frame: '',
            frames: '',
            wrapper: '',
            rulers: false,
            zoom: 100,
            x: 0,
            y: 0
        },
        initialize(config = {}) {
            const {em} = config;
            const {styles = [], scripts = []} = config;
            const frame = new Frame({}, config);
            styles.forEach(style => frame.addLink(style));
            scripts.forEach(script => frame.addScript(script));
            this.em = em;
            this.set('frame', frame);
            this.set('frames', new Frames([frame], config));
            this.listenTo(this, 'change:zoom', this.onZoomChange);
            this.listenTo(em, 'change:device', this.updateDevice);
        },
        updateDevice() {
            const {em} = this;
            const device = em.getDeviceModel();
            const model = em.getCurrentFrameModel();
            if (model && device) {
                const {width, height} = device.attributes;
                model.set({
                    width,
                    height
                });
            }
        },
        onZoomChange() {
            const zoom = this.get('zoom');
            zoom < 1 && this.set('zoom', 1);
        }
    });
});
define('skylark-grapejs/canvas/view/FrameView',[
    "skylark-langx/langx",
    'skylark-backbone',
    'skylark-underscore',
    '../../css_composer/view/CssRulesView',
    '../../dom_components/view/ComponentView',
    '../../utils/dom',
    '../../utils/mixins'
], function (langx,Backbone, _, CssRulesView, ComponentView, dom, mixins) {
    'use strict';
    return Backbone.View.extend({
        tagName: 'iframe',
        attributes: {
            allowfullscreen: 'allowfullscreen',
            'data-frame-el': true
        },
        initialize(o) {
            _.bindAll(this, 'updateClientY', 'stopAutoscroll', 'autoscroll', '_emitUpdate');
            const {model, el} = this;
            this.config = {
                ...o.config ,
                frameView: this
            };
            this.ppfx = this.config.pStylePrefix || '';
            this.em = this.config.em;
            this.listenTo(model, 'change:head', this.updateHead);
            model.view = this;
            mixins.setViewEl(el, this);
        },
        updateHead() {
            const headEl = this.getHead();
            dom.empty(headEl);
            dom.appendVNodes(headEl, this.model.getHead());
        },
        getEl() {
            return this.el;
        },
        getWindow() {
            return this.getEl().contentWindow;
        },
        getDoc() {
            return this.getEl().contentDocument;
        },
        getHead() {
            return this.getDoc().querySelector('head');
        },
        getBody() {
            return this.getDoc().querySelector('body');
        },
        getWrapper() {
            return this.getBody().querySelector('[data-gjs-type=wrapper]');
        },
        getJsContainer() {
            if (!this.jsContainer) {
                this.jsContainer = dom.createEl('div', { class: `${ this.ppfx }js-cont` });
            }
            return this.jsContainer;
        },
        getToolsEl() {
            const {frameWrapView} = this.config;
            return frameWrapView && frameWrapView.elTools;
        },
        getGlobalToolsEl() {
            return this.em.get('Canvas').getGlobalToolsEl();
        },
        getHighlighter() {
            return this._getTool('[data-hl]');
        },
        getBadgeEl() {
            return this._getTool('[data-badge]');
        },
        getOffsetViewerEl() {
            return this._getTool('[data-offset]');
        },
        getRect() {
            if (!this.rect) {
                this.rect = this.el.getBoundingClientRect();
            }
            return this.rect;
        },
        getOffsetRect() {
            const {el} = this;
            const {scrollTop, scrollLeft} = this.getBody();
            const height = el.offsetHeight;
            const width = el.offsetWidth;
            return {
                top: el.offsetTop,
                left: el.offsetLeft,
                height,
                width,
                scrollTop,
                scrollLeft,
                scrollBottom: scrollTop + height,
                scrollRight: scrollLeft + width
            };
        },
        _getTool(name) {
            const toolsEl = this.getToolsEl();
            if (!this[name]) {
                this[name] = toolsEl.querySelector(name);
            }
            return this[name];
        },
        remove() {
            const {root, model} = this;
            this._toggleEffects();
            Backbone.View.prototype.remove.apply(this, arguments);
            root.remove();
            model.remove();
        },
        startAutoscroll() {
            this.lastMaxHeight = this.getWrapper().offsetHeight - this.el.offsetHeight;
            setTimeout(() => {
                this._toggleAutoscrollFx(1);
                requestAnimationFrame(this.autoscroll);
            }, 0);
        },
        autoscroll() {
            if (this.dragging) {
                const canvas = this.em.get('Canvas');
                const win = this.getWindow();
                const body = this.getBody();
                const actualTop = body.scrollTop;
                const clientY = this.lastClientY || 0;
                const limitTop = canvas.getConfig().autoscrollLimit;
                const limitBottom = this.getRect().height - limitTop;
                let nextTop = actualTop;
                if (clientY < limitTop) {
                    nextTop -= limitTop - clientY;
                }
                if (clientY > limitBottom) {
                    nextTop += clientY - limitBottom;
                }
                if (nextTop !== actualTop && nextTop > 0 && nextTop < this.lastMaxHeight) {
                    const toolsEl = this.getGlobalToolsEl();
                    toolsEl.style.opacity = 0;
                    this.showGlobalTools();
                    win.scrollTo(0, nextTop);
                }
                requestAnimationFrame(this.autoscroll);
            }
        },
        updateClientY(ev) {
            ev.preventDefault();
            this.lastClientY = mixins.getPointerEvent(ev).clientY * this.em.getZoomDecimal();
        },
        showGlobalTools: _.debounce(function () {
            this.getGlobalToolsEl().style.opacity = '';
        }, 50),
        stopAutoscroll() {
            this.dragging && this._toggleAutoscrollFx();
        },
        _toggleAutoscrollFx(enable) {
            this.dragging = enable;
            const win = this.getWindow();
            const method = enable ? 'on' : 'off';
            mixins[method](win, 'mousemove dragover', this.updateClientY);
            mixins[method](win, 'mouseup', this.stopAutoscroll);
        },
        render() {
            const {el, $el, ppfx, config} = this;
            $el.attr({ class: ppfx + 'frame' });
            if (config.scripts.length) {
                this.renderScripts();
            } else if (config.renderContent) {
                el.onload = this.renderBody.bind(this);
            }
            return this;
        },
        renderScripts() {
            const {el, config} = this;
            const appendScript = scripts => {
                if (scripts.length > 0) {
                    const src = scripts.shift();
                    const scriptEl = dom.createEl('script', langx.mixin({
                                            type: 'text/javascript'
                                        },_.isString(src) ? { src } : src
                    ));
                    scriptEl.onerror = scriptEl.onload = appendScript.bind(null, scripts);
                    el.contentDocument.head.appendChild(scriptEl);
                } else {
                    this.renderBody();
                }
            };
            el.onload = () => appendScript([...config.scripts]);
        },
        renderBody() {
            const {config, model, ppfx} = this;
            const root = model.get('root');
            const styles = model.get('styles');
            const {em} = config;
            const doc = this.getDoc();
            const head = this.getHead();
            const body = this.getBody();
            const win = this.getWindow();
            const conf = em.get('Config');
            const extStyles = [];
            config.styles.forEach(href => extStyles.push(_.isString(href) ? {
                tag: 'link',
                attributes: {
                    href,
                    rel: 'stylesheet'
                }
            } : {
                tag: 'link',
                attributes: {
                    rel: 'stylesheet',
                    ...href
                }
            }));
            extStyles.length && dom.appendVNodes(head, extStyles);
            const colorWarn = '#ffca6f';
            dom.append(body, `<style>
      ${ conf.baseCss || '' }

      .${ ppfx }dashed *[data-highlightable] {
        outline: 1px dashed rgba(170,170,170,0.7);
        outline-offset: -2px;
      }

      .${ ppfx }selected {
        outline: 3px solid #3b97e3 !important;
        outline-offset: -3px;
      }

      .${ ppfx }selected-parent {
        outline: 2px solid ${ colorWarn } !important
      }

      .${ ppfx }no-select {
        user-select: none;
        -webkit-user-select:none;
        -moz-user-select: none;
      }

      .${ ppfx }freezed {
        opacity: 0.5;
        pointer-events: none;
      }

      .${ ppfx }no-pointer {
        pointer-events: none;
      }

      .${ ppfx }plh-image {
        background: #f5f5f5;
        border: none;
        height: 100px;
        width: 100px;
        display: block;
        outline: 3px solid #ffca6f;
        cursor: pointer;
        outline-offset: -2px
      }

      .${ ppfx }grabbing {
        cursor: grabbing;
        cursor: -webkit-grabbing;
      }

      .${ ppfx }is__grabbing {
        overflow-x: hidden;
      }

      .${ ppfx }is__grabbing,
      .${ ppfx }is__grabbing * {
        cursor: grabbing !important;
      }

      ${ conf.canvasCss || '' }
      ${ conf.protectedCss || '' }
    </style>`);
            this.root = new ComponentView({
                model: root,
                config: {
                    ...root.config,
                    frameView: this
                }
            }).render();
            dom.append(body, this.root.el);
            dom.append(body, new CssRulesView({
                collection: styles,
                config: {
                    ...em.get('CssComposer').getConfig(),
                    frameView: this
                }
            }).render().el);
            dom.append(body, this.getJsContainer());
            mixins.on(body, 'click', ev => ev && ev.target.tagName == 'A' && ev.preventDefault());
            mixins.on(body, 'submit', ev => ev && ev.preventDefault());
            [
                {
                    event: 'keydown keyup keypress',
                    class: 'KeyboardEvent'
                },
                {
                    event: 'wheel',
                    class: 'WheelEvent'
                }
            ].forEach(obj => obj.event.split(' ').forEach(event => {
                doc.addEventListener(event, ev => this.el.dispatchEvent(dom.createCustomEvent(ev, obj.class)));
            }));
            this._toggleEffects(1);
            model.trigger('loaded');
        },
        _toggleEffects(enable) {
            const method = enable ? mixins.on : mixins.off;
            const win = this.getWindow();
            method(win, `${ dom.motionsEv } resize`, this._emitUpdate);
        },
        _emitUpdate() {
            this.model._emitUpdated();
        }
    });
});
define('skylark-grapejs/canvas/view/FrameWrapView',[
    'skylark-backbone',
    './FrameView',
    'skylark-underscore',
    '../../utils/dom',
    '../../utils/Dragger'
], function (Backbone, FrameView, a, b, Dragger) {
    'use strict';
    return Backbone.View.extend({
        events: {
            'click [data-action-remove]': 'remove',
            'mousedown [data-action-move]': 'startDrag'
        },
        initialize(opts = {}, conf = {}) {
            a.bindAll(this, 'onScroll', 'frameLoaded', 'updateOffset', 'remove', 'startDrag');
            const {model} = this;
            const config = {
                ...opts.config || conf,
                frameWrapView: this
            };
            const {canvasView, em} = config;
            this.cv = canvasView;
            this.config = config;
            this.em = em;
            this.canvas = em && em.get('Canvas');
            this.ppfx = config.pStylePrefix || '';
            this.frame = new FrameView({
                model,
                config
            });
            this.classAnim = `${ this.ppfx }frame-wrapper--anim`;
            this.listenTo(model, 'loaded', this.frameLoaded);
            this.listenTo(model, 'change:x change:y', this.updatePos);
            this.listenTo(model, 'change:width change:height', this.updateSize);
            this.updatePos();
            this.setupDragger();
        },
        setupDragger() {
            const {canvas, model} = this;
            let dragX, dragY, zoom;
            const toggleEffects = on => {
                canvas.toggleFramesEvents(on);
            };
            this.dragger = new Dragger({
                onStart: () => {
                    const {x, y} = model.attributes;
                    zoom = this.em.getZoomMultiplier();
                    dragX = x;
                    dragY = y;
                    toggleEffects();
                },
                onEnd: () => toggleEffects(1),
                setPosition: posOpts => {
                    model.set({
                        x: dragX + posOpts.x * zoom,
                        y: dragY + posOpts.y * zoom
                    });
                }
            });
        },
        startDrag(ev) {
            ev && this.dragger.start(ev);
        },
        remove() {
            Backbone.View.prototype.remove.apply(this, arguments);
            this.frame.remove();
            return this;
        },
        updateOffset: a.debounce(function () {
            const {em, $el, frame} = this;
            em.runDefault({ preserveSelected: 1 });
            $el.removeClass(this.classAnim);
            frame.model._emitUpdated();
        }),
        updatePos(md) {
            const {model, el} = this;
            const {x, y} = model.attributes;
            const {style} = el;
            this.frame.rect = 0;
            style.left = isNaN(x) ? x : `${ x }px`;
            style.top = isNaN(y) ? y : `${ y }px`;
            md && this.updateOffset();
        },
        updateSize: a.debounce(function () {
            this.updateDim();
        }),
        updateDim() {
            const {em, el, $el, model, classAnim} = this;
            const {width, height} = model.attributes;
            const {style} = el;
            const currW = style.width || '';
            const currH = style.height || '';
            const newW = width || '';
            const newH = height || '';
            const noChanges = currW == newW && currH == newH;
            const un = 'px';
            this.frame.rect = 0;
            $el.addClass(classAnim);
            style.width = a.isNumber(newW) ? `${ newW }${ un }` : newW;
            style.height = a.isNumber(newH) ? `${ newH }${ un }` : newH;
            if (a.isNull(width) || a.isNull(height)) {
                const newDims = {
                    ...!width ? { width: el.offsetWidth } : {},
                    ...!height ? { height: el.offsetHeight } : {}
                };
                model.set(newDims, { silent: 1 });
            }
            em.stopDefault({ preserveSelected: 1 });
            noChanges ? this.updateOffset() : $el.one(b.motionsEv, this.updateOffset);
        },
        onScroll() {
            const {frame, em} = this;
            em.trigger('frame:scroll', {
                frame,
                body: frame.getBody(),
                target: frame.getWindow()
            });
        },
        frameLoaded() {
            const {frame} = this;
            frame.getWindow().onscroll = this.onScroll;
            this.updateDim();
        },
        render() {
            const {frame, $el, ppfx, cv, model, el} = this;
            const {onRender} = model.attributes;
            frame.render();
            $el.empty().attr({ class: `${ ppfx }frame-wrapper` }).append(`
      <div class="${ ppfx }frame-wrapper__top gjs-two-color" data-frame-top>
        <div class="${ ppfx }frame-wrapper__name" data-action-move>
          ${ model.get('name') || '' }
        </div>
        <div class="${ ppfx }frame-wrapper__top-r">
          <div class="${ ppfx }frame-wrapper__icon" data-action-remove style="display: none">
            <svg viewBox="0 0 24 24"><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"></path></svg>
          </div>
        </div>
      </div>
      <div class="${ ppfx }frame-wrapper__right" data-frame-right></div>
      <div class="${ ppfx }frame-wrapper__left" data-frame-left></div>
      <div class="${ ppfx }frame-wrapper__bottom" data-frame-bottom></div>
      `).append(frame.el);
            const elTools = b.createEl('div', {
                class: `${ ppfx }tools`,
                style: 'pointer-events:none; opacity: 0'
            }, `
      <div class="${ ppfx }highlighter" data-hl></div>
      <div class="${ ppfx }badge" data-badge></div>
      <div class="${ ppfx }placeholder">
        <div class="${ ppfx }placeholder-int"></div>
      </div>
      <div class="${ ppfx }ghost"></div>
      <div class="${ ppfx }toolbar" style="pointer-events:all"></div>
      <div class="${ ppfx }resizer"></div>
      <div class="${ ppfx }offset-v" data-offset>
        <div class="gjs-marginName" data-offset-m>
          <div class="gjs-margin-v-el gjs-margin-v-top" data-offset-m-t></div>
          <div class="gjs-margin-v-el gjs-margin-v-bottom" data-offset-m-b></div>
          <div class="gjs-margin-v-el gjs-margin-v-left" data-offset-m-l></div>
          <div class="gjs-margin-v-el gjs-margin-v-right" data-offset-m-r></div>
        </div>
        <div class="gjs-paddingName" data-offset-m>
          <div class="gjs-padding-v-el gjs-padding-v-top" data-offset-p-t></div>
          <div class="gjs-padding-v-el gjs-padding-v-bottom" data-offset-p-b></div>
          <div class="gjs-padding-v-el gjs-padding-v-left" data-offset-p-l></div>
          <div class="gjs-padding-v-el gjs-padding-v-right" data-offset-p-r></div>
        </div>
      </div>
      <div class="${ ppfx }offset-fixed-v"></div>
    `);
            this.elTools = elTools;
            cv.toolsWrapper.appendChild(elTools);
            onRender && onRender({
                el,
                elTop: el.querySelector('[data-frame-top]'),
                elRight: el.querySelector('[data-frame-right]'),
                elBottom: el.querySelector('[data-frame-bottom]'),
                elLeft: el.querySelector('[data-frame-left]'),
                frame: model,
                frameWrapperView: this,
                remove: this.remove,
                startDrag: this.startDrag
            });
            return this;
        }
    });
});
define('skylark-grapejs/canvas/view/FramesView',[
    '../../domain_abstract/view/DomainViews',
    './FrameWrapView'
], function (DomainViews, FrameWrapView) {
    'use strict';
    return DomainViews.extend({
        itemView: FrameWrapView,
        autoAdd: 1,
        init() {
            this.listenTo(this.collection, 'reset', this.render);
        },
        onRender() {
            const {config, $el} = this;
            const {em} = config;
            em && $el.attr({ class: `${ em.getConfig('stylePrefix') }frames` });
        }
    });
});
define('skylark-grapejs/canvas/view/CanvasView',[
    "skylark-langx/langx",
    "skylark-jquery",
    'skylark-backbone',
    'skylark-underscore',
    '../../utils/mixins',
    './FramesView'
], function (langx,$,Backbone, _, mixins, FramesView) {
    'use strict';
    let timerZoom;
    return Backbone.View.extend({
        events: { wheel: 'onWheel' },
        template() {
            const {pfx} = this;
            return `
      <div class="${ pfx }canvas__frames" data-frames></div>
      <div id="${ pfx }tools" class="${ pfx }canvas__tools" data-tools></div>
    `;
        },
        initialize(o) {
            _.bindAll(this, 'clearOff', 'onKeyPress');
            mixins.on(window, 'scroll resize', this.clearOff);
            const {model} = this;
            const frames = model.get('frames');
            this.config = o.config || {};
            this.em = this.config.em || {};
            this.pfx = this.config.stylePrefix || '';
            this.ppfx = this.config.pStylePrefix || '';
            this.className = this.config.stylePrefix + 'canvas';
            const {em, config} = this;
            this.frames = new FramesView({
                collection: frames,
                config: langx.mixin({},config,{
                    canvasView: this,
                    renderContent: 1
                })
            });
            this.listenTo(em, 'change:canvasOffset', this.clearOff);
            this.listenTo(em, 'component:selected', this.checkSelected);
            this.listenTo(model, 'change:zoom change:x change:y', this.updateFrames);
            this.listenTo(frames, 'loaded:all', () => em.trigger('loaded'));
            this.toggleListeners(1);
        },
        checkSelected(component, opts = {}) {
            const {scroll} = opts;
            const currFrame = this.em.get('currentFrame');
            scroll && component.views.forEach(view => {
                view._getFrame() !== currFrame && view.scrollIntoView(scroll);
            });
        },
        remove() {
            Backbone.View.prototype.remove.apply(this, arguments);
            this.toggleListeners();
        },
        preventDefault(ev) {
            if (ev) {
                ev.preventDefault();
                ev._parentEvent && ev._parentEvent.preventDefault();
            }
        },
        toggleListeners(enable) {
            const method = enable ? 'on' : 'off';

            mixins[method](document, 'keypress', this.onKeyPress);
        },
        onKeyPress(ev) {
            const {em} = this;
            const key = mixins.getKeyChar(ev);
            if (key === ' ' && em.getZoomDecimal() !== 1) {
                this.preventDefault(ev);
                em.get('Editor').runCommand('core:canvas-move');
            }
        },
        onWheel(ev) {
            if ((ev.ctrlKey || ev.metaKey) && this.em.getConfig('multiFrames')) {
                this.preventDefault(ev);
                const {model} = this;
                const delta = Math.max(-1, Math.min(1, ev.wheelDelta || -ev.detail));
                const zoom = model.get('zoom');
                model.set('zoom', zoom + delta * 2);
            }
        },
        updateFrames(ev) {
            const {em, model} = this;
            const {x, y} = model.attributes;
            const zoom = this.getZoom();
            const defOpts = { preserveSelected: 1 };
            const mpl = zoom ? 1 / zoom : 1;
            this.framesArea.style.transform = `scale(${ zoom }) translate(${ x * mpl }px, ${ y * mpl }px)`;
            this.clearOff();
            em.stopDefault(defOpts);
            em.trigger('canvas:update', ev);
            timerZoom && clearTimeout(timerZoom);
            timerZoom = setTimeout(() => em.runDefault(defOpts), 300);
        },
        getZoom() {
            return this.em.getZoomDecimal();
        },
        isElInViewport(el) {
            const elem = mixins.getElement(el);
            const rect = mixins.getElRect(elem);
            const frameRect = this.getFrameOffset(elem);
            const rTop = rect.top;
            const rLeft = rect.left;
            return rTop >= 0 && rLeft >= 0 && rTop <= frameRect.height && rLeft <= frameRect.width;
        },
        offset(el, opts = {}) {
            const rect = mixins.getElRect(el);
            const docBody = el.ownerDocument.body;
            const {noScroll} = opts;
            return {
                top: rect.top + (noScroll ? 0 : docBody.scrollTop),
                left: rect.left + (noScroll ? 0 : docBody.scrollLeft),
                width: rect.width,
                height: rect.height
            };
        },
        clearOff() {
            this.frmOff = null;
            this.cvsOff = null;
        },
        getFrameOffset(el) {
            if (!this.frmOff || el) {
                const frEl = el ? el.ownerDocument.defaultView.frameElement : this.frame.el;
                this.frmOff = this.offset(frEl);
            }
            return this.frmOff;
        },
        getCanvasOffset() {
            if (!this.cvsOff)
                this.cvsOff = this.offset(this.el);
            return this.cvsOff;
        },
        getElementPos(el, opts) {
            const zoom = this.getZoom();
            var opt = opts || {};
            var frmOff = this.getFrameOffset(el);
            var cvsOff = this.getCanvasOffset();
            var eo = this.offset(el, opts);
            var frmTop = opt.avoidFrameOffset ? 0 : frmOff.top;
            var frmLeft = opt.avoidFrameOffset ? 0 : frmOff.left;
            const top = eo.top * zoom + frmTop - cvsOff.top;
            const left = eo.left * zoom + frmLeft - cvsOff.left;
            const height = eo.height * zoom;
            const width = eo.width * zoom;
            return {
                top,
                left,
                height,
                width,
                zoom,
                rect: eo
            };
        },
        getElementOffsets(el) {
            if (!el || mixins.isTextNode(el))
                return {};
            const result = {};
            const styles = window.getComputedStyle(el);
            [
                'marginTop',
                'marginRight',
                'marginBottom',
                'marginLeft',
                'paddingTop',
                'paddingRight',
                'paddingBottom',
                'paddingLeft'
            ].forEach(offset => {
                result[offset] = parseFloat(styles[offset]) * this.getZoom();
            });
            return result;
        },
        getPosition(opts = {}) {
            const doc = this.frame.el.contentDocument;
            if (!doc)
                return;
            const bEl = doc.body;
            const zoom = this.getZoom();
            const fo = this.getFrameOffset();
            const co = this.getCanvasOffset();
            const {noScroll} = opts;
            return {
                top: fo.top + (noScroll ? 0 : bEl.scrollTop) * zoom - co.top,
                left: fo.left + (noScroll ? 0 : bEl.scrollLeft) * zoom - co.left,
                width: co.width,
                height: co.height
            };
        },
        updateScript(view) {
            const model = view.model;
            const id = model.getId();
            if (!view.scriptContainer) {
                view.scriptContainer = $(`<div data-id="${ id }">`);
                this.getJsContainer().appendChild(view.scriptContainer.get(0));
            }
            view.el.id = id;
            view.scriptContainer.html('');
            const script = document.createElement('script');
            script.innerHTML = `
        setTimeout(function() {
          var item = document.getElementById('${ id }');
          if (!item) return;
          (function(){
            ${ model.getScriptString() };
          }.bind(item))()
        }, 1);`;
            setTimeout(() => view.scriptContainer.get(0).appendChild(script), 0);
        },
        getJsContainer(view) {
            const frameView = this.getFrameView(view);
            return frameView && frameView.getJsContainer();
        },
        getFrameView(view) {
            return view && view._getFrame() || this.em.get('currentFrame');
        },
        render() {
            const {el, $el, ppfx, model, em, frames} = this;
            const cssc = em.get('CssComposer');
            const wrapper = model.get('wrapper');
            $el.html(this.template());
            const $frames = $el.find('[data-frames]');
            this.framesArea = $frames.get(0);
            this.wrapper = wrapper;
            if (wrapper && typeof wrapper.render == 'function') {
                model.get('frame').set({
                    wrapper,
                    root: wrapper.getWrapper(),
                    styles: cssc.getAll()
                });
            }
            const toolsWrp = $el.find('[data-tools]');
            this.toolsWrapper = toolsWrp.get(0);
            toolsWrp.append(`
      <div class="${ ppfx }tools ${ ppfx }tools-gl" style="pointer-events:none">
        <div class="${ ppfx }placeholder">
          <div class="${ ppfx }placeholder-int"></div>
        </div>
      </div>
      <div id="${ ppfx }tools" style="pointer-events:none">
        <div class="${ ppfx }badge"></div>
        <div class="${ ppfx }ghost"></div>
        <div class="${ ppfx }toolbar" style="pointer-events:all"></div>
        <div class="${ ppfx }resizer"></div>
        <div class="${ ppfx }offset-v"></div>
        <div class="${ ppfx }offset-fixed-v"></div>
      </div>
    `);
            const toolsEl = el.querySelector(`#${ ppfx }tools`);
            this.hlEl = el.querySelector(`.${ ppfx }highlighter`);
            this.badgeEl = el.querySelector(`.${ ppfx }badge`);
            this.placerEl = el.querySelector(`.${ ppfx }placeholder`);
            this.ghostEl = el.querySelector(`.${ ppfx }ghost`);
            this.toolbarEl = el.querySelector(`.${ ppfx }toolbar`);
            this.resizerEl = el.querySelector(`.${ ppfx }resizer`);
            this.offsetEl = el.querySelector(`.${ ppfx }offset-v`);
            this.fixedOffsetEl = el.querySelector(`.${ ppfx }offset-fixed-v`);
            this.toolsGlobEl = el.querySelector(`.${ ppfx }tools-gl`);
            this.toolsEl = toolsEl;
            this.el.className = this.className;
            const frms = model.get('frames');
            frms.listenToLoad();
            frames.render();
            em.setCurrentFrame(frms.at(0).view);
            $frames.append(frames.el);
            this.frame = frms.at(0).view;
            return this;
        }
    });
});
define('skylark-grapejs/canvas/index',[
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
                var canvasOff = this.offset(this.getElement());
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
define('skylark-grapejs/commands/view/CommandAbstract',['skylark-backbone'], function (Backbone) {
    'use strict';
    const $ = Backbone.$;
    return Backbone.View.extend({
        initialize(o) {
            this.config = o || {};
            this.editorModel = this.em = this.config.em || {};
            this.pfx = this.config.stylePrefix;
            this.ppfx = this.config.pStylePrefix;
            this.hoverClass = this.pfx + 'hover';
            this.badgeClass = this.pfx + 'badge';
            this.plhClass = this.pfx + 'placeholder';
            this.freezClass = this.ppfx + 'freezed';
            this.canvas = this.em.get && this.em.get('Canvas');
            if (this.em.get)
                this.setElement(this.getCanvas());
            if (this.canvas) {
                this.$canvas = this.$el;
                this.canvasTool = this.getCanvasTools();
            }
            this.init(this.config);
        },
        onFrameScroll(e) {
        },
        getCanvas() {
            return this.canvas.getElement();
        },
        getCanvasBody() {
            return this.canvas.getBody();
        },
        getCanvasWrapper() {
            return this.canvas.getWrapperEl();
        },
        getCanvasTools() {
            return this.canvas.getToolsEl();
        },
        offset(el) {
            var rect = el.getBoundingClientRect();
            return {
                top: rect.top + el.ownerDocument.body.scrollTop,
                left: rect.left + el.ownerDocument.body.scrollLeft
            };
        },
        init(o) {
        },
        callRun(editor, options = {}) {
            const id = this.id;
            editor.trigger(`run:${ id }:before`, options);
            if (options && options.abort) {
                editor.trigger(`abort:${ id }`, options);
                return;
            }
            const sender = options.sender || editor;
            const result = this.run(editor, sender, options);
            editor.trigger(`run:${ id }`, result, options);
            editor.trigger('run', id, result, options);
            return result;
        },
        callStop(editor, options = {}) {
            const id = this.id;
            const sender = options.sender || editor;
            editor.trigger(`stop:${ id }:before`, options);
            const result = this.stop(editor, sender, options);
            editor.trigger(`stop:${ id }`, result, options);
            editor.trigger('stop', id, result, options);
            return result;
        },
        stopCommand() {
            this.em.get('Commands').stop(this.id);
        },
        run(em, sender) {
        },
        stop(em, sender) {
        }
    });
});
define('skylark-grapejs/commands/config/config',[],function () {
    'use strict';
    return {
        stylePrefix: 'com-',
        defaults: [],
        strict: 1
    };
});
define('skylark-grapejs/commands/view/CanvasClear',[],function () {
    'use strict';
    return {
        run(ed) {
            ed.DomComponents.clear();
            ed.CssComposer.clear();
        }
    };
});
define('skylark-grapejs/commands/view/CanvasMove',[
    'skylark-underscore',
    '../../utils/mixins',
    '../../utils/Dragger'
], function (_, mixins, Dragger) {
    'use strict';
    return {
        run(ed) {
            _.bindAll(this, 'onKeyUp', 'enableDragger', 'disableDragger');
            this.editor = ed;
            this.canvasModel = this.canvas.getCanvasView().model;
            this.toggleMove(1);
        },
        stop(ed) {
            this.toggleMove();
            this.disableDragger();
        },
        onKeyUp(ev) {
            if (mixins.getKeyChar(ev) === ' ') {
                this.editor.stopCommand(this.id);
            }
        },
        enableDragger(ev) {
            this.toggleDragger(1, ev);
        },
        disableDragger(ev) {
            this.toggleDragger(0, ev);
        },
        toggleDragger(enable, ev) {
            const {canvasModel, em} = this;
            let {dragger} = this;
            const methodCls = enable ? 'add' : 'remove';
            this.getCanvas().classList[methodCls](`${ this.ppfx }is__grabbing`);
            if (!dragger) {
                dragger = new Dragger({
                    getPosition() {
                        return {
                            x: canvasModel.get('x'),
                            y: canvasModel.get('y')
                        };
                    },
                    setPosition({x, y}) {
                        canvasModel.set({
                            x,
                            y
                        });
                    },
                    onStart(ev, dragger) {
                        em.trigger('canvas:move:start', dragger);
                    },
                    onDrag(ev, dragger) {
                        em.trigger('canvas:move', dragger);
                    },
                    onEnd(ev, dragger) {
                        em.trigger('canvas:move:end', dragger);
                    }
                });
                this.dragger = dragger;
            }
            enable ? dragger.start(ev) : dragger.stop();
        },
        toggleMove(enable) {
            const {ppfx} = this;
            const methodCls = enable ? 'add' : 'remove';
            const methodEv = enable ? 'on' : 'off';

            const canvas = this.getCanvas();
            const classes = [`${ ppfx }is__grab`];
            !enable && classes.push(`${ ppfx }is__grabbing`);
            classes.forEach(cls => canvas.classList[methodCls](cls));
            mixins[methodEv](document, 'keyup', this.onKeyUp);
            mixins[methodEv](canvas, 'mousedown', this.enableDragger);
            mixins[methodEv](document, 'mouseup', this.disableDragger);
        }
    };
});
define('skylark-grapejs/commands/view/ComponentDelete',['skylark-underscore'], function (a) {
    'use strict';
    return {
        run(ed, sender, opts = {}) {
            let components = opts.component || ed.getSelectedAll();
            components = a.isArray(components) ? [...components] : [components];
            ed.select(null);
            components.forEach(component => {
                if (!component || !component.get('removable')) {
                    return this.em.logWarning('The element is not removable', { component });
                }
                component.remove();
            });
            return components;
        }
    };
});
define('skylark-grapejs/commands/view/ComponentDrag',[
    'skylark-underscore',
    '../../utils/Dragger'
], function (a, Dragger) {
    'use strict';
    const evName = 'dmode';
    return {
        run(editor, sender, opts = {}) {
            a.bindAll(this, 'setPosition', 'onStart', 'onDrag', 'onEnd', 'getPosition', 'getGuidesStatic', 'renderGuide', 'getGuidesTarget');
            const {target, event, mode, dragger = {}} = opts;
            const el = target.getEl();
            const config = {
                doc: el.ownerDocument,
                onStart: this.onStart,
                onEnd: this.onEnd,
                onDrag: this.onDrag,
                getPosition: this.getPosition,
                setPosition: this.setPosition,
                guidesStatic: () => this.guidesStatic,
                guidesTarget: () => this.guidesTarget,
                ...dragger
            };
            this.setupGuides();
            this.opts = opts;
            this.editor = editor;
            this.em = editor.getModel();
            this.target = target;
            this.isTran = mode == 'translate';
            this.guidesContainer = this.getGuidesContainer();
            this.guidesTarget = this.getGuidesTarget();
            this.guidesStatic = this.getGuidesStatic();
            let drg = this.dragger;
            if (!drg) {
                drg = new Dragger(config);
                this.dragger = drg;
            } else {
                drg.setOptions(config);
            }
            event && drg.start(event);
            this.toggleDrag(1);
            this.em.trigger(`${ evName }:start`, this.getEventOpts());
            return drg;
        },
        getEventOpts() {
            return {
                mode: this.opts.mode,
                target: this.target,
                guidesTarget: this.guidesTarget,
                guidesStatic: this.guidesStatic
            };
        },
        stop() {
            this.toggleDrag();
        },
        setupGuides() {
            (this.guides || []).forEach(item => {
                const {guide} = item;
                guide && guide.parentNode.removeChild(guide);
            });
            this.guides = [];
        },
        getGuidesContainer() {
            let {guidesEl} = this;
            if (!guidesEl) {
                const {editor, em, opts} = this;
                const pfx = editor.getConfig('stylePrefix');
                const elInfoX = document.createElement('div');
                const elInfoY = document.createElement('div');
                const guideContent = `<div class="${ pfx }guide-info__line ${ pfx }danger-bg">
        <div class="${ pfx }guide-info__content ${ pfx }danger-color"></div>
      </div>`;
                guidesEl = document.createElement('div');
                guidesEl.className = `${ pfx }guides`;
                elInfoX.className = `${ pfx }guide-info ${ pfx }guide-info__x`;
                elInfoY.className = `${ pfx }guide-info ${ pfx }guide-info__y`;
                elInfoX.innerHTML = guideContent;
                elInfoY.innerHTML = guideContent;
                guidesEl.appendChild(elInfoX);
                guidesEl.appendChild(elInfoY);
                editor.Canvas.getGlobalToolsEl().appendChild(guidesEl);
                this.guidesEl = guidesEl;
                this.elGuideInfoX = elInfoX;
                this.elGuideInfoY = elInfoY;
                this.elGuideInfoContentX = elInfoX.querySelector(`.${ pfx }guide-info__content`);
                this.elGuideInfoContentY = elInfoY.querySelector(`.${ pfx }guide-info__content`);
                em.on('canvas:update frame:scroll', a.debounce(() => {
                    this.updateGuides();
                    opts.debug && this.guides.forEach(item => this.renderGuide(item));
                }, 200));
            }
            return guidesEl;
        },
        getGuidesStatic() {
            let result = [];
            const el = this.target.getEl();
            const {
                parentNode = {}
            } = el;
            a.each(parentNode.children, item => result = result.concat(el !== item ? this.getElementGuides(item) : []));
            return result.concat(this.getElementGuides(parentNode));
        },
        getGuidesTarget() {
            return this.getElementGuides(this.target.getEl());
        },
        updateGuides(guides) {
            let lastEl, lastPos;
            (guides || this.guides).forEach(item => {
                const {origin} = item;
                const pos = lastEl === origin ? lastPos : this.getElementPos(origin);
                lastEl = origin;
                lastPos = pos;
                a.each(this.getGuidePosUpdate(item, pos), (val, key) => item[key] = val);
                item.originRect = pos;
            });
        },
        getGuidePosUpdate(item, rect) {
            const result = {};
            const {top, height, left, width} = rect;
            switch (item.type) {
            case 't':
                result.y = top;
                break;
            case 'b':
                result.y = top + height;
                break;
            case 'l':
                result.x = left;
                break;
            case 'r':
                result.x = left + width;
                break;
            case 'x':
                result.x = left + width / 2;
                break;
            case 'y':
                result.y = top + height / 2;
                break;
            }
            return result;
        },
        renderGuide(item = {}) {
            const el = item.guide || document.createElement('div');
            const un = 'px';
            const guideSize = item.active ? 2 : 1;
            let numEl = el.children[0];
            el.style = `position: absolute; background-color: ${ item.active ? 'green' : 'red' };`;
            if (!el.children.length) {
                numEl = document.createElement('div');
                numEl.style = 'position: absolute; color: red; padding: 5px; top: 0; left: 0;';
                el.appendChild(numEl);
            }
            if (item.y) {
                el.style.width = '100%';
                el.style.height = `${ guideSize }${ un }`;
                el.style.top = `${ item.y }${ un }`;
                el.style.left = 0;
            } else {
                el.style.width = `${ guideSize }${ un }`;
                el.style.height = '100%';
                el.style.left = `${ item.x }${ un }`;
                el.style.top = `0${ un }`;
            }
            !item.guide && this.guidesContainer.appendChild(el);
            return el;
        },
        getElementPos(el) {
            return this.editor.Canvas.getElementPos(el, { noScroll: 1 });
        },
        getElementGuides(el) {
            const {opts} = this;
            const originRect = this.getElementPos(el);
            const {top, height, left, width} = originRect;
            const guides = [
                {
                    type: 't',
                    y: top
                },
                {
                    type: 'b',
                    y: top + height
                },
                {
                    type: 'l',
                    x: left
                },
                {
                    type: 'r',
                    x: left + width
                },
                {
                    type: 'x',
                    x: left + width / 2
                },
                {
                    type: 'y',
                    y: top + height / 2
                }
            ].map(item => ({
                ...item,
                origin: el,
                originRect,
                guide: opts.debug && this.renderGuide(item)
            }));
            guides.forEach(item => this.guides.push(item));
            return guides;
        },
        getTranslate(transform, axis = 'x') {
            let result = 0;
            (transform || '').split(' ').forEach(item => {
                const itemStr = item.trim();
                const fn = `translate${ axis.toUpperCase() }(`;
                if (itemStr.indexOf(fn) === 0)
                    result = parseFloat(itemStr.replace(fn, ''));
            });
            return result;
        },
        setTranslate(transform, axis, value) {
            const fn = `translate${ axis.toUpperCase() }(`;
            const val = `${ fn }${ value })`;
            let result = (transform || '').split(' ').map(item => {
                const itemStr = item.trim();
                if (itemStr.indexOf(fn) === 0)
                    item = val;
                return item;
            }).join(' ');
            if (result.indexOf(fn) < 0)
                result += ` ${ val }`;
            return result;
        },
        getPosition() {
            const {target, isTran} = this;
            const {left, top, transform} = target.getStyle();
            let x = 0;
            let y = 0;
            if (isTran) {
                x = this.getTranslate(transform);
                y = this.getTranslate(transform, 'y');
            } else {
                x = parseFloat(left);
                y = parseFloat(top);
            }
            return {
                x,
                y
            };
        },
        setPosition({x, y, end, position, width, height}) {
            const {target, isTran} = this;
            const unit = 'px';
            const en = !end ? 1 : '';
            const left = `${ x }${ unit }`;
            const top = `${ y }${ unit }`;
            if (isTran) {
                let transform = target.getStyle()['transform'] || '';
                transform = this.setTranslate(transform, 'x', left);
                transform = this.setTranslate(transform, 'y', top);
                return target.addStyle({
                    transform,
                    en
                }, { avoidStore: !end });
            }
            const adds = {
                position,
                width,
                height
            };
            const style = {
                left,
                top,
                en
            };
            a.keys(adds).forEach(add => {
                const prop = adds[add];
                if (prop)
                    style[add] = prop;
            });
            target.addStyle(style, { avoidStore: !end });
        },
        _getDragData() {
            const {target} = this;
            return {
                target,
                parent: target.parent(),
                index: target.index()
            };
        },
        onStart() {
            const {target, editor, isTran, opts} = this;
            const {center, onStart} = opts;
            const {Canvas} = editor;
            const style = target.getStyle();
            const position = 'absolute';
            onStart && onStart(this._getDragData());
            if (isTran)
                return;
            if (style.position !== position) {
                let {left, top, width, height} = Canvas.offset(target.getEl());
                if (center) {
                    const {x, y} = Canvas.getMouseRelativeCanvas(event);
                    left = x;
                    top = y;
                }
                this.setPosition({
                    x: left,
                    y: top,
                    width: `${ width }px`,
                    height: `${ height }px`,
                    position
                });
            }
        },
        onDrag(...args) {
            const {guidesTarget, opts} = this;
            const {onDrag} = opts;
            this.updateGuides(guidesTarget);
            opts.debug && guidesTarget.forEach(item => this.renderGuide(item));
            opts.guidesInfo && this.renderGuideInfo(guidesTarget.filter(item => item.active));
            onDrag && onDrag(this._getDragData());
        },
        onEnd(ev, dragger, opt = {}) {
            const {editor, opts, id} = this;
            const {onEnd} = opts;
            onEnd && onEnd(ev, opt, {
                event: ev,
                ...opt,
                ...this._getDragData()
            });
            editor.stopCommand(id);
            this.hideGuidesInfo();
            this.em.trigger(`${ evName }:end`, this.getEventOpts());
        },
        hideGuidesInfo() {
            [
                'X',
                'Y'
            ].forEach(item => {
                const guide = this[`elGuideInfo${ item }`];
                if (guide)
                    guide.style.display = 'none';
            });
        },
        renderGuideInfo(guides = []) {
            const {guidesStatic} = this;
            this.hideGuidesInfo();
            guides.forEach(item => {
                const {origin, x} = item;
                const rectOrigin = this.getElementPos(origin);
                const axis = a.isUndefined(x) ? 'y' : 'x';
                const isY = axis === 'y';
                const origEdge1 = rectOrigin[isY ? 'left' : 'top'];
                const origEdge1Raw = rectOrigin.rect[isY ? 'left' : 'top'];
                const origEdge2 = isY ? origEdge1 + rectOrigin.width : origEdge1 + rectOrigin.height;
                const origEdge2Raw = isY ? origEdge1Raw + rectOrigin.rect.width : origEdge1Raw + rectOrigin.rect.height;
                const elGuideInfo = this[`elGuideInfo${ axis.toUpperCase() }`];
                const elGuideInfoCnt = this[`elGuideInfoContent${ axis.toUpperCase() }`];
                const guideInfoStyle = elGuideInfo.style;
                const res = guidesStatic.filter(stat => stat.type === item.type).map(stat => {
                    const {left, width, top, height} = stat.originRect;
                    const statEdge1 = isY ? left : top;
                    const statEdge2 = isY ? left + width : top + height;
                    return {
                        gap: statEdge2 < origEdge1 ? origEdge1 - statEdge2 : statEdge1 - origEdge2,
                        guide: stat
                    };
                }).filter(item => item.gap > 0).sort((a, b) => a.gap - b.gap).map(item => item.guide)[0];
                if (res) {
                    const {left, width, top, height, rect} = res.originRect;
                    const isEdge1 = isY ? left < rectOrigin.left : top < rectOrigin.top;
                    const statEdge1 = isY ? left : top;
                    const statEdge1Raw = isY ? rect.left : rect.top;
                    const statEdge2 = isY ? left + width : top + height;
                    const statEdge2Raw = isY ? rect.left + rect.width : rect.top + rect.height;
                    const posFirst = isY ? item.y : item.x;
                    const posSecond = isEdge1 ? statEdge2 : origEdge2;
                    const pos2 = `${ posFirst }px`;
                    const size = isEdge1 ? origEdge1 - statEdge2 : statEdge1 - origEdge2;
                    const sizeRaw = isEdge1 ? origEdge1Raw - statEdge2Raw : statEdge1Raw - origEdge2Raw;
                    guideInfoStyle.display = '';
                    guideInfoStyle[isY ? 'top' : 'left'] = pos2;
                    guideInfoStyle[isY ? 'left' : 'top'] = `${ posSecond }px`;
                    guideInfoStyle[isY ? 'width' : 'height'] = `${ size }px`;
                    elGuideInfoCnt.innerHTML = `${ Math.round(sizeRaw) }px`;
                    this.em.trigger(`${ evName }:active`, {
                        ...this.getEventOpts(),
                        guide: item,
                        guidesStatic,
                        matched: res,
                        posFirst,
                        posSecond,
                        size,
                        sizeRaw,
                        elGuideInfo,
                        elGuideInfoCnt
                    });
                }
            });
        },
        toggleDrag(enable) {
            const {ppfx, editor} = this;
            const methodCls = enable ? 'add' : 'remove';
            const classes = [`${ ppfx }is__grabbing`];
            const {Canvas} = editor;
            const body = Canvas.getBody();
            classes.forEach(cls => body.classList[methodCls](cls));
            Canvas[enable ? 'startAutoscroll' : 'stopAutoscroll']();
        }
    };
});
define('skylark-grapejs/commands/view/ComponentEnter',[],function () {
    'use strict';
    return {
        run(ed) {
            if (!ed.Canvas.hasFocus())
                return;
            const toSelect = [];
            ed.getSelectedAll().forEach(component => {
                const coll = component.components();
                const next = coll && coll.at(0);
                next && toSelect.push(next);
            });
            toSelect.length && ed.select(toSelect);
        }
    };
});
define('skylark-grapejs/commands/view/ComponentExit',[],function () {
    'use strict';
    return {
        run(ed, snd, opts = {}) {
            if (!ed.Canvas.hasFocus() && !opts.force)
                return;
            const toSelect = [];
            ed.getSelectedAll().forEach(component => {
                let next = component.parent();
                while (next && !next.get('selectable')) {
                    next = next.parent();
                }
                next && toSelect.push(next);
            });
            toSelect.length && ed.select(toSelect);
        }
    };
});
define('skylark-grapejs/commands/view/ComponentNext',[],function () {
    'use strict';
    return {
        run(ed) {
            if (!ed.Canvas.hasFocus())
                return;
            const toSelect = [];
            ed.getSelectedAll().forEach(component => {
                const coll = component.collection;
                const at = coll.indexOf(component);
                const next = coll.at(at + 1);
                toSelect.push(next || component);
            });
            toSelect.length && ed.select(toSelect);
        }
    };
});
define('skylark-grapejs/commands/view/ComponentPrev',[],function () {
    'use strict';
    return {
        run(ed) {
            if (!ed.Canvas.hasFocus())
                return;
            const toSelect = [];
            ed.getSelectedAll().forEach(component => {
                const coll = component.collection;
                const at = coll.indexOf(component);
                const next = coll.at(at - 1);
                toSelect.push(next && at - 1 >= 0 ? next : component);
            });
            toSelect.length && ed.select(toSelect);
        }
    };
});
define('skylark-grapejs/commands/view/ComponentStyleClear',['skylark-underscore'], function (a) {
    'use strict';
    return {
        run(ed, sender, opts = {}) {
            const {target} = opts;
            const dc = ed.DomComponents;
            const type = target.get('type');
            const len = dc.getWrapper().find(`[data-gjs-type="${ type }"]`).length;
            const toRemove = [];
            if (!len) {
                const rules = ed.CssComposer.getAll();
                let toClear = target.get('style-signature');
                toClear = a.isArray(toClear) ? toClear : [toClear];
                rules.forEach(rule => {
                    const selector = rule.selectorsToString();
                    toClear.forEach(part => {
                        part && selector.indexOf(part) >= 0 && toRemove.push(rule);
                    });
                });
                rules.remove(toRemove);
            }
            return toRemove;
        }
    };
});
define('skylark-grapejs/commands/view/CopyComponent',[],function () {
    'use strict';
    return {
        run(ed) {
            const em = ed.getModel();
            const models = [...ed.getSelectedAll()];
            if (models.length) {
                em.set('clipboard', models);
            }
        }
    };
});
define('skylark-grapejs/dom_components/view/ToolbarButtonView',['skylark-backbone'], function (Backbone) {
    'use strict';
    return Backbone.View.extend({
        events() {
            return this.model.get('events') || { mousedown: 'handleClick' };
        },
        attributes() {
            return this.model.get('attributes');
        },
        initialize(opts = {}) {
            const {
                config = {}
            } = opts;
            this.em = config.em;
            this.editor = config.editor;
        },
        handleClick(event) {
            event.preventDefault();
            event.stopPropagation();
            const {editor, em} = this;
            const {left, top} = editor.Canvas.getFrameEl().getBoundingClientRect();
            const calibrated = {
                ...event,
                clientX: event.clientX - left,
                clientY: event.clientY - top
            };
            em.trigger('toolbar:run:before');
            this.execCommand(calibrated);
        },
        execCommand(event) {
            const opts = { event };
            const command = this.model.get('command');
            const editor = this.editor;
            if (typeof command === 'function') {
                command(editor, null, opts);
            }
            if (typeof command === 'string') {
                editor.runCommand(command, opts);
            }
        },
        render() {
            const {editor, $el, model} = this;
            const id = model.get('id');
            const label = model.get('label');
            const pfx = editor.getConfig('stylePrefix');
            $el.addClass(`${ pfx }toolbar-item`);
            id && $el.addClass(`${ pfx }toolbar-item__${ id }`);
            label && $el.append(label);
            return this;
        }
    });
});
define('skylark-grapejs/dom_components/view/ToolbarView',[
    '../../domain_abstract/view/DomainViews',
    './ToolbarButtonView'
], function (DomainViews, ToolbarButtonView) {
    'use strict';
    return DomainViews.extend({
        itemView: ToolbarButtonView,
        initialize(opts = {}) {
            this.config = {
                editor: opts.editor || '',
                em: opts.em
            };
            this.listenTo(this.collection, 'reset', this.render);
        }
    });
});
define('skylark-grapejs/dom_components/model/ToolbarButton',['skylark-backbone'], function (Backbone) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            command: '',
            attributes: {}
        }
    });
});
define('skylark-grapejs/dom_components/model/Toolbar',[
    'skylark-backbone',
    './ToolbarButton'
], function (Backbone, ToolbarButton) {
    'use strict';
    return Backbone.Collection.extend({ model: ToolbarButton });
});
define('skylark-grapejs/commands/view/SelectComponent',[
    'skylark-backbone',
    'skylark-underscore',
    '../../utils/mixins',
    '../../dom_components/view/ToolbarView',
    '../../dom_components/model/Toolbar'
], function (Backbone, a, mixins, ToolbarView, Toolbar) {
    'use strict';
    const $ = Backbone.$;
    let showOffsets;
    return {
        init(o) {
            a.bindAll(this, 'onHover', 'onOut', 'onClick', 'onFrameScroll', 'onFrameUpdated');
        },
        enable() {
            this.frameOff = this.canvasOff = this.adjScroll = null;
            this.startSelectComponent();
            showOffsets = 1;
        },
        startSelectComponent() {
            this.toggleSelectComponent(1);
            this.em.getSelected() && this.onSelect();
        },
        stopSelectComponent() {
            this.toggleSelectComponent();
        },
        toggleSelectComponent(enable) {
            const {em} = this;
            const method = enable ? 'on' : 'off';

            const trigger = (win, body) => {
                mixins[method](body, 'mouseover', this.onHover);
                mixins[method](body, 'mouseleave', this.onOut);
                mixins[method](body, 'click touchend', this.onClick);
                mixins[method](win, 'scroll', this.onFrameScroll);
            };
            mixins[method](window, 'resize', this.onFrameUpdated);
            em[method]('component:toggled', this.onSelect, this);
            em[method]('change:componentHovered', this.onHovered, this);
            em[method]('component:resize component:styleUpdate', this.updateGlobalPos, this);
            em[method]('change:canvasOffset', this.updateAttached, this);
            em[method]('frame:updated', this.onFrameUpdated, this);
            em.get('Canvas').getFrames().forEach(frame => {
                const {view} = frame;
                trigger(view.getWindow(), view.getBody());
            });
        },
        onHover(e) {
            e.stopPropagation();
            const trg = e.target;
            const view = mixins.getViewEl(trg);
            const frameView = view && view._getFrame();
            const $el = $(trg);
            let model = $el.data('model');
            if (!model) {
                let parent = $el.parent();
                while (!model && parent.length > 0) {
                    model = parent.data('model');
                    parent = parent.parent();
                }
            }
            if (model && !model.get('hoverable')) {
                let parent = model && model.parent();
                while (parent && !parent.get('hoverable'))
                    parent = parent.parent();
                model = parent;
            }
            this.currentDoc = trg.ownerDocument;
            this.em.setHovered(model);
            frameView && this.em.set('currentFrame', frameView);
        },
        onFrameUpdated() {
            this.updateLocalPos();
            this.updateGlobalPos();
        },
        onHovered(em, component) {
            let result = {};
            if (component) {
                component.views.forEach(view => {
                    const el = view.el;
                    const pos = this.getElementPos(el);
                    result = {
                        el,
                        pos,
                        component,
                        view: mixins.getViewEl(el)
                    };
                    this.updateToolsLocal(result);
                    if (el.ownerDocument === this.currentDoc)
                        this.elHovered = result;
                });
            }
        },
        onSelect: a.debounce(function () {
            const {em} = this;
            const component = em.getSelected();
            const currentFrame = em.get('currentFrame') || {};
            const view = component && component.getView(currentFrame.model);
            let el = view && view.el;
            let result = {};
            if (el) {
                const pos = this.getElementPos(el);
                result = {
                    el,
                    pos,
                    component,
                    view: mixins.getViewEl(el)
                };
            }
            this.elSelected = result;
            this.updateToolsGlobal();
            this.updateToolsLocal(result);
        }),
        updateGlobalPos() {
            const sel = this.getElSelected();
            if (!sel.el)
                return;
            sel.pos = this.getElementPos(sel.el);
            this.updateToolsGlobal();
        },
        updateLocalPos() {
            const sel = this.getElHovered();
            if (!sel.el)
                return;
            sel.pos = this.getElementPos(sel.el);
            this.updateToolsLocal();
        },
        getElHovered() {
            return this.elHovered || {};
        },
        getElSelected() {
            return this.elSelected || {};
        },
        onOut() {
            this.currentDoc = null;
            this.em.setHovered(0);
            this.canvas.getFrames().forEach(frame => {
                const el = frame.view.getToolsEl();
                this.toggleToolsEl(0, 0, { el });
            });
        },
        toggleToolsEl(on, view, opts = {}) {
            const el = opts.el || this.canvas.getToolsEl(view);
            el.style.opacity = on ? 1 : 0;
            return el;
        },
        showElementOffset(el, pos, opts = {}) {
            if (!showOffsets)
                return;
            this.editor.runCommand('show-offset', {
                el,
                elPos: pos,
                view: opts.view,
                force: 1,
                top: 0,
                left: 0
            });
        },
        hideElementOffset(view) {
            this.editor.stopCommand('show-offset', { view });
        },
        showFixedElementOffset(el, pos) {
            this.editor.runCommand('show-offset', {
                el,
                elPos: pos,
                state: 'Fixed'
            });
        },
        hideFixedElementOffset(el, pos) {
            if (this.editor)
                this.editor.stopCommand('show-offset', { state: 'Fixed' });
        },
        hideHighlighter(view) {
            this.canvas.getHighlighter(view).style.opacity = 0;
        },
        onClick(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            const {em} = this;
            if (em.get('_cmpDrag'))
                return em.set('_cmpDrag');
            const $el = $(ev.target);
            let model = $el.data('model');
            if (!model) {
                let parent = $el.parent();
                while (!model && parent.length > 0) {
                    model = parent.data('model');
                    parent = parent.parent();
                }
            }
            if (model) {
                if (model.get('selectable')) {
                    this.select(model, ev);
                } else {
                    let parent = model.parent();
                    while (parent && !parent.get('selectable'))
                        parent = parent.parent();
                    this.select(parent, ev);
                }
            }
        },
        select(model, event = {}) {
            if (!model)
                return;
            const ctrlKey = event.ctrlKey || event.metaKey;
            const {shiftKey} = event;
            const {editor, em} = this;
            const multiple = editor.getConfig('multipleSelection');
            if (ctrlKey && multiple) {
                editor.selectToggle(model);
            } else if (shiftKey && multiple) {
                em.clearSelection(editor.Canvas.getWindow());
                const coll = model.collection;
                const index = coll.indexOf(model);
                const selAll = editor.getSelectedAll();
                let min, max;
                editor.getSelectedAll().forEach(sel => {
                    const selColl = sel.collection;
                    const selIndex = selColl.indexOf(sel);
                    if (selColl === coll) {
                        if (selIndex < index) {
                            min = a.isUndefined(min) ? selIndex : Math.max(min, selIndex);
                        } else if (selIndex > index) {
                            max = a.isUndefined(max) ? selIndex : Math.min(max, selIndex);
                        }
                    }
                });
                if (!a.isUndefined(min)) {
                    while (min !== index) {
                        editor.selectAdd(coll.at(min));
                        min++;
                    }
                }
                if (!a.isUndefined(max)) {
                    while (max !== index) {
                        editor.selectAdd(coll.at(max));
                        max--;
                    }
                }
                editor.selectAdd(model);
            } else {
                editor.select(model, { scroll: {} });
            }
            this.initResize(model);
        },
        updateBadge(el, pos, opts = {}) {
            const model = $(el).data('model');
            if (!model || !model.get('badgable'))
                return;
            const badge = this.getBadge(opts);
            if (!opts.posOnly) {
                const config = this.canvas.getConfig();
                const icon = model.getIcon();
                const ppfx = config.pStylePrefix || '';
                const clsBadge = `${ ppfx }badge`;
                const customeLabel = config.customBadgeLabel;
                const badgeLabel = `${ icon ? `<div class="${ clsBadge }__icon">${ icon }</div>` : '' }
        <div class="${ clsBadge }__name">${ model.getName() }</div>`;
                badge.innerHTML = customeLabel ? customeLabel(model) : badgeLabel;
            }
            const un = 'px';
            const bStyle = badge.style;
            bStyle.display = 'block';
            const badgeH = badge ? badge.offsetHeight : 0;
            const posTop = 0 - badgeH;
            const top = opts.topOff - badgeH < 0 ? -opts.topOff : posTop;
            const left = opts.leftOff < 0 ? -opts.leftOff : 0;
            bStyle.top = top + un;
            bStyle.left = left + un;
        },
        showHighlighter(view) {
            this.canvas.getHighlighter(view).style.opacity = '';
        },
        initResize(elem) {
            const {em, canvas} = this;
            const editor = em ? em.get('Editor') : '';
            const config = em ? em.get('Config') : '';
            const pfx = config.stylePrefix || '';
            const resizeClass = `${ pfx }resizing`;
            const model = !a.isElement(elem) && mixins.isTaggableNode(elem) ? elem : em.getSelected();
            const resizable = model.get('resizable');
            const el = a.isElement(elem) ? elem : model.getEl();
            let options = {};
            let modelToStyle;
            var toggleBodyClass = (method, e, opts) => {
                const docs = opts.docs;
                docs && docs.forEach(doc => {
                    const body = doc.body;
                    const cls = body.className || '';
                    body.className = (method == 'add' ? `${ cls } ${ resizeClass }` : cls.replace(resizeClass, '')).trim();
                });
            };
            if (editor && resizable) {
                options = {
                    onStart(e, opts = {}) {
                        const {el, config, resizer} = opts;
                        const {keyHeight, keyWidth, currentUnit, keepAutoHeight, keepAutoWidth} = config;
                        toggleBodyClass('add', e, opts);
                        modelToStyle = em.get('StyleManager').getModelToStyle(model);
                        canvas.toggleFramesEvents();
                        const computedStyle = getComputedStyle(el);
                        const modelStyle = modelToStyle.getStyle();
                        let currentWidth = modelStyle[keyWidth];
                        config.autoWidth = keepAutoWidth && currentWidth === 'auto';
                        if (isNaN(parseFloat(currentWidth))) {
                            currentWidth = computedStyle[keyWidth];
                        }
                        let currentHeight = modelStyle[keyHeight];
                        config.autoHeight = keepAutoHeight && currentHeight === 'auto';
                        if (isNaN(parseFloat(currentHeight))) {
                            currentHeight = computedStyle[keyHeight];
                        }
                        resizer.startDim.w = parseFloat(currentWidth);
                        resizer.startDim.h = parseFloat(currentHeight);
                        showOffsets = 0;
                        if (currentUnit) {
                            config.unitHeight = mixins.getUnitFromValue(currentHeight);
                            config.unitWidth = mixins.getUnitFromValue(currentWidth);
                        }
                    },
                    onMove() {
                        editor.trigger('component:resize');
                    },
                    onEnd(e, opts) {
                        toggleBodyClass('remove', e, opts);
                        editor.trigger('component:resize');
                        canvas.toggleFramesEvents(1);
                        showOffsets = 1;
                    },
                    updateTarget(el, rect, options = {}) {
                        if (!modelToStyle) {
                            return;
                        }
                        const {store, selectedHandler, config} = options;
                        const {keyHeight, keyWidth, autoHeight, autoWidth, unitWidth, unitHeight} = config;
                        const onlyHeight = [
                            'tc',
                            'bc'
                        ].indexOf(selectedHandler) >= 0;
                        const onlyWidth = [
                            'cl',
                            'cr'
                        ].indexOf(selectedHandler) >= 0;
                        const style = {};
                        const en = !store ? 1 : '';
                        if (!onlyHeight) {
                            const bodyw = canvas.getBody().offsetWidth;
                            const width = rect.w < bodyw ? rect.w : bodyw;
                            style[keyWidth] = autoWidth ? 'auto' : `${ width }${ unitWidth }`;
                        }
                        if (!onlyWidth) {
                            style[keyHeight] = autoHeight ? 'auto' : `${ rect.h }${ unitHeight }`;
                        }
                        modelToStyle.addStyle({
                            ...style,
                            en
                        }, { avoidStore: !store });
                        const updateEvent = `update:component:style`;
                        const eventToListen = `${ updateEvent }:${ keyHeight } ${ updateEvent }:${ keyWidth }`;
                        em && em.trigger(eventToListen, null, null, { noEmit: 1 });
                    }
                };
                if (typeof resizable == 'object') {
                    options = {
                        ...options,
                        ...resizable
                    };
                }
                this.resizer = editor.runCommand('resize', {
                    el,
                    options,
                    force: 1
                });
            } else {
                editor.stopCommand('resize');
                this.resizer = null;
            }
        },
        updateToolbar(mod) {
            var em = this.config.em;
            var model = mod == em ? em.getSelected() : mod;
            var toolbarEl = this.canvas.getToolbarEl();
            var toolbarStyle = toolbarEl.style;
            if (!model) {
                toolbarStyle.opacity = 0;
                return;
            }
            var toolbar = model.get('toolbar');
            var showToolbar = em.get('Config').showToolbar;
            if (showToolbar && toolbar && toolbar.length) {
                toolbarStyle.opacity = '';
                toolbarStyle.display = '';
                if (!this.toolbar) {
                    toolbarEl.innerHTML = '';
                    this.toolbar = new Toolbar(toolbar);
                    var toolbarView = new ToolbarView({
                        collection: this.toolbar,
                        editor: this.editor,
                        em
                    });
                    toolbarEl.appendChild(toolbarView.render().el);
                }
                this.toolbar.reset(toolbar);
                toolbarStyle.top = '-100px';
                toolbarStyle.left = 0;
            } else {
                toolbarStyle.display = 'none';
            }
        },
        updateToolbarPos(pos) {
            const unit = 'px';
            const {style} = this.canvas.getToolbarEl();
            style.top = `${ pos.top }${ unit }`;
            style.left = `${ pos.left }${ unit }`;
            style.opacity = '';
        },
        getCanvasPosition() {
            return this.canvas.getCanvasView().getPosition();
        },
        getBadge(opts = {}) {
            return this.canvas.getBadgeEl(opts.view);
        },
        onFrameScroll() {
            this.updateTools();
        },
        updateTools() {
            this.updateToolsLocal();
            this.updateGlobalPos();
        },
        isCompSelected(comp) {
            return comp && comp.get('status') === 'selected';
        },
        updateToolsLocal(data) {
            const {el, pos, view, component} = data || this.getElHovered();
            if (!el) {
                this.lastHovered = 0;
                return;
            }
            const isHoverEn = component.get('hoverable');
            const isNewEl = this.lastHovered !== el;
            const badgeOpts = isNewEl ? {} : { posOnly: 1 };
            if (isNewEl && isHoverEn) {
                this.lastHovered = el;
                this.showHighlighter(view);
                this.showElementOffset(el, pos, { view });
            }
            if (this.isCompSelected(component)) {
                this.hideHighlighter(view);
                this.hideElementOffset(view);
            }
            const unit = 'px';
            const {style} = this.toggleToolsEl(1, view);
            const frameOff = this.canvas.canvasRectOffset(el, pos);
            const topOff = frameOff.top;
            const leftOff = frameOff.left;
            this.updateBadge(el, pos, {
                ...badgeOpts,
                view,
                topOff,
                leftOff
            });
            style.top = topOff + unit;
            style.left = leftOff + unit;
            style.width = pos.width + unit;
            style.height = pos.height + unit;
        },
        updateToolsGlobal() {
            const {el, pos, component} = this.getElSelected();
            if (!el) {
                this.toggleToolsEl();
                this.lastSelected = 0;
                return;
            }
            const {canvas} = this;
            const isNewEl = this.lastSelected !== el;
            if (isNewEl) {
                this.lastSelected = el;
                this.updateToolbar(component);
            }
            const unit = 'px';
            const {style} = this.toggleToolsEl(1);
            const targetToElem = canvas.getTargetToElementFixed(el, canvas.getToolbarEl(), { pos });
            const topOff = targetToElem.canvasOffsetTop;
            const leftOff = targetToElem.canvasOffsetLeft;
            style.top = topOff + unit;
            style.left = leftOff + unit;
            style.width = pos.width + unit;
            style.height = pos.height + unit;
            this.updateToolbarPos({
                top: targetToElem.top,
                left: targetToElem.left
            });
        },
        updateAttached: a.debounce(function () {
            this.updateToolsGlobal();
        }),
        getElementPos(el) {
            return this.canvas.getCanvasView().getElementPos(el);
        },
        hideBadge() {
            this.getBadge().style.display = 'none';
        },
        cleanPrevious(model) {
            model && model.set({
                status: '',
                state: ''
            });
        },
        getContentWindow() {
            return this.canvas.getWindow();
        },
        run(editor) {
            this.editor = editor && editor.get('Editor');
            this.enable();
        },
        stop(ed, sender, opts = {}) {
            const {em, editor} = this;
            this.stopSelectComponent();
            !opts.preserveSelected && em.setSelected(null);
            this.onOut();
            this.toggleToolsEl();
            editor && editor.stopCommand('resize');
        }
    };
});
define('skylark-grapejs/commands/view/DeleteComponent',[
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
define('skylark-grapejs/commands/view/ExportTemplate',['skylark-backbone'], function (Backbone) {
    'use strict';
    const $ = Backbone.$;
    return {
        run(editor, sender, opts = {}) {
            sender && sender.set && sender.set('active', 0);
            const config = editor.getConfig();
            const modal = editor.Modal;
            const pfx = config.stylePrefix;
            this.cm = editor.CodeManager || null;
            if (!this.$editors) {
                const oHtmlEd = this.buildEditor('htmlmixed', 'hopscotch', 'HTML');
                const oCsslEd = this.buildEditor('css', 'hopscotch', 'CSS');
                this.htmlEditor = oHtmlEd.el;
                this.cssEditor = oCsslEd.el;
                const $editors = $(`<div class="${ pfx }export-dl"></div>`);
                $editors.append(oHtmlEd.$el).append(oCsslEd.$el);
                this.$editors = $editors;
            }
            modal.open({
                title: config.textViewCode,
                content: this.$editors
            }).getModel().once('change:open', () => editor.stopCommand(this.id));
            this.htmlEditor.setContent(editor.getHtml());
            this.cssEditor.setContent(editor.getCss());
        },
        stop(editor) {
            const modal = editor.Modal;
            modal && modal.close();
        },
        buildEditor(codeName, theme, label) {
            const input = document.createElement('textarea');
            !this.codeMirror && (this.codeMirror = this.cm.getViewer('CodeMirror'));
            const el = this.codeMirror.clone().set({
                label,
                codeName,
                theme,
                input
            });
            const $el = new this.cm.EditorView({
                model: el,
                config: this.cm.getConfig()
            }).render().$el;
            el.init(input);
            return {
                el,
                $el
            };
        }
    };
});
define('skylark-grapejs/commands/view/Fullscreen',['skylark-underscore'], function (a) {
    'use strict';
    return {
        isEnabled() {
            var d = document;
            if (d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement)
                return 1;
            else
                return 0;
        },
        enable(el) {
            var pfx = '';
            if (el.requestFullscreen)
                el.requestFullscreen();
            else if (el.webkitRequestFullscreen) {
                pfx = 'webkit';
                el.webkitRequestFullscreen();
            } else if (el.mozRequestFullScreen) {
                pfx = 'moz';
                el.mozRequestFullScreen();
            } else if (el.msRequestFullscreen)
                el.msRequestFullscreen();
            else
                console.warn('Fullscreen not supported');
            return pfx;
        },
        disable() {
            const d = document;
            if (this.isEnabled()) {
                if (d.exitFullscreen)
                    d.exitFullscreen();
                else if (d.webkitExitFullscreen)
                    d.webkitExitFullscreen();
                else if (d.mozCancelFullScreen)
                    d.mozCancelFullScreen();
                else if (d.msExitFullscreen)
                    d.msExitFullscreen();
            }
        },
        fsChanged(pfx, e) {
            var d = document;
            var ev = (pfx || '') + 'fullscreenchange';
            if (!this.isEnabled()) {
                this.stop(null, this.sender);
                document.removeEventListener(ev, this.fsChanged);
            }
        },
        run(editor, sender, opts = {}) {
            this.sender = sender;
            const {target} = opts;
            const targetEl = a.isElement(target) ? target : document.querySelector(target);
            const pfx = this.enable(targetEl || editor.getContainer());
            this.fsChanged = this.fsChanged.bind(this, pfx);
            document.addEventListener(pfx + 'fullscreenchange', this.fsChanged);
            editor.trigger('change:canvasOffset');
        },
        stop(editor, sender) {
            if (sender && sender.set)
                sender.set('active', false);
            this.disable();
            if (editor)
                editor.trigger('change:canvasOffset');
        }
    };
});
define('skylark-grapejs/commands/view/SelectPosition',['skylark-backbone'], function (Backbone) {
    'use strict';
    const $ = Backbone.$;
    return {
        startSelectPosition(trg, doc, opts = {}) {
            this.isPointed = false;
            var utils = this.editorModel.get('Utils');
            const container = trg.ownerDocument.body;
            if (utils && !this.sorter)
                this.sorter = new utils.Sorter({
                    container,
                    placer: this.canvas.getPlacerEl(),
                    containerSel: '*',
                    itemSel: '*',
                    pfx: this.ppfx,
                    direction: 'a',
                    document: doc,
                    wmargin: 1,
                    nested: 1,
                    em: this.editorModel,
                    canvasRelative: 1,
                    scale: () => this.em.getZoomDecimal()
                });
            if (opts.onStart)
                this.sorter.onStart = opts.onStart;
            trg && this.sorter.startSort(trg, { container });
        },
        getOffsetDim() {
            var frameOff = this.offset(this.canvas.getFrameEl());
            var canvasOff = this.offset(this.canvas.getElement());
            var top = frameOff.top - canvasOff.top;
            var left = frameOff.left - canvasOff.left;
            return {
                top,
                left
            };
        },
        stopSelectPosition() {
            this.posTargetCollection = null;
            this.posIndex = this.posMethod == 'after' && this.cDim.length !== 0 ? this.posIndex + 1 : this.posIndex;
            if (this.sorter) {
                this.sorter.moved = 0;
                this.sorter.endMove();
            }
            if (this.cDim) {
                this.posIsLastEl = this.cDim.length !== 0 && this.posMethod == 'after' && this.posIndex == this.cDim.length;
                this.posTargetEl = this.cDim.length === 0 ? $(this.outsideElem) : !this.posIsLastEl && this.cDim[this.posIndex] ? $(this.cDim[this.posIndex][5]).parent() : $(this.outsideElem);
                this.posTargetModel = this.posTargetEl.data('model');
                this.posTargetCollection = this.posTargetEl.data('model-comp');
            }
        },
        enable() {
            this.startSelectPosition();
        },
        nearFloat(index, method, dims) {
            var i = index || 0;
            var m = method || 'before';
            var len = dims.length;
            var isLast = len !== 0 && m == 'after' && i == len;
            if (len !== 0 && (!isLast && !dims[i][4] || dims[i - 1] && !dims[i - 1][4] || isLast && !dims[i - 1][4]))
                return 1;
            return 0;
        },
        run() {
            this.enable();
        },
        stop() {
            this.stopSelectPosition();
            this.$wrapper.css('cursor', '');
            this.$wrapper.unbind();
        }
    };
});
define('skylark-grapejs/commands/view/MoveComponent',[
    'skylark-underscore',
    'skylark-backbone',
    '../../utils/mixins',
    './SelectComponent',
    './SelectPosition'
], function (a, Backbone, b, SelectComponent, SelectPosition) {
    'use strict';
    const $ = Backbone.$;
    return a.extend({}, SelectPosition, SelectComponent, {
        init(o) {
            SelectComponent.init.apply(this, arguments);
            a.bindAll(this, 'initSorter', 'rollback', 'onEndMove');
            this.opt = o;
            this.hoverClass = this.ppfx + 'highlighter-warning';
            this.badgeClass = this.ppfx + 'badge-warning';
            this.noSelClass = this.ppfx + 'no-select';
        },
        enable(...args) {
            SelectComponent.enable.apply(this, args);
            this.getBadgeEl().addClass(this.badgeClass);
            this.getHighlighterEl().addClass(this.hoverClass);
            var wp = this.$wrapper;
            wp.css('cursor', 'move');
            wp.on('mousedown', this.initSorter);
            wp.addClass(this.noSelClass);
        },
        toggleClipboard() {
        },
        initSorter(e) {
            var el = $(e.target).data('model');
            var drag = el.get('draggable');
            if (!drag)
                return;
            this.cacheEl = null;
            this.startSelectPosition(e.target, this.frameEl.contentDocument);
            this.sorter.draggable = drag;
            this.sorter.onEndMove = this.onEndMove.bind(this);
            this.stopSelectComponent();
            this.$wrapper.on('mousedown', this.initSorter);
            b.on(this.getContentWindow(), 'keydown', this.rollback);
        },
        initSorterFromModel(model) {
            var drag = model.get('draggable');
            if (!drag)
                return;
            this.cacheEl = null;
            var el = model.view.el;
            this.startSelectPosition(el, this.frameEl.contentDocument);
            this.sorter.draggable = drag;
            this.sorter.onEndMove = this.onEndMoveFromModel.bind(this);
            this.stopSelectComponent();
            b.on(this.getContentWindow(), 'keydown', this.rollback);
        },
        initSorterFromModels(models) {
            this.cacheEl = null;
            const lastModel = models[models.length - 1];
            const frame = (this.em.get('currentFrame') || {}).model;
            const el = lastModel.getEl(frame);
            const doc = el.ownerDocument;
            this.startSelectPosition(el, doc, { onStart: this.onStart });
            this.sorter.draggable = lastModel.get('draggable');
            this.sorter.toMove = models;
            this.sorter.onMoveClb = this.onDrag;
            this.sorter.onEndMove = this.onEndMoveFromModel.bind(this);
            this.stopSelectComponent();
            b.on(this.getContentWindow(), 'keydown', this.rollback);
        },
        onEndMoveFromModel() {
            b.off(this.getContentWindow(), 'keydown', this.rollback);
        },
        onEndMove() {
            this.enable();
            b.off(this.getContentWindow(), 'keydown', this.rollback);
        },
        onSelect(e, el) {
        },
        rollback(e, force) {
            var key = e.which || e.keyCode;
            if (key == 27 || force) {
                this.sorter.moved = false;
                this.sorter.endMove();
            }
            return;
        },
        getBadgeEl() {
            if (!this.$badge)
                this.$badge = $(this.getBadge());
            return this.$badge;
        },
        getHighlighterEl() {
            if (!this.$hl)
                this.$hl = $(this.canvas.getHighlighter());
            return this.$hl;
        },
        stop(...args) {
            SelectComponent.stop.apply(this, args);
            this.getBadgeEl().removeClass(this.badgeClass);
            this.getHighlighterEl().removeClass(this.hoverClass);
            var wp = this.$wrapper;
            wp.css('cursor', '').unbind().removeClass(this.noSelClass);
        }
    });
});
define('skylark-grapejs/commands/view/OpenLayers',[
    'skylark-backbone',
    '../../navigator/index'
], function (Backbone, Layers) {
    'use strict';
    const $ = Backbone.$;
    return {
        run(editor) {
            const lm = editor.LayerManager;
            const pn = editor.Panels;
            if (!this.layers) {
                const id = 'views-container';
                const layers = document.createElement('div');
                const panels = pn.getPanel(id) || pn.addPanel({ id });
                layers.appendChild(lm.render());
                panels.set('appendContent', layers).trigger('change:appendContent');
                this.layers = layers;
            }
            this.layers.style.display = 'block';
        },
        stop() {
            const layers = this.layers;
            layers && (layers.style.display = 'none');
        }
    };
});
define('skylark-grapejs/commands/view/OpenStyleManager',[
    'skylark-backbone',
    '../../style_manager/index'
], function (Backbone, StyleManager) {
    'use strict';
    const $ = Backbone.$;
    return {
        run(em, sender) {
            this.sender = sender;
            if (!this.$cn) {
                var config = em.getConfig(), panels = em.Panels;
                this.$cn = $('<div></div>');
                this.$cn2 = $('<div></div>');
                this.$cn.append(this.$cn2);
                var dvm = em.DeviceManager;
                if (dvm && config.showDevices) {
                    var devicePanel = panels.addPanel({ id: 'devices-c' });
                    devicePanel.set('appendContent', dvm.render()).trigger('change:appendContent');
                }
                var clm = em.SelectorManager;
                if (clm)
                    this.$cn2.append(clm.render([]));
                this.$cn2.append(em.StyleManager.render());
                var smConfig = em.StyleManager.getConfig();
                const pfx = smConfig.stylePrefix;
                this.$header = $(`<div class="${ pfx }header">${ em.t('styleManager.empty') }</div>`);
                this.$cn.append(this.$header);
                if (!panels.getPanel('views-container'))
                    this.panel = panels.addPanel({ id: 'views-container' });
                else
                    this.panel = panels.getPanel('views-container');
                this.panel.set('appendContent', this.$cn).trigger('change:appendContent');
                this.target = em.editor;
                this.listenTo(this.target, 'component:toggled', this.toggleSm);
            }
            this.toggleSm();
        },
        toggleSm() {
            const {target, sender} = this;
            if (sender && sender.get && !sender.get('active'))
                return;
            const {componentFirst} = target.get('SelectorManager').getConfig();
            const selectedAll = target.getSelectedAll().length;
            if (selectedAll === 1 || selectedAll > 1 && componentFirst) {
                this.$cn2.show();
                this.$header.hide();
            } else {
                this.$cn2.hide();
                this.$header.show();
            }
        },
        stop() {
            if (this.$cn2)
                this.$cn2.hide();
            if (this.$header)
                this.$header.hide();
        }
    };
});
define('skylark-grapejs/commands/view/OpenTraitManager',['skylark-backbone'], function (Backbone) {
    'use strict';
    const $ = Backbone.$;
    return {
        run(editor, sender) {
            this.sender = sender;
            const em = editor.getModel();
            var config = editor.Config;
            var pfx = config.stylePrefix;
            var tm = editor.TraitManager;
            var panelC;
            if (!this.$cn) {
                var tmView = tm.getTraitsViewer();
                var confTm = tm.getConfig();
                this.$cn = $('<div></div>');
                this.$cn2 = $('<div></div>');
                this.$cn.append(this.$cn2);
                this.$header = $('<div>').append(`<div class="${ confTm.stylePrefix }header">${ em.t('traitManager.empty') }</div>`);
                this.$cn.append(this.$header);
                this.$cn2.append(`<div class="${ pfx }traits-label">${ em.t('traitManager.label') }</div>`);
                this.$cn2.append(tmView.render().el);
                var panels = editor.Panels;
                if (!panels.getPanel('views-container'))
                    panelC = panels.addPanel({ id: 'views-container' });
                else
                    panelC = panels.getPanel('views-container');
                panelC.set('appendContent', this.$cn.get(0)).trigger('change:appendContent');
                this.target = editor.getModel();
                this.listenTo(this.target, 'component:toggled', this.toggleTm);
            }
            this.toggleTm();
        },
        toggleTm() {
            const sender = this.sender;
            if (sender && sender.get && !sender.get('active'))
                return;
            if (this.target.getSelectedAll().length === 1) {
                this.$cn2.show();
                this.$header.hide();
            } else {
                this.$cn2.hide();
                this.$header.show();
            }
        },
        stop() {
            this.$cn2 && this.$cn2.hide();
            this.$header && this.$header.hide();
        }
    };
});
define('skylark-grapejs/commands/view/OpenBlocks',[],function () {
    'use strict';
    return {
        run(editor, sender) {
            const bm = editor.BlockManager;
            const pn = editor.Panels;
            if (!this.blocks) {
                bm.render();
                const id = 'views-container';
                const blocks = document.createElement('div');
                const panels = pn.getPanel(id) || pn.addPanel({ id });
                blocks.appendChild(bm.getContainer());
                panels.set('appendContent', blocks).trigger('change:appendContent');
                this.blocks = blocks;
            }
            this.blocks.style.display = 'block';
        },
        stop() {
            const blocks = this.blocks;
            blocks && (blocks.style.display = 'none');
        }
    };
});
define('skylark-grapejs/commands/view/OpenAssets',[],function () {
    'use strict';
    return {
        run(editor, sender, opts = {}) {
            const modal = editor.Modal;
            const am = editor.AssetManager;
            const config = am.getConfig();
            const amContainer = am.getContainer();
            const title = opts.modalTitle || editor.t('assetManager.modalTitle') || '';
            const types = opts.types;
            const accept = opts.accept;
            am.setTarget(opts.target);
            am.onClick(opts.onClick);
            am.onDblClick(opts.onDblClick);
            am.onSelect(opts.onSelect);
            if (!this.rendered || types) {
                let assets = am.getAll().filter(i => 1);
                if (types && types.length) {
                    assets = assets.filter(a => types.indexOf(a.get('type')) !== -1);
                }
                am.render(assets);
                this.rendered = 1;
            }
            if (accept) {
                const uploadEl = amContainer.querySelector(`input#${ config.stylePrefix }uploadFile`);
                uploadEl && uploadEl.setAttribute('accept', accept);
            }
            modal.open({
                title,
                content: amContainer
            }).getModel().once('change:open', () => editor.stopCommand(this.id));
            return this;
        },
        stop(editor) {
            editor.Modal.close();
            return this;
        }
    };
});
define('skylark-grapejs/commands/view/PasteComponent',['skylark-underscore'], function (a) {
    'use strict';
    return {
        run(ed) {
            const em = ed.getModel();
            const clp = em.get('clipboard');
            const selected = ed.getSelected();
            if (clp && selected) {
                ed.getSelectedAll().forEach(comp => {
                    if (!comp)
                        return;
                    const coll = comp.collection;
                    const at = coll.indexOf(comp) + 1;
                    const copyable = clp.filter(cop => cop.get('copyable'));
                    let added;
                    if (a.contains(clp, comp) && comp.get('copyable')) {
                        added = coll.add(comp.clone(), { at });
                    } else {
                        added = coll.add(copyable.map(cop => cop.clone()), { at });
                    }
                    added = a.isArray(added) ? added : [added];
                    added.forEach(add => ed.trigger('component:paste', add));
                });
                selected.emitUpdate();
            }
        }
    };
});
define('skylark-grapejs/commands/view/Preview',['skylark-underscore'], function (a) {
    'use strict';
    return {
        getPanels(editor) {
            if (!this.panels) {
                this.panels = editor.Panels.getPanels();
            }
            return this.panels;
        },
        tglPointers(editor, val) {
            const body = editor.Canvas.getBody();
            const elP = body.querySelectorAll(`.${ this.ppfx }no-pointer`);
            a.each(elP, item => item.style.pointerEvents = val ? '' : 'all');
        },
        run(editor, sender) {
            this.sender = sender;
            editor.stopCommand('sw-visibility');
            editor.getModel().stopDefault();
            const panels = this.getPanels(editor);
            const canvas = editor.Canvas.getElement();
            const editorEl = editor.getEl();
            const pfx = editor.Config.stylePrefix;
            if (!this.helper) {
                const helper = document.createElement('span');
                helper.className = `${ pfx }off-prv fa fa-eye-slash`;
                editorEl.appendChild(helper);
                helper.onclick = () => this.stopCommand();
                this.helper = helper;
            }
            this.helper.style.display = 'inline-block';
            this.tglPointers(editor);
            panels.forEach(panel => panel.set('visible', false));
            const canvasS = canvas.style;
            canvasS.width = '100%';
            canvasS.height = '100%';
            canvasS.top = '0';
            canvasS.left = '0';
            canvasS.padding = '0';
            canvasS.margin = '0';
            editor.refresh();
        },
        stop(editor) {
            const {
                sender = {}
            } = this;
            sender.set && sender.set('active', 0);
            const panels = this.getPanels(editor);
            const swVisibilityButton = editor.Panels.getButton('options', 'sw-visibility');
            if (swVisibilityButton && swVisibilityButton.get('active')) {
                editor.runCommand('sw-visibility');
            }
            editor.getModel().runDefault();
            panels.forEach(panel => panel.set('visible', true));
            const canvas = editor.Canvas.getElement();
            canvas.setAttribute('style', '');
            if (this.helper) {
                this.helper.style.display = 'none';
            }
            editor.refresh();
            this.tglPointers(editor, 1);
        }
    };
});
define('skylark-grapejs/commands/view/Resize',[],function () {
    'use strict';
    return {
        run(editor, sender, opts) {
            var opt = opts || {};
            var el = opt.el || '';
            var canvas = editor.Canvas;
            var canvasResizer = this.canvasResizer;
            var options = opt.options || {};
            var canvasView = canvas.getCanvasView();
            options.appendTo = canvas.getResizerEl();
            options.prefix = editor.getConfig().stylePrefix;
            options.posFetcher = canvasView.getElementPos.bind(canvasView);
            options.mousePosFetcher = canvas.getMouseRelativePos;
            if (!canvasResizer || opt.forceNew) {
                this.canvasResizer = editor.Utils.Resizer.init(options);
                canvasResizer = this.canvasResizer;
            }
            canvasResizer.setOptions(options);
            canvasResizer.blur();
            canvasResizer.focus(el);
            return canvasResizer;
        },
        stop() {
            const resizer = this.canvasResizer;
            resizer && resizer.blur();
        }
    };
});
define('skylark-grapejs/commands/view/ShowOffset',[
    'skylark-backbone',
    'skylark-underscore',
    '../../utils/mixins'
], function (Backbone, a, b) {
    'use strict';
    const $ = Backbone.$;
    return {
        getOffsetMethod(state) {
            var method = state || '';
            return 'get' + method + 'OffsetViewerEl';
        },
        run(editor, sender, opts) {
            var opt = opts || {};
            var state = opt.state || '';
            var config = editor.getConfig();
            const zoom = this.em.getZoomDecimal();
            const el = opt.el || '';
            if (!config.showOffsets || b.isTextNode(el) || !config.showOffsetsSelected && state == 'Fixed') {
                editor.stopCommand(this.id, opts);
                return;
            }
            var canvas = editor.Canvas;
            var pos = { ...opt.elPos || canvas.getElementPos(el) };
            if (!a.isUndefined(opt.top)) {
                pos.top = opt.top;
            }
            if (!a.isUndefined(opt.left)) {
                pos.left = opt.left;
            }
            var style = window.getComputedStyle(el);
            var ppfx = this.ppfx;
            var stateVar = state + 'State';
            var method = this.getOffsetMethod(state);
            var offsetViewer = canvas[method](opts.view);
            offsetViewer.style.opacity = '';
            let marginT = this['marginT' + state];
            let marginB = this['marginB' + state];
            let marginL = this['marginL' + state];
            let marginR = this['marginR' + state];
            let padT = this['padT' + state];
            let padB = this['padB' + state];
            let padL = this['padL' + state];
            let padR = this['padR' + state];
            if (offsetViewer.childNodes.length) {
                this[stateVar] = '1';
                marginT = offsetViewer.querySelector('[data-offset-m-t]');
                marginB = offsetViewer.querySelector('[data-offset-m-b]');
                marginL = offsetViewer.querySelector('[data-offset-m-l]');
                marginR = offsetViewer.querySelector('[data-offset-m-r]');
                padT = offsetViewer.querySelector('[data-offset-p-t]');
                padB = offsetViewer.querySelector('[data-offset-p-b]');
                padL = offsetViewer.querySelector('[data-offset-p-l]');
                padR = offsetViewer.querySelector('[data-offset-p-r]');
            }
            if (!this[stateVar]) {
                var stateLow = state.toLowerCase();
                var marginName = stateLow + 'margin-v';
                var paddingName = stateLow + 'padding-v';
                var marginV = $(`<div class="${ ppfx }marginName">`).get(0);
                var paddingV = $(`<div class="${ ppfx }paddingName">`).get(0);
                var marginEls = ppfx + marginName + '-el';
                var paddingEls = ppfx + paddingName + '-el';
                const fullMargName = `${ marginEls } ${ ppfx + marginName }`;
                const fullPadName = `${ paddingEls } ${ ppfx + paddingName }`;
                marginT = $(`<div class="${ fullMargName }-top"></div>`).get(0);
                marginB = $(`<div class="${ fullMargName }-bottom"></div>`).get(0);
                marginL = $(`<div class="${ fullMargName }-left"></div>`).get(0);
                marginR = $(`<div class="${ fullMargName }-right"></div>`).get(0);
                padT = $(`<div class="${ fullPadName }-top"></div>`).get(0);
                padB = $(`<div class="${ fullPadName }-bottom"></div>`).get(0);
                padL = $(`<div class="${ fullPadName }-left"></div>`).get(0);
                padR = $(`<div class="${ fullPadName }-right"></div>`).get(0);
                this['marginT' + state] = marginT;
                this['marginB' + state] = marginB;
                this['marginL' + state] = marginL;
                this['marginR' + state] = marginR;
                this['padT' + state] = padT;
                this['padB' + state] = padB;
                this['padL' + state] = padL;
                this['padR' + state] = padR;
                marginV.appendChild(marginT);
                marginV.appendChild(marginB);
                marginV.appendChild(marginL);
                marginV.appendChild(marginR);
                paddingV.appendChild(padT);
                paddingV.appendChild(padB);
                paddingV.appendChild(padL);
                paddingV.appendChild(padR);
                offsetViewer.appendChild(marginV);
                offsetViewer.appendChild(paddingV);
                this[stateVar] = '1';
            }
            var unit = 'px';
            var marginLeftSt = parseFloat(style.marginLeft.replace(unit, '')) * zoom;
            var marginRightSt = parseFloat(style.marginRight.replace(unit, '')) * zoom;
            var marginTopSt = parseFloat(style.marginTop.replace(unit, '')) * zoom;
            var marginBottomSt = parseFloat(style.marginBottom.replace(unit, '')) * zoom;
            var mtStyle = marginT.style;
            var mbStyle = marginB.style;
            var mlStyle = marginL.style;
            var mrStyle = marginR.style;
            var ptStyle = padT.style;
            var pbStyle = padB.style;
            var plStyle = padL.style;
            var prStyle = padR.style;
            var posLeft = parseFloat(pos.left);
            var widthEl = parseFloat(style.width) * zoom + unit;
            mtStyle.height = marginTopSt + unit;
            mtStyle.width = widthEl;
            mtStyle.top = pos.top - marginTopSt + unit;
            mtStyle.left = posLeft + unit;
            mbStyle.height = marginBottomSt + unit;
            mbStyle.width = widthEl;
            mbStyle.top = pos.top + pos.height + unit;
            mbStyle.left = posLeft + unit;
            var marginSideH = pos.height + marginTopSt + marginBottomSt + unit;
            var marginSideT = pos.top - marginTopSt + unit;
            mlStyle.height = marginSideH;
            mlStyle.width = marginLeftSt + unit;
            mlStyle.top = marginSideT;
            mlStyle.left = posLeft - marginLeftSt + unit;
            mrStyle.height = marginSideH;
            mrStyle.width = marginRightSt + unit;
            mrStyle.top = marginSideT;
            mrStyle.left = posLeft + pos.width + unit;
            var padTop = parseFloat(style.paddingTop) * zoom;
            ptStyle.height = padTop + unit;
            var padBot = parseFloat(style.paddingBottom) * zoom;
            pbStyle.height = padBot + unit;
            var padSideH = pos.height - padBot - padTop + unit;
            var padSideT = pos.top + padTop + unit;
            plStyle.height = padSideH;
            plStyle.width = parseFloat(style.paddingLeft) * zoom + unit;
            plStyle.top = padSideT;
            var padRight = parseFloat(style.paddingRight) * zoom;
            prStyle.height = padSideH;
            prStyle.width = padRight + unit;
            prStyle.top = padSideT;
        },
        stop(editor, sender, opts = {}) {
            var opt = opts || {};
            var state = opt.state || '';
            var method = this.getOffsetMethod(state);
            var canvas = editor.Canvas;
            var offsetViewer = canvas[method](opts.view);
            offsetViewer.style.opacity = 0;
        }
    };
});
define('skylark-grapejs/commands/view/SwitchVisibility',[],function () {
    'use strict';
    return {
        run(ed) {
            this.toggleVis(ed);
        },
        stop(ed) {
            this.toggleVis(ed, 0);
        },
        toggleVis(ed, active = 1) {
            const method = active ? 'add' : 'remove';
            ed.Canvas.getFrames().forEach(frame => {
                frame.view.getBody().classList[method](`${ this.ppfx }dashed`);
            });
        }
    };
});
define('skylark-grapejs/commands/index',[
    'skylark-underscore',
    './view/CommandAbstract',
    './config/config',
    '../dom_components/model/Component',

    './view/CanvasClear',
    './view/CanvasMove',

    './view/ComponentDelete',
    './view/ComponentDrag',
    './view/ComponentEnter',
    './view/ComponentExit',
    './view/ComponentNext',
    './view/ComponentPrev',
    './view/ComponentStyleClear',

    './view/CopyComponent',
    './view/DeleteComponent',
  
    './view/ExportTemplate',

    './view/Fullscreen',

    './view/MoveComponent',

    './view/OpenLayers',
    './view/OpenStyleManager',
    './view/OpenTraitManager',
    './view/OpenBlocks',
    './view/OpenAssets',
 
    './view/PasteComponent',
    './view/Preview',

    './view/Resize',

    './view/SelectComponent',
    './view/SelectPosition',

    './view/ShowOffset',
    './view/SwitchVisibility'
], function (
    a, 
    CommandAbstract, 
    defaults, 
    b,

    ViewCanvasClear,
    ViewCanvasMove,

    ViewComponentDelete,
    ViewComponentDrag,
    ViewComponentEnter,
    ViewComponentExit,
    ViewComponentNext,
    ViewComponentPrev,
    ViewComponentStyleClear,

    ViewCopyComponent,
    ViewDeleteComponent,
  
    ViewExportTemplate,

    ViewFullscreen,

    ViewMoveComponent,

    ViewOpenLayers,
    ViewOpenStyleManager,
    ViewOpenTraitManager,
    ViewOpenBlocks,
    ViewOpenAssets,
 
    ViewPasteComponent,
    ViewPreview,

    ViewResize,

    ViewSelectComponent,
    ViewSelectPosition,

    ViewShowOffset,
    ViewSwitchVisibility  
) {
    'use strict';
    return () => {
        let em;
        let c = {};
        const commands = {};
        const defaultCommands = {};
        const active = {};
        const commandsDef = [
            [
                'preview',
                'Preview',
                'preview',
                ViewPreview
            ],
            [
                'resize',
                'Resize',
                'resize',
                ViewResize
            ],
            [
                'fullscreen',
                'Fullscreen',
                'fullscreen',
                ViewFullscreen
            ],
            [
                'copy',
                'CopyComponent',
                '',
                ViewCopyComponent
            ],
            [
                'paste',
                'PasteComponent',
                '',
                ViewPasteComponent
            ],
            [
                'canvas-move',
                'CanvasMove',
                '',
                ViewCanvasMove
            ],
            [
                'canvas-clear',
                'CanvasClear',
                '',
                ViewCanvasClear
            ],
            [
                'open-code',
                'ExportTemplate',
                'export-template',
                ViewExportTemplate
            ],
            [
                'open-layers',
                'OpenLayers',
                'open-layers',
                ViewOpenLayers
            ],
            [
                'open-styles',
                'OpenStyleManager',
                'open-sm',
                ViewOpenStyleManager
            ],
            [
                'open-traits',
                'OpenTraitManager',
                'open-tm',
                ViewOpenTraitManager
            ],
            [
                'open-blocks',
                'OpenBlocks',
                'open-blocks',
                ViewOpenBlocks
            ],
            [
                'open-assets',
                'OpenAssets',
                'open-assets',
                ViewOpenAssets
            ],
            [
                'component-select',
                'SelectComponent',
                'select-comp',
                ViewSelectComponent
            ],
            [
                'component-outline',
                'SwitchVisibility',
                'sw-visibility',
                ViewSwitchVisibility
            ],
            [
                'component-offset',
                'ShowOffset',
                'show-offset',
                ViewShowOffset
            ],
            [
                'component-move',
                'MoveComponent',
                'move-comp',
                ViewMoveComponent
            ],
            [
                'component-next',
                'ComponentNext',
                '',
                ViewComponentNext
            ],
            [
                'component-prev',
                'ComponentPrev',
                '',
                ViewComponentPrev
            ],
            [
                'component-enter',
                'ComponentEnter',
                '',
                ViewComponentEnter
            ],
            [
                'component-exit',
                'ComponentExit',
                'select-parent',
                ViewComponentExit
            ],
            [
                'component-delete',
                'ComponentDelete',
                '',
                ViewComponentDelete
            ],
            [
                'component-style-clear',
                'ComponentStyleClear',
                '',
                ViewComponentStyleClear
            ],
            [
                'component-drag',
                'ComponentDrag',
                '',
                ViewComponentDrag
            ]
        ];
        const add = function (id, obj) {
            if (a.isFunction(obj))
                obj = { run: obj };
            if (!obj.stop)
                obj.noStop = 1;
            delete obj.initialize;
            obj.id = id;
            commands[id] = CommandAbstract.extend(obj);
            return this;
        };
        return {
            CommandAbstract,
            name: 'Commands',
            init(config = {}) {
                c = {
                    ...defaults,
                    ...config
                };
                em = c.em;
                const ppfx = c.pStylePrefix;
                if (ppfx)
                    c.stylePrefix = ppfx + c.stylePrefix;
                for (let k in c.defaults) {
                    const obj = c.defaults[k];
                    if (obj.id)
                        this.add(obj.id, obj);
                }
                defaultCommands['tlb-delete'] = {
                    run(ed) {
                        return ed.runCommand('core:component-delete');
                    }
                };
                defaultCommands['tlb-clone'] = {
                    run(ed) {
                        ed.runCommand('core:copy');
                        ed.runCommand('core:paste');
                    }
                };
                defaultCommands['tlb-move'] = {
                    run(ed, sender, opts = {}) {
                        let dragger;
                        const em = ed.getModel();
                        const event = opts && opts.event;
                        const {target} = opts;
                        const sel = target || ed.getSelected();
                        const selAll = target ? [target] : [...ed.getSelectedAll()];
                        const nativeDrag = event && event.type == 'dragstart';
                        const defComOptions = { preserveSelected: 1 };
                        const modes = [
                            'absolute',
                            'translate'
                        ];
                        const mode = sel.get('dmode') || em.get('dmode');
                        const hideTlb = () => em.stopDefault(defComOptions);
                        const altMode = a.includes(modes, mode);
                        selAll.forEach(sel => sel.trigger('disable'));
                        if (!sel || !sel.get('draggable')) {
                            return em.logWarning('The element is not draggable');
                        }
                        nativeDrag ? setTimeout(hideTlb, 0) : hideTlb();
                        const onStart = data => {
                            em.trigger(`${ b.eventDrag }:start`, data);
                        };
                        const onDrag = data => {
                            em.trigger(b.eventDrag, data);
                        };
                        const onEnd = (e, opts, data) => {
                            em.runDefault(defComOptions);
                            selAll.forEach(sel => sel.set('status', 'selected'));
                            ed.select(selAll);
                            sel.emitUpdate();
                            em.trigger(`${ b.eventDrag }:end`, data);
                            (altMode || data.cancelled) && em.set('_cmpDrag', 1);
                        };
                        if (altMode) {
                            dragger = ed.runCommand('core:component-drag', {
                                guidesInfo: 1,
                                mode,
                                target: sel,
                                onStart,
                                onDrag,
                                onEnd,
                                event
                            });
                        } else {
                            if (nativeDrag) {
                                event.dataTransfer.setDragImage(sel.view.el, 0, 0);
                            }
                            const cmdMove = ed.Commands.get('move-comp');
                            cmdMove.onStart = onStart;
                            cmdMove.onDrag = onDrag;
                            cmdMove.onEndMoveFromModel = onEnd;
                            cmdMove.initSorterFromModels(selAll);
                        }
                        selAll.forEach(sel => sel.set('status', 'freezed-selected'));
                    }
                };
                defaultCommands['core:undo'] = e => e.UndoManager.undo();
                defaultCommands['core:redo'] = e => e.UndoManager.redo();
                commandsDef.forEach(item => {
                    const oldCmd = item[2];
                    const cmd = item[3]; //require(`./view/${ item[1] }`).default; // modified by lwf
                    const cmdName = `core:${ item[0] }`;
                    defaultCommands[cmdName] = cmd;
                    if (oldCmd) {
                        defaultCommands[oldCmd] = cmd;
                        [
                            'run',
                            'stop'
                        ].forEach(name => {
                            em.on(`${ name }:${ oldCmd }`, (...args) => em.trigger(`${ name }:${ cmdName }`, ...args));
                        });
                    }
                });
                if (c.em)
                    c.model = c.em.get('Canvas');
                this.loadDefaultCommands();
                return this;
            },
            add,
            get(id) {
                let el = commands[id];
                if (a.isFunction(el)) {
                    el = new el(c);
                    commands[id] = el;
                } else if (!el) {
                    em.logWarning(`'${ id }' command not found`);
                }
                return el;
            },
            extend(id, cmd = {}) {
                const command = this.get(id);
                if (command) {
                    const cmdObj = {
                        ...command.constructor.prototype,
                        ...cmd
                    };
                    this.add(id, cmdObj);
                    const oldCmd = commandsDef.filter(cmd => `core:${ cmd[0] }` === id && cmd[2])[0];
                    oldCmd && this.add(oldCmd[2], cmdObj);
                }
                return this;
            },
            has(id) {
                return !!commands[id];
            },
            getAll() {
                return commands;
            },
            run(id, options = {}) {
                return this.runCommand(this.get(id), options);
            },
            stop(id, options = {}) {
                return this.stopCommand(this.get(id), options);
            },
            isActive(id) {
                return this.getActive().hasOwnProperty(id);
            },
            getActive() {
                return active;
            },
            loadDefaultCommands() {
                for (var id in defaultCommands) {
                    this.add(id, defaultCommands[id]);
                }
                return this;
            },
            runCommand(command, options = {}) {
                let result;
                if (command && command.run) {
                    const id = command.id;
                    const editor = em.get('Editor');
                    if (!this.isActive(id) || options.force || !c.strict) {
                        result = command.callRun(editor, options);
                        if (id && command.stop && !command.noStop && !options.abort) {
                            active[id] = result;
                        }
                    }
                }
                return result;
            },
            stopCommand(command, options = {}) {
                let result;
                if (command && command.run) {
                    const id = command.id;
                    const editor = em.get('Editor');
                    if (this.isActive(id) || options.force || !c.strict) {
                        if (id)
                            delete active[id];
                        result = command.callStop(editor, options);
                    }
                }
                return result;
            },
            create(command) {
                if (!command.stop)
                    command.noStop = 1;
                const cmd = CommandAbstract.extend(command);
                return new cmd(c);
            }
        };
    };
});
define('skylark-grapejs/block_manager/config/config',[],function () {
    'use strict';
    return {
        appendTo: '',
        appendOnClick: 0,
        blocks: []
    };
});
define('skylark-grapejs/block_manager/model/Category',[
	'skylark-backbone'
], function (Backbone) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            id: '',
            label: '',
            open: true,
            attributes: {}
        }
    });
});
define('skylark-grapejs/block_manager/model/Block',[
    'skylark-backbone',
    './Category'
], function (Backbone, Category) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            activate: 0,
            select: 0,
            resetId: 0,
            label: '',
            media: '',
            content: '',
            category: '',
            attributes: {}
        },
        initialize(opts = {}) {
            let category = this.get('category');
            if (category) {
                if (typeof category == 'string') {
                    var catObj = new Category({
                        id: category,
                        label: category
                    });
                }
            }
        }
    });
});
define('skylark-grapejs/block_manager/model/Blocks',[
    'skylark-backbone',
    './Block'
], function (Backbone, Block) {
    'use strict';
    return Backbone.Collection.extend({ model: Block });
});
define('skylark-grapejs/block_manager/model/Categories',[
    'skylark-backbone',
    './Category'
], function (Backbone, Category) {
    'use strict';
    return Backbone.Collection.extend({ model: Category });
});
define('skylark-grapejs/block_manager/view/BlockView',[
    'skylark-backbone',
    'skylark-underscore',
    '../../utils/mixins'
], function (Backbone, _, mixins) {
    'use strict';
    return Backbone.View.extend({
        events: {
            click: 'handleClick',
            mousedown: 'startDrag',
            dragstart: 'handleDragStart',
            drag: 'handleDrag',
            dragend: 'handleDragEnd'
        },
        initialize(o, config = {}) {
            const {model} = this;
            this.em = config.em;
            this.config = config;
            this.endDrag = this.endDrag.bind(this);
            this.ppfx = config.pStylePrefix || '';
            this.listenTo(model, 'destroy remove', this.remove);
            this.listenTo(model, 'change', this.render);
        },
        handleClick() {
            const {config, model, em} = this;
            if (!config.appendOnClick)
                return;
            const sorter = config.getSorter();
            const content = model.get('content');
            const selected = em.getSelected();
            sorter.setDropContent(content);
            let target, valid;
            if (selected) {
                valid = sorter.validTarget(selected.getEl(), content);
                if (valid.valid) {
                    target = selected;
                } else {
                    const parent = selected.parent();
                    valid = sorter.validTarget(parent.getEl(), content);
                    if (valid.valid)
                        target = parent;
                }
            }
            if (!target) {
                const wrapper = em.getWrapper();
                valid = sorter.validTarget(wrapper.getEl(), content);
                if (valid.valid)
                    target = wrapper;
            }
            const result = target && target.append(content)[0];
            result && em.setSelected(result, { scroll: 1 });
        },
        startDrag(e) {
            const {config, em} = this;
            if (e.button !== 0 || !config.getSorter || this.el.draggable)
                return;
            em.refreshCanvas();
            const sorter = config.getSorter();
            sorter.setDragHelper(this.el, e);
            sorter.setDropContent(this.model.get('content'));
            sorter.startSort(this.el);
            mixins.on(document, 'mouseup', this.endDrag);
        },
        handleDragStart(ev) {
            const {em, model} = this;
            const content = model.get('content');
            const isObj = _.isObject(content);
            const data = isObj ? JSON.stringify(content) : content;
            em.set('dragResult');
            ev.dataTransfer.setData('text', data);
            em.set('dragContent', content);
            em.trigger('block:drag:start', model, ev);
        },
        handleDrag(ev) {
            this.em.trigger('block:drag', this.model, ev);
        },
        handleDragEnd() {
            const {em, model} = this;
            const result = em.get('dragResult');
            if (result) {
                const oldKey = 'activeOnRender';
                const oldActive = result.get && result.get(oldKey);
                if (model.get('activate') || oldActive) {
                    result.trigger('active');
                    result.set(oldKey, 0);
                }
                if (model.get('select')) {
                    em.setSelected(result);
                }
                if (model.get('resetId')) {
                    result.onAll(model => model.resetId());
                }
            }
            em.set({
                dragResult: null,
                dragContent: null
            });
            em.trigger('block:drag:stop', result, model);
        },
        endDrag(e) {
            mixins.off(document, 'mouseup', this.endDrag);
            const sorter = this.config.getSorter();
            sorter.moved = 0;
            sorter.endMove();
        },
        render() {
            const {em, el, ppfx, model} = this;
            const className = `${ ppfx }block`;
            const label = em && em.t(`blockManager.labels.${ model.id }`) || model.get('label');
            const render = model.get('render');
            const media = model.get('media');
            el.className += ` ${ className } ${ ppfx }one-bg ${ ppfx }four-color-h`;
            el.innerHTML = `
      ${ media ? `<div class="${ className }__media">${ media }</div>` : '' }
      <div class="${ className }-label">${ label }</div>
    `;
            el.title = el.textContent.trim();
            mixins.hasDnd(em) && el.setAttribute('draggable', true);
            const result = render && render({
                el,
                model,
                className,
                prefix: ppfx
            });
            if (result)
                el.innerHTML = result;
            return this;
        }
    });
});
define('skylark-grapejs/block_manager/view/CategoryView',[
    'skylark-underscore',
    'skylark-backbone'
], function (_, Backbone) {
    'use strict';
    return Backbone.View.extend({
        template: _.template(`
  <div class="<%= pfx %>title">
    <i class="<%= pfx %>caret-icon"></i>
    <%= label %>
  </div>
  <div class="<%= pfx %>blocks-c"></div>
  `),
        events: {},
        initialize(o = {}, config = {}) {
            this.config = config;
            const pfx = config.pStylePrefix || '';
            this.em = config.em;
            this.pfx = pfx;
            this.caretR = 'fa fa-caret-right';
            this.caretD = 'fa fa-caret-down';
            this.iconClass = `${ pfx }caret-icon`;
            this.activeClass = `${ pfx }open`;
            this.className = `${ pfx }block-category`;
            this.events[`click .${ pfx }title`] = 'toggle';
            this.listenTo(this.model, 'change:open', this.updateVisibility);
            this.delegateEvents();
        },
        updateVisibility() {
            if (this.model.get('open'))
                this.open();
            else
                this.close();
        },
        open() {
            this.el.className = `${ this.className } ${ this.activeClass }`;
            this.getIconEl().className = `${ this.iconClass } ${ this.caretD }`;
            this.getBlocksEl().style.display = '';
        },
        close() {
            this.el.className = this.className;
            this.getIconEl().className = `${ this.iconClass } ${ this.caretR }`;
            this.getBlocksEl().style.display = 'none';
        },
        toggle() {
            var model = this.model;
            model.set('open', !model.get('open'));
        },
        getIconEl() {
            if (!this.iconEl) {
                this.iconEl = this.el.querySelector('.' + this.iconClass);
            }
            return this.iconEl;
        },
        getBlocksEl() {
            if (!this.blocksEl) {
                this.blocksEl = this.el.querySelector('.' + this.pfx + 'blocks-c');
            }
            return this.blocksEl;
        },
        append(el) {
            this.getBlocksEl().appendChild(el);
        },
        render() {
            const {em, el, $el, model} = this;
            const label = em.t(`blockManager.categories.${ model.id }`) || model.get('label');
            el.innerHTML = this.template({
                pfx: this.pfx,
                label
            });
            el.className = this.className;
            $el.css({ order: model.get('order') });
            this.updateVisibility();
            return this;
        }
    });
});
define('skylark-grapejs/block_manager/view/BlocksView',[
    'skylark-backbone',
    'skylark-underscore',
    './BlockView',
    './CategoryView'
], function (Backbone, _, BlockView, CategoryView) {
    'use strict';
    return Backbone.View.extend({
        initialize(opts, config) {
            _.bindAll(this, 'getSorter', 'onDrag', 'onDrop');
            this.config = config || {};
            this.categories = opts.categories || '';
            this.renderedCategories = [];
            var ppfx = this.config.pStylePrefix || '';
            this.ppfx = ppfx;
            this.noCatClass = `${ ppfx }blocks-no-cat`;
            this.blockContClass = `${ ppfx }blocks-c`;
            this.catsClass = `${ ppfx }block-categories`;
            const coll = this.collection;
            this.listenTo(coll, 'add', this.addTo);
            this.listenTo(coll, 'reset', this.render);
            this.em = this.config.em;
            this.tac = 'test-tac';
            this.grabbingCls = this.ppfx + 'grabbing';
            if (this.em) {
                this.config.getSorter = this.getSorter;
                this.canvas = this.em.get('Canvas');
            }
        },
        updateConfig(opts = {}) {
            this.config = {
                ...this.config,
                ...opts
            };
        },
        getSorter() {
            if (!this.em)
                return;
            if (!this.sorter) {
                var utils = this.em.get('Utils');
                var canvas = this.canvas;
                this.sorter = new utils.Sorter({
                    container: canvas.getBody(),
                    placer: canvas.getPlacerEl(),
                    containerSel: '*',
                    itemSel: '*',
                    pfx: this.ppfx,
                    onStart: this.onDrag,
                    onEndMove: this.onDrop,
                    onMove: this.onMove,
                    document: canvas.getFrameEl().contentDocument,
                    direction: 'a',
                    wmargin: 1,
                    nested: 1,
                    em: this.em,
                    canvasRelative: 1
                });
            }
            return this.sorter;
        },
        onDrag(e) {
            this.em.stopDefault();
            this.em.trigger('block:drag:start', e);
        },
        onMove(e) {
            this.em.trigger('block:drag:move', e);
        },
        onDrop(model) {
            const em = this.em;
            em.runDefault();
            if (model && model.get) {
                if (model.get('activeOnRender')) {
                    model.trigger('active');
                    model.set('activeOnRender', 0);
                }
                em.trigger('block:drag:stop', model);
            }
        },
        addTo(model) {
            this.add(model);
        },
        add(model, fragment) {
            const {config} = this;
            var frag = fragment || null;
            var view = new BlockView({
                model,
                attributes: model.get('attributes')
            }, config);
            var rendered = view.render().el;
            var category = model.get('category');
            if (category && this.categories && !config.ignoreCategories) {
                if (_.isString(category)) {
                    category = {
                        id: category,
                        label: category
                    };
                } else if (_.isObject(category) && !category.id) {
                    category.id = category.label;
                }
                var catModel = this.categories.add(category);
                var catId = catModel.get('id');
                var catView = this.renderedCategories[catId];
                var categories = this.getCategoriesEl();
                model.set('category', catModel);
                if (!catView && categories) {
                    catView = new CategoryView({ model: catModel }, this.config).render();
                    this.renderedCategories[catId] = catView;
                    categories.appendChild(catView.el);
                }
                catView && catView.append(rendered);
                return;
            }
            if (frag)
                frag.appendChild(rendered);
            else
                this.append(rendered);
        },
        getCategoriesEl() {
            if (!this.catsEl) {
                this.catsEl = this.el.querySelector(`.${ this.catsClass }`);
            }
            return this.catsEl;
        },
        getBlocksEl() {
            if (!this.blocksEl) {
                this.blocksEl = this.el.querySelector(`.${ this.noCatClass } .${ this.blockContClass }`);
            }
            return this.blocksEl;
        },
        append(el) {
            let blocks = this.getBlocksEl();
            blocks && blocks.appendChild(el);
        },
        render() {
            const ppfx = this.ppfx;
            const frag = document.createDocumentFragment();
            this.catsEl = null;
            this.blocksEl = null;
            this.renderedCategories = [];
            this.el.innerHTML = `
      <div class="${ this.catsClass }"></div>
      <div class="${ this.noCatClass }">
        <div class="${ this.blockContClass }"></div>
      </div>
    `;
            this.collection.each(model => this.add(model, frag));
            this.append(frag);
            const cls = `${ this.blockContClass }s ${ ppfx }one-bg ${ ppfx }two-color`;
            this.$el.addClass(cls);
            return this;
        }
    });
});
define('skylark-grapejs/block_manager/index',[
    'skylark-underscore',
    './config/config',
    './model/Blocks',
    './model/Categories',
    './view/BlocksView'
], function (a, defaults, Blocks, BlockCategories, BlocksView) {
    'use strict';
    return () => {
        var c = {};
        var blocks, blocksVisible, blocksView;
        var categories = [];
        return {
            name: 'BlockManager',
            init(config) {
                c = config || {};
                const em = c.em;
                for (let name in defaults) {
                    if (!(name in c)) {
                        c[name] = defaults[name];
                    }
                }
                blocks = new Blocks([]);
                blocksVisible = new Blocks([]);
                categories = new BlockCategories();
                blocksView = new BlocksView({
                    collection: blocksVisible,
                    categories
                }, c);
                blocks.listenTo(blocks, 'add', model => {
                    blocksVisible.add(model);
                    em && em.trigger('block:add', model);
                });
                blocks.listenTo(blocks, 'remove', model => {
                    blocksVisible.remove(model);
                    em && em.trigger('block:remove', model);
                });
                blocks.listenTo(blocks, 'reset', coll => {
                    blocksVisible.reset(coll.models);
                });
                return this;
            },
            getConfig() {
                return c;
            },
            onLoad() {
                const blocks = this.getAll();
                !blocks.length && blocks.reset(c.blocks);
            },
            postRender() {
                const elTo = this.getConfig().appendTo;
                if (elTo) {
                    const el = a.isElement(elTo) ? elTo : document.querySelector(elTo);
                    el.appendChild(this.render());
                }
            },
            add(id, opts) {
                var obj = opts || {};
                obj.id = id;
                return blocks.add(obj);
            },
            get(id) {
                return blocks.get(id);
            },
            getAll() {
                return blocks;
            },
            getAllVisible() {
                return blocksVisible;
            },
            remove(id) {
                return blocks.remove(id);
            },
            getCategories() {
                return categories;
            },
            getContainer() {
                return blocksView.el;
            },
            render(blocks, opts = {}) {
                const toRender = blocks || this.getAll().models;
                if (opts.external) {
                    return new BlocksView({
                        collection: new Blocks(toRender),
                        categories
                    }, {
                        ...c,
                        ...opts
                    }).render().el;
                }
                if (!blocksView.rendered) {
                    blocksView.render();
                    blocksView.rendered = 1;
                }
                blocksView.updateConfig(opts);
                blocksView.collection.reset(toRender);
                return this.getContainer();
            }
        };
    };
});
define('skylark-grapejs/editor/model/Editor',[
    "skylark-langx/langx",
    'skylark-underscore',
    'skylark-jquery',
    'skylark-backbone',
    '../../utils/extender',
    '../../utils/mixins',
    "../../utils/index",
    "../../i18n/index",
    "../../keymaps/index",
    "../../undo_manager/index",
    "../../storage_manager/index",
    "../../device_manager/index",
    "../../parser/index",
    "../../selector_manager/index",
    "../../style_manager/index",
    "../../modal_dialog/index",
    "../../code_manager/index",
    "../../panels/index",
    "../../rich_text_editor/index",
    "../../asset_manager/index",
    "../../css_composer/index",
    "../../trait_manager/index",
    "../../dom_components/index",
    "../../navigator/index",
    "../../canvas/index",
    "../../commands/index",
    "../../block_manager/index"
], function (langx,_, $, Backbone, Extender, b,
    _utils,
    _i18n,
    _keymaps,
    _undo_manager,
    _storage_manager,
    _device_manager,
    _parser,
    _selector_manager,
    _style_manager,
    _modal_dialog,
    _code_manager,
    _panels,
    _rich_text_editor,
    _asset_manager,
    _css_composer,
    _trait_manager,
    _dom_components,
    _navigator,
    _canvas,
    _commands,
    _block_manager
) {
    'use strict';
    Backbone.$ = $;
    const deps = [
        _utils,
        _i18n,
        _keymaps,
        _undo_manager,
        _storage_manager,
        _device_manager,
        _parser,
        _selector_manager,
        _style_manager,
        _modal_dialog,
        _code_manager,
        _panels,
        _rich_text_editor,
        _asset_manager,
        _css_composer,
        _trait_manager,
        _dom_components,
        _navigator,
        _canvas,
        _commands,
        _block_manager
    ];
    const {Collection} = Backbone;
    let timedInterval;
    let updateItr;
    Extender({
        Backbone: Backbone,
        $: Backbone.$
    });
    const logs = {
        debug: console.log,
        info: console.info,
        warning: console.warn,
        error: console.error
    };
    return Backbone.Model.extend({
        defaults() {
            return {
                editing: 0,
                selected: new Collection(),
                clipboard: null,
                dmode: 0,
                componentHovered: null,
                previousModel: null,
                changesCount: 0,
                storables: [],
                modules: [],
                toLoad: [],
                opened: {},
                device: ''
            };
        },
        initialize(c = {}) {
            this.config = c;
            this.set('Config', c);
            this.set('modules', []);
            this.set('toLoad', []);
            this.set('storables', []);
            this.set('dmode', c.dragMode);
            const el = c.el;
            const log = c.log;
            const toLog = log === true ? _.keys(logs) : _.isArray(log) ? log : [];
            _.bindAll(this, 'initBaseColorPicker');
            if (el && c.fromElement)
                this.config.components = el.innerHTML;
            this.attrsOrig = el ? _.toArray(el.attributes).reduce((res, next) => {
                res[next.nodeName] = next.nodeValue;
                return res;
            }, {}) : '';
            deps.forEach(name => this.loadModule(name));
            this.on('change:componentHovered', this.componentHovered, this);
            this.on('change:changesCount', this.updateChanges, this);
            toLog.forEach(e => this.listenLog(e));
            [{
                    from: 'change:selectedComponent',
                    to: 'component:toggled'
                }].forEach(event => {
                const eventFrom = event.from;
                const eventTo = event.to;
                this.listenTo(this, eventFrom, (...args) => {
                    this.trigger(eventTo, ...args);
                    this.logWarning(`The event '${ eventFrom }' is deprecated, replace it with '${ eventTo }'`);
                });
            });
        },
        getContainer() {
            return this.config.el;
        },
        listenLog(event) {
            this.listenTo(this, `log:${ event }`, logs[event]);
        },
        getConfig(prop) {
            const config = this.config;
            return _.isUndefined(prop) ? config : config[prop];
        },
        loadOnStart(clb = null) {
            const sm = this.get('StorageManager');
            this.get('toLoad').forEach(module => {
                module.onLoad();
            });
            const postLoad = () => {
                const modules = this.get('modules');
                modules.forEach(module => module.postLoad && module.postLoad(this));
                clb && clb();
            };
            if (sm && sm.canAutoload()) {
                this.load(postLoad);
            } else {
                postLoad();
            }
        },
        updateChanges() {
            const stm = this.get('StorageManager');
            const changes = this.get('changesCount');
            updateItr && clearTimeout(updateItr);
            updateItr = setTimeout(() => this.trigger('update'));
            if (this.config.noticeOnUnload) {
                window.onbeforeunload = changes ? e => 1 : null;
            }
            if (stm.isAutosave() && changes >= stm.getStepsBeforeSave()) {
                this.store();
            }
        },
        loadModule(moduleName) {
            const {config} = this;
            const Module = moduleName.default || moduleName;
            const Mod =  Module(); // new Module() modified by lwf
            const name = Mod.name.charAt(0).toLowerCase() + Mod.name.slice(1);
            const cfgParent = !_.isUndefined(config[name]) ? config[name] : config[Mod.name];
            const cfg = cfgParent || {};
            const sm = this.get('StorageManager');
            cfg.pStylePrefix = config.pStylePrefix || '';
            if (!_.isUndefined(cfgParent) && !cfgParent) {
                cfg._disable = 1;
            }
            if (Mod.storageKey && Mod.store && Mod.load && sm) {
                cfg.stm = sm;
                const mth = name == 'domComponents' ? 'unshift' : 'push';
                this.get('storables')[mth](Mod);
            }
            cfg.em = this;
            Mod.init(cfg);
            !Mod.private && this.set(Mod.name, Mod);
            Mod.onLoad && this.get('toLoad').push(Mod);
            this.get('modules').push(Mod);
            return this;
        },
        init(editor) {
            this.set('Editor', editor);
        },
        getEditor() {
            return this.get('Editor');
        },
        handleUpdates(model, val, opt = {}) {
            if (opt.temporary) {
                return;
            }
            timedInterval && clearInterval(timedInterval);
            timedInterval = setTimeout(() => {
                if (!opt.avoidStore) {
                    this.set('changesCount', this.get('changesCount') + 1, opt);
                }
            }, 0);
        },
        componentHovered(editor, component, options) {
            const prev = this.previous('componentHovered');
            prev && this.trigger('component:unhovered', prev, options);
            component && this.trigger('component:hovered', component, options);
        },
        getSelected() {
            return this.get('selected').last();
        },
        getSelectedAll() {
            return this.get('selected').models;
        },
        setSelected(el, opts = {}) {
            const multiple = _.isArray(el);
            const els = multiple ? el : [el];
            const selected = this.get('selected');
            let added;
            multiple && this.removeSelected(selected.filter(s => !_.contains(els, s)));
            els.forEach(el => {
                const model = b.getModel(el, $);
                if (model && !model.get('selectable'))
                    return;
                !multiple && this.removeSelected(selected.filter(s => s !== model));
                this.addSelected(model, opts);
                added = model;
            });
        },
        addSelected(el, opts = {}) {
            const model = b.getModel(el, $);
            const models = _.isArray(model) ? model : [model];
            models.forEach(model => {
                if (model && !model.get('selectable'))
                    return;
                const selected = this.get('selected');
                opts.forceChange && selected.remove(model, opts);
                selected.push(model, opts);
            });
        },
        removeSelected(el, opts = {}) {
            this.get('selected').remove(b.getModel(el, $), opts);
        },
        toggleSelected(el, opts = {}) {
            const model = b.getModel(el, $);
            const models = _.isArray(model) ? model : [model];
            models.forEach(model => {
                if (this.get('selected').contains(model)) {
                    this.removeSelected(model, opts);
                } else {
                    this.addSelected(model, opts);
                }
            });
        },
        setHovered(el, opts = {}) {
            const model = b.getModel(el, $);
            if (model && !model.get('hoverable'))
                return;
            opts.forceChange && this.set('componentHovered', '');
            this.set('componentHovered', model, opts);
        },
        getHovered() {
            return this.get('componentHovered');
        },
        setComponents(components) {
            return this.get('DomComponents').setComponents(components);
        },
        getComponents() {
            var cmp = this.get('DomComponents');
            var cm = this.get('CodeManager');
            if (!cmp || !cm)
                return;
            var wrp = cmp.getComponents();
            return cm.getCode(wrp, 'json');
        },
        setStyle(style) {
            var rules = this.get('CssComposer').getAll();
            for (var i = 0, len = rules.length; i < len; i++)
                rules.pop();
            rules.add(style);
            return this;
        },
        getStyle() {
            return this.get('CssComposer').getAll();
        },
        setState(value) {
            this.set('state', value);
            return this;
        },
        getState() {
            return this.get('state');
        },
        getHtml() {
            const config = this.config;
            const exportWrapper = config.exportWrapper;
            const wrapperIsBody = config.wrapperIsBody;
            const js = config.jsInHtml ? this.getJs() : '';
            var wrp = this.get('DomComponents').getComponent();
            var html = this.get('CodeManager').getCode(wrp, 'html', {
                exportWrapper,
                wrapperIsBody
            });
            html += js ? `<script>${ js }</script>` : '';
            return html;
        },
        getCss(opts = {}) {
            const config = this.config;
            const wrapperIsBody = config.wrapperIsBody;
            const avoidProt = opts.avoidProtected;
            const keepUnusedStyles = !_.isUndefined(opts.keepUnusedStyles) ? opts.keepUnusedStyles : config.keepUnusedStyles;
            const cssc = this.get('CssComposer');
            const wrp = this.get('DomComponents').getComponent();
            const protCss = !avoidProt ? config.protectedCss : '';
            return protCss + this.get('CodeManager').getCode(wrp, 'css', {
                cssc,
                wrapperIsBody,
                keepUnusedStyles
            });
        },
        getJs() {
            var wrp = this.get('DomComponents').getWrapper();
            return this.get('CodeManager').getCode(wrp, 'js').trim();
        },
        store(clb) {
            var sm = this.get('StorageManager');
            var store = {};
            if (!sm)
                return;
            this.get('storables').forEach(m => {
                var obj = m.store(1);
                for (var el in obj)
                    store[el] = obj[el];
            });
            sm.store(store, res => {
                clb && clb(res);
                this.set('changesCount', 0);
                this.trigger('storage:store', store);
            });
            return store;
        },
        load(clb = null) {
            this.getCacheLoad(1, res => {
                this.get('storables').forEach(module => module.load(res));
                clb && clb(res);
            });
        },
        getCacheLoad(force, clb) {
            if (this.cacheLoad && !force)
                return this.cacheLoad;
            const sm = this.get('StorageManager');
            const load = [];
            if (!sm)
                return {};
            this.get('storables').forEach(m => {
                let key = m.storageKey;
                key = _.isFunction(key) ? key() : key;
                const keys = _.isArray(key) ? key : [key];
                keys.forEach(k => load.push(k));
            });
            sm.load(load, res => {
                this.cacheLoad = res;
                clb && clb(res);
                setTimeout(() => this.trigger('storage:load', res));
            });
        },
        getDeviceModel() {
            var name = this.get('device');
            return this.get('DeviceManager').get(name);
        },
        runDefault(opts = {}) {
            var command = this.get('Commands').get(this.config.defaultCommand);
            if (!command || this.defaultRunning)
                return;
            command.stop(this, this, opts);
            command.run(this, this, opts);
            this.defaultRunning = 1;
        },
        stopDefault(opts = {}) {
            var command = this.get('Commands').get(this.config.defaultCommand);
            if (!command)
                return;
            command.stop(this, this, opts);
            this.defaultRunning = 0;
        },
        refreshCanvas() {
            this.set('canvasOffset', null);
            this.set('canvasOffset', this.get('Canvas').getOffset());
        },
        clearSelection(win) {
            var w = win || window;
            w.getSelection().removeAllRanges();
        },
        getCurrentMedia() {
            const config = this.config;
            const device = this.getDeviceModel();
            const condition = config.mediaCondition;
            const preview = config.devicePreviewMode;
            const width = device && device.get('widthMedia');
            return device && width && !preview ? `(${ condition }: ${ width })` : '';
        },
        getWrapper() {
            return this.get('DomComponents').getWrapper();
        },
        setCurrentFrame(frameView) {
            return this.set('currentFrame', frameView);
        },
        getCurrentFrame() {
            return this.get('currentFrame');
        },
        getCurrentFrameModel() {
            return (this.getCurrentFrame() || {}).model;
        },
        getDirtyCount() {
            return this.get('changesCount');
        },
        getZoomDecimal() {
            return this.get('Canvas').getZoomDecimal();
        },
        getZoomMultiplier() {
            return this.get('Canvas').getZoomMultiplier();
        },
        setDragMode(value) {
            return this.set('dmode', value);
        },
        t(...args) {
            return this.get('I18n').t(...args);
        },
        inAbsoluteMode() {
            return this.get('dmode') === 'absolute';
        },
        destroyAll() {
            const {DomComponents, CssComposer, UndoManager, Panels, Canvas, Keymaps, RichTextEditor} = this.attributes;
            DomComponents.clear();
            CssComposer.clear();
            UndoManager.clear().removeAll();
            Panels.getPanels().reset();
            Canvas.getCanvasView().remove();
            Keymaps.removeAll();
            RichTextEditor.destroy();
            this.view.remove();
            this.stopListening();
            $(this.config.el).empty().attr(this.attrsOrig);
        },
        setEditing(value) {
            this.set('editing', value);
            return this;
        },
        isEditing() {
            return !!this.get('editing');
        },
        log(msg, opts = {}) {
            const {ns, level = 'debug'} = opts;
            this.trigger('log', msg, opts);
            level && this.trigger(`log:${ level }`, msg, opts);
            if (ns) {
                const logNs = `log-${ ns }`;
                this.trigger(logNs, msg, opts);
                level && this.trigger(`${ logNs }:${ level }`, msg, opts);
            }
        },
        logInfo(msg, opts) {
            this.log(msg, langx.mixin({},opts, {evel: 'info' }));
        },
        logWarning(msg, opts) {
            this.log(msg, langx.mixin({},opts, {evel: 'warning' }));
        },
        logError(msg, opts) {
            this.log(msg, langx.mixin({},opts, {evel: 'error' }));
        },
        initBaseColorPicker(el, opts = {}) {
            const config = this.getConfig();
            const {
                colorPicker = {}
            } = config;
            const elToAppend = config.el;
            const ppfx = config.stylePrefix;
            return $(el).spectrum(langx.mixin({
                    containerClassName: `${ ppfx }one-bg ${ ppfx }two-color`,
                    appendTo: elToAppend || 'body',
                    maxSelectionSize: 8,
                    showPalette: true,
                    palette: [],
                    showAlpha: true,
                    chooseText: 'Ok',
                    cancelText: '\u2A2F',
                },opts,colorPicker)
            );
        },
        data(el, name, value) {
            const varName = '_gjs-data';
            if (!el[varName]) {
                el[varName] = {};
            }
            if (_.isUndefined(value)) {
                return el[varName][name];
            } else {
                el[varName][name] = value;
            }
        }
    });
});
define('skylark-grapejs/editor/view/EditorView',[
    "skylark-jquery",
    'skylark-backbone',
    '../../utils/mixins'
], function ($,Backbone, mixins) {
    'use strict';
    return Backbone.View.extend({
        initialize() {
            const {model} = this;
            model.view = this;
            this.conf = model.config;
            this.pn = model.get('Panels');
            this.cv = model.get('Canvas');
            model.on('loaded', () => {
                this.pn.active();
                this.pn.disableButtons();
                setTimeout(() => {
                    model.runDefault();
                    model.trigger('load', model.get('Editor'));
                });
            });
        },
        render() {
            const {model, $el, conf} = this;
            const pfx = conf.stylePrefix;
            const contEl = $(conf.el || `body ${ conf.container }`);
            mixins.appendStyles(conf.cssIcons, {
                unique: 1,
                prepand: 1
            });
            $el.empty();
            if (conf.width)
                contEl.css('width', conf.width);
            if (conf.height)
                contEl.css('height', conf.height);
            $el.append(this.cv.render());
            $el.append(this.pn.render());
            $el.attr('class', `${ pfx }editor ${ pfx }one-bg ${ pfx }two-color`);
            contEl.addClass(`${ pfx }editor-cont`).empty().append($el);
            return this;
        }
    });
});
define('skylark-grapejs/editor/index',[
    "skylark-langx/langx",
    'skylark-jquery',
    './config/config',
    './model/Editor',
    './view/EditorView'
], function (langx,$, defaults, EditorModel, EditorView) {
    'use strict';
    return (config = {}) => {

        const c = langx.mixin(
            {},
            defaults,
            config
        );

        c.pStylePrefix = c.stylePrefix;

        var em = new EditorModel(c);

        var editorView = new EditorView({
            model: em,
            config: c
        });
        
        return {
            $,
            editor: em,
            I18n: em.get('I18n'),
            DomComponents: em.get('DomComponents'),
            LayerManager: em.get('LayerManager'),
            CssComposer: em.get('CssComposer'),
            StorageManager: em.get('StorageManager'),
            AssetManager: em.get('AssetManager'),
            BlockManager: em.get('BlockManager'),
            TraitManager: em.get('TraitManager'),
            SelectorManager: em.get('SelectorManager'),
            CodeManager: em.get('CodeManager'),
            Commands: em.get('Commands'),
            Keymaps: em.get('Keymaps'),
            Modal: em.get('Modal'),
            Panels: em.get('Panels'),
            StyleManager: em.get('StyleManager'),
            Canvas: em.get('Canvas'),
            UndoManager: em.get('UndoManager'),
            DeviceManager: em.get('DeviceManager'),
            RichTextEditor: em.get('RichTextEditor'),
            Parser: em.get('Parser'),
            Utils: em.get('Utils'),
            Config: em.get('Config'),
            init() {
                em.init(this);
                em.on('loaded', () => {
                    this.UndoManager.clear();
                    em.get('modules').forEach(module => {
                        module.postRender && module.postRender(editorView);
                    });
                });
                return this;
            },
            getConfig(prop) {
                return em.getConfig(prop);
            },
            getHtml(opts) {
                return em.getHtml(opts);
            },
            getCss(opts) {
                return em.getCss(opts);
            },
            getJs() {
                return em.getJs();
            },
            getComponents() {
                return em.get('DomComponents').getComponents();
            },
            getWrapper() {
                return em.get('DomComponents').getWrapper();
            },
            setComponents(components) {
                em.setComponents(components);
                return this;
            },
            addComponents(components, opts) {
                return this.getWrapper().append(components, opts);
            },
            getStyle() {
                return em.get('CssComposer').getAll();
            },
            setStyle(style) {
                em.setStyle(style);
                return this;
            },
            getSelected() {
                return em.getSelected();
            },
            getSelectedAll() {
                return em.getSelectedAll();
            },
            getSelectedToStyle() {
                let selected = em.getSelected();
                if (selected) {
                    return this.StyleManager.getModelToStyle(selected);
                }
            },
            select(el, opts) {
                em.setSelected(el, opts);
                return this;
            },
            selectAdd(el) {
                em.addSelected(el);
                return this;
            },
            selectRemove(el) {
                em.removeSelected(el);
                return this;
            },
            selectToggle(el) {
                em.toggleSelected(el);
                return this;
            },
            setDevice(name) {
                em.set('device', name);
                return this;
            },
            getDevice() {
                return em.get('device');
            },
            runCommand(id, options = {}) {
                return em.get('Commands').run(id, options);
            },
            stopCommand(id, options = {}) {
                return em.get('Commands').stop(id, options);
            },
            store(clb) {
                return em.store(clb);
            },
            load(clb) {
                return em.load(clb);
            },
            getContainer() {
                return c.el;
            },
            getDirtyCount() {
                return em.getDirtyCount();
            },
            refresh() {
                em.refreshCanvas();
            },
            setCustomRte(obj) {
                this.RichTextEditor.customRte = obj;
            },
            setCustomParserCss(parser) {
                this.Parser.getConfig().parserCss = parser;
                return this;
            },
            setDragMode(value) {
                em.setDragMode(value);
                return this;
            },
            log(msg, opts = {}) {
                em.log(msg, opts);
                return this;
            },
            t(...args) {
                return em.t(...args);
            },
            on(event, callback) {
                em.on(event, callback);
                return this;
            },
            once(event, callback) {
                em.once(event, callback);
                return this;
            },
            off(event, callback) {
                em.off(event, callback);
                return this;
            },
            trigger(event) {
                em.trigger.apply(em, arguments);
                return this;
            },
            destroy() {
                return em.destroyAll();
            },
            getEl() {
                return editorView.el;
            },
            getModel() {
                return em;
            },
            render() {
                editorView.render();
                return editorView.el;
            }
        };
    };
});
define('skylark-grapejs/utils/polyfills',[],function () {
    'use strict';
    return () => {
        const isIE = () => {
            let match;
            const agent = window.navigator.userAgent;
            const rules = [
                [
                    'edge',
                    /Edge\/([0-9\._]+)/
                ],
                [
                    'ie',
                    /MSIE\s(7\.0)/
                ],
                [
                    'ie',
                    /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/
                ],
                [
                    'ie',
                    /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/
                ]
            ];
            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i];
                match = rule[1].exec(agent);
                if (match)
                    break;
            }
            return !!match;
        };
        if (isIE()) {
            const originalCreateHTMLDocument = DOMImplementation.prototype.createHTMLDocument;
            DOMImplementation.prototype.createHTMLDocument = title => {
                if (!title)
                    title = '';
                return originalCreateHTMLDocument.apply(document.implementation, [title]);
            };
        }
    };
});
define('skylark-grapejs/plugin_manager/config/config',[],function () {
    'use strict';
    return { plugins: [] };
});
define('skylark-grapejs/plugin_manager/index',['./config/config'], function (defaults) {
    'use strict';

    return config => {
        for (var name in defaults) {
            if (!(name in defaults))
                c[name] = defaults[name];
        }
        var plugins = {};
        return {
            add(id, plugin) {
                if (plugins[id]) {
                    return plugins[id];
                }
                plugins[id] = plugin;
                return plugin;
            },
            get(id) {
                return plugins[id];
            },
            getAll() {
                return plugins;
            }
        };
    };

});
define('skylark-grapejs/main',[
    "skylark-langx/langx",
    'skylark-jquery',
    './editor/index',
    'skylark-underscore',
    './utils/polyfills',
    './plugin_manager/index'
], function (
    langx,
    $, 
    startEditor, 
    _, 
    polyfills, 
    pluginsInit
) {
    'use strict';
    polyfills();
    const plugins = pluginsInit();
    const editors = [];
    const defaultConfig = {
        autorender: 1,
        plugins: [],
        pluginsOpts: {}
    };
    return {
        $,
        editors,
        plugins,
        version: '<# VERSION #>',
        init(config = {}) {
            const els = config.container;
            if (!els)
                throw new Error("'container' is required");
            config = langx.mixin({},
                defaultConfig,
                config
            );
            config.el = _.isElement(els) ? els : document.querySelector(els);
            const editor = startEditor(config).init();
            config.plugins.forEach(pluginId => {
                let plugin = plugins.get(pluginId);
                const plgOptions = config.pluginsOpts[pluginId] || {};
                if (!plugin) {
                    const wplg = window[pluginId];
                    plugin = wplg && wplg.default ? wplg.default : wplg;
                }
                if (plugin) {
                    plugin(editor, plgOptions);
                } else if (_.isFunction(pluginId)) {
                    pluginId(editor, plgOptions);
                } else {
                    console.warn(`Plugin ${ pluginId } not found`);
                }
            });
            editor.getModel().loadOnStart();
            config.autorender && editor.render();
            editors.push(editor);
            return editor;
        }
    };
});
define('skylark-grapejs', ['skylark-grapejs/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-grapejs.js.map
