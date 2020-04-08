define([
    './Dragger',
    './Sorter',
    './Resizer'
], function (Dragger, Sorter, Resizer) {
    'use strict';
    return () => {
        return {
            name: 'Utils',
            init() {
                return this;
            },
            Sorter,
            Resizer,
            Dragger
        };
    };
});