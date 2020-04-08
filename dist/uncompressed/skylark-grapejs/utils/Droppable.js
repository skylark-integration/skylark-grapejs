define([
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