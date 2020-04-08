define([
    './config/config',
    './model/Panel',
    './model/Panels',
    './view/PanelView',
    './view/PanelsView'
], function (defaults, Panel, Panels, PanelView, PanelsView) {
    'use strict';
    return () => {
        var c = {};
        var panels, PanelsViewObj;
        return {
            name: 'Panels',
            init(config) {
                c = config || {};
                for (var name in defaults) {
                    if (!(name in c))
                        c[name] = defaults[name];
                }
                var ppfx = c.pStylePrefix;
                if (ppfx)
                    c.stylePrefix = ppfx + c.stylePrefix;
                panels = new Panels(c.defaults);
                PanelsViewObj = new PanelsView({
                    collection: panels,
                    config: c
                });
                return this;
            },
            getPanels() {
                return panels;
            },
            getPanelsEl() {
                return PanelsViewObj.el;
            },
            addPanel(panel) {
                return panels.add(panel);
            },
            removePanel(panel) {
                return panels.remove(panel);
            },
            getPanel(id) {
                var res = panels.where({ id });
                return res.length ? res[0] : null;
            },
            addButton(panelId, button) {
                var pn = this.getPanel(panelId);
                return pn ? pn.get('buttons').add(button) : null;
            },
            removeButton(panelId, button) {
                var pn = this.getPanel(panelId);
                return pn && pn.get('buttons').remove(button);
            },
            getButton(panelId, id) {
                var pn = this.getPanel(panelId);
                if (pn) {
                    var res = pn.get('buttons').where({ id });
                    return res.length ? res[0] : null;
                }
                return null;
            },
            render() {
                return PanelsViewObj.render().el;
            },
            active() {
                this.getPanels().each(p => {
                    p.get('buttons').each(btn => {
                        btn.get('active') && btn.trigger('updateActive');
                    });
                });
            },
            disableButtons() {
                this.getPanels().each(p => {
                    p.get('buttons').each(btn => {
                        if (btn.get('disable'))
                            btn.trigger('change:disable');
                    });
                });
            },
            Panel
        };
    };
});