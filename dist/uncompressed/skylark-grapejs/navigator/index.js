define([
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