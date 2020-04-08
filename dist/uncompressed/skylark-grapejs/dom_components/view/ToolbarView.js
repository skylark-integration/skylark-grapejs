define([
    '../../domain_abstract/view/DomainViews',
    './ToolbarButtonView'
], function (DomainViews, ToolbarButtonView) {
    'use strict';
    return DomainViews.extend({
        itemView: ToolbarButtonView,
        initialize(opts = {}) {
            this.config = {
                editor: opts.editor || '',
                em: opts.em
            };
            this.listenTo(this.collection, 'reset', this.render);
        }
    });
});