define(['../../utils/mixins'], function (a) {
    'use strict';
    const RTE_KEY = '_rte';
    const btnState = {
        ACTIVE: 1,
        INACTIVE: 0,
        DISABLED: -1
    };
    const isValidAnchor = rte => {
        const anchor = rte.selection().anchorNode;
        const parentNode = anchor && anchor.parentNode;
        const nextSibling = anchor && anchor.nextSibling;
        return parentNode && parentNode.nodeName == 'A' || nextSibling && nextSibling.nodeName == 'A';
    };
    const defActions = {
        bold: {
            name: 'bold',
            icon: '<b>B</b>',
            attributes: { title: 'Bold' },
            result: rte => rte.exec('bold')
        },
        italic: {
            name: 'italic',
            icon: '<i>I</i>',
            attributes: { title: 'Italic' },
            result: rte => rte.exec('italic')
        },
        underline: {
            name: 'underline',
            icon: '<u>U</u>',
            attributes: { title: 'Underline' },
            result: rte => rte.exec('underline')
        },
        strikethrough: {
            name: 'strikethrough',
            icon: '<strike>S</strike>',
            attributes: { title: 'Strike-through' },
            result: rte => rte.exec('strikeThrough')
        },
        link: {
            icon: `<span style="transform:rotate(45deg)">&supdsub;</span>`,
            name: 'link',
            attributes: {
                style: 'font-size:1.4rem;padding:0 4px 2px;',
                title: 'Link'
            },
            state: (rte, doc) => {
                if (rte && rte.selection()) {
                    return isValidAnchor(rte) ? btnState.ACTIVE : btnState.INACTIVE;
                } else {
                    return btnState.INACTIVE;
                }
            },
            result: rte => {
                if (isValidAnchor(rte)) {
                    rte.exec('unlink');
                } else {
                    rte.insertHTML(`<a class="link" href="">${ rte.selection() }</a>`);
                }
            }
        }
    };
    return class RichTextEditor {
        constructor(settings = {}) {
            const el = settings.el;
            if (el[RTE_KEY]) {
                return el[RTE_KEY];
            }
            el[RTE_KEY] = this;
            this.setEl(el);
            this.updateActiveActions = this.updateActiveActions.bind(this);
            const settAct = settings.actions || [];
            settAct.forEach((action, i) => {
                if (typeof action === 'string') {
                    action = defActions[action];
                } else if (defActions[action.name]) {
                    action = {
                        ...defActions[action.name],
                        ...action
                    };
                }
                settAct[i] = action;
            });
            const actions = settAct.length ? settAct : Object.keys(defActions).map(action => defActions[action]);
            settings.classes = {
                ...{
                    actionbar: 'actionbar',
                    button: 'action',
                    active: 'active',
                    disabled: 'disabled',
                    inactive: 'inactive'
                },
                ...settings.classes
            };
            const classes = settings.classes;
            let actionbar = settings.actionbar;
            this.actionbar = actionbar;
            this.settings = settings;
            this.classes = classes;
            this.actions = actions;
            if (!actionbar) {
                const actionbarCont = settings.actionbarContainer;
                actionbar = document.createElement('div');
                actionbar.className = classes.actionbar;
                actionbarCont.appendChild(actionbar);
                this.actionbar = actionbar;
                actions.forEach(action => this.addAction(action));
            }
            settings.styleWithCSS && this.exec('styleWithCSS');
            this.syncActions();
            return this;
        }
        destroy() {
            this.el = 0;
            this.doc = 0;
            this.actionbar = 0;
            this.settings = {};
            this.classes = {};
            this.actions = [];
        }
        setEl(el) {
            this.el = el;
            this.doc = el.ownerDocument;
        }
        updateActiveActions() {
            this.getActions().forEach(action => {
                const btn = action.btn;
                const update = action.update;
                const {active, inactive, disabled} = { ...this.classes };
                const state = action.state;
                const name = action.name;
                const doc = this.doc;
                btn.className = btn.className.replace(active, '').trim();
                btn.className = btn.className.replace(inactive, '').trim();
                btn.className = btn.className.replace(disabled, '').trim();
                if (state) {
                    switch (state(this, doc)) {
                    case btnState.ACTIVE:
                        btn.className += ` ${ active }`;
                        break;
                    case btnState.INACTIVE:
                        btn.className += ` ${ inactive }`;
                        break;
                    case btnState.DISABLED:
                        btn.className += ` ${ disabled }`;
                        break;
                    }
                } else {
                    if (doc.queryCommandSupported(name) && doc.queryCommandState(name)) {
                        btn.className += ` ${ active }`;
                    }
                }
                update && update(this, action);
            });
        }
        enable() {
            if (this.enabled) {
                return this;
            }
            this.actionbarEl().style.display = '';
            this.el.contentEditable = true;
            a.on(this.el, 'mouseup keyup', this.updateActiveActions);
            this.syncActions();
            this.updateActiveActions();
            this.el.focus();
            this.enabled = 1;
            return this;
        }
        disable() {
            this.actionbarEl().style.display = 'none';
            this.el.contentEditable = false;
            a.off(this.el, 'mouseup keyup', this.updateActiveActions);
            this.enabled = 0;
            return this;
        }
        syncActions() {
            this.getActions().forEach(action => {
                if (this.settings.actionbar) {
                    if (!action.state || action.state && action.state(this, this.doc) >= 0) {
                        const event = action.event || 'click';
                        action.btn[`on${ event }`] = e => {
                            action.result(this, action);
                            this.updateActiveActions();
                        };
                    }
                }
            });
        }
        addAction(action, opts = {}) {
            const sync = opts.sync;
            const btn = document.createElement('span');
            const icon = action.icon;
            const attr = action.attributes || {};
            btn.className = this.classes.button;
            action.btn = btn;
            for (let key in attr) {
                btn.setAttribute(key, attr[key]);
            }
            if (typeof icon == 'string') {
                btn.innerHTML = icon;
            } else {
                btn.appendChild(icon);
            }
            this.actionbarEl().appendChild(btn);
            if (sync) {
                this.actions.push(action);
                this.syncActions();
            }
        }
        getActions() {
            return this.actions;
        }
        selection() {
            return this.doc.getSelection();
        }
        exec(command, value = null) {
            this.doc.execCommand(command, false, value);
        }
        actionbarEl() {
            return this.actionbar;
        }
        insertHTML(value) {
            let lastNode;
            const doc = this.doc;
            const sel = doc.getSelection();
            if (sel && sel.rangeCount) {
                const node = doc.createElement('div');
                const range = sel.getRangeAt(0);
                range.deleteContents();
                node.innerHTML = value;
                Array.prototype.slice.call(node.childNodes).forEach(nd => {
                    range.insertNode(nd);
                    lastNode = nd;
                });
                sel.removeAllRanges();
                sel.addRange(range);
                this.el.focus();
            }
        }
    };
});