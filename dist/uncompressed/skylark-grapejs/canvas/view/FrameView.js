define([
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
            this.config = langx.mixin({},
                ...o.config ,{
                frameView: this
            });
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