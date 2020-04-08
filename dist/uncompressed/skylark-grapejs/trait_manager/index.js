define([
    'skylark-underscore',
    './config/config',
    './view/TraitsView'
], function (a, defaultOpts, TraitsView) {
    'use strict';
    return () => {
        let c = {};
        let TraitsViewer;
        return {
            TraitsView,
            name: 'TraitManager',
            getConfig() {
                return c;
            },
            init(config = {}) {
                c = config;
                a.defaults(c, defaultOpts);
                const ppfx = c.pStylePrefix;
                ppfx && (c.stylePrefix = `${ ppfx }${ c.stylePrefix }`);
                TraitsViewer = new TraitsView({
                    collection: [],
                    editor: c.em,
                    config: c
                });
                return this;
            },
            postRender() {
                const elTo = this.getConfig().appendTo;
                if (elTo) {
                    const el = a.isElement(elTo) ? elTo : document.querySelector(elTo);
                    el.appendChild(this.render());
                }
            },
            getTraitsViewer() {
                return TraitsViewer;
            },
            addType(name, trait) {
                var itemView = TraitsViewer.itemView;
                TraitsViewer.itemsView[name] = itemView.extend(trait);
            },
            getType(name) {
                return TraitsViewer.itemsView[name];
            },
            render() {
                return TraitsViewer.render().el;
            }
        };
    };
});