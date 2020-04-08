define([
    'skylark-backbone',
    '../../style_manager/index'
], function (Backbone, StyleManager) {
    'use strict';
    const $ = Backbone.$;
    return {
        run(em, sender) {
            this.sender = sender;
            if (!this.$cn) {
                var config = em.getConfig(), panels = em.Panels;
                this.$cn = $('<div></div>');
                this.$cn2 = $('<div></div>');
                this.$cn.append(this.$cn2);
                var dvm = em.DeviceManager;
                if (dvm && config.showDevices) {
                    var devicePanel = panels.addPanel({ id: 'devices-c' });
                    devicePanel.set('appendContent', dvm.render()).trigger('change:appendContent');
                }
                var clm = em.SelectorManager;
                if (clm)
                    this.$cn2.append(clm.render([]));
                this.$cn2.append(em.StyleManager.render());
                var smConfig = em.StyleManager.getConfig();
                const pfx = smConfig.stylePrefix;
                this.$header = $(`<div class="${ pfx }header">${ em.t('styleManager.empty') }</div>`);
                this.$cn.append(this.$header);
                if (!panels.getPanel('views-container'))
                    this.panel = panels.addPanel({ id: 'views-container' });
                else
                    this.panel = panels.getPanel('views-container');
                this.panel.set('appendContent', this.$cn).trigger('change:appendContent');
                this.target = em.editor;
                this.listenTo(this.target, 'component:toggled', this.toggleSm);
            }
            this.toggleSm();
        },
        toggleSm() {
            const {target, sender} = this;
            if (sender && sender.get && !sender.get('active'))
                return;
            const {componentFirst} = target.get('SelectorManager').getConfig();
            const selectedAll = target.getSelectedAll().length;
            if (selectedAll === 1 || selectedAll > 1 && componentFirst) {
                this.$cn2.show();
                this.$header.hide();
            } else {
                this.$cn2.hide();
                this.$header.show();
            }
        },
        stop() {
            if (this.$cn2)
                this.$cn2.hide();
            if (this.$header)
                this.$header.hide();
        }
    };
});