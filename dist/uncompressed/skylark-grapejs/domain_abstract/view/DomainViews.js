define([
    'skylark-underscore',
    'skylark-backbone'
], function (a, Backbone) {
    'use strict';
    return Backbone.View.extend({
        itemView: '',
        itemsView: '',
        itemType: 'type',
        autoAdd: 0,
        initialize(opts = {}, config) {
            this.config = config || opts.config || {};
            this.autoAdd && this.listenTo(this.collection, 'add', this.addTo);
            this.init();
        },
        init() {
        },
        addTo(model) {
            this.add(model);
        },
        itemViewNotFound(type) {
            const {config, ns} = this;
            const {em} = config;
            const warn = `${ ns ? `[${ ns }]: ` : '' }'${ type }' type not found`;
            em && em.logWarning(warn);
        },
        add(model, fragment) {
            const {config, reuseView, itemsView = {}} = this;
            const inputTypes = [
                'button',
                'checkbox',
                'color',
                'date',
                'datetime-local',
                'email',
                'file',
                'hidden',
                'image',
                'month',
                'number',
                'password',
                'radio',
                'range',
                'reset',
                'search',
                'submit',
                'tel',
                'text',
                'time',
                'url',
                'week'
            ];
            var frag = fragment || null;
            var itemView = this.itemView;
            var typeField = model.get(this.itemType);
            let view;
            if (itemsView[typeField]) {
                itemView = itemsView[typeField];
            } else if (typeField && !itemsView[typeField] && !a.includes(inputTypes, typeField)) {
                this.itemViewNotFound(typeField);
            }
            if (model.view && reuseView) {
                view = model.view;
            } else {
                view = new itemView({
                    model,
                    config
                }, config);
            }
            var rendered = view.render().el;
            if (frag)
                frag.appendChild(rendered);
            else
                this.$el.append(rendered);
        },
        render() {
            var frag = document.createDocumentFragment();
            this.$el.empty();
            if (this.collection.length)
                this.collection.each(function (model) {
                    this.add(model, frag);
                }, this);
            this.$el.append(frag);
            this.onRender();
            return this;
        },
        onRender() {
        }
    });
});