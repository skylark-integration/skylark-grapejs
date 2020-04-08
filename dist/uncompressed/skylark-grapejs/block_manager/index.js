define([
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