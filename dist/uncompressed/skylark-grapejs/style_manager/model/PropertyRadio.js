define([
    "skylark-langx/langx",
    './Property'
], function (Property) {
    'use strict';
    return Property.extend({
        defaults: () => ({
            ...Property.prototype.defaults,
            options: [],
            full: 1
        }),
        initialize(...args) {
            Property.prototype.initialize.apply(this, args);
            this.listenTo(this, 'change:options', this.onOptionChange);
        },
        onOptionChange() {
            this.set('list', this.get('options'));
        },
        getOptions() {
            const {options, list} = this.attributes;
            return options && options.length ? options : list;
        },
        setOptions(opts = []) {
            this.set('options', opts);
            return this;
        },
        addOption(opt) {
            if (opt) {
                const opts = this.getOptions();
                this.setOptions([
                    ...opts,
                    opt
                ]);
            }
            return this;
        }
    });
});