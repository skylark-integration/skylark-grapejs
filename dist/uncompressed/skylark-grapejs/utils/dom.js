define(['skylark-underscore'], function (_) {
    'use strict';
    const KEY_TAG = 'tag';
    const KEY_ATTR = 'attributes';
    const KEY_CHILD = 'children';
    const motionsEv = 'transitionend oTransitionEnd transitionend webkitTransitionEnd';
    const empty = node => {
        while (node.firstChild)
            node.removeChild(node.firstChild);
    };
    const replaceWith = (oldEl, newEl) => {
        oldEl.parentNode.replaceChild(newEl, oldEl);
    };
    const appendAtIndex = (parent, child, index) => {
        const {childNodes} = parent;
        const total = childNodes.length;
        const at = _.isUndefined(index) ? total : index;
        if (_.isString(child)) {
            parent.insertAdjacentHTML('beforeEnd', child);
            child = parent.lastChild;
            parent.removeChild(child);
        }
        if (at >= total) {
            parent.appendChild(child);
        } else {
            parent.insertBefore(child, childNodes[at]);
        }
    };
    const append = (parent, child) => appendAtIndex(parent, child);
    const createEl = (tag, attrs = '', child) => {
        const el = document.createElement(tag);
        attrs && _.each(attrs, (value, key) => el.setAttribute(key, value));
        if (child) {
            if (_.isString(child))
                el.innerHTML = child;
            else
                el.appendChild(child);
        }
        return el;
    };
    const createCustomEvent = (e, cls) => {
        let oEvent;
        try {
            oEvent = new window[cls](e.type, e);
        } catch (e) {
            oEvent = document.createEvent(cls);
            oEvent.initEvent(e.type, true, true);
        }
        oEvent.keyCodeVal = e.keyCode;
        oEvent._parentEvent = e;
        [
            'keyCode',
            'which'
        ].forEach(prop => {
            Object.defineProperty(oEvent, prop, {
                get() {
                    return this.keyCodeVal;
                }
            });
        });
        return oEvent;
    };
    const appendVNodes = (node, vNodes = []) => {
        const vNodesArr = Array.isArray(vNodes) ? vNodes : [vNodes];
        vNodesArr.forEach(vnode => {
            const tag = vnode[KEY_TAG] || 'div';
            const attr = vnode[KEY_ATTR] || {};
            const el = document.createElement(tag);
            _.each(attr, (value, key) => {
                el.setAttribute(key, value);
            });
            node.appendChild(el);
        });
    };
    return {
        motionsEv: motionsEv,
        empty: empty,
        replaceWith: replaceWith,
        appendAtIndex: appendAtIndex,
        append: append,
        createEl: createEl,
        createCustomEvent: createCustomEvent,
        appendVNodes: appendVNodes
    };
});