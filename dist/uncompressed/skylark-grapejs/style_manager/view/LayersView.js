define([
    'skylark-backbone',
    './LayerView'
], function (Backbone, LayerView) {
    'use strict';
    return Backbone.View.extend({
        initialize(o) {
            this.config = o.config || {};
            this.stackModel = o.stackModel;
            this.preview = o.preview;
            this.pfx = this.config.stylePrefix || '';
            this.ppfx = this.config.pStylePrefix || '';
            this.propsConfig = o.propsConfig;
            let pfx = this.pfx;
            let ppfx = this.ppfx;
            let collection = this.collection;
            this.className = `${ pfx }layers ${ ppfx }field`;
            this.listenTo(collection, 'add', this.addTo);
            this.listenTo(collection, 'deselectAll', this.deselectAll);
            this.listenTo(collection, 'reset', this.render);
            var em = this.config.em || '';
            var utils = em ? em.get('Utils') : '';
            this.sorter = utils ? new utils.Sorter({
                container: this.el,
                ignoreViewChildren: 1,
                containerSel: `.${ pfx }layers`,
                itemSel: `.${ pfx }layer`,
                pfx: this.config.pStylePrefix
            }) : '';
            collection.view = this;
            this.$el.data('model', collection);
            this.$el.data('collection', collection);
        },
        addTo(model) {
            var i = this.collection.indexOf(model);
            this.addToCollection(model, null, i);
        },
        addToCollection(model, fragmentEl, index) {
            var fragment = fragmentEl || null;
            const stackModel = this.stackModel;
            const config = this.config;
            const sorter = this.sorter;
            const propsConfig = this.propsConfig;
            if (typeof this.preview !== 'undefined') {
                model.set('preview', this.preview);
            }
            var view = new LayerView({
                model,
                config,
                sorter,
                stackModel,
                propsConfig
            });
            var rendered = view.render().el;
            if (fragment) {
                fragment.appendChild(rendered);
            } else {
                if (typeof index != 'undefined') {
                    var method = 'before';
                    if (this.$el.children().length == index) {
                        index--;
                        method = 'after';
                    }
                    if (index < 0) {
                        this.$el.append(rendered);
                    } else
                        this.$el.children().eq(index)[method](rendered);
                } else
                    this.$el.append(rendered);
            }
            return rendered;
        },
        deselectAll() {
            this.$el.find('.' + this.pfx + 'layer').removeClass(this.pfx + 'active');
        },
        render() {
            var fragment = document.createDocumentFragment();
            this.$el.empty();
            this.collection.each(function (model) {
                this.addToCollection(model, fragment);
            }, this);
            this.$el.append(fragment);
            this.$el.attr('class', this.className);
            if (this.sorter)
                this.sorter.plh = null;
            return this;
        }
    });
});