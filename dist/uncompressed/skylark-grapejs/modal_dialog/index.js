define([
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