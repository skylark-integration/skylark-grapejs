define([
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