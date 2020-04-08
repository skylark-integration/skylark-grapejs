define([
    'skylark-backbone/Model'
], function (Model) {
    'use strict';
    return Model.extend({
        idAttribute: 'src',
        defaults: {
            type: '',
            src: ''
        },
        getFilename() {
            return this.get('src').split('/').pop();
        },
        getExtension() {
            return this.getFilename().split('.').pop();
        }
    });
});