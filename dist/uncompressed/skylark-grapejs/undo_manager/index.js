define([
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