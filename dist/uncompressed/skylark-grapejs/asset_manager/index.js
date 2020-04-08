define([
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