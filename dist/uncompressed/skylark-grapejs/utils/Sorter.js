define([
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