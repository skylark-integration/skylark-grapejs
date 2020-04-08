define(['skylark-backbone'], function (Backbone) {
    'use strict';
    const TYPE_CLASS = 1;
    const TYPE_ID = 2;
    const Selector = Backbone.Model.extend({
        idAttribute: 'name',
        defaults: {
            name: '',
            label: '',
            type: TYPE_CLASS,
            active: true,
            private: false,
            protected: false
        },
        initialize(props, opts = {}) {
            const {
                config = {}
            } = opts;
            const name = this.get('name');
            const label = this.get('label');
            if (!name) {
                this.set('name', label);
            } else if (!label) {
                this.set('label', name);
            }
            const namePreEsc = this.get('name');
            const {escapeName} = config;
            const nameEsc = escapeName ? escapeName(namePreEsc) : Selector.escapeName(namePreEsc);
            this.set('name', nameEsc);
        },
        getFullName(opts = {}) {
            const {escape} = opts;
            const name = this.get('name');
            let init = '';
            switch (this.get('type')) {
            case TYPE_CLASS:
                init = '.';
                break;
            case TYPE_ID:
                init = '#';
                break;
            }
            return init + (escape ? escape(name) : name);
        }
    }, {
        TYPE_CLASS,
        TYPE_ID,
        escapeName(name) {
            return `${ name }`.trim().replace(/([^a-z0-9\w-\:]+)/gi, '-');
        }
    });
    return Selector;
});