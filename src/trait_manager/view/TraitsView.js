define([
    '../../domain_abstract/view/DomainViews',
    './TraitView',
    './TraitSelectView',
    './TraitCheckboxView',
    './TraitNumberView',
    './TraitColorView',
    './TraitButtonView'
], function (DomainViews, TraitView, TraitSelectView, TraitCheckboxView, TraitNumberView, TraitColorView, TraitButtonView) {
    'use strict';
    return DomainViews.extend({
        ns: 'Traits',
        itemView: TraitView,
        reuseView: 1,
        itemsView: {
            text: TraitView,
            number: TraitNumberView,
            select: TraitSelectView,
            checkbox: TraitCheckboxView,
            color: TraitColorView,
            button: TraitButtonView
        },
        initialize(o = {}) {
            const config = o.config || {};
            this.config = config;
            this.em = o.editor;
            this.pfx = config.stylePrefix || '';
            this.ppfx = config.pStylePrefix || '';
            this.className = this.pfx + 'traits';
            const toListen = 'component:toggled';
            this.listenTo(this.em, toListen, this.updatedCollection);
            this.updatedCollection();
        },
        updatedCollection() {
            const ppfx = this.ppfx;
            const comp = this.em.getSelected();
            this.el.className = `${ this.className } ${ ppfx }one-bg ${ ppfx }two-color`;
            this.collection = comp ? comp.get('traits') : [];
            this.render();
        }
    });
});