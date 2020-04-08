define([
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