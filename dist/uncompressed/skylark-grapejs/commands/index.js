define([
    'skylark-underscore',
    './view/CommandAbstract',
    './config/config',
    '../../dom_components/model/Component'
], function (a, CommandAbstract, defaults, b) {
    'use strict';
    return () => {
        let em;
        let c = {};
        const commands = {};
        const defaultCommands = {};
        const active = {};
        const commandsDef = [
            [
                'preview',
                'Preview',
                'preview'
            ],
            [
                'resize',
                'Resize',
                'resize'
            ],
            [
                'fullscreen',
                'Fullscreen',
                'fullscreen'
            ],
            [
                'copy',
                'CopyComponent'
            ],
            [
                'paste',
                'PasteComponent'
            ],
            [
                'canvas-move',
                'CanvasMove'
            ],
            [
                'canvas-clear',
                'CanvasClear'
            ],
            [
                'open-code',
                'ExportTemplate',
                'export-template'
            ],
            [
                'open-layers',
                'OpenLayers',
                'open-layers'
            ],
            [
                'open-styles',
                'OpenStyleManager',
                'open-sm'
            ],
            [
                'open-traits',
                'OpenTraitManager',
                'open-tm'
            ],
            [
                'open-blocks',
                'OpenBlocks',
                'open-blocks'
            ],
            [
                'open-assets',
                'OpenAssets',
                'open-assets'
            ],
            [
                'component-select',
                'SelectComponent',
                'select-comp'
            ],
            [
                'component-outline',
                'SwitchVisibility',
                'sw-visibility'
            ],
            [
                'component-offset',
                'ShowOffset',
                'show-offset'
            ],
            [
                'component-move',
                'MoveComponent',
                'move-comp'
            ],
            [
                'component-next',
                'ComponentNext'
            ],
            [
                'component-prev',
                'ComponentPrev'
            ],
            [
                'component-enter',
                'ComponentEnter'
            ],
            [
                'component-exit',
                'ComponentExit',
                'select-parent'
            ],
            [
                'component-delete',
                'ComponentDelete'
            ],
            [
                'component-style-clear',
                'ComponentStyleClear'
            ],
            [
                'component-drag',
                'ComponentDrag'
            ]
        ];
        const add = function (id, obj) {
            if (a.isFunction(obj))
                obj = { run: obj };
            if (!obj.stop)
                obj.noStop = 1;
            delete obj.initialize;
            obj.id = id;
            commands[id] = CommandAbstract.extend(obj);
            return this;
        };
        return {
            CommandAbstract,
            name: 'Commands',
            init(config = {}) {
                c = {
                    ...defaults,
                    ...config
                };
                em = c.em;
                const ppfx = c.pStylePrefix;
                if (ppfx)
                    c.stylePrefix = ppfx + c.stylePrefix;
                for (let k in c.defaults) {
                    const obj = c.defaults[k];
                    if (obj.id)
                        this.add(obj.id, obj);
                }
                defaultCommands['tlb-delete'] = {
                    run(ed) {
                        return ed.runCommand('core:component-delete');
                    }
                };
                defaultCommands['tlb-clone'] = {
                    run(ed) {
                        ed.runCommand('core:copy');
                        ed.runCommand('core:paste');
                    }
                };
                defaultCommands['tlb-move'] = {
                    run(ed, sender, opts = {}) {
                        let dragger;
                        const em = ed.getModel();
                        const event = opts && opts.event;
                        const {target} = opts;
                        const sel = target || ed.getSelected();
                        const selAll = target ? [target] : [...ed.getSelectedAll()];
                        const nativeDrag = event && event.type == 'dragstart';
                        const defComOptions = { preserveSelected: 1 };
                        const modes = [
                            'absolute',
                            'translate'
                        ];
                        const mode = sel.get('dmode') || em.get('dmode');
                        const hideTlb = () => em.stopDefault(defComOptions);
                        const altMode = a.includes(modes, mode);
                        selAll.forEach(sel => sel.trigger('disable'));
                        if (!sel || !sel.get('draggable')) {
                            return em.logWarning('The element is not draggable');
                        }
                        nativeDrag ? setTimeout(hideTlb, 0) : hideTlb();
                        const onStart = data => {
                            em.trigger(`${ b.eventDrag }:start`, data);
                        };
                        const onDrag = data => {
                            em.trigger(b.eventDrag, data);
                        };
                        const onEnd = (e, opts, data) => {
                            em.runDefault(defComOptions);
                            selAll.forEach(sel => sel.set('status', 'selected'));
                            ed.select(selAll);
                            sel.emitUpdate();
                            em.trigger(`${ b.eventDrag }:end`, data);
                            (altMode || data.cancelled) && em.set('_cmpDrag', 1);
                        };
                        if (altMode) {
                            dragger = ed.runCommand('core:component-drag', {
                                guidesInfo: 1,
                                mode,
                                target: sel,
                                onStart,
                                onDrag,
                                onEnd,
                                event
                            });
                        } else {
                            if (nativeDrag) {
                                event.dataTransfer.setDragImage(sel.view.el, 0, 0);
                            }
                            const cmdMove = ed.Commands.get('move-comp');
                            cmdMove.onStart = onStart;
                            cmdMove.onDrag = onDrag;
                            cmdMove.onEndMoveFromModel = onEnd;
                            cmdMove.initSorterFromModels(selAll);
                        }
                        selAll.forEach(sel => sel.set('status', 'freezed-selected'));
                    }
                };
                defaultCommands['core:undo'] = e => e.UndoManager.undo();
                defaultCommands['core:redo'] = e => e.UndoManager.redo();
                commandsDef.forEach(item => {
                    const oldCmd = item[2];
                    const cmd = require(`./view/${ item[1] }`).default;
                    const cmdName = `core:${ item[0] }`;
                    defaultCommands[cmdName] = cmd;
                    if (oldCmd) {
                        defaultCommands[oldCmd] = cmd;
                        [
                            'run',
                            'stop'
                        ].forEach(name => {
                            em.on(`${ name }:${ oldCmd }`, (...args) => em.trigger(`${ name }:${ cmdName }`, ...args));
                        });
                    }
                });
                if (c.em)
                    c.model = c.em.get('Canvas');
                this.loadDefaultCommands();
                return this;
            },
            add,
            get(id) {
                let el = commands[id];
                if (a.isFunction(el)) {
                    el = new el(c);
                    commands[id] = el;
                } else if (!el) {
                    em.logWarning(`'${ id }' command not found`);
                }
                return el;
            },
            extend(id, cmd = {}) {
                const command = this.get(id);
                if (command) {
                    const cmdObj = {
                        ...command.constructor.prototype,
                        ...cmd
                    };
                    this.add(id, cmdObj);
                    const oldCmd = commandsDef.filter(cmd => `core:${ cmd[0] }` === id && cmd[2])[0];
                    oldCmd && this.add(oldCmd[2], cmdObj);
                }
                return this;
            },
            has(id) {
                return !!commands[id];
            },
            getAll() {
                return commands;
            },
            run(id, options = {}) {
                return this.runCommand(this.get(id), options);
            },
            stop(id, options = {}) {
                return this.stopCommand(this.get(id), options);
            },
            isActive(id) {
                return this.getActive().hasOwnProperty(id);
            },
            getActive() {
                return active;
            },
            loadDefaultCommands() {
                for (var id in defaultCommands) {
                    this.add(id, defaultCommands[id]);
                }
                return this;
            },
            runCommand(command, options = {}) {
                let result;
                if (command && command.run) {
                    const id = command.id;
                    const editor = em.get('Editor');
                    if (!this.isActive(id) || options.force || !c.strict) {
                        result = command.callRun(editor, options);
                        if (id && command.stop && !command.noStop && !options.abort) {
                            active[id] = result;
                        }
                    }
                }
                return result;
            },
            stopCommand(command, options = {}) {
                let result;
                if (command && command.run) {
                    const id = command.id;
                    const editor = em.get('Editor');
                    if (this.isActive(id) || options.force || !c.strict) {
                        if (id)
                            delete active[id];
                        result = command.callStop(editor, options);
                    }
                }
                return result;
            },
            create(command) {
                if (!command.stop)
                    command.noStop = 1;
                const cmd = CommandAbstract.extend(command);
                return new cmd(c);
            }
        };
    };
});